var expect = require("chai").expect;
var view = require('../../feed/feed.view');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.view', function() {
    
    describe('feed.analysis', function (){

        it('view with single analys, should have single element in values array', function(done) {
            var feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                },
                analysis: [{
                    isNaturalWet: false,
                    number: 1,
                    code: '23',
                    date: new Date('10-10-2000'),
                    dryMaterial: 23,
                    ph: 5
                }]
            };

            var feedView = view(feed, {tenantName: 'foo'});
            expect(feedView.actions.length).to.equal(1);
            expect(feedView.general).to.equal(feed.general);
            expect(feedView.feedItemSections.length).to.equal(2);

            var viewSection = feedView.feedItemSections[0];
            expect(viewSection.controls.isNaturalWet.values.length).to.equal(1);
            expect(viewSection.controls.number.values.length).to.equal(1);
            expect(viewSection.controls.code.values.length).to.equal(1);
            expect(viewSection.controls.date.values.length).to.equal(1);
            expect(viewSection.controls.dryMaterial.values.length).to.equal(1);
            expect(viewSection.controls.ph.values.length).to.equal(1);

            done();
        });

        it('view with single analys should have dry and raw values for recalculate property', function(done) {
            var feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                },
                analysis: [{
                    isNaturalWet: false,
                    number: 1,
                    dryMaterial: 10,
                    nel: 10
                }]
            };

            var feedView = view(feed, {tenantName: 'foo'});
            var viewSection = feedView.feedItemSections[0];

            var nel = viewSection.controls.nel.values[0];
            expect(nel.dryValue).to.equal(10);
            expect(nel.rawValue).to.equal(1);

            feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                },
                analysis: [{
                    isNaturalWet: true,
                    number: 1,
                    dryMaterial: 10,
                    nel: 10
                }]
            };

            feedView = view(feed, {tenantName: 'foo'});
            viewSection = feedView.feedItemSections[0];

            nel = viewSection.controls.nel.values[0];
            expect(nel.dryValue).to.equal(100);
            expect(nel.rawValue).to.equal(10);

            done();
        });

        it('view with multiple analys should have dry and raw values for recalculate property', function(done) {
            var feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                },
                analysis: [{
                    isNaturalWet: false,
                    number: 1,
                    dryMaterial: 10,
                    fos: 10,
                    nel: 10,
                    vos: null,
                    exchangeEnergy: null
                }, {
                    isNaturalWet: true,
                    number: 2,
                    dryMaterial: 10,
                    fos: null,
                    nel: 10,
                    vos: 10,
                    exchangeEnergy: null
                }]
            };

            var feedView = view(feed, {tenantName: 'foo'});
            var viewSection = feedView.feedItemSections[0];

            expect(viewSection.controls.exchangeEnergy).to.equal(undefined);

            var nel1 = viewSection.controls.nel.values[0];
            var nel2 = viewSection.controls.nel.values[1];
            
            var fos1 = viewSection.controls.fos.values[0];
            var fos2 = viewSection.controls.fos.values[1];

            var vos1 = viewSection.controls.vos.values[0];
            var vos2 = viewSection.controls.vos.values[1];
            
            expect(nel1).to.deep.equal({dryValue: 10, rawValue: 1});
            expect(nel2).to.deep.equal({dryValue: 100, rawValue: 10});

            expect(fos1).to.deep.equal({dryValue: 10, rawValue: 1});
            expect(fos2).to.deep.equal(null);

            expect(vos1).to.deep.equal(null);
            expect(vos2).to.deep.equal({dryValue: 100, rawValue: 10});

            done();
        });

    });

    describe('feed.general', function (){
        it('view with "name" and "year" properties only', function(done) {
            var feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }
            };

            var feedView = view(feed);
            expect(feedView.actions.length).to.equal(1);
            expect(feedView.general).to.equal(feed.general);
            expect(feedView.feedItemSections.length).to.equal(1);

            var viewSection = feedView.feedItemSections[0];
            expect(viewSection.key).to.equal('general');
            expect(viewSection.controls['name'].key).to.equal('name');
            expect(viewSection.controls['year'].key).to.equal('year');
            expect(Object.keys(viewSection.controls).length).to.equal(2);

            done();
        });

        it('view with all properties', function(done) {
            var feed = {
                _id: '1',
                general: {
                    name: '1',
                    feedType: '2',
                    composition: '3',
                    year: 2000,
                    field: '4',
                    totalWeight: 2000,
                    balanceWeight: 1000,
                    storage: '5',
                    price: 2,
                    opened: false,
                    done: false
                }
            };

            var feedView = view(feed);
            expect(feedView.actions.length).to.equal(1);
            expect(feedView.general).to.equal(feed.general);
            expect(feedView.feedItemSections.length).to.equal(1);

            var viewSection = feedView.feedItemSections[0];
            expect(viewSection.key).to.equal('general');
            expect(Object.keys(viewSection.controls).length).to.equal(11);

            _.forEach(viewSection.controls, function (data, key) {
                expect(data.key).to.equal(key);
                expect(data.value).to.equal(lang(feed.general[key]));
            });

            done();
        });
    });

    describe('feed.harvest', function (){

        it('view should have hervest days if harvest.start and harvest.end is set', function (done) {

            var feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }, harvest: {
                    cutNumber: 1,
                    preservative: '2',
                    dosage: '3',
                    film: '4',
                    start: new Date('10-10-2000'),
                    end: new Date('10-20-2000')
                }
            };

            var feedView = view(feed);
            expect(feedView.actions.length).to.equal(1);
            expect(feedView.general).to.equal(feed.general);
            expect(feedView.feedItemSections.length).to.equal(2);

            var viewSection = feedView.feedItemSections[1];
            expect(viewSection.controls.harvestDays.value).to.equal(10);

            done();
        });

        it('view should not have hervest days if harvest.start or harvest.end is not set', function (done) {

            var feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }, harvest: {
                    cutNumber: 1,
                    preservative: '2',
                    dosage: '3',
                    film: '4',
                    //start: new Date('10-10-2000'),
                    end: new Date('10-20-2000')
                }
            };

            var feedView = view(feed);
            var viewSection = feedView.feedItemSections[1];
            expect(viewSection.controls.harvestDays).to.equal(undefined);

            feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }, harvest: {
                    cutNumber: 1,
                    preservative: '2',
                    dosage: '3',
                    film: '4',
                    start: new Date('10-10-2000')
                    //end: new Date('10-20-2000')
                }
            };
            feedView = view(feed);
            viewSection = feedView.feedItemSections[1];
            expect(viewSection.controls.harvestDays).to.equal(undefined);

            feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }, harvest: {
                    cutNumber: 1,
                    preservative: '2',
                    dosage: '3',
                    film: '4'
                }
            };
            feedView = view(feed);
            viewSection = feedView.feedItemSections[1];
            expect(viewSection.controls.harvestDays).to.equal(undefined);

            done();
        });
    });

    describe('feed.feeding', function (){

        it('view should have feeding days if feeding.start and feeding.end is set', function (done) {

            var feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }, feeding: {
                    start: new Date('10-10-2000'),
                    end: new Date('10-20-2000')
                }
            };

            var feedView = view(feed);
            var viewSection = feedView.feedItemSections[1];
            expect(viewSection.controls.feedingDays.value).to.equal(10);

            done();
        });

        it('view should not have feeding days if feeding.start or feeding.end is not set', function (done) {

            var feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }, feeding: {
                    end: new Date('10-20-2000')
                }
            };

            var feedView = view(feed);
            var viewSection = feedView.feedItemSections[1];
            expect(viewSection.controls.feedingDays).to.equal(undefined);

            feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }, feeding: {
                    start: new Date('10-10-2000')
                    //end: new Date('10-20-2000')
                }
            };
            feedView = view(feed);
            viewSection = feedView.feedItemSections[1];
            expect(viewSection.controls.feedingDays).to.equal(undefined);

            feed = {
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }, feeding: {
                    tonnPerDay: 2
                }
            };
            feedView = view(feed);
            viewSection = feedView.feedItemSections[1];
            expect(viewSection.controls.feedingDays).to.equal(undefined);

            done();
        });
    });
});