'use strict';

var util = require('util');
var ServerTransport = require('bograch-transport').ServerTransport;
var amqpRpc = require('amqp-rpc');

function AmqpServerTransport(opts) {
  ServerTransport.call(this);

  opts = opts || {};
  if (!opts.amqpURL) {
    throw new TypeError('amqpURL is missing from the opts');
  }
  this._amqpURL = opts.amqpURL;
  this._methods = {};
}

util.inherits(AmqpServerTransport, ServerTransport);

AmqpServerTransport.prototype.on = function(methodName, cb) {
  this._methods[methodName] = cb;
};

function createCallbackMethod(method) {
  return function(args, ccb) {
    method(args, ccb);
  };
}

AmqpServerTransport.prototype.start = function(cb) {
  this._rpc = amqpRpc.factory({
    url: this._amqpURL
  });

  for (var methodName in this._methods) {
    this._rpc.on(methodName, createCallbackMethod(this._methods[methodName]));
  }
  cb();
};

AmqpServerTransport.prototype.end = function() {};

module.exports = AmqpServerTransport;
