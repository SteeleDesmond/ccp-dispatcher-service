import { ApiServer, RedisServer } from './server';
import { artifactManager } from './workers';

export const start = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const apiServer = new ApiServer();
    const redis = new RedisServer();

    Promise.all([
      apiServer.start(),
      artifactManager.start(redis.getRsmq()),
    ]).then(() => resolve())
      .catch(reject);

    const graceful = () => {
      Promise.all([
        apiServer.stop(),
        artifactManager.stop(),
      ]).then(() => process.exit(0));
    };

    // Stop graceful
    process.on('SIGTERM', graceful);
    process.on('SIGINT', graceful);
  });
};
