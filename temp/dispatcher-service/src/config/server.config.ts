import * as npmPackage from '../../package.json';


export class ServerConfig {
  static readonly protocol = process.env.PROTOCOL || npmPackage.config.protocol;
  static readonly host = process.env.HOST || npmPackage.config.host;
  static readonly port = process.env.PORT || npmPackage.config.port;
  static readonly contextRoot = process.env.CONTEXT_ROOT || npmPackage.config.contextRoot;

  static readonly redisHost = process.env.REDISHOST || npmPackage.config.redisHost;
  static readonly redisPort = + process.env.REDISPORT || npmPackage.config.redisPort;
  static readonly redisPass = process.env.REDISPASS || npmPackage.config.redisPass;
  static readonly redisNamespace = process.env.REDISNAMESPACE || npmPackage.config.redisNamespace;

  static readonly mongoHost = process.env.MONGOHOST || npmPackage.config.mongoHost;
  static readonly mongoUser = process.env.MONGOUSER;
  static readonly mongoPass = process.env.MONGOPASS;
  static readonly mongoPort = process.env.MONGOPORT;
  static readonly mongoName = process.env.MONGONAME;

  static readonly environment = process.env.ENVIRONMENT || 'localhost'; // i.e. dallas:dev, dallas:test, dallas:prod1, dallas:prod2
  static readonly serviceName = process.env.SERVICE_NAME || 'CCP Dispatcher Service';
}