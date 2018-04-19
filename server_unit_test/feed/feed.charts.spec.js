var expect = require("chai").expect;
var charts = require('../../feed/feed.charts');
var feedUtils = require('../../feed/feed.utils');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.charts', function() {
    
    it('charts', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015,
                feedType: 'haylage',
                composition: 'foo',
                balanceWeight: 1
            },
            analysis: [{
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
                date: new Date('12-10-2015'),
                isNaturalWet: true,
                number: 2,
                dryMaterial: 10,
                crudeProtein: 20
            }]
        }];

        var feedChart = charts(feeds);
        expect(feedChart.chartSeries[0].data[0]).to.equal(166.67);

        feeds[1].analysis[0].isNaturalWet = false;
        feedChart = charts(feeds);

        console.log(feedChart.chartSeries[0].data)
        expect(feedChart.chartSeries[0].data[0]).to.equal(46.67);
        done();
    });
});