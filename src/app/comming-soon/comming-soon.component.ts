//#region @browser
import { Component, HostBinding, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comming-soon',
  templateUrl: './comming-soon.component.html',
  styleUrls: ['./comming-soon.component.scss']
})
export class CommingSoonComponent implements OnInit {
  handlers: Subscription[] = [];
  // @HostBinding('style.height.px')
  // height: number;
  constructor() { }

  ngOnInit() {
    // this.height = window.innerHeight;
  }



  ngOnDestroy(): void {
    this.handlers.forEach(h => h.unsubscribe());
  }

}
//#endregion
