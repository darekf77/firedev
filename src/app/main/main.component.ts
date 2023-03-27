import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
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
