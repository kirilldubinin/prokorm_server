var expect = require("chai").expect;
var diff = require('../../feed/feed.diff');
var feedUtils = require('../../feed/feed.utils');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.diff', function() {
    
    it('diff', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015,
                price: '',
            },analysis: [{
                    date: new Date('10-10-2015'),
                    isNaturalWet: false,
                    number: 1,
                    dryMaterial: 10,
                    fos: 10,
                    nel: 10,
                    vos: null,
                    exchangeEnergy: null,
                    ndf: null
                }, {
                    date: new Date('12-10-2015'),
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 24,
                    fos: null,
                    nel: 10,
                    vos: 10,
                    exchangeEnergy: null,
                    ndf: null
                }]
        }, {
            _id: '2',
            general: {
                name: '2',
                year: 2015,
                price:  null
            },analysis: [{
                    isNaturalWet: false,
                    number: 1,
                    dryMaterial: 10,
                    fos: 10,
                    nel: 10,
                    vos: null,
                    exchangeEnergy: null,
                    ndf: null
                }, {
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 6,
                    fos: null,
                    nel: 10,
                    vos: 10,
                    exchangeEnergy: null,
                    ndf: 1
                }]
        }];

        var feedDiff = diff(feeds);
        
        // general
        var diffGeneral = _.find(feedDiff.diffs, {"key": "general"});
        expect(_.find(diffGeneral.children, {key: 'price'})).to.equal(undefined);
        expect(_.find(diffGeneral.children, {key: 'year'}).values).to.deep.equal([2015, 2015]);

        // analysis
        var diffAnalys = _.find(feedDiff.diffs, {"key": "analysis"});

        expect(_.find(diffAnalys.children, {key: 'exchangeEnergy'})).to.equal(undefined);

        var numbers = _.find(diffAnalys.children, {key: 'number'});
        expect(numbers.values).to.deep.equal([[1,2], [1,2]]);

        var dryMaterials = _.find(diffAnalys.children, {key: 'dryMaterial'});
        expect(dryMaterials.values).to.deep.equal([[10,24], [10,6]]);

        var dates = _.find(diffAnalys.children, {key: 'date'});
        expect(dates.values).to.deep.equal([['10/10/2015','10/12/2015'], [undefined, undefined]]);


        _.forEach(diffAnalys.children, function (child) {
            var key = child.key;
            if (feedUtils.propertyForRecalculate[key]) {
                
                var analysisIndx = [0,1];
                var feedsIndx = [0,1];

                _.forEach(feedsIndx, function (i) {
                    _.forEach(analysisIndx, function (n) {
                        var analysis = feeds[i].analysis[n];
                        var value = feedUtils.calcDryRaw(analysis.isNaturalWet, analysis.dryMaterial, analysis[key]);
                        expect(child.values[i][n]).to.deep.equal(value);

                    })                    
                });
            } 
        });

        expect(feedDiff.dryRawValues).to.deep.equal([ [ false, true ], [ false, true ] ]);

        done();
    });
});