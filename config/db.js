import { Pool } from "pg";
import logger from "../utils/logger";

const {DB_USER, DB_PASSWORD, DB_PORT, DB_NAME} = process.env