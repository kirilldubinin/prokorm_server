var Ration = require('../models/ration');
var _ = require('lodash');

function sortRations (a,b) {
    return b.createdAt.getTime() - a.createdAt.getTime();
}

function getPrice(ration) {
    return null;
}
function getDryWeight(ration) {
    return null;
}

function list(rations) {

	//sort
    // startDate: not null
    // startDate: null and endDate: null
    // startDate: not null and endDate: not null
    var inProgress = _.filter(rations, function(r) {
        return r.general.startDate && !r.general.endDate;
    }).sort(sortRations);

    var nonProgress = _.filter(rations, function(r) {
        return !r.general.startDate && !r.general.endDate;
    }).sort(sortRations);

    var done = _.filter(rations, function(r) {
        return r.general.endDate && r.general.startDate;
    }).sort(sortRations);

    var sortedRations = _.concat(inProgress, nonProgress, done);
    var shortRations = _.map(sortedRations, function(ration) {
        return _.merge({}, {
            _id: ration._id,
            name: ration.general.name,
            type: ration.general.type,
            target: ration.general.target,
            startDate: ration.general.startDate,
            endDate: ration.general.endDate,
            price: getPrice(ration),
            dryWeight: getDryWeight(ration) 
        });
    });

    var filterValues = {
        type: _.filter(_.uniq(_.map(shortRations, 'type')), null).sort(function (a,b) { return b - a; }),
        name: _.filter(_.uniq(_.map(shortRations, 'name')), null).sort(function (a,b) { return b - a; })
    };

    return {
        rations: shortRations,
        filterValues: filterValues
    };
}

module.exports = list;