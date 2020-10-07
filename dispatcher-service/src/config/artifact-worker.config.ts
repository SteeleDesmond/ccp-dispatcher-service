import * as npmPackage from '../../package.json';

export class ArtifactWorkerConfig {

  get requestQueue(): string {
    return process.env.DISPATCHER_QUEUE || npmPackage.config.dispatcherQueue;
  }

  get runInterval(): number {
    return 10000;
  }
} 