/**
 * @file ./server/URLRequestRouter.js
 * @date Thu, 11 Aug 2016 20:12:54 +0200
 * @version 1.0
 * @author Tommaso Panozzo
 *
 * router delle richieste
 */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const AppInfo = require('./AppInfoProvider.js');
const Login   = require('./LoginHandler.js');
const Logout  = require('./LogoutHandler.js');
const PathsResults = require('./PathResultsProvider.js');
const Buildings  = require('./BuildingsProvider.js');
const Registration = require('./RegistrationHandler.js');
const Validator = require('./RegistrationFieldsValidator.js');
const Path = require('./PathProvider.js');
const UserData = require('./UserDataProvider.js');
const PasswordReset = require('./PasswordResetHandler.js');
const RankingProvider = require('./RankingProvider.js');

// indica di fare il parse del body di tutte le richieste
// in entrata come JSON object
app.use(bodyParser.json());

const prepareAndExecute = function(handlerType, req, res) {
   var handler = new handlerType;
   handler.request = req;
   handler.response = res;
   handler.execute();
}

app.get('/appinfo', function(req, res) {
   console.log('handle appinfo');
   prepareAndExecute(AppInfo, req, res);
});

app.post('/login', function(req, res) {
   console.log('handle login');
   var handler = new Login;
   handler.request = req;
   handler.response = res;
   handler.execute();
});

app.get('/logout', function(req, res) {
   console.log('handle logout');
   prepareAndExecute(Logout, req, res);
});

app.get('/pathsresults', function(req, res) {
   console.log('handle pathsresults');
   prepareAndExecute(PathsResults.get, req, res);
});

app.post('/pathsresults', function(req, res) {
   console.log('handle pathsresults');
   prepareAndExecute(PathsResults.set, req, res);
});

app.post('/buildings', function(req, res) {
   console.log('handle buildings');
   prepareAndExecute(Buildings, req, res);
});

app.post('/newuser', function(req, res) {
   console.log('handle new user');
   prepareAndExecute(Registration, req, res);
});

app.post('/validateFields', function(req, res) {
   console.log('handle field validation');
   prepareAndExecute(Validator, req, res);
});

app.get('/path/:pathID', function(req, res) {
   console.log('handle path with id ', req.params.pathID);
   var handler = new Path;
   handler.request = req;
   handler.response = res;
   handler.execute(req.params.pathID);
});

app.get('/userData', function(req, res) {
   console.log('handle userData request');
   prepareAndExecute(UserData.get, req, res);
});

app.post('/userData', function(req, res) {
   console.log('handle userData request');
   prepareAndExecute(UserData.post, req, res);
});

app.post('/passwordReset', function(req, res) {
   console.log('handle reset password request');
   prepareAndExecute(PasswordReset, req, res);
});

app.get('/leaderboard/:pathID', function(req, res) {
   console.log('handle leaderboard for path with id: ', req.params.pathID);
   prepareAndExecute(RankingProvider, req, res);
})

module.exports.start = function() {
  app.listen(1234);
};

console.log('listening on port 1234');
