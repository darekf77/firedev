import { Firedev } from 'firedev/src';
import { _ } from 'tnp-core/src';
import type { AppController } from './app.controller';

@Firedev.Entity({
  className: 'App'
})
export class App extends Firedev.Base.Entity<any> {
  static ctrl: AppController;
  static from(obj: Omit<Partial<App>, 'ctrl'>) {
    return _.merge(new App(), obj)
  }

  static getAll() {
    return this.ctrl.getAll();
  }
  ctrl: AppController;


  //#region @websql
  @Firedev.Orm.Column.Generated()
  //#endregion
  id: string;


}
