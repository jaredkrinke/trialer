$(function () {
    // TODO: Use an enum instead of characters...
    var sessions = [];
    var trials = [];
    var trialsPerSession = 5;
    
    var generateSequence = function (min, max) {
        var sequence = [];
        for (var i = min; i <= max; i++) {
            sequence.push(i);
        }
        return sequence;
    };
    
    var axes = {
        xaxis: {
            ticks: generateSequence(1, 2)
        },

        yaxis: {
            ticks: generateSequence(0, trialsPerSession)
        },
    };

    var plot = $.jqplot('plot', [[0]], { axes: axes });
    
    var replotOptions = {
        clear: true,
        resetAxes: true,
        axes: axes,
    };
    
    var updateGraph = function () {
        var count = sessions.length;
        // TODO: Is computing the x values really needed?
        var points = [];
        for (var i = 0; i < count; i++) {
            points.push([i + 1, sessions[i]]);
        }
        
        replotOptions.data = [points];
        replotOptions.axes.xaxis.ticks = generateSequence(1, Math.max(count, 2));
        plot.replot(replotOptions);
    };
    
    var trialBody = $('#trial-body');
    var trialTemplate = $('#trial-template');
    trialBody.empty();
    var appendResult = function (result) {
        trials.push(result);
        trialBody.append(trialTemplate.clone()
                        .find('.trial-number').text(trials.length).end()
                        .find('.trial-outcome').text(result).end());
        
        // TODO: Show progress and allow for undo
        
        if (trials.length >= trialsPerSession) {
            var count = trialsPerSession;
            var sum = 0;
            for (var i = 0; i < count; i++) {
                sum += (trials[i] === '+') ? 1 : 0;
            }
            
            sessions.push(sum);
            updateGraph();
            
            trials.length = 0;
            trialBody.empty();
        }
    };
    
    var createResultHandler = function (result) {
        return function (event) {
            event.preventDefault();
            appendResult(result);
        };
    };
    
    $('#trial-success').click(createResultHandler('+'));
    $('#trial-prompt').click(createResultHandler('P'));
    $('#trial-form').submit(createResultHandler('-'));
});
