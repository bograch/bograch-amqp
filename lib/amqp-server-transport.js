'use strict';

var util = require('util');
var ServerTransport = require('bograch-transport').ServerTransport;
var amqpRpc = require('amqp-rpc');

function AmqpServerTransport(options) {
  ServerTransport.call(this);

  options = options || {};
  if (!options.amqpURL) {
    throw new TypeError('amqpURL is missing from the options');
  }
  this._amqpURL = options.amqpURL;
}

util.inherits(AmqpServerTransport, ServerTransport);

AmqpServerTransport.prototype.on = function (methodName, cb) {
  this._rpc.on(methodName, function (args, ccb) {
    cb(args, ccb);
  });
};

AmqpServerTransport.prototype.start = function (cb) {
  this._rpc = amqpRpc.factory({
    url: this._amqpURL
  });
  cb();
};

AmqpServerTransport.prototype.end = function () {};

module.exports = AmqpServerTransport;