import { ConfigurableModuleBuilder } from '@nestjs/common';
import { FirebaseOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<FirebaseOptions>()
    .setClassMethodName('forRoot')
    .build();
