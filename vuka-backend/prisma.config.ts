import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

require("dotenv").config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    adapter: () => {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      return new PrismaPg(pool);
    },
  },
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});