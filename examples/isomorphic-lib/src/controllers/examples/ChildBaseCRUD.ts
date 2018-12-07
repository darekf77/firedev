

import {
  ENDPOINT, GET, POST, PUT, DELETE, isNode,
  PathParam, QueryParam, CookieParam, HeaderParam, BodyParam,
  Response, BaseCRUDEntity, OrmConnection, CLASSNAME,
  SYMBOL, ModelDataConfig, HelpersBackend
} from 'morphi';

import { Connection } from "typeorm/connection/Connection";
import { Repository } from "typeorm/repository/Repository";

// local
import { Book } from '../../entities/examples/Book';
import { TestController } from './TestController';


@ENDPOINT()
@CLASSNAME('ChildBaseCRUD')
export class ChildBaseCRUD extends TestController {
  @BaseCRUDEntity(Book) public entity: Book;
  constructor() {
    super();
    //#region @backend
    if (isNode) {
      this.createBooks()
    }
    //#endregion
  }

  //#region @backend
  async createBooks() {

    let book1 = new Book();
    book1.title = 'overridedE!!!!';
    let book2 = new Book();
    book2.title = 'overririiriri1'
    this.repository.save([book1, book2] as any)
  }
  //#endregion

  @GET(`/${SYMBOL.CRUD_TABLE_MODEL}`)
  getAll(@QueryParam('config') config?: ModelDataConfig) {
    //#region @backendFunc
    console.log('here')
    return async (req, res) => {
      const s = super.getAll(config)
      const books = await HelpersBackend.getResponseValue(s, req, res)
      const build = new Book();
      build.title = 'overirded!'
      return [
        build
      ].concat(books as any) as any
    }
    //#endregion
  }




}
