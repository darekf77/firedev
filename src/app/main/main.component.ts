import { Component, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { App } from '../shared/app/app';
import { tap } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  readme$ = App.ctrl.readme().received.observable.pipe(
    tap(d => {
      console.log(d)
    }),
    map(d => d.body.text)
  )

  handlers: Subscription[] = [];
  constructor() { }

  ngOnDestroy(): void {
    this.handlers.forEach(h => h.unsubscribe());
  }

  numbers = [];
  childs = _.times(10, d => {
    return {
      header: `test${d}`
    };
  });

  ngOnInit() {
    this.numbers = _.times(10);
  }

}
