//#region @notForNpm
//#region imports
import { Firedev } from 'firedev';
const host = 'http://localhost:4199';
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
    loadChildren: () => import('./app/main/main.module')
      .then(m => m.MainModule),
  },
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
  ) { }

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
      // PUT FIREDEV CONTORLLERS HERE
    ],
    entities: [
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
