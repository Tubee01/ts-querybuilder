CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE attribute_type as ENUM (
    'STRING',
    'INT',
    'DATETIME',
    'JSON' 
);

CREATE TABLE entity (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id VARCHAR(36) REFERENCES entity(id),
    name VARCHAR(255) UNIQUE NOT NULL,
);

CREATE TABLE attribute (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id VARCHAR(36) REFERENCES entity(id),
    name VARCHAR(255) NOT NULL,
    type attribute_type
);

CREATE TABLE property_value (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    attribute_id VARCHAR(36) REFERENCES attribute(id),
    entity_id VARCHAR(36) REFERENCES entity(id)
);


CREATE TABLE date_time_property_value (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    property_value_id VARCHAR(36) REFERENCES property_value(id),
    value TIMESTAMP
);

CREATE TABLE string_property_value (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    property_value_id VARCHAR(36) REFERENCES property_value(id),
    value TEXT
);

CREATE TABLE int_property_value (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    property_value_id VARCHAR(36) REFERENCES property_value(id),
    value INTEGER
);

CREATE TABLE json_property_value (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    property_value_id VARCHAR(36) REFERENCES property_value(id),
    value JSONB
);