/** @module Postgres */
let { Pool } = require("pg");

/**
 * @class Postgres
 * @description Class for managing Postgres database connection and transactions.
 */
class Postgres {
  /**
   * @constructor
   * @description Creates and initializes a Postgres connection pool.
   * @param {object} dbconfig - Database configuration object.
   */
  constructor(dbconfig) {
    // Configures pool with connection information
    this.appPool = new Pool({
      host : dbconfig.HOST,
      port : dbconfig.PORT,
      database : dbconfig.DATABASE,
      user : dbconfig.USER,
      password : dbconfig.PASSWORD,
      ssl : dbconfig.SSL,
      binary : dbconfig.BINARY,
      client_encoding : dbconfig.CLIENT_ENCODING,
      application_name : dbconfig.APPLICATION_NAME,
      fallback_application_name : dbconfig.FALLBACK_APPLICATION_NAME,
      connectionTimeoutMillis : dbconfig.CONNECTION_TIMEOUT_MILLIS,
      idleTimeoutMillis : dbconfig.IDLE_TIMEOUT_MILLIS,
      max : dbconfig.MAX,
      keepAlive : dbconfig.KEEP_ALIVE,
      allowExitOnIdle : dbconfig.ALLOW_EXIT_ON_IDLE
    });
  }

  /**
   * @method Init
   * @description Gets a client from the connection pool.
   * @returns {Promise<void>}
   */
  async Init() {
    this.client = await this.appPool.connect();
  }

  /**
   * @method Execute
   * @description Executes an SQL query.
   * @param {string} query - The SQL query to execute.
   * @param {Array} params - Parameters for the query (optional).
   * @returns {Promise<Array>} - Result rows of the executed query.
   */
  async Execute(query, params = []) {
    return (await this.client.query(query, params));
  }

  /**
   * @method Release
   * @description Releases the client back to the connection pool.
   * @returns {Promise<void>}
   */
  async Release() {
    await this.client.release();
  }

  /**
   * @method Begin
   * @description Begins a database transaction.
   * @returns {Promise<void>}
   */
  async Begin() {
    await this.client.query("BEGIN");
  }

  /**
   * @method Commit
   * @description Commits a database transaction.
   * @returns {Promise<void>}
   */
  async Commit() {
    await this.client.query("COMMIT");
  }

  /**
   * @method Rollback
   * @description Rolls back a database transaction.
   * @returns {Promise<void>}
   */
  async Rollback() {
    await this.client.query("ROLLBACK");
  }
}

/**
 * @function GetClient
 * @description Gets an instance of the Postgres class.
 * @param {object} dbType - Database type configuration.
 * @returns {Promise<Postgres>} - A promise that resolves to a Postgres client.
 */
let GetClient = async (dbType) => {
  let postgres = new Postgres(dbType);
  await postgres.Init();
  return postgres;
};

module.exports.GetPostgresClient = GetClient;
