
BEGIN;

TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE games CASCADE;
TRUNCATE TABLE bets CASCADE;

CREATE FUNCTION get_user_id(email text) RETURNS int
AS $$
DECLARE
    user_id int;
BEGIN
    SELECT id
        INTO STRICT user_id
        FROM users
        WHERE email = get_user_id.email;
    RETURN user_id;
END
$$ LANGUAGE plpgsql;

INSERT INTO
    users (
        "name",
        "email",
        "password",
        "score",
        "is_admin",
        "created_at",
        "updated_at")
    VALUES (
        'Tux',
        'tux@kernel.org',
        '$2b$10$5yUfvGWg73uC/5G6cTwzq.xqevm56kpV3sRm0cuq.UqHoZRvIB7Va',
        0,
        true,
        now(),
        now());

COMMIT;
