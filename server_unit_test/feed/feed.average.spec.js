var expect = require("chai").expect;
var average = require('../../feed/feed.average');
var feedUtils = require('../../feed/feed.utils');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.average', function() {
    
    it('average', function(done) {
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
                    dryMaterial: 10,
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
                    dryMaterial: 10,
                    fos: null,
                    nel: 10,
                    vos: 10,
                    exchangeEnergy: null,
                    ndf: 1
                }]
        }];

        var feedAverage = average(feeds);
        expect(feedAverage.dryRawValues).to.deep.equal([ [ false, true ], [ false, true ], [false] ]);

        var fosAverage = _.find(feedAverage.analysis[0].children, {key: 'fos'});
        expect(fosAverage.values[2][0]).to.deep.equal({dryValue: 10, rawValue: 1});
        
        var nelAverage = _.find(feedAverage.analysis[0].children, {key: 'nel'});
        expect(nelAverage.values[2][0]).to.deep.equal({dryValue: 55, rawValue: 5.5});

        var dryMaterialAverage = _.find(feedAverage.analysis[0].children, {key: 'dryMaterial'});
        expect(dryMaterialAverage.values[2][0]).to.equal(10);

        var exchangeEnergyAverage = _.find(feedAverage.analysis[0].children, {key: 'exchangeEnergy'});
        expect(exchangeEnergyAverage).to.equal(undefined);
        
        done();
    });
});