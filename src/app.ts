//#region @notForNpm
//#region @browser
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-firedev',
  template: 'hello from firedev'
})
export class FiredevComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}

@NgModule({
  imports: [],
  exports: [FiredevComponent],
  declarations: [FiredevComponent],
  providers: [],
})
export class FiredevModule { }
//#endregion

//#region @backend
async function start(port: number) {

}

export default start;

//#endregion

//#endregion
