BEGIN;

CREATE TABLE users (
    "id" SERIAL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(2000) NOT NULL UNIQUE,
    "password" VARCHAR(100) NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE games (
    "id" SERIAL,
    "name" VARCHAR(255) NOT NULL,
    "time_limit" TIMESTAMP WITH TIME ZONE NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 1,
    "created_by" INTEGER NOT NULL REFERENCES "users" ("id"),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE bets (
    "id" SERIAL,
    "value" TIMESTAMP WITH TIME ZONE NOT NULL,
    "placed_by" INTEGER NOT NULL REFERENCES "users" ("id"),
    "game" INTEGER NOT NULL REFERENCES "games" ("id"),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("id")
);

COMMIT;
