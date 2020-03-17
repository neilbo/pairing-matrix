import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneratorPageRoutingModule } from './generator-routing.module';

import { GeneratorPage } from './generator.page';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneratorPageRoutingModule,
    ColorPickerModule
  ],
  declarations: [GeneratorPage]
})
export class GeneratorPageModule {}
