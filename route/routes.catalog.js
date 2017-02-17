var _ = require('lodash');
var Catalog = require('../models/catalog');
var lang = require('../feed/lang');

module.exports = function(app, isAuthenticated, errorHandler) {
    app.get('/api/catalog', isAuthenticated, function(req, res) {
        Catalog.find().lean().exec(function(err, items) {
            if (err) {
                return errorHandler(err, req, res);
            }
            var shortItems = _.map(items, function(item) {
                return {
                    key: item.key,
                    short: item.ru_short
                }
            });
            res.status(200).json(shortItems);
        });
    });
    app.get('/api/catalog/:key', isAuthenticated, function(req, res) {
        Catalog.findOne({
            key: req.params.key
        }).lean().exec(function(err, item) {
            if (err) {
                return errorHandler(err, req, res);
            }
            var result = {
                key: item.key,
                short: item.ru_short,
                content: item.ru_content
            }
            res.status(200).json(result);
        });
    });
    /*app.put('/api/catalog/:key', isAuthenticated, function(req, res) {
        Catalog.findOne({
            key: req.params.key
        }, function(err, item) {
            if (err) {
                return errorHandler(err, req, res);
            }
            item.ru_short = req.body.short;
            item.ru_content = req.body.content;
            // save the bear
            item.save(function(err, updatedItem) {
                if (err) res.send(err);
                res.json({
                    message: 'OK',
                    id: updatedItem.key
                });
            });
        });
    });*/
}