import "dotenv/config";

// Point every server module at the TEST database and a deterministic auth config.
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.BETTER_AUTH_SECRET = "integration-test-secret-integration-test-secret";
process.env.BETTER_AUTH_TRUSTED_ORIGINS = "";
process.env.ADMIN_REQUIRE_2FA = "true";
