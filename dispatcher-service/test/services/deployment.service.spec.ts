import {Container} from 'typescript-ioc';

import {OpenShiftService} from '../../src/services';
import {ApiServer} from '../../src/server';
import {buildApiServer} from '../helper';

describe('Deployment service', () =>{

  let app: ApiServer;
  let service: OpenShiftService;
  beforeAll(() => {
    app = buildApiServer();

    service = Container.get(OpenShiftService);
  });

  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('Given greeting()', () => {
    context('when "Juan" provided', () => {
      const name = 'Juan';
      test('then return "Hello, Juan!"', async () => {
        // expect(await service.greeting(name)).toEqual(`Hello, ${name}!`);
      });
    });

    context('when no name provided', () => {
      test('then return "Hello, World!"', async () => {
        // expect(await service.greeting()).toEqual('Hello, World!');
      });
    })
  });
});
