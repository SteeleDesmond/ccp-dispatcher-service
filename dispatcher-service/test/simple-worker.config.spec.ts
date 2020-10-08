import { OpenShiftWorkerConfig } from '../src/config/environment-worker.config';

describe('openshift-worker.config', () => {
  test('canary verifies test infrastructure', () => {
      expect(true).toEqual(true);
  });

  // describe('given OpenShiftWorkerConfig', () => {
  //   test('default runInterval should be 60,000 microseconds', () => {
  //     expect(new OpenShiftWorkerConfig().runInterval).toEqual(60000);
  //   });
  // });
});
