/**
 * @file ./server/utility/EmailChecker.js
 * @date Wed, 3 Aug 2016 08:58:10 +0200
 * @version 1.0
 * @author Tommaso Panozzo
 *
 * Validatore delle email
 */
'use strict';

const validator = require('email-validator');
const db = require('../DBHandler.js');

function EmailChecker(email) {
   return validator.validate(email);
};

function checkEmail(email) {
   return new Promise(function(resolve, reject) {
      if (!validator.validate(email)) {
         resolve(false);
      }
      db().select().from('User').where({
         email: email
      }).then(function(users) {
         if (users.length == 0) {
            resolve(true);
         } else {
            resolve(false);
         }
      }.bind(this), function(error) {
         console.error('Error querying the db for', email, 'uniqueness\nError:', error);
         reject({
            debugMessage: 'Error querying the db for ' + email + ' uniqueness',
            errorCode: 550,
            debugInfo: error
         });
      });
   });
};

module.exports.isValid = EmailChecker;
module.exports.checkEmail = checkEmail;
