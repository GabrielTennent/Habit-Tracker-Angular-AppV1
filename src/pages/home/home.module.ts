import { NgModule } from '@angular/core';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { HomePage } from './home';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomePage],
  imports: [CommonModule, FormsModule, IonicModule, Option, IonicPageModule.forChild(HomePage)]
})
export class HomePageModule {}
