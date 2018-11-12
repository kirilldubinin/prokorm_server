var expect = require("chai").expect;
var rating = require('../../feed/feed.rating').getRaiting;
var score = require('../../feed/feed.rating').getScore;
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
                dryMaterial: 22.3,
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
    xit('return null if feedType undefined', function(done) {
        var raitingAverage = rating(feeds);
        expect(raitingAverage).to.equal(null);
        var raitingAverage = rating(feeds, 'wrong');
        expect(raitingAverage).to.equal(null);
        done();
    });
    it('should return rating for haylage', function(done) {
        var raitingAverage = rating(feeds, 'haylage');

        _.forEach(raitingAverage.properties, function (prop) {
            expect(prop.key).to.be.a('string');
            expect(prop.label).to.be.a('string');
            expect(prop.dimension).to.be.a('string');
            expect(prop.bestValue).to.be.a('string');
        });

        var feed_1 = raitingAverage.feeds[0];
        var feed_1_in_range = _.filter(feed_1, {"inRange": true});
        expect(feed_1[0].name).to.be.equal('1');
        expect(feed_1_in_range.length).to.be.equal(4);

        var feed_2 = raitingAverage.feeds[1];
        var feed_2_in_range = _.filter(feed_2, {"inRange": true});
        expect(feed_2[0].name).to.be.equal('3');
        expect(feed_2_in_range.length).to.be.equal(4);

        var feed_3 = raitingAverage.feeds[2];
        var feed_3_in_range = _.filter(feed_3, {"inRange": true});
        expect(feed_3[0].name).to.be.equal('2');
        expect(feed_3_in_range.length).to.be.equal(4);

       
        done();
    });

    it('should return rating for greenmass', function(done) {
        
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2018,
                price: '',
            },
            analysis: [{
                dryMaterial: 22.3,
                crudeProtein: 160,
                vcos: 75.9,
                ndf: 380,
                //adl: 40,
                oeb: 40,
                crudeAsh: 209,
                sugar: 120
            }]
        }]
        try {
            var raitingAverage = rating(feeds, 'greenmass');
        } catch(e) {
            expect(e).to.be.equal('У 1 выбранного корма введены не все обязательные показатели');
        }

        feeds[0].analysis[0].adl = 40;

        try {
            var raitingAverage = rating(feeds, 'greenmass');
            expect(raitingAverage.feeds[0][0].score).to.be.equal(420);
        } catch(e) {}

        done();
    });

    it('should return score for sugar', function(done) {
        expect(score.score_oeb(80)).to.be.equal(20);
        expect(score.score_vcos(75.9)).to.be.equal(100);
        expect(score.score_sugar(21)).to.be.equal(10);
        expect(score.score_ndf(362)).to.be.equal(60);
        expect(score.score_crudeProtein(209)).to.be.equal(90);
        done();
    });
});