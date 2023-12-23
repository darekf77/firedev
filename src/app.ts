//#region @notForNpm
//#region imports
import { Firedev } from 'firedev/src';
import { AppController } from './app/shared/app/app.controller';
import { App } from './app/shared/app/app';
import { host } from './app/constants';
declare const ENV: any;

//#region @browser
import { NgModule, NgZone, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";



//#endregion
//#endregion

//#region @browser

//#region routes
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./app/comming-soon/comming-soon.module')
      .then(m => m.CommingSoonModule),
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./app/main/main.module')
  //     .then(m => m.MainModule),
  // },
];
//#endregion

//#region main component
@Component({
  selector: 'app-firedev',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.scss'],
  templateUrl: './app.html',
})
export class FiredevComponent implements OnInit {
  constructor(
    private ngZone: NgZone
  ) {  }

  async ngOnInit() {
    Firedev.initNgZone(this.ngZone);
    await start();
  }
}
//#endregion

//#region main module
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
    }),
  ],
  exports: [FiredevComponent],
  declarations: [FiredevComponent],
  providers: [],
})
export class FiredevModule { }
//#endregion
//#endregion

//#region firedev start function
async function start() {
  // Firedev.enableProductionMode();

  const context = await Firedev.init({
    host,
    controllers: [
      AppController,
      // PUT FIREDEV CONTORLLERS HERE
    ],
    entities: [
      App,
      // PUT FIREDEV ENTITIES HERE
    ],
    //#region @websql
    config: {
      type: 'better-sqlite3',
      database: 'tmp-db.sqlite',
      logging: false,
    }
    //#endregion
  });
  //#region @backend
  if (Firedev.isNode) {
    context.node.app.get('/hello', (req, res) => {
      res.send('Hello my-entity')
    })
  }
  //#endregion
}
//#endregion

export default start;
//#endregion
