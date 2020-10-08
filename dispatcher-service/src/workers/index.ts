import { Container } from 'typescript-ioc';
import { config } from './environment-manager';

export * from './environment-manager';
export * from './response.worker';
export * from './environment.worker';

Container.configure(...config); 
