import {ContainerConfiguration, Scope} from 'typescript-ioc';
import {ArtifactApi} from './artifact.api';
import {ArtifactService} from './artifact.service';

const config: ContainerConfiguration[] = [
  {
    bind: ArtifactApi,
    to: ArtifactService,
    scope: Scope.Singleton
  }
];

export default config;