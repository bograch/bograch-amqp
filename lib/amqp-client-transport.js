'use strict';

var util = require('util');
var ClientTransport = require('bograch-transport').ClientTransport;
var amqpRpc = require('amqp-rpc');

function AmqpClientTransport(ops) {
  ClientTransport.call(this);

  ops = ops || {};
  if (!ops.amqpURL) {
    throw new TypeError('amqpURL is missing from the ops');
  }
  this._amqpURL = ops.amqpURL;
}

util.inherits(AmqpClientTransport, ClientTransport);

AmqpClientTransport.prototype.connect = function(cb) {
  this._rpc = amqpRpc.factory({
    url: this._amqpURL
  });
  cb();
};

AmqpClientTransport.prototype.end = function() {
};

AmqpClientTransport.prototype.call = function(methodName, args, cb) {
  this._rpc.call(methodName, args, cb);
};

module.exports = AmqpClientTransport;
