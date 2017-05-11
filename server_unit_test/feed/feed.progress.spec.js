var expect = require("chai").expect;
var progress = require('../../feed/feed.progress');
var feedUtils = require('../../feed/feed.utils');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.progress', function() {
    
    it('get dashboard progress for feeds', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015,
                feedType: 'haylage',
                composition: 'foo',
                totalWeight: 343,
                balanceWeight: 123,
                opened: true,
                done: false
            },
            feeding: {
                start: new Date(),
                end: null,
                tonnPerDay: 12,
                autoDecrement: true
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
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 10,
                    crudeProtein: 100
                }]
        }];

        var b = progress(feeds);
        
        var autoDecrementFeeds = b.autoDecrementFeeds;

        expect(autoDecrementFeeds.length).to.equal(1);
        expect(autoDecrementFeeds[0].name).to.equal('1');
        expect(autoDecrementFeeds[0].tonnPerDay).to.equal(12);
        expect(autoDecrementFeeds[0].willEnd).to.exist;
        expect(autoDecrementFeeds[0].daysLeft).to.equal(10);
        expect(autoDecrementFeeds[0].percentLeft).to.equal(36);
        expect(autoDecrementFeeds[0].totalWeight).to.equal(343);
        expect(autoDecrementFeeds[0].balanceWeight).to.equal(123);

        done();
    });

    it('sorting progress for feeds', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015,
                feedType: 'haylage',
                composition: 'foo',
                totalWeight: 343,
                balanceWeight: 123,
                opened: true,
                done: false
            },
            feeding: {
                start: new Date(),
                end: null,
                tonnPerDay: 12,
                autoDecrement: true
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
                composition: 'foo',
                totalWeight: 300,
                balanceWeight: 10,
                opened: true,
                done: false
            },
            feeding: {
                start: new Date(),
                end: null,
                tonnPerDay: 2,
                autoDecrement: true
            },
            analysis: [{
                    date: new Date('12-10-2015'),
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 10,
                    crudeProtein: 10
                }]
        }];

        var b = progress(feeds);
        
        var autoDecrementFeeds = b.autoDecrementFeeds;

        expect(autoDecrementFeeds[0].name).to.equal('2');
        expect(autoDecrementFeeds[1].name).to.equal('1');

        done();
    });
});