var expect = require("chai").expect;
var list = require('../../feed/feed.list');
var _ = require('lodash');
describe('feed.list', function() {
    it('verify feeds with "name" and "year" properties only', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015
            }
        }, {
            _id: '2',
            general: {
                name: '2',
                year: 2014
            }
        }, {
            _id: '3',
            general: {
                name: '3',
                year: 2017
            }
        }];
        var feedList = list(feeds);
        expect(feedList.feeds.length).to.equal(3);
        expect(feedList.feeds[0].year).to.equal(2017);
        expect(feedList.feeds[1].year).to.equal(2015);
        expect(feedList.feeds[2].year).to.equal(2014);
        _.each(feedList.feeds, function(feed) {
            expect(feed.name).to.be.a('string');
            expect(feed.year).to.be.a('number');
            expect(feed.analysis).to.equal(0);
            expect(feed.feedType).to.equal(undefined);
            expect(feed.field).to.equal(undefined);
            expect(feed._id).to.be.a('string');
            expect(feed.totalWeight).to.equal(undefined);
            expect(feed.balanceWeight).to.equal(undefined);
            expect(feed.done).to.equal(undefined);
            expect(feed.opened).to.equal(undefined);
        });
        done();
    });
    it('verify analysis length', function(done) {
        var feeds = [{
            _id: '1',
            general: {
                name: '1',
                year: 2015
            },
            analysis: [{}, {}]
        }, {
            _id: '2',
            general: {
                name: '2',
                year: 2015
            }
        }, {
            _id: '3',
            general: {
                name: '3',
                year: 2015
            },
            analysis: []
        }, {
            _id: '3',
            general: {
                name: '3',
                year: 2015
            },
            analysis: [{}]
        }];
        var feedList = list(feeds);
        expect(feedList.feeds[0].analysis).to.equal(2);
        expect(feedList.feeds[1].analysis).to.equal(0);
        expect(feedList.feeds[2].analysis).to.equal(0);
        expect(feedList.feeds[3].analysis).to.equal(1);
        done();
    });
    describe('sorting', function() {
        it('feeds should be in following sort: opened, closed, done', function(done) {
            var feeds = [{
                _id: '1',
                general: {
                    name: '1',
                    year: 2015,
                    done: true
                }
            }, {
                _id: '2',
                general: {
                    name: '2',
                    year: 2014,
                    opened: true
                }
            }, {
                _id: '3',
                general: {
                    name: '3',
                    year: 2017
                }
            }, {
                _id: '4',
                general: {
                    name: '4',
                    year: 2017,
                    done: true
                }
            }, {
                _id: '5',
                general: {
                    name: '5',
                    year: 2016
                }
            }];
            var feedList = list(feeds);
            
            // in progress
            expect(feedList.feeds[0].name).to.equal('2');
            
            // closed
            expect(feedList.feeds[1].name).to.equal('3');
			expect(feedList.feeds[2].name).to.equal('5');

            // done
            expect(feedList.feeds[3].name).to.equal('4');
            expect(feedList.feeds[4].name).to.equal('1');

            done();
        });
        it('feeds with harvest dates should sorting by harvest.end', function(done) {
            var feeds = [{
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                },
                harvest: {
                    end: new Date('10-10-2000')
                }
            }, {
                _id: '2',
                general: {
                    name: '2',
                    year: 2014
                },
                harvest: {
                    end: new Date('10-11-2000')
                }
            }, {
                _id: '3',
                general: {
                    name: '3',
                    year: 2017
                },
                harvest: {
                    end: new Date('10-2-2000')
                }
            }];
            var feedList = list(feeds);
            expect(feedList.feeds[0].name).to.equal('2');
            expect(feedList.feeds[1].name).to.equal('1');
            expect(feedList.feeds[2].name).to.equal('3');
            done();
        });
        it('feeds without harvest dates should sorting by general.year', function(done) {
            var feeds = [{
                _id: '1',
                general: {
                    name: '1',
                    year: 2015
                }
            }, {
                _id: '2',
                general: {
                    name: '2',
                    year: 2014
                }
            }, {
                _id: '3',
                general: {
                    name: '3',
                    year: 2017
                }
            }];
            var feedList = list(feeds);
            expect(feedList.feeds[0].name).to.equal('3');
            expect(feedList.feeds[1].name).to.equal('1');
            expect(feedList.feeds[2].name).to.equal('2');
            done();
        });
        it('feeds with mixed harvest.end and general.year', function(done) {
            var feeds = [{
                _id: '1',
                general: {
                    name: '1',
                    year: 2016
                },
                harvest: {
                    end: new Date('10-10-2016')
                }
            }, {
                _id: '2',
                general: {
                    name: '2',
                    year: 2017
                },
            }, {
                _id: '3',
                general: {
                    name: '3',
                    year: 2015
                },
                harvest: {
                    end: new Date('11-10-2015')
                }
            }];
            var feedList = list(feeds);
            expect(feedList.feeds[0].name).to.equal('2');
            expect(feedList.feeds[1].name).to.equal('1');
            expect(feedList.feeds[2].name).to.equal('3');
            done();
        });
    });
});