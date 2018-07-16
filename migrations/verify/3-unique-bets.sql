BEGIN;

DO $$
BEGIN
    ASSERT 1 = (
        SELECT 1
        FROM information_schema.constraint_table_usage
        WHERE table_name = 'bets'
        AND constraint_name = 'unique_bets');
END $$;

ROLLBACK;
