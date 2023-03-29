//#region @browser
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommingSoonComponent } from './comming-soon.component';

const routes: Routes = [
  {
    path: '',
    component: CommingSoonComponent,
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
    RouterModule.forChild(routes),
  ],
  declarations: [CommingSoonComponent],
})
export class CommingSoonModule { }
//#endregion