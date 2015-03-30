'use strict';

var amqpRpc = require('amqp-rpc');

function AmqpProvider(options) {
  options = options || {};
  
  this.name = 'amqp';
  
  if (!options.amqpURL) {
    throw new TypeError('amqpURL is missing from the options');
  }
  
  this._rpc = amqpRpc.factory({
    url: options.amqpURL
  });
}

AmqpProvider.prototype.call = function (message, args, cb) {
  this._rpc.call(message, args, cb);
};

AmqpProvider.prototype.on = function (message, cb) {
  this._rpc.on(message, function (args, ccb) {
    cb(args, ccb);
  });
};

module.exports = AmqpProvider;