export type PropertyValue = {
  id: string;
  attributeId: string;
  attribute: Attribute;
  entityId: string;
  entity: Entity;
};

export type Entity = {
  id: string;
  name: string;
  parentId: string | null;
  parent: Entity | null;
  attributes: Array<Attribute> | null;
  values: Record<Attribute['name'], AttirbutePropertyValue['value']> | null;
};

export type EntityWithoutRelations = Omit<Entity, 'parent' | 'attributes' | 'values'>;

export type Attribute = {
  id: string;
  name: string;
  entityId: string;
  entity: Entity;
  type: AttributeType;
};

export type AttirbutePropertyValue<T = unknown> = {
  id: string;
  propertyValueId: string;
  value: T;
  propertyValue: PropertyValue;
};

export enum AttributeType {
  String = 'STRING',
  Number = 'INT',
  Date = 'DATETIME',
  Json = 'JSON',
}
