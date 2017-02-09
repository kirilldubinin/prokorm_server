var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension');
var math = require('mathjs');
var _ = require('lodash');

function sortFeeds(a, b) {
    if (a.harvest.end && b.harvest) {
        return a.harvest.end.getTime() - b.harvest.end.getTime();
    } else {
        return a.general.year - b.general.year;
    }
}

function charts(feeds) {
    var series = ['dryMaterial', 'ph', 'oilAcid', 'exchangeEnergy', 'crudeAsh']
    var allYears = [];
    var chartSeries = _.map(series, function(seria) {

        var seriaDates = _.map(feeds, function(feed) {
            var lastAnalys = _.last(feed.analysis);
            var value = null;
            allYears.push(lastAnalys.date.getFullYear());
            var canBerecalcalated = feedUtils.propertyForRecalculate[seria];
            if (_.isNumber(lastAnalys[seria])) {
                if (canBerecalcalated) {
                    var isNaturalWet = lastAnalys.isNaturalWet;
                    var dryMaterial = lastAnalys.dryMaterial / 100;
                    value = isNaturalWet ? 
                    	(lastAnalys[seria] / dryMaterial) : 
                    	lastAnalys[seria];

                } else {
                    value = lastAnalys[seria];
                }
            }
            return {
                year: lastAnalys.date.getFullYear(),
                data: value
            };
        });     
        seriaDates = _.groupBy(seriaDates, 'year');
        seriaDates = _.map(seriaDates, function(data, key) {

	        data = _.filter(data, function (d) { return _.isNumber(d.data); });
	        if (data.length) {
	        	return {
	        		year: key,
                	data: math.round(_.sumBy(data, 'data')/data.length, 2)
	        	}
	        } else {
	        	return {
	        		year: key,
	        		data: null
	        	}
	        }
        });

        return {
            dimension: dimension(seria),
            name: lang(seria),
            data: seriaDates
        }
    });
    allYears = _.uniq(allYears).sort(function(a, b) {
        return a - b;
    });
    chartSeries.sort(function(a, b) {
        return a.year - b.year;
    });
    chartSeries = _.map(chartSeries, function(chartSeria) {
        var groupByYear = _.groupBy(chartSeria.data, 'year');
        return {
            name: chartSeria.name + ', ' + chartSeria.dimension,
            data: _.map(allYears, function(year) {
                if (!groupByYear[year]) {
                    return null;
                } else {
                    return _.first(_.map(groupByYear[year], 'data'));
                }
            })
        }
    });
    return {
        categories: allYears,
        chartSeries: chartSeries
    }
}
module.exports = charts;