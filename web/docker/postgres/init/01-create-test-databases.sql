-- Runs once, on first initialisation of the local Postgres volume.
-- feather_touch         : local development (created by POSTGRES_DB)
-- feather_touch_test    : integration tests (reset freely)
-- feather_touch_shadow  : Prisma Migrate shadow database
CREATE DATABASE feather_touch_test OWNER feather;
CREATE DATABASE feather_touch_shadow OWNER feather;
