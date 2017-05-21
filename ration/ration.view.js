var _ = require('lodash');
var Ration = require('../models/ration');
var lang = require('./ration.lang');
var dimension = require('./ration.dimension');

function convertValue(key, val) {
    return val;
}

function convertToControl(item) {
	var viewObj = {};
    _.each(item, function(value, key) {
        // check if value not empty
        if (_.isBoolean(value) || _.isNumber(value) || value) {
            viewObj[key] = {
                label: lang(key),
                value: convertValue(key, value),
                dimension: dimension(key),
                key: key
            }
        }
    });
    return viewObj;
}
 
function convert(ration, sessionData) {

	var generalView = convertToControl(ration.general);
    var feedsView = _.size(ration.feeds) ? 
    	{
	    	head: _.map([
	    		'#',
				'component', 
				'proportionWeight', 
				'dryMaterial', 
				'totalDryMaterial', 
				'priceKilo',
				'price'], lang),
	    	body: 
	    		_.map(ration.feeds, function (feed) {
	    			return [
	    				_.omitBy({
		    				feedId: feed._id,
		    				name: feed.name,
		    				year: feed.year,
		    				branch: feed.branch,
		    				storage: feed.storage
		    			},_.isUndefined),
		    			feed.weight,
		    			feed.dryMaterial,
		    			Math.round(feed.weight*feed.dryMaterial/1000), //totalDryMaterial
		    			feed.price, //priceKilo
		    			Math.round(feed.weight * feed.price) //price
	    			] 
	    		}),
	    	footer: [
	    		'',
	    		'',
	    		_.sumBy(ration.feeds, 'weight'), // weight
	    		'',
	    		_.sumBy(ration.feeds, 'dryMaterial')/1000, // dry material
	    		'',
	    		_.sumBy(ration.feeds, function (feed) {
	    			return Math.round(feed.weight * feed.price);
	    		})
	    	]
	    } :
	    null;

    var parametersView = _.size(ration.feeds) ?
    	{
    		head: _.map([
	    		'#',
				'parameters', 
				'min', 
				'current', 
				'max'], lang)
    	} :
    	null;


    var rationItemSections = [generalView];
    feedsView && rationItemSections.push(feedsView);
    //var parametersView = convertToControl(ration.parameters);
    return {
    	general: ration.general,
    	rationItemSections: [
    		{
	            label: lang('general'),
	            key: 'general',
	            controls: generalView
    		},
    		{
	            label: lang('feeds'),
	            key: 'feeds',
	            controls: feedsView
    		},
    		{
	            label: lang('parameters'),
	            key: 'parameters',
	            controls: parametersView
    		}
    	]
    };
}

module.exports = convert;