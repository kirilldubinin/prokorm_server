// set up ======================================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var database = require('./config/database');
var winston = require('winston');
var _ = require('lodash');
var Catalog = require('./models/catalog');
// configuration ===============================================================
mongoose.connect(database.localUrl); // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
var db = mongoose.connection;
db.on('error', function(err) {
    winston.error('connection error:', err.message);
});
db.once('open', function callback() {
    winston.info("Connected to DB!");
    add();
});

function add() {
    var catalog_milkAcid = new Catalog();
    catalog_milkAcid.key = 'milkAcid';
    catalog_milkAcid.ru_short = 'Молочная кислота';
    catalog_milkAcid.ru_content = 'Молочная кислота, г (Одна из кислот, которая образуется в процессе консервации грубых кормов. Молочная кислота обладает хорошими вкусовыми качествами, и правильный процесс консервации грубых кормов дает результат в относительно высоком содержании молочной кислоты. На содержание молочной кислоты можно повлиять укосом трав с высоким содержанием сахара в них, и подвяливанием трав до уровня содержания сухого вещества  между 35 и 45 %. После процесса консервации, в идеальной ситуации, в сенажах злаковых трав содержание молочной кислоты около 5 %. Оптимально: 30-70 г/кг СВ)';
    catalog_milkAcid.save(function(err, updated) {
        if (err) console.log(err);
        console.log(updated);
    });
}