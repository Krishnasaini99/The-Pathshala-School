import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { bootSync } from './app/cloud';

// Pehle cloud se latest content lao (offline ho to cache se chalega), phir app start
bootSync().finally(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
});
