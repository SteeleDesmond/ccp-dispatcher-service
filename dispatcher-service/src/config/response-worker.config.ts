import * as npmPackage from '../../package.json';


export class ResponseWorkerConfig {

  get responseQueue(): string {
    return process.env.DISPATCHER_QUEUE || npmPackage.config.dispatcherQueue;
  }

  get runInterval(): number {
    return 10000;
  }

  get redisHost(): string {
    return process.env.REDISHOST || npmPackage.config.redisHost;
  } 

  get redisPort(): number {
    return + (process.env.REDISPORT || npmPackage.config.redisPort);
  } 

  get redisPass(): string {
    return process.env.REDISPASS || npmPackage.config.redisPass;
  } 
}
