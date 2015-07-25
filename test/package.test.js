'use strict';

var expect = require('chai').expect;
var amqpTransport = require('..');
var ClientTransport = amqpTransport.ClientTransport;
var ServerTransport = amqpTransport.ServerTransport;

var options = {
  amqpURL: 'amqp://guest:guest@localhost:5672'
};
var client = new ClientTransport(options);
var server = new ServerTransport(options);

describe('Transport', function() {
  it('should send and receive message', function(done) {
    server.on('lala', function(args, cb) {
      cb(['wrongFunction1']);
    });

    server.on('foo', function(args, cb) {
      expect(args[0]).to.be.equal('argsToServer');
      cb(['argsToClient']);
    });

    server.on('bar', function(args, cb) {
      cb(['wrongFunction2']);
    });

    server.start(function() {
    });

    client.connect(function() {
        client.call('foo', ['argsToServer'], function(args) {
          expect(args[0]).to.be.equal('argsToClient');
          done();
        });
      });
  });
});
