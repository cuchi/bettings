BEGIN;

CREATE TYPE game_mode AS ENUM ('secret', 'secret-till-end', 'open');
ALTER TABLE games ADD COLUMN mode game_mode NOT NULL DEFAULT 'open';

COMMIT;
