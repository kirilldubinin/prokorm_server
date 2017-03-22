var expect = require("chai").expect;
var sum = require('../../feed/feed.sum');
var feedUtils = require('../../feed/feed.utils');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.sum', function() {
    
    it('sum', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015,
                feedType: 'haylage',
                composition: 'foo',
                balanceWeight: 1
            },analysis: [{
                    date: new Date('12-10-2015'),
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 10,
                    crudeProtein: 10
                }]
        }, {
            _id: '2',
            general: {
                name: '2',
                year: 2015,
                feedType: 'haylage',
                composition: 'bar',
                balanceWeight: 2
            },analysis: [{
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 10,
                    crudeProtein: 100
                }]
        }];

        var feedSum = sum(feeds);

        expect(feedSum.properties.length).to.equal(2);
        expect(feedSum.sumsRows.length).to.equal(1);

        var sumsByProp = feedSum.sumsRows[0];

        expect(sumsByProp.sumsByProp[0].value).to.equal(300);
        expect(sumsByProp.sumsByProp[1].value).to.equal(210);
        expect(sumsByProp.byComposition.length).to.equal(2);
        expect(sumsByProp.byComposition[0].key).to.equal('foo');
        expect(sumsByProp.byComposition[1].key).to.equal('bar');
        done();
    });
});