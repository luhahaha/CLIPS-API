/**
 * @file ./server/RegistrationHandler.js
 * @date Wed, 3 Aug 2016 08:58:10 +0200
 * @version 1.0
 * @author Tommaso Panozzo
 *
 * gestisce la richiesta di registrazione
 */
'use strict';

var RequestHandler = require('./URLRequestHandler.js');
var UsernameChecker = require('./utility/UsernameChecker.js');
var Token = require('./utility/TokenGenerator.js');
var db = require('./DBHandler.js');
var emailChecker = require('./utility/EmailChecker.js');
var passwordChecker = require('./utility/PasswordChecker.js')

function RegistrationRequestHandler() {
   this.execute = function() {
      var data = this.request.body;
      var missingField = false

      if (!data.hasOwnProperty('username')) {
         missingField = 'username';
      }
      if (!data.hasOwnProperty('email')) {
         missingField = 'email';
      }
      if (!data.hasOwnProperty('password')) {
         missingField = 'password';
      }

      var username = data.username;
      var password = data.password;
      var email = data.email;

      if (missingField) {
         this.response.status(460).send({
            errorCode: 460,
            debugMessage: "missing " + missingField
         });
      } else if (!emailChecker.isValid(email)) {
         this.response.status(460).send({
            errorCode: 460,
            debugMessage: 'email is not valid',
            userMessage: 'usa un indirizzo email valido'
         });
      } else if (!passwordChecker.isValid(password)) {
         this.response.status(460).send({
            errorCode: 460,
            debugMessage: 'password is not valid',
            userMessage: passwordChecker.instructions
         });
      } else {
         var response = this.response;
         emailChecker.checkEmail(email).then(function(emailIsValid) {
            if (emailIsValid) {
               UsernameChecker(username).then(function(isValid) {
                  // console.log('isValid = ', isValid);
                  if (isValid) {
                     var query = db()('User').insert({
                        username: username,
                        email: email,
                        password: password
                     });
                     query.then(function(userID) {
                        // effettuare il login e restituire un token valido
                        let token = Token.generate();
                        var context = {
                           token: token,
                           data : {
                              username: username,
                              email: email,
                              id: userID[0]
                           },
                           response: response
                        };
                        var saveNewTokenQuery = db()('AuthToken').insert({
                           token: token,
                           userID: userID
                        });
                        saveNewTokenQuery.then(function(result) {
                           context.response.status(200).send({
                              token: context.token,
                              userData: context.data
                           });
                        }. bind(context), function(error) {
                           console.log('Error saving token: ', error);
                           context.response.status(505).send({
                              errorCode: 505,
                              debugMessage: "unable to save new user's token"
                           });
                        }.bind(context));
                     }.bind(response), function(error) {
                        console.log('error saving user: ', error);
                        response.status(505).send({
                           errorCode: 505,
                           debugMessage: "unable to save user"
                        });
                     }.bind(response));
                  } else {
                     console.log('username (', username, ') is NOT valid');
                     response.status(461).send({
                        errorCode: 461,
                        debugMessage: "username is NOT valid (maybe not unique). Choose another!"
                     });
                  }
               }.bind(response), function(error) {
                  console.log('error checking username: ', error);
                  response.status(505).send({
                     errorCode: 505,
                     debugMessage: "errorCreating user " + error
                  });
               }.bind(response));
            } else {
               response.status(460).send({
                  errorCode: 461,
                  debugMessage: 'email is not valid'
               });
            }
         }.bind(response));
      }
   };
};

RegistrationRequestHandler.prototype = new RequestHandler;

module.exports = RegistrationRequestHandler;
