'use strict';
require('babel-register');
require('dotenv').config();
require('app-module-path').addPath('./src');

module.exports = require('cognito-gateway/index.js');
