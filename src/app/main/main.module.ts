import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
// import { SliderVerticalModule } from "@firedev-baseline/layout";  // UNCOMMENT
import { StaticColumnsModule } from 'static-columns';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  // {
  //   path: 'anothermodulepath',
  //   loadChildren: () => import('anothermodule')
  //     .then(m => m.AnotherLazyModule),
  // },
];

@NgModule({
  imports: [
    CommonModule,
    // SliderVerticalModule, // UNCOMMENT
    StaticColumnsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [MainComponent],
})
export class MainModule { }
