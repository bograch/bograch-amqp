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

// NOTE: params are passed through a property in another object
// because amqp-rpc can't pass strings for some reason
AmqpProvider.prototype.call = function (message, params, cb) {
  this._rpc.call(message, { params: params }, cb);
};

AmqpProvider.prototype.on = function (message, cb) {
  this._rpc.on(message, function (params, ccb) {
    cb(params.params, ccb);
  });
};

module.exports = AmqpProvider;