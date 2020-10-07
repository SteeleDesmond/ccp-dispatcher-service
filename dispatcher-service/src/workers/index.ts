import { Container } from 'typescript-ioc';
import { config } from './artifact-manager';

export * from './artifact-manager';
export * from './response.worker';
export * from './artifact.worker';

Container.configure(...config); 
