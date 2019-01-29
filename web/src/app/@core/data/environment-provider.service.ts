import { Injectable, Inject } from '@angular/core';
import { ENVIRONMENT_TOKEN, Environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentProviderService {
  constructor(@Inject(ENVIRONMENT_TOKEN) private environment) {
  }

  get current(): Environment {
    return { ...this.environment };
  }
}

