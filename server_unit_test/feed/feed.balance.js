var expect = require("chai").expect;
var balance = require('../../feed/feed.balance');
var feedUtils = require('../../feed/feed.utils');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.balance', function() {
    
    it('total and balance weight is required for balance', function(done) {
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

        var b = balance(feeds);
        
        expect(b.byFeedType.length).to.equal(0);
        expect(b.byComposition.length).to.equal(0);

        done();
    });

    it('balance', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015,
                feedType: 'haylage',
                composition: 'foo',
                balanceWeight: 1,
                totalWeight: 2
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
                balanceWeight: 2,
                totalWeight: 3
            },analysis: [{
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 10,
                    crudeProtein: 100
                }]
        }];

        var b = balance(feeds);
        var byFeedType = b.byFeedType[0];
        expect(byFeedType.total).to.equal(5);
        expect(byFeedType.balance).to.equal(3);
        expect(byFeedType.balancePercent).to.equal(60);

        var byComposition = b.byComposition[0];
        expect(byComposition.total).to.equal(2);
        expect(byComposition.balance).to.equal(1);
        expect(byComposition.balancePercent).to.equal(50);

        byComposition = b.byComposition[1];
        expect(byComposition.total).to.equal(3);
        expect(byComposition.balance).to.equal(2);
        expect(byComposition.balancePercent).to.equal(67);


        
        done();
    });
});