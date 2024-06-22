//#region imports
import type {
  DataSource,
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  // ObjectID // TODO why is this not in firedev-typeorm,
  RemoveOptions,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'firedev-typeorm/src';
// @firedev-ignore
import type { QueryDeepPartialEntity } from 'firedev-typeorm/lib/typeorm/query-builder/QueryPartialEntity';
// @firedev-ignore
import type { UpsertOptions } from 'firedev-typeorm/lib/typeorm/repository/UpsertOptions';
// import { QueryDeepPartialEntity } from 'firedev-typeorm/src';
// import { UpsertOptions } from 'firedev-typeorm/src';

import type { DataSource as DataSourceType } from 'firedev-typeorm/src';
import { EndpointContext } from '../endpoint-context';
import { Symbols } from '../symbols';
import { BaseClass } from './base-class';
import { Helpers } from 'tnp-core/src';
import { _ } from 'tnp-core/src';
import { ClassHelpers } from '../helpers/class-helpers';
import { Validators } from '../validators';
import { MySqlQuerySource } from 'firedev-type-sql/src';
import { FiredevRepository } from '../decorators/classes/repository-decorator';
//#endregion

const INDEX_KEYS_NO_FOR_UPDATE = ['id'];

@FiredevRepository({ className: 'BaseRepository' })
export abstract class BaseRepository<
  Entity extends { id?: any },
> extends BaseClass {
  //#region dummy fields
  // static ids:number  = 0;
  // id:number  = BaseRepository.ids++;
  //#endregion

  //#region constructor & resolve entity
  abstract entityClassResolveFn: () => any;
  constructor(
    // Injected through BaseCrudController
    private __entityClassResolveFn: () => any,
  ) {
    super();
    // @ts-ignore
    this.entityClassResolveFn = __entityClassResolveFn;
  }
  //#endregion

  //#region db query
  private __dbQuery: MySqlQuerySource;

  public get dbQuery(): MySqlQuerySource {
    //#region @websqlFunc
    if (!this.__dbQuery) {
      if (!this.__endpoint_context__) {
        throw new Error(
          `[BaseRepository] Context not inited for class ${ClassHelpers.getName(
            this,
          )}`,
        );
      }
      const connection = this.__endpoint_context__?.connection;
      if (!connection) {
        throw new Error(
          `[BaseRepository] Database not inited for context ${this.__endpoint_context__?.contextName}`,
        );
      }
      this.__dbQuery = new MySqlQuerySource(connection);
    }
    return this.__dbQuery;
    //#endregion
  }
  //#endregion

  //#region connection
  public get connection(): DataSourceType {
    //#region @websqlFunc
    return this.__endpoint_context__.connection;
    //#endregion
  }
  //#endregion

  //#region repository
  //#region @websql
  private __repository: Repository<Entity>;
  //#endregion
  protected get repository() {
    //#region @websqlFunc
    return this.__repository;
    //#endregion
  }

  /**
   * alias to repository
   */
  protected get repo() {
    //#region @websqlFunc
    return this.repository;
    //#endregion
  }

  public get repositoryExists(): boolean {
    //#region @websqlFunc
    return !!this.__repository;
    //#endregion
  }

  //#endregion

  //#region init

  async __init() {
    //#region @websql
    let entityClassFn: any = this.entityClassResolveFn();
    if (!entityClassFn) {
      Helpers.warn(
        `Entity class not provided for repository ${ClassHelpers.getName(this)}`,
      );
      return;
    }
    const ctx: EndpointContext = this.__endpoint_context__;
    const connection = ctx.connection;

    if (!connection) {
      throw new Error(`Connection not found for context ${ctx.contextName}`);
    }

    entityClassFn = this.__endpoint_context__.getClassFunByClass(entityClassFn);

    if (!entityClassFn) {
      Helpers.warn(
        `Entity class not found for repository ${ClassHelpers.getName(this)}`,
      );
      return;
    }

    const entityObj = entityClassFn[Symbols.orignalClassClonesObj];
    if (!entityObj) {
      console.error(
        `Cannot init base repository for ` +
          ` ${ctx.contextName}/${ClassHelpers.getName(this)}/${
            entityClassFn[Symbols.fullClassNameStaticProperty]
          }`,
      );
      return;
    }
    entityClassFn = entityObj[ctx.contextName];

    // console.log(
    //   `Trying to init repo for ${ctx.contextName}/` +
    //     `${ClassHelpers.getName(this)}/` +
    //     `${entityClassFn[Symbols.fullClassNameStaticProperty]}`,
    // );

    this.__repository = (await connection.getRepository(entityClassFn)) as any;
    // console.log(
    //   `Inited repository for (${ClassHelpers.getFullInternalName(this)}) ` +
    //     ` ${ctx.contextName}/${ClassHelpers.getName(this)}/${
    //       entityClassFn[Symbols.fullClassNameStaticProperty]
    //     }`,
    //   this.repository,
    // );
    //#endregion
  }
  //#endregion

  //#region crud operations / typeorm / has id
  /**
   * Checks if entity has an id.
   * If entity composite compose ids, it will check them all.
   */
  hasId(entity: Entity): boolean {
    return this.repo.hasId(entity);
  }
  //#endregion

  //#region crud operations / typeorm / get id
  /**
   * Gets entity mixed id.
   */
  getId(entity: Entity): any {
    return this.repo.getId(entity);
  }
  //#endregion

  //#region crud operations / typeorm / create & bulk create
  /**
    Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  async save(
    item: Entity,
    options?: SaveOptions & {
      reload: false;
    },
  ): Promise<Entity> {
    //#region @websqlFunc
    let model = await this.repo.create(item);

    model = await this.repo.save(model, options);
    const { id } = model as any;

    model = await this.repo.findOne({
      where: { id } as any,
    });

    return model;
    //#endregion
  }

  /**
   * alias to save
   * -> it will actuall create new entity in db
   * in oposite to typeorm create method
   */
  async create(
    item: Entity,
    options?: SaveOptions & {
      reload: false;
    },
  ): Promise<Entity> {
    return this.save(item, options);
  }

  async bulkSave(
    items: Entity[],
    options?: SaveOptions & {
      reload: false;
    },
  ): Promise<Entity[]> {
    //#region @websqlFunc
    const models = [];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      // TODO FIX THIS / REFACTOR
      const model = await this.save(item, options);
      models.push(model);
    }
    return models;
    //#endregion
  }

  async bulkCreate(
    items: Entity[],
    options?: SaveOptions & {
      reload: false;
    },
  ): Promise<Entity[]> {
    return this.bulkSave(items, options);
  }

  //#region old typeorm version
  // /**
  //  * Creates a new entity instance.
  //  */
  // create(): Entity;
  // /**
  //  * Creates new entities and copies all entity properties from given objects into their new entities.
  //  * Note that it copies only properties that are present in entity schema.
  //  */
  // create(entityLikeArray: Entity[]): Entity[];
  // /**
  //  * Creates a new entity instance and copies all entity properties from this object into a new entity.
  //  * Note that it copies only properties that are present in entity schema.
  //  */
  // create(entityLike: Entity): Entity;
  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  // save<T extends DeepPartial<Entity>>(
  //   entities: T[],
  //   options: SaveOptions & {
  //     reload: false;
  //   },
  // ): Promise<T[]>;
  // /**
  //  * Saves all given entities in the database.
  //  * If entities do not exist in the database then inserts, otherwise updates.
  //  */
  // save<T extends DeepPartial<Entity>>(
  //   entities: T[],
  //   options?: SaveOptions,
  // ): Promise<(T & Entity)[]>;
  // /**
  //  * Saves a given entity in the database.
  //  * If entity does not exist in the database then inserts, otherwise updates.
  //  */
  // save<T extends DeepPartial<Entity>>(
  //   entity: T,
  //   options: SaveOptions & {
  //     reload: false;
  //   },
  // ): Promise<T>;
  // /**
  //  * Saves a given entity in the database.
  //  * If entity does not exist in the database then inserts, otherwise updates.
  //  */
  // save<T extends DeepPartial<Entity>>(
  //   entity: T,
  //   options?: SaveOptions,
  // ): Promise<T & Entity> {
  //   return this.repo.save(entity, options);
  // }
  //#endregion

  //#endregion

  //#region crud operations / typeorm / merge
  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge(mergeIntoEntity: Entity, ...entityLikes: Entity[]): Entity {
    return this.repo.merge(mergeIntoEntity, ...entityLikes);
  }
  //#endregion

  //#region crud operations / typeorm / preload
  /**
   * Creates a new entity from the given plain javascript object. If entity already exist in the database, then
   * it loads it (and everything related to it), replaces all values with the new ones from the given object
   * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
   * replaced from the new object.
   *
   * Note that given entity-like object must have an entity id / primary key to find entity by.
   * Returns undefined if entity with given id was not found.
   */
  preload(entityLike: Entity): Promise<Entity | undefined> {
    return this.repo.preload(entityLike);
  }
  //#endregion

  //#region crud operations / typeorm / remove (delete) & bulk remove (delete)

  /**
   * Removes a given entities from the database.
   */
  async remove(idOrEntity: number | string | Entity): Promise<Entity> {
    //#region @websqlFunc
    if (_.isObject(idOrEntity)) {
      idOrEntity = (idOrEntity as Entity).id;
    }
    const deletedEntity = await this.repo.findOne({
      where: { id: idOrEntity } as any,
    });

    const idCopy = deletedEntity.id;
    await this.repo.remove(deletedEntity);

    deletedEntity.id = idCopy;
    return deletedEntity;
    //#endregion
  }

  /**
   * alias to remove
   */
  async delete(idOrEntity: number | string | Entity): Promise<Entity> {
    return this.remove(idOrEntity);
  }

  /**
   * alias to removeById
   */
  async deleteById(id: number | string): Promise<Entity> {
    return this.remove(id);
  }
  async bulkRemove(
    idsOrEntities: (number | string | Entity)[],
  ): Promise<Entity[]> {
    //#region @websqlFunc
    idsOrEntities = idsOrEntities.map(id => {
      return _.isObject(id) ? (id as Entity).id : id;
    });

    const models = [];
    for (let index = 0; index < idsOrEntities.length; index++) {
      const id = idsOrEntities[index];
      const model = await this.remove(id);
      models.push(model);
    }
    return models;
    //#endregion
  }

  async bulkDelete(ids: (number | string | Entity)[]): Promise<Entity[]> {
    return this.bulkRemove(ids);
  }

  //#region old typeorm version
  // /**
  //  * Deletes entities by a given criteria.
  //  * Unlike save method executes a primitive operation without cascades, relations and other operations included.
  //  * Executes fast and efficient DELETE query.
  //  * Does not check if entity exist in the database.
  //  */
  // delete(
  //   criteria:
  //     | string
  //     | string[]
  //     | number
  //     | number[]
  //     | Date
  //     | Date[]
  //     | ObjectID
  //     | ObjectID[]
  //     | FindOptionsWhere<Entity>,
  // ): Promise<DeleteResult> {
  //   return this.repo.delete(criteria);
  // }

  // /**
  //  * Removes a given entities from the database.
  //  */
  // remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;
  // /**
  //  * Removes a given entity from the database.
  //  */
  // remove(entity: Entity, options?: RemoveOptions): Promise<Entity> {
  //   return this.repo.remove(entity, options);
  // }

  //#endregion
  //#endregion

  //#region crud operations / typeorm / soft remove
  /**
   * Records the delete date of all given entities.
   */
  softRemove<T extends Entity>(
    entities: T[],
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T[]>;
  /**
   * Records the delete date of all given entities.
   */
  softRemove<T extends Entity>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;
  /**
   * Records the delete date of a given entity.
   */
  softRemove<T extends Entity>(
    entity: T,
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T>;
  /**
   * Records the delete date of a given entity.
   */
  softRemove<T extends Entity>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity> {
    return this.repo.softRemove(entity, options);
  }
  //#endregion

  //#region crud operations / typeorm / recover
  /**
   * Recovers all given entities in the database.
   */
  recover<T extends Entity>(
    entities: T[],
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T[]>;
  /**
   * Recovers all given entities in the database.
   */
  recover<T extends Entity>(
    entities: T[],
    options?: SaveOptions,
  ): Promise<(T & Entity)[]>;
  /**
   * Recovers a given entity in the database.
   */
  recover<T extends Entity>(
    entity: T,
    options: SaveOptions & {
      reload: false;
    },
  ): Promise<T>;
  /**
   * Recovers a given entity in the database.
   */
  recover<T extends Entity>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity> {
    return this.repo.recover(entity, options);
  }
  //#endregion

  //#region crud operations / typeorm / insert
  /**
   * Inserts a given entity into the database.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient INSERT query.
   * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
   */
  insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    return this.repo.insert(entity);
  }
  //#endregion

  //#region crud operations / typeorm / update & build update
  async update(item: Entity) {
    //#region @websqlFunc
    const { id } = item as any;
    return await this.updateById(id, item);
    //#endregion
  }

  async updateById(id: number | string, item: Entity) {
    //#region @websqlFunc
    const allowedPropsToUpdate = [];
    for (const key in item) {
      if (
        _.isObject(item) &&
        item.hasOwnProperty(key) &&
        typeof item[key] !== 'object' &&
        !_.isUndefined(
          this.repo.metadata.ownColumns.find(c => c.propertyName === key),
        )
      ) {
        allowedPropsToUpdate.push(key);
      }
    }

    for (let i = 0; i < allowedPropsToUpdate.length; i++) {
      const key: string = allowedPropsToUpdate[i];
      if (!INDEX_KEYS_NO_FOR_UPDATE.includes(key.toLowerCase())) {
        // const raw = _.isBoolean(item[key]) || _.isNumber(item[key]) || _.isNull(item[key]); // TODO does this make any sense ?
        const toSet = item[key];
        // const tableName = tableNameFrom(this.entity as any);

        await this.repo.update(
          {
            id,
          } as any,
          {
            [key]: toSet,
          } as any,
        );
        //         await this.repo.query(
        //           `UPDATE '${tableName}' as ${table}
        // SET ${key}=${toSet}
        // WHERE ${table}.id='${id}'
        // `);
      }
    }
    let model = await this.repo.findOne({
      where: { id } as any,
    });

    return model;
    //#endregion
  }
  async bulkUpdate(items: Entity[]) {
    //#region @websqlFunc
    const models = [];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const { id } = item as any; // TOOD
      const model = await this.updateById(id, item);
      models.push(model);
    }
    return { models };
    //#endregion
  }

  //#region tpeorm update version
  // this version suck and will not return update entity
  // /**
  //  * Updates entity partially. Entity can be found by a given conditions.
  //  * Unlike save method executes a primitive operation without cascades, relations and other operations included.
  //  * Executes fast and efficient UPDATE query.
  //  * Does not check if entity exist in the database.
  //  */
  // update(
  //   criteria:
  //     | string
  //     | string[]
  //     | number
  //     | number[]
  //     | Date
  //     | Date[]
  //     | ObjectID
  //     | ObjectID[]
  //     | FindOptionsWhere<Entity>,
  //   partialEntity: QueryDeepPartialEntity<Entity>,
  // ): Promise<UpdateResult> {
  //   return this.repo.update(criteria, partialEntity);
  // }
  //#endregion

  //#endregion

  //#region crud operations / typeorm / upsert
  /**
   * Inserts a given entity into the database, unless a unique constraint conflicts then updates the entity
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient INSERT ... ON CONFLICT DO UPDATE/ON DUPLICATE KEY UPDATE query.
   */
  upsert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[],
    conflictPathsOrOptions: string[] | UpsertOptions<Entity>,
  ): Promise<InsertResult> {
    return this.repo.upsert(entityOrEntities, conflictPathsOrOptions);
  }
  //#endregion

  //#region crud operations / typeorm / soft delete
  /**
   * Records the delete date of entities by a given criteria.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient SOFT-DELETE query.
   * Does not check if entity exist in the database.
   */
  softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      // | ObjectID
      // | ObjectID[]
      | FindOptionsWhere<Entity>,
  ): Promise<UpdateResult> {
    return this.repo.softDelete(criteria);
  }
  //#endregion

  //#region crud operations / typeorm / restore
  /**
   * Restores entities by a given criteria.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient SOFT-DELETE query.
   * Does not check if entity exist in the database.
   */
  restore(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      // | ObjectID
      // | ObjectID[]
      | FindOptionsWhere<Entity>,
  ): Promise<UpdateResult> {
    return this.repo.restore(criteria);
  }
  //#endregion

  //#region crud operations / typeorm / count
  /**
   * Counts entities that match given options.
   * Useful for pagination.
   */
  count(options?: FindManyOptions<Entity>): Promise<number> {
    return this.repo.count(options);
  }
  //#endregion

  //#region crud operations / typeorm / count by
  /**
   * Counts entities that match given conditions.
   * Useful for pagination.
   */
  countBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<number> {
    return this.repo.countBy(where);
  }
  //#endregion

  //#region crud operations / typeorm / find
  /**
   * Finds entities that match given find options.
   */
  find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repo.find(options);
  }
  //#endregion

  //#region crud operations / typeorm / find by
  /**
   * Finds entities that match given find options.
   */
  findBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<Entity[]> {
    return this.repo.findBy(where);
  }
  //#endregion

  //#region crud operations / typeorm / find and count
  // async findAndCount(options: { take: number; skip: number }) {
  // const { take, skip } = options;
  // const [result, total] = await this.repo.findAndCount({
  //   // where: { name: Like('%' + keyword + '%') },
  //   // order: { name: "DESC" },
  //   take: take,
  //   skip: skip,
  // });
  // return { result, total };

  // }
  //
  /**
   * Finds entities that match given find options.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
    return this.repo.findAndCount(options);
  }
  //#endregion

  //#region crud operations / typeorm / find and count by
  /**
   * Finds entities that match given WHERE conditions.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  findAndCountBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<[Entity[], number]> {
    return this.repo.findAndCountBy(where);
  }
  //#endregion

  //#region crud operations / typeorm / find by ids
  /**
   * Finds entities with ids.
   * Optionally find options or conditions can be applied.
   *
   * @deprecated use `findBy` method instead in conjunction with `In` operator, for example:
   *
   * .findBy({
   *     id: In([1, 2, 3])
   * })
   */
  findByIds(ids: any[]): Promise<Entity[]> {
    return this.repo.findByIds(ids);
  }
  //#endregion

  //#region crud operations / typeorm / find one
  /**
   * Finds first entity by a given find options.
   * If entity was not found in the database - returns null.
   */
  findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
    return this.repo.findOne(options);
  }
  //#endregion

  //#region crud operations / typeorm / find one by
  /**
   * Finds first entity that matches given where condition.
   * If entity was not found in the database - returns null.
   */
  findOneBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<Entity | null> {
    return this.repo.findOneBy(where);
  }
  //#endregion

  //#region crud operations / typeorm / find one or fail
  /**
   * Finds first entity that matches given id.
   * If entity was not found in the database - returns null.
   *
   * @deprecated use `findOneBy` method instead in conjunction with `In` operator, for example:
   *
   * .findOneBy({
   *     id: 1 // where "id" is your primary column name
   * })
   */
  findOneById(
    id: number | string | Date,
    // | ObjectID
  ): Promise<Entity | null> {
    return this.repo.findOneById(id);
  }
  //#endregion

  //#region crud operations / typeorm / find one or fail
  /**
   * Finds first entity by a given find options.
   * If entity was not found in the database - rejects with error.
   */
  findOneOrFail(options: FindOneOptions<Entity>): Promise<Entity> {
    return this.repo.findOneOrFail(options);
  }
  //#endregion

  //#region crud operations / typeorm / find one by or fail
  /**
   * Finds first entity that matches given where condition.
   * If entity was not found in the database - rejects with error.
   */
  findOneByOrFail(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<Entity> {
    return this.repo.findOneByOrFail(where);
  }
  //#endregion

  //#region crud operations / typeorm / query
  /**
   * Executes a raw SQL query and returns a raw database results.
   * Raw query execution is supported only by relational databases (MongoDB is not supported).
   */
  query(query: string, parameters?: any[]): Promise<any> {
    return this.repo.query(query, parameters);
  }
  //#endregion

  //#region crud operations / typeorm / clear
  /**
   * Clears all the data from the given table/collection (truncates/drops it).
   *
   * Note: this method uses TRUNCATE and may not work as you expect in transactions on some platforms.
   * @see https://stackoverflow.com/a/5972738/925151
   */
  clear(): Promise<void> {
    return this.repo.clear();
  }
  //#endregion

  //#region crud operations / typeorm / increment
  /**
   * Increments some column by provided value of the entities matched given conditions.
   */
  increment(
    conditions: FindOptionsWhere<Entity>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult> {
    return this.repo.increment(conditions, propertyPath, value);
  }
  //#endregion

  //#region crud operations / typeorm / decrement
  /**
   * Decrements some column by provided value of the entities matched given conditions.
   */
  decrement(
    conditions: FindOptionsWhere<Entity>,
    propertyPath: string,
    value: number | string,
  ): Promise<UpdateResult> {
    return this.repo.decrement(conditions, propertyPath, value);
  }
  //#endregion

  //#region crud operations / get all
  async getAll() {
    //#region @websqlFunc
    const totalCount = await this.repo.count();
    const models = await this.repo.find();
    return { models, totalCount };
    //#endregion
  }
  //#endregion

  //#region crud operations / get by id
  async getBy(id: number | string): Promise<Entity> {
    //#region @websqlFunc
    const model = await await this.repo.findOne({
      where: { id } as any,
    });

    return model;
    //#endregion
  }
  //#endregion

}
