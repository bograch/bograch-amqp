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
  this._methods = {};
}

util.inherits(AmqpServerTransport, ServerTransport);

AmqpServerTransport.prototype.on = function (methodName, cb) {
  this._methods[methodName] = cb;
};

AmqpServerTransport.prototype.start = function (cb) {
  this._rpc = amqpRpc.factory({
    url: this._amqpURL
  });
  for (var methodName in this._methods) {
    this._rpc.on(methodName, function (args, ccb) {
      this._methods[methodName](args, ccb);
    }.bind(this));
  }
  cb();
};

AmqpServerTransport.prototype.end = function () {};

module.exports = AmqpServerTransport;