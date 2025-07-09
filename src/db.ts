import postgres from 'postgres';
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
}
const sql = postgres(databaseUrl);

export default sql;