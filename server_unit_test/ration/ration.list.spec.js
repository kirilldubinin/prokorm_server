var expect = require("chai").expect;
var list = require('../../ration/ration.list');
var _ = require('lodash');
describe('ration.list', function() {
    describe('sorting', function() {
        it('by createdAt', function() {
            var rations = [{
                createdAt: new Date('10-10-2010'),
                general: {
                    name: '1',
                    type: '1'
                }
            }, {
                createdAt: new Date('11-10-2009'),
                general: {
                    name: '2',
                    type: '2'
                }
            }, {
                createdAt: new Date('11-10-2010'),
                general: {
                    name: '3',
                    type: '3'
                }
            }];
            var res = list(rations).rations;
            expect(res[0].name).to.equal('3');
            expect(res[1].name).to.equal('1');
            expect(res[2].name).to.equal('2');
        });
        it('by progress state, in progress should be on top', function() {
            var rations = [{
                createdAt: new Date('10-10-2010'),
                general: {
                    name: '1',
                    type: '1',
                    startDate: new Date('10-10-2015')
                }
            }, {
                createdAt: new Date('11-10-2009'),
                general: {
                    name: '2',
                    type: '2'
                }
            }, {
                createdAt: new Date('11-10-2010'),
                general: {
                    name: '3',
                    type: '3',
                    startDate: new Date('10-10-2015')
                }
            }];
            var res = list(rations).rations;
            expect(res[0].name).to.equal('3');
            expect(res[1].name).to.equal('1');
            expect(res[2].name).to.equal('2');
        });
        it('by progress state, non progress should be on the middle', function() {
            var rations = [{
                createdAt: new Date('10-10-2010'),
                general: {
                    name: '4',
                    type: '4',
                    startDate: new Date('10-10-2015'),
                    endDate: new Date('10-11-2015')
                }
            }, {
                createdAt: new Date('10-10-2010'),
                general: {
                    name: '1',
                    type: '1',
                    startDate: new Date('10-10-2015')
                }
            }, {
                createdAt: new Date('11-10-2009'),
                general: {
                    name: '2',
                    type: '2'
                }
            }, {
                createdAt: new Date('11-10-2010'),
                general: {
                    name: '3',
                    type: '3',
                    startDate: new Date('10-10-2015')
                }
            }];
            var res = list(rations).rations;
            expect(res[0].name).to.equal('3');
            expect(res[1].name).to.equal('1');
            expect(res[2].name).to.equal('2');
            expect(res[3].name).to.equal('4');
        });
    });

    describe('content', function () {
        var rations = [{
            _id: '1',
            createdAt: new Date('10-10-2010'),
            general: {
                name: 'name',
                type: 'type',
                startDate: 'foo',
                endDate: 'bar',
                target: 'target'
            }
        }];

        it('should have _id', function () {
            var res = list(rations).rations;
            expect(res[0]._id).to.equal('1');
        });
        it('should have name', function () {
            var res = list(rations).rations;
            expect(res[0].name).to.equal('name');
        });
        it('should have type', function () {
            var res = list(rations).rations;
            expect(res[0].type).to.equal('type');
        });
        it('should have startDate', function () {
            var res = list(rations).rations;
            expect(res[0].startDate).to.equal('foo');
        });
        it('should have endDate', function () {
            var res = list(rations).rations;
            expect(res[0].endDate).to.equal('bar');
        });
        it('should have target', function () {
            var res = list(rations).rations;
            expect(res[0].target).to.equal('target');
        });
        it('should have price', function () {
            var res = list(rations).rations;
            expect(res[0].price).to.equal(null);
        });
        it('should have dryWeight', function () {
            var res = list(rations).rations;
            expect(res[0].dryWeight).to.equal(null);
        });
    });
});