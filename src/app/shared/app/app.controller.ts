import { Firedev } from 'firedev';
import { App } from './app';
import axios from 'axios';
import { host } from '../../constants';
import { Helpers } from 'tnp-core';


@Firedev.Controller({
  className: 'AppController',
  entity: App
})
export class AppController extends Firedev.Base.Controller<any> {

  @Firedev.Http.GET()
  hello(): Firedev.Response<string> {
    return async () => {
      return 'Hello world';
    }
  }

  @Firedev.Http.GET()
  readme(): Firedev.Response<string> {
    return async () => {
      return (await axios.get(`${Helpers.isWebSQL ? location.origin : host}/src/assets/README`)).data;
    }
  }

  @Firedev.Http.GET(`/${Firedev.symbols.CRUD_TABLE_MODELS}`) // @ts-ignore
  getAll(@Firedev.Http.Param.Query('limit') limit = Infinity): Firedev.Response<App[]> {
    //#region @websqlFunc
    const config = super.getAll();
    return async (req, res) => { // @ts-ignore
      let arr = await Firedev.getResponseValue(config, req, res) as App[];
      if (arr.length > limit) {
        arr = arr.slice(0, limit - 1);
      }
      return arr as any;
    }
    //#endregion
  }

}
