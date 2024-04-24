import { Response, RequestHandler } from 'express';
import { Response as ExpressResponse, Request as ExpressRequest } from 'express';
import { Models as ModelsNg2Rest } from 'ng2-rest/src';


import { CLASS } from 'typescript-class-helpers/src';


export namespace Models {

  export import Rest = ModelsNg2Rest;

  export type ContextENDPOINT = { target: Function; initFN: Function; };

  export type FormlyFromType = 'material' | 'bootstrap';


  export type ExpressContext<T> = (req: ExpressRequest, res: ExpressResponse) => T;

  export type SyncResponse<T> = string | T;

  export type ResponseFuncOpt<T> = {
    limitSize?: (enties: Function | Function[], include: string[], exclude: string[]) => void;
  }

  export type SyncResponseFunc<T> = (options?: ResponseFuncOpt<T>) => SyncResponse<T>;
  export type MixResponse<T> = SyncResponse<T> | ExpressContext<T>;

  export interface ClientAction<T> {
    received?: Rest.PromiseObservableMix<Rest.HttpResponse<T>>;
  }

  export interface __Response<T> {
    //#region @websql
    send?: MixResponse<T>;
    //#endregion
  }

  export interface AsyncResponse<T> {
    (req?: ExpressRequest, res?: ExpressResponse): Promise<SyncResponse<T> | SyncResponseFunc<T>>;
  }

  export type Response<T = string> = (__Response<T> | AsyncResponse<T>) & ClientAction<T> & __Response<T>;

  export class Errors {

    public toString = (): string => {
      return this.message
    }

    private constructor(public message: string, private code: ModelsNg2Rest.HttpCode = 400) {

    }

    private static create(message: string, code: ModelsNg2Rest.HttpCode = 400) {
      return new Errors(message, code);
    }

    public static entityNotFound(entity?: Function) {
      return Errors.create(`Entity ${CLASS.getName(entity)} not found`);
    }

    public static custom(message: string, code: ModelsNg2Rest.HttpCode = 400) {
      return Errors.create(message, code);
    }

  }

  //#region @websql
  export interface AuthCallBack {
    (methodReference: Function): RequestHandler;
  }

  //#endregion

}
