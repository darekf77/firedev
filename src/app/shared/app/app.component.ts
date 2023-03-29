//#region @browser
import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppService]
})
export class AppComponent implements OnInit {

  constructor(
    protected service: AppService
  ) { }

  ngOnInit() {
  }

}
//#endregion
