import { Container } from "typescript-ioc";

export * from './artifact.api';
export * from './artifact.service';

import config from './ioc.config';

Container.configure(...config);