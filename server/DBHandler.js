/**
 * @file ./server/DBHandler.js
 * @date Thu, 11 Aug 2016 20:12:54 +0200
 * @version 1.0
 * @author Tommaso Panozzo
 *
 * gestisce la creazione degli oggetti query knex per l'interazione con il DB
 */
'use strict';

var knex = require('knex');
var config = require('./config.js').db;
var db;

function getDb() {
    return db || getDb.reconnect();
}

getDb.reconnect = function() {
    db = knex(config);
    return db;
};

module.exports = getDb;
