var expect = require("chai").expect;
var rating = require('../../feed/feed.rating');
var _ = require('lodash');
describe.only('feed.rating', function() {
    
    it('rating', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015,
                price: '',
            },analysis: [{
                    dryMaterial: 20,
                    oeb: 25,
                    vcos: 100,
                    nh3: 2,
                    sugar: 120,
                    ndf: 430,
                    crudeProtein: 120
                }]
        }, {
            _id: '2',
            general: {
                name: '2',
                year: 2015,
                price:  null
            },analysis: [{
                    dryMaterial: 10,
                    oeb: 5,
                    vcos: 10,
                    nh3: 20,
                    sugar: 100,
                    ndf: 130,
                    crudeProtein: 90
                }]
        }, {
            _id: '3',
            general: {
                name: '3',
                year: 2015,
                price:  null
            },analysis: [{
                    dryMaterial: 10,
                    vcos: 10,
                    nh3: 20,
                    sugar: 100,
                    ndf: 130,
                    crudeProtein: 90
                }]
        }];

        var raitingAverage = rating(feeds);
        //console.log(raitingAverage);
        done();
    });
});