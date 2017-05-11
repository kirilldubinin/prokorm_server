var expect = require("chai").expect;
var planning = require('../../feed/feed.planning');
var feedUtils = require('../../feed/feed.utils');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.planning', function() {
    
    it('planning', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015,
                feedType: 'haylage',
                composition: 'foo',
                balanceWeight: 900
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
                balanceWeight: 1200
            },analysis: [{
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 10,
                    crudeProtein: 100
                }]
        }, {
            _id: '3',
            general: {
                name: '3',
                year: 2015,
                feedType: 'grain',
                composition: 'bar',
                balanceWeight: 220
            },analysis: [{
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 10,
                    crudeProtein: 100
                }]
        }];

        var feedPlanning = planning({
            feeds: feeds, 
            tonnPerDay:{
                haylage: 10,
                grain: 2
            }
        });

        expect(feedPlanning.properties.length).to.equal(4);
        var haylage = feedPlanning.sumsRows[0];

        expect(haylage.label).to.equal('Сенаж');
        expect(haylage.key).to.equal('haylage');
        expect(haylage.tonnPerDay).to.equal(10);
        expect(haylage.willEnd).to.exist;
        expect(haylage.daysLeft).to.equal(210);
        expect(haylage.balanceWeight).to.equal(2100);
        done();
    });
});