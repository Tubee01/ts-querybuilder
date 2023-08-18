/* eslint-disable @typescript-eslint/no-explicit-any */
import sql from './db';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type OrderColumn<T> = {
  column: keyof T;
  direction: Order;
};

export type WhereClause = {
  contains?: string;
  endsWith?: string;
  eq?: string;
  gt?: string;
  gte?: string;
  in?: string[];
  lt?: string;
  lte?: string;
  startsWith?: string;
  neq?: string;
};

export type Where<T> =
  | {
      [K in keyof T]?: WhereClause | T[K];
    }
  | {
      OR?: WhereClause;
      AND?: WhereClause;
    };

export class QueryBuilder {
  constructor(private readonly table: string) {}

  public insert<T extends Record<string, unknown>[]>(options: {
    data: Record<string, any>;
    returning?: string[] | string;
  }) {
    const { data, returning } = options;

    if (returning === '*') {
      return sql<T>`INSERT INTO ${sql(this.table)} ${sql(data)} ${returning ? sql`RETURNING *` : sql``}`;
    }

    return sql<T>`INSERT INTO ${sql(this.table)} ${sql(data)} ${returning ? sql`RETURNING ${sql(returning)}` : sql``}`;
  }

  public update<T extends Record<string, unknown>[]>(options: {
    data: Record<string, any>;
    returning?: string[] | string;
    where?: Where<T[0]>;
  }) {
    const { data, returning, where } = options;
    if (returning === '*') {
      return sql<T>`UPDATE ${sql(this.table)} SET ${sql(data)} ${where ? this.getWhere(where) : sql``}`;
    }

    return sql<T>`UPDATE ${sql(this.table)} SET ${sql(data)} ${where ? this.getWhere(where) : sql``}`;
  }

  public delete<T extends Record<string, unknown>>(options?: {
    where?: Where<T>;
    returning?: string[] | string;
  }): Promise<T[] | null> {
    const { where, returning } = options;

    if (returning === '*') {
      return sql`DELETE FROM ${sql(this.table)} ${where ? this.getWhere(where) : sql``} RETURNING *`;
    }

    return sql`DELETE FROM ${sql(this.table)} ${where ? this.getWhere(where) : sql``} ${
      returning ? sql`RETURNING ${sql(returning)}` : sql``
    }`;
  }

  public find<T extends Record<string, unknown>[]>(
    options: { where?: Where<T[0]>; order?: OrderColumn<T[0]>[]; select?: (keyof T[0])[] } = {},
  ) {
    const { where, order, select } = options;
    const filterKeys = where ? Object.keys(where).filter((x) => where[x] !== undefined) : [];

    const pgquery = sql<T>`SELECT ${select?.length ? sql`${sql(select as string[])}` : sql`*`} FROM ${sql(
      this.table,
    )} ${filterKeys?.length ? this.getWhere(where) : sql``} ${order?.length ? this.getOrderBy(order) : sql``}`;

    return pgquery;
  }

  private getWhere<T extends Record<string, unknown>[]>(where: Where<T[0]>) {
    const filterKeys = Object.keys(where).filter((x) => where[x] !== undefined);

    //TODO: Handle together AND and OR

    if (filterKeys.includes('OR')) {
      return this.getWhereOr(where.OR);
    }

    if (filterKeys.includes('AND')) {
      return this.getWhereAnd(where.AND);
    }

    return this.getWhereAnd(where);
  }

  private getFirstOperator(clause: WhereClause) {
    return Object.keys(clause).find((x) => clause[x] !== undefined);
  }

  private getSqlOperator(operator: keyof WhereClause) {
    switch (operator) {
      case 'contains':
      case 'endsWith':
      case 'startsWith':
        return sql`LIKE`;
      case 'eq':
        return sql`=`;
      case 'gt':
        return sql`>`;
      case 'gte':
        return sql`>=`;
      case 'in':
        return sql`IN`;
      case 'lt':
        return sql`<`;
      case 'lte':
        return sql`<=`;
      case 'neq':
        return sql`!=`;
      default:
        return sql`=`;
    }
  }

  private manipulateFilterValue(value: string, operator: string) {
    switch (operator) {
      case 'contains':
        return `%${value}%`;
      case 'endsWith':
        return `%${value}`;
      case 'startsWith':
        return `${value}%`;
      default:
        return value;
    }
  }

  private getWhereOr(where: WhereClause) {
    return this.getSqlWhere(where, 'OR');
  }

  private getWhereAnd<T>(where: WhereClause | Where<T>) {
    return this.getSqlWhere(where as WhereClause, 'AND');
  }

  private getSqlWhere(where: WhereClause, clauseKey: string) {
    const filterKeys = Object.keys(where).filter((x) => where[x] !== undefined);

    return sql`WHERE ${
      filterKeys.map((key, i) => {
        const operator = this.getFirstOperator(where[key] as WhereClause);
        const value = +operator === 0 ? where[key] : this.manipulateFilterValue(where[key][operator], operator);
        return sql`${i ? sql`${clauseKey} ` : sql``}${sql(key)} ${this.getSqlOperator(operator as keyof WhereClause)} ${
          value === null ? sql`NULL` : sql`${value}`
        }`;
      }) as any
    }`;
  }

  private getOrderBy<T extends Record<string, any>[]>(order: OrderColumn<T[0]>[]) {
    return sql`ORDER BY ${
      order.map(
        (x, i) =>
          sql`${i ? sql`, ` : sql``} ${sql(x.column as string)} ${
            x.direction?.toUpperCase() === Order.DESC ? sql`desc` : sql`asc`
          } `,
      ) as any
    }`;
  }
}
