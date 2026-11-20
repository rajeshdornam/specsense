const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, 'specsense.sqlite');

let dbInstance = null;
let SQLModule = null;

async function getDB() {
  if (dbInstance) return dbInstance;

  SQLModule = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    dbInstance = new SQLModule.Database(fileBuffer);
  } else {
    dbInstance = new SQLModule.Database();
    persistDB();
  }

  return dbInstance;
}

function persistDB() {
  if (!dbInstance) return;
  const data = dbInstance.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

// Helper wrapper for SQL execution
const db = {
  async init() {
    await getDB();
  },

  async all(sql, params = []) {
    const db = await getDB();
    const stmt = db.prepare(sql);
    if (params && params.length > 0) {
      stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  async get(sql, params = []) {
    const rows = await this.all(sql, params);
    return rows.length > 0 ? rows[0] : null;
  },

  async run(sql, params = []) {
    const db = await getDB();
    if (params && params.length > 0) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      stmt.step();
      stmt.free();
    } else {
      db.run(sql);
    }
    persistDB();
    const lastIdRes = db.exec("SELECT last_insert_rowid() as id;");
    const lastInsertId = (lastIdRes && lastIdRes[0] && lastIdRes[0].values[0]) ? lastIdRes[0].values[0][0] : null;
    return { lastInsertId };
  },

  async exec(sql) {
    const db = await getDB();
    db.run(sql);
    persistDB();
  }
};

module.exports = db;
