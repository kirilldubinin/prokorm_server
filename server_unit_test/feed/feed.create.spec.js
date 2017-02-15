var expect = require("chai").expect;
var create = require('../../feed/feed.create');
var feedUtils = require('../../feed/feed.utils');
var lang = require('../../feed/lang');
var _ = require('lodash');
describe('feed.create', function() {
    
    var res = null;
    beforeEach(function (done) {
        res = {
            _json: null,
            json: function(data) {
                this._json = data;
                return this;
            },
            _status: null,
            status: function(data) {
                this._status = data;
                return this;
            }
        };

        done();
    });

    it('does not have rights', function(done) {
        
        create({
            user: {
                permissions: []    
            }
        }, res);

        expect(res._status).to.equal(406);
        expect(res._json).to.deep.equal({message: 'Недостаточно прав'});

        done();
    });

    it('does not have user and tenant in request', function(done) {
        
        create({
            user: {
                permissions: [],
                _id: null,
                tenantId: 'foo' 
            },
        }, res);

        expect(res._status).to.equal(406);
        expect(res._json).to.deep.equal({message: 'Недостаточно прав'});

        create({
            user: {
                permissions: [],
                _id: 'foo',
                tenantId: null 
            },
        }, res);

        expect(res._status).to.equal(406);
        expect(res._json).to.deep.equal({message: 'Недостаточно прав'});

        create({
            user: {
                permissions: [],
                _id: null,
                tenantId: null 
            },
        }, res);

        expect(res._status).to.equal(406);
        expect(res._json).to.deep.equal({message: 'Недостаточно прав'});

        done();
    });

    describe('validate general', function (done) {

        it('feedType is required', function (done) {

            create({
                user: {
                    permissions: ['admin'],
                    _id: 'foo',
                    tenantId: 'foo' 
                },
                body: {
                    general: {
                        name: 'foo',
                        feedType: '',
                        composition: 'foo',
                        year: 'foo'
                    }   
                }
            }, res);

            expect(res._status).to.equal(406);
            expect(res._json).to.deep.equal({message: lang('feedType') + ' обязательно для заполнения'});

            done();
        });

        it('composition is required', function (done) {

            create({
                user: {
                    permissions: ['admin'],
                    _id: 'foo',
                    tenantId: 'foo' 
                },
                body: {
                    general: {
                        name: 'foo',
                        feedType: 'foo',
                        composition: '',
                        year: 'foo'
                    }   
                }
            }, res);

            expect(res._status).to.equal(406);
            expect(res._json).to.deep.equal({message: lang('composition') + ' обязательно для заполнения'});

            done();
        });

        it('year is required', function (done) {

            create({
                user: {
                    permissions: ['admin'],
                    _id: 'foo',
                    tenantId: 'foo' 
                },
                body: {
                    general: {
                        name: 'foo',
                        feedType: 'foo',
                        composition: 'foo',
                        year: ''
                    }   
                }
            }, res);

            expect(res._status).to.equal(406);
            expect(res._json).to.deep.equal({message: lang('year') + ' обязательно для заполнения'});

            done();
        });
    });

    describe('validate analysis', function (done) {

        it('number is required', function (done) {

            create({
                user: {
                    permissions: ['admin'],
                    _id: 'foo',
                    tenantId: 'foo' 
                },
                body: {
                    general: {
                        name: 'foo',
                        feedType: 'foo',
                        composition: 'foo',
                        year: 'foo'
                    },
                    analysis: [{
                        number: null,
                        date: 'foo',
                        dryMaterial: 'foo'
                    }]   
                }
            }, res);

            expect(res._status).to.equal(406);
            expect(res._json).to.deep.equal({message: lang('number') + 'анализа обязателен для заполнения'});

            done();
        });

        it('date is required', function (done) {

            create({
                user: {
                    permissions: ['admin'],
                    _id: 'foo',
                    tenantId: 'foo' 
                },
                body: {
                    general: {
                        name: 'foo',
                        feedType: 'foo',
                        composition: 'foo',
                        year: 'foo'
                    },
                    analysis: [{
                        number: 'foo',
                        date: null,
                        dryMaterial: 'foo'
                    }]  
                }
            }, res);

            expect(res._status).to.equal(406);
            expect(res._json).to.deep.equal({message: lang('date') + 'анализа обязательна для заполнения'});

            done();
        });

        it('dryMaterial is required', function (done) {

            create({
                user: {
                    permissions: ['admin'],
                    _id: 'foo',
                    tenantId: 'foo' 
                },
                body: {
                    general: {
                        name: 'foo',
                        feedType: 'foo',
                        composition: 'foo',
                        year: 'foo'
                    },
                    analysis: [{
                        number: 'foo',
                        date: 'foo',
                        dryMaterial: null
                    }]  
                }
            }, res);

            expect(res._status).to.equal(406);
            expect(res._json).to.deep.equal({message: lang('dryMaterial') + 'анализа обязательно для заполнения'});

            done();
        });
    });
});