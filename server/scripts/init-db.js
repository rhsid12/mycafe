import '../src/load-env.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from '../src/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function run() {
  const schemaPath = path.join(__dirname, '../src/sql/schema.sql')
  const seedPath = path.join(__dirname, '../src/sql/seed.sql')

  const schemaSql = await fs.readFile(schemaPath, 'utf-8')
  const seedSql = await fs.readFile(seedPath, 'utf-8')

  await pool.query(schemaSql)
  await pool.query(seedSql)

  console.log('Database schema and seed data initialized.')
}

run()
  .catch((error) => {
    console.error('Failed to initialize DB:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
