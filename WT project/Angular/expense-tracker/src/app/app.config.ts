import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Angular app configuration with routing
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
