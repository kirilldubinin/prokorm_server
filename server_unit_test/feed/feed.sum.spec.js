var expect = require("chai").expect;
var sum = require('../../feed/feed.sum');
var feedUtils = require('../../feed/feed.utils');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.sum', function() {
    
    it.only('sum', function(done) {
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

        var feedAverage = sum(feeds);
        console.log(feedAverage.sumsRows[0].sumsByProp); 
        console.log('=================')
        console.log(feedAverage.sumsRows[0].byComposition[0].sumsByProp); 
        console.log(feedAverage.sumsRows[0].byComposition[1].sumsByProp); 


        done();
    });
});