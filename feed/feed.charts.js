var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension');
var _ = require('lodash');

function sortFeeds(a, b) {
    if (a.harvest.end && b.harvest) {
        return a.harvest.end.getTime() - b.harvest.end.getTime();
    } else {
        return a.general.year - b.general.year;
    }
}

function charts(feeds) {
    console.log('start charts');
    console.log(feeds);
    var series = ['dryMaterial', 'ph', 'milkAcid', 'aceticAcid', 'oilAcid', 
                'exchangeEnergy', 'nel', 'crudeAsh', 'crudeProtein', 'crudeFat',
                'sugar', 'starch', 'crudeFiber', 'ndf', 'adf', 'adl'];

    var byDefault = ['dryMaterial', 'ph', 'exchangeEnergy', 'crudeAsh', 'crudeProtein', 'crudeFiber'];
    
    try {

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
                    	data: Math.round((_.sumBy(data, 'data')/data.length)*100)/100
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
                visible: _.some(byDefault, function (d) { return d === seria; }),
                data: seriaDates.sort(function(a, b) {
                    return a.year - b.year;
                })
            }
        });


        allYears = _.uniq(allYears).sort(function(a, b) {
            return a - b;
        });
    } catch(e) {
        console.log(e);
    }  
    console.log('2');

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
            }),
            visible: chartSeria.visible
        }
    });

    return {
        categories: allYears,
        chartSeries: chartSeries
    }
}
module.exports = charts;