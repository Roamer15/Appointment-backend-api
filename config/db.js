import { Pool } from "pg";
import logger from "../utils/logger.js";
import "dotenv/config";

const { DB_USER, DB_PASSWORD, DB_PORT, DB_NAME, DB_HOST } = process.env;

if (!DB_USER || !DB_PASSWORD || !DB_PORT || !DB_NAME || !DB_HOST) {
  logger.error(
    "Database environment variables are missing! Create or check your .env files"
  );
  process.exit(1);
}

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: parseInt(DB_PORT, 10),
  connectionTimeoutMillis: 2000,
});

logger.info(`Database has been configured for ${DB_NAME} database`);

pool.on("connect", (client) => {
  logger.info(`Client connected from Pool (Total count: ${pool.totalCount}`);
});

pool.on("error", (err, client) => {
  logger.error("Unexpected error on idle client in pool", err);
  process.exit(-1);
});

async function initializeDbSchema() {
  const client = await pool.connect();

  try {
    logger.info("Initializing database schema");
    await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");

    // creatioin of all the tables needed for the database
    await query(`
            CREATE TABLE IF NOT EXISTS clients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            profile_image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                 );

            `);
    logger.info("Clients table has been created successfully");

    await query(`
            CREATE TABLE IF NOT EXISTS providers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            specialty VARCHAR(100),
            bio TEXT,
            rating DECIMAL(3, 1),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                  );`);
    logger.info("Clients table has been created successfully");

    await query(`
            CREATE TABLE IF NOT EXISTS time_slots (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              provider_id UUID NOT NULL,
              day DATE NOT NULL,
              start_time TIME(0) NOT NULL,
              end_time TIME(0) NOT NULL,
              is_booked BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT fk_provider
                FOREIGN KEY(provider_id) 
                REFERENCES providers(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
            );
          `);
    logger.info("Time slots table has been created successfully");

    await query(`
            CREATE INDEX IF NOT EXISTS idx_time_slots_provider ON time_slots(provider_id);
          `);
    await query(`
            CREATE INDEX IF NOT EXISTS idx_time_slots_day_time ON time_slots(day, start_time, end_time);
          `);
    logger.info("Optimization indexes added");

    await query(`
            CREATE TABLE IF NOT EXISTS appointments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
            timeslot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
            ppointment_date DATE NOT NULL,
            status VARCHAR(20) CHECK (status IN ('booked', 'canceled', 'completed', 'no-show')) DEFAULT 'booked',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

            `);
    logger.info("Appointments table created successfully");

    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = NOW();
         RETURN NEW;
      END;
      $$ language 'plpgsql';
  `);
    logger.debug("update_updated_at_column function ensured.");

    await client.query(`
  DO $$ BEGIN
    IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_time_slots_updated_at'
  ) THEN
      CREATE TRIGGER update_time_slots_updated_at
      BEFORE UPDATE ON time_slots 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    END IF;
  END $$;
`);
    logger.debug("Time slots update_at Trigger is checked and created");

    await query(`
                CREATE INDEX IF NOT EXISTS idx_appointments_provider_status ON appointments(provider_id, status);
                CREATE INDEX IF NOT EXISTS idx_appointments_client_status ON appointments(client_id, status);
              `);
  } catch (err) {
    logger.error(`Error while initializing the schema`, err);
    process.exit(1);
  } finally {
    client.release();
  }
}

async function connectToDb() {
  try {
    const client = await pool.connect();
    logger.info(`Database connection pool established successfully`);
    client.release();
  } catch (error) {
    logger.error("Unable to establish database connection pool", error);
    process.exit(1);
  }
}

async function query(text, params) {
  const start = Date.now();
  try {
    const response = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.info(
      `Executed query: { text: ${text.substring(
        0,
        100
      )}..., params: ${JSON.stringify(
        params
      )}, duration: ${duration}ms, rows: ${response.rowCount}}`
    );
    return response;
  } catch (error) {
    logger.error(
      `Error executing query: { text: ${text.substring(
        0,
        100
      )}..., params: ${JSON.stringify(params)}, error: ${error.message}}`
    );
    throw error;
  }
}

export { pool, connectToDb, initializeDbSchema, query };
