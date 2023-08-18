import { Entity, EntityWithoutRelations } from '../types';
import { OrderColumn, QueryBuilder, Where } from '../query-builder';

export class EntityModel {
  private readonly queryBuilder = new QueryBuilder('entity');

  find(options?: { where?: Where<Entity>; order?: OrderColumn<Entity>[]; select?: (keyof Entity)[] }) {
    return this.queryBuilder.find<Entity[]>(options);
  }

  create(options: {
    data: Partial<Omit<EntityWithoutRelations, 'id'>>;
    returning?: (keyof Entity)[];
    where?: Where<Entity>;
  }) {
    return this.queryBuilder.insert(options);
  }

  update(options: {
    data: Partial<Omit<EntityWithoutRelations, 'id'>>;
    returning?: (keyof Entity)[];
    where?: Where<Entity>;
  }) {
    return this.queryBuilder.update(options);
  }

  delete(where?: Where<Entity>) {
    return this.queryBuilder.delete({ where });
  }
}
