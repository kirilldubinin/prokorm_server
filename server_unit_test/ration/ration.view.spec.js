var expect = require("chai").expect;
var view = require('../../ration/ration.view');
var lang = require('../../ration/ration.lang');
var dimension = require('../../ration/ration.dimension');
var _ = require('lodash');
describe('ration.view', function() {
    
    describe('general tab', function() {
        
        var ration = {
            createdAt: new Date('10-10-2010'),
            general: {
                name: '1',
                type: '1',
                target: '12 литров',
                groupName: 'foo',
                cowWeight: 1,
                startDate: 'bar',
                endDate: 'bar'
            }
        };

        it('label should exist', function() {
            var res = view(ration).rationItemSections[0];
            expect(res.label).to.equal(lang('general'));
        });

        it('key should exist', function() {
            var res = view(ration).rationItemSections[0];
            expect(res.key).to.equal('general');
        });

        it('controls should exist', function() {
            var res = view(ration).rationItemSections[0];
            expect(_.size(res.controls)).to.be.above(0);
        });

        describe('controls', function () {

            _.forEach(['type', 'name', 'target', 'startDate', 'endDate'], function (key) {
                it(key + ' control should exist', function () {
                    var res = _.first(view(ration).rationItemSections).controls;
                    
                    var type = _.first(_.filter(res, {key: key}));
                    
                    expect(type.key).to.equal(key);
                    expect(type.label).to.equal(lang(type['key']));
                    expect(type.dimension).to.equal(dimension(type.dimension));
                    expect(type.value).to.equal(ration.general[key]);
                });    
            })
        });
    });

    describe('feeds tab', function () {

        var ration = {
            createdAt: new Date('10-10-2010'),
            general: {
                name: '1',
                type: '1'
            },
            feeds: [
                {
                    _id: '_id',
                    name: 'name',
                    year: 'year',
                    branch: 'branch',
                    storage: 'storage',
                    weight: 10, //kilo
                    dryMaterial: 100, // gr/kilo
                    price: 15 // for kilo
                },
                {
                    name: 'name',
                    weight: 1,
                    dryMaterial: 500, // gr/kilo
                    price: 1000 // for kilo
                }
            ]
        };

        it('label should exist', function() {
            var res = view(ration).rationItemSections[1];
            expect(res.label).to.equal(lang('feeds'));
        });

        it('key should exist', function() {
            var res = view(ration).rationItemSections[1];
            expect(res.key).to.equal('feeds');
        });

        it('controls should exist', function() {
            var res = view(ration).rationItemSections[1];
            expect(_.size(res.controls)).to.be.above(0);
        });

        describe.only('controls', function () {
            describe('head', function () {
                _.forEach([
                    '#',
                    'component', 
                    'proportionWeight', 
                    'dryMaterial', 
                    'totalDryMaterial', 
                    'priceKilo',
                    'price'], function (key, index) {

                        it(key + ' should exist', function () {
                            var res = view(ration).rationItemSections[1].controls.head;
                            expect(res[index]).to.equal(lang(key));
                        });
                    });
            });
            describe('body', function () {

                it('verifify array of feeds', function () {
                    var res = view(ration).rationItemSections[1].controls.body;
                    var first = res[0];
                    
                    //1
                    expect(first[0]).to.deep.equal({
                        feedId: ration.feeds[0]._id,
                        name: ration.feeds[0].name,
                        year: ration.feeds[0].year,
                        branch: ration.feeds[0].branch,
                        storage: ration.feeds[0].storage
                    });  
                    //2
                    expect(first[1]).to.equal(ration.feeds[0].weight);
                    //3
                    expect(first[2]).to.equal(ration.feeds[0].dryMaterial);
                    //4 totalDryMaterial
                    expect(first[3]).to.equal(Math.round(ration.feeds[0].weight*ration.feeds[0].dryMaterial/1000));
                    //5 price kilo
                    expect(first[4]).to.equal(Math.round(ration.feeds[0].price));
                    //6 price
                    expect(first[5]).to.equal(Math.round(ration.feeds[0].weight*ration.feeds[0].price));

                    var second = res[1];
                    
                    //1
                    expect(second[0]).to.deep.equal({
                        name: ration.feeds[1].name
                    });  
                    //2
                    expect(second[1]).to.equal(ration.feeds[1].weight);
                    //3
                    expect(second[2]).to.equal(ration.feeds[1].dryMaterial);
                    //4 totalDryMaterial
                    expect(second[3]).to.equal(Math.round(ration.feeds[1].weight*ration.feeds[1].dryMaterial/1000));
                    //5 price kilo
                    expect(second[4]).to.equal(Math.round(ration.feeds[1].price));
                    //6 price
                    expect(second[5]).to.equal(Math.round(ration.feeds[1].weight*ration.feeds[1].price));

                });
            });
            describe('footer', function () {
                it('verfify array of total values', function () {
                    

                });    
            });
        });
    });
});