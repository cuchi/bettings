BEGIN;

DELETE FROM bets a
    USING (
        SELECT MIN(created_at) as created_at, placed_by, game FROM bets
        GROUP BY (placed_by, game) HAVING COUNT(*) > 1
    ) b
    WHERE a.placed_by = b.placed_by
    AND a.game = b.game
    AND a.created_at <> b.created_at;

ALTER TABLE bets ADD UNIQUE (placed_by, game);

COMMIT;
