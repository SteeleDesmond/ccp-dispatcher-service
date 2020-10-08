import * as npmPackage from '../../package.json';

export class EnvironmentWorkerConfig {

  get requestQueue(): string {
    return process.env.DISPATCHER_QUEUE || npmPackage.config.dispatcherQueue;
  }

  get runInterval(): number {
    return 10000;
  }
} 