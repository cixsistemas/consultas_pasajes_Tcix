import sql from "mssql";

const sqlConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_DATABASE,

  port: Number(process.env.DB_PORT ?? 1433),

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export function getConnection(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    const pool = new sql.ConnectionPool(sqlConfig);

    pool.on("error", (error) => {
      console.error("Error en SQL Server:", error);
    });

    poolPromise = pool.connect();
  }

  return poolPromise;
}

export { sql };