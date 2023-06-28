import { _ } from 'tnp-core';
import { MorphiHelpers } from '../helpers';
import { CLASS } from 'typescript-class-helpers';
import type { FrameworkContext } from '../framework/framework-context';

declare const global: any;


const abstractClasses = ['BASE_CONTROLLER'];

export function activateBaseCrud(
  target: Function,
  entity: Function,
  context: FrameworkContext) {

  if (_.isFunction(target) && MorphiHelpers.hasParentClassWithName(target, 'BaseCRUD') &&
    !abstractClasses.includes(CLASS.getName(target))) {
    if (_.isUndefined(entity)) {
      if (CLASS.getName(target) === CLASS.getName(target['__proto__'])) {
        // console.log(`Site class override curd for ${getClassName(target)}`)
        return;
      }

      //#region @websql
      if (context.mode === 'backend/frontend' || context.mode === 'websql/backend-frontend') {
        //#endregion
        !global.hideLog && console.warn(`
        You are extending BaseCRUD class.. CRUD functionality won't work
        unless you provide "entity" property for CRUD operations on db.
        @Firedev.Controller({
          ...
          entity: <YOUR ENTITY CLASS HERE>
          ...
        })
        class ${CLASS.getName(target)} extends  ...
              `)
        //#region @websql
      }
      //#endregion

    } else {
      // console.log(`Traget ${target.name} has parent BaseCrud`)
      target.prototype['entity'] = entity;
    }
  } else {
    // console.log(`Traget ${target.name} don't have parent BaseCrud`)
  }


}
