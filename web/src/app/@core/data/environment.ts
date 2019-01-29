import { InjectionToken } from '@angular/core';

export const ENVIRONMENT_TOKEN = new InjectionToken<Environment>('environment');

export interface Environment {
  production: boolean;
  apiBaseUri: string;
  appToken: string;
}
