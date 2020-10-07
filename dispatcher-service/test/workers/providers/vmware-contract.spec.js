
const { Pact } = require('@pact-foundation/pact');
const path = require('path');

const vmwareService = new Pact({
  consumer: 'installAgent',
  provider: 'vmwareService',
  port: 4000,
  log: path.resolve(process.cwd(), 'logs', 'vmwareService-pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'INFO',
});