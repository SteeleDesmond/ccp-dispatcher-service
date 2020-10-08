import { Container } from "typescript-ioc";

export * from './environment.api';
export * from './environment.service';

import config from './ioc.config';

Container.configure(...config);