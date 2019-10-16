import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { BatteryPage } from '../pages/battery/battery';
import { seniorStatus } from '../pages/seniorStatus/seniorStatus';
import { ChartsModule } from 'ng2-charts-x';
import { HomePage } from '../pages/home/home';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MyApp, seniorStatus, BatteryPage, HomePage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp), ChartsModule, FormsModule],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, seniorStatus, BatteryPage, HomePage],
  providers: [StatusBar, SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
