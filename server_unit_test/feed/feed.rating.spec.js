var expect = require("chai").expect;
var rating = require('../../feed/feed.rating');
var _ = require('lodash');
describe.only('feed.rating', function() {
    var feeds;
    beforeEach(function() {
        feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015,
                price: '',
            },
            analysis: [{
                dryMaterial: 32.3,
                oeb: 80,
                vcos: 75.9,
                nh3: 7,
                sugar: 21,
                ndf: 362,
                crudeProtein: 209
            }]
        }, {
            _id: '2',
            general: {
                name: '2',
                year: 2015,
                price: null
            },
            analysis: [{
                dryMaterial: 39.1,
                oeb: 23,
                vcos: 63,
                nh3: 7,
                sugar: 54,
                ndf: 522,
                crudeProtein: 122
            }]
        }, {
            _id: '3',
            general: {
                name: '3',
                year: 2015,
                price: null
            },
            analysis: [{
                dryMaterial: 48.9,
                oeb: -35,
                vcos: 71.3,
                nh3: 5,
                sugar: 114,
                ndf: 560,
                crudeProtein: 70
            }]
        }];
    });
    it('return null if feedType undefined', function(done) {
        var raitingAverage = rating(feeds);
        expect(raitingAverage).to.equal(null);
        var raitingAverage = rating(feeds, 'wrong');
        expect(raitingAverage).to.equal(null);
        done();
    });
    it('should return rating for haylage', function(done) {
        var raitingAverage = rating(feeds, 'haylage');
        console.log(raitingAverage);
        //console.log(raitingAverage);
        done();
    });
});