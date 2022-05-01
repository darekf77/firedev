import { _, Helpers } from 'tnp-core';
import { CLASS } from 'typescript-class-helpers';
import { SYMBOL } from '../symbols';
import { ModelDataConfig } from './model-data-config';
import { __ENDPOINT } from '../decorators/decorators-endpoint-class';
import { GET, PUT, DELETE, POST, HEAD, PATCH } from '../decorators/decorators-methods';
import { Query, Path, Body } from '../decorators/decorators-params';
import { Models } from '../models';

//#region @backend
import { Repository, Connection, getRepository } from 'typeorm';
import { tableNameFrom } from '../framework/framework-helpers';
import { MorphiHelpers } from '../helpers';
import { IBASE_ENTITY } from '../framework/framework-entity';
import { FrameworkContext } from '../framework/framework-context';
import { DbCrud } from './db-crud.backend';
declare const global: any;
import { CrudHelpers } from './crud-helpers.backend';
//#endregion

const Firedev = {
  symbols: SYMBOL,
  Http: {
    GET, PUT, DELETE, POST, HEAD, PATCH
  }
}

@CLASS.NAME('BaseCRUD')
@__ENDPOINT(BaseCRUD)
export abstract class BaseCRUD<T> {
  //#region @backend
  connection: Connection;
  public get repository(): Repository<T> {
    return this.repo;
  }
  private repo: Repository<any>;
  //#endregion

  public entity: any;

  constructor() {
    this.init()
  }

  //#region @backend
  readonly db: DbCrud<T>;
  //#endregion

  private init() {
    //#region @backend
    const context = FrameworkContext.findForTraget(this);
    this.connection = context.connection;

    if (Helpers.isNode && this.entity && this.connection && this.entity[SYMBOL.HAS_TABLE_IN_DB]) {
      this.repo = this.connection.getRepository(this.entity as any)
      Helpers.log(`Base CRUD inited for: ${(this.entity as any).name}`);
      // @ts-ignore
      this.db = DbCrud.from(this.connection, this.entity);
    } else {
      Helpers.log(`Base CRUD NOT inited for: ${this.entity && (this.entity as any).name}`)
    }
    //#endregion
  }

  @Firedev.Http.GET(`/${Firedev.symbols.CRUD_TABLE_MODEL}/:id/property/:property`)
  bufforedChanges(
    @Path(`id`) id: number | string,
    @Path(`property`) property: string,
    @Query('alreadyLength') alreadyLength?: number,
    @Query('config') config?: ModelDataConfig
  ): Models.Response<string | any[]> {
    //#region @backendFunc
    return async (request, response) => {

      const model = await CrudHelpers.getModel(id, config, this.repo);
      if (model === void 0) {
        return;
      }
      CrudHelpers.preventUndefinedModel(model, config, id)
      let value = model[property];
      let result: any;
      if (_.isString(value) || _.isArray(value)) {
        result = (value as string).slice(alreadyLength);

      }
      // console.log(`result for id:${id}, prop: ${property}, alredylength: ${alreadyLength}`, result)

      return result;
    }
    //#endregion
  }


  @Firedev.Http.GET(`/${Firedev.symbols.CRUD_TABLE_MODELS}`)
  getAll(@Query('config') config?: ModelDataConfig): Models.Response<T[]> {
    //#region @backendFunc
    return async (request, response) => {
      if (this.repo) {
        const { models, totalCount } = await this.db.getAll(config);
        response.setHeader(SYMBOL.X_TOTAL_COUNT, totalCount)
        return models;
      }
      return [];
    }
    //#endregion
  }

  @Firedev.Http.GET(`/${Firedev.symbols.CRUD_TABLE_MODEL}/:id`)
  getBy(@Path(`id`) id: number | string, @Query('config') config?: ModelDataConfig): Models.Response<T> {
    //#region @backendFunc
    return async () => {
      const { model } = await this.db.getBy(id, config);
      return model;
    }
    //#endregion
  }


  @Firedev.Http.PUT(`/${Firedev.symbols.CRUD_TABLE_MODEL}/:id`)
  updateById(@Path(`id`) id: number | string, @Body() item: T, @Query('config') config?: ModelDataConfig): Models.Response<T> {
    //#region @backendFunc

    return async () => {
      const { model } = await this.db.updateById(id, item as any, config);
      return model;

    }
    //#endregion
  }

  @Firedev.Http.PUT(`/bulk/${Firedev.symbols.CRUD_TABLE_MODELS}`)
  bulkUpdate(@Body() items: T[], @Query('config') config?: ModelDataConfig): Models.Response<T[]> {
    //#region @backendFunc
    return async () => {
      if (!Array.isArray(items) || (items?.length === 0)) {
        return [];
      }
      const { models } = await this.db.bulkUpdate(items);
      return models;
    }
    //#endregion
  }

  @Firedev.Http.DELETE(`/${Firedev.symbols.CRUD_TABLE_MODEL}/:id`)
  deleteById(@Path(`id`) id: number, @Query('config') config?: ModelDataConfig): Models.Response<T> {
    //#region @backendFunc
    return async () => {
      const { model } = await this.db.deleteById(id, config);
      return model;
    }
    //#endregion
  }

  @Firedev.Http.DELETE(`/bulk/${Firedev.symbols.CRUD_TABLE_MODELS}/:ids`)
  bulkDelete(@Path(`ids`) ids: (number | string)[], @Query('config') config?: ModelDataConfig): Models.Response<(number | string | T)[]> {
    //#region @backendFunc
    return async () => {
      const { models } = await this.db.bulkDelete(ids, config);
      return models;
    }
    //#endregion
  }


  @Firedev.Http.POST(`/${Firedev.symbols.CRUD_TABLE_MODEL}/`)
  create(@Body() item: T, @Query('config') config?: ModelDataConfig): Models.Response<T> {
    //#region @backendFunc
    return async () => {
      const { model } = await this.db.create(item as any, config);
      return model;
    }
    //#endregion
  }

  @Firedev.Http.POST(`/bulk/${Firedev.symbols.CRUD_TABLE_MODELS}/`)
  bulkCreate(@Body() items: T, @Query('config') config?: ModelDataConfig): Models.Response<T[]> {
    //#region @backendFunc
    return async () => {
      const { models } = await this.db.bulkCreate(items as any, config);
      return models;
    }
    //#endregion
  }

}

//#region @backend

//#endregion
