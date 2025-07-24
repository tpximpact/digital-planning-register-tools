-- SQL dump generated using DBML (dbml.dbdiagram.io)
-- Database: PostgreSQL
-- Generated at: 2025-07-24T14:44:32.870Z

CREATE TABLE "planningApplications" (
  "reference" varchar PRIMARY KEY,
  "address" text,
  "postcode" text,
  "description" text,
  "created_at" timestamp,
  "updated_at" timestamp
);
