import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { seniorStatus } from './seniorStatus';
import { ChartsModule } from 'ng2-charts-x';

@NgModule({
  declarations: [seniorStatus],
  imports: [IonicPageModule.forChild(seniorStatus), ChartsModule]
})
export class seniorStatusModule {}
