import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
