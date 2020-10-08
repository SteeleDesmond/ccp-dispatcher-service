import {ContainerConfiguration, Scope} from 'typescript-ioc';
import {EnvironmentApi} from './environment.api';
import {EnvironmentService} from './environment.service';

const config: ContainerConfiguration[] = [
  {
    bind: EnvironmentApi,
    to: EnvironmentService,
    scope: Scope.Singleton
  }
];

export default config;