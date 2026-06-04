import '../src/load-env.js'
import { pool } from '../src/db.js'

async function run() {
  const result = await pool.query('SELECT NOW() AS now')
  console.log('PostgreSQL connected successfully.')
  console.log(`Database: ${process.env.DB_NAME}`)
  console.log(`Server time: ${result.rows[0].now}`)
}

run()
  .catch((error) => {
    console.error('PostgreSQL connection failed:', error.message)
    console.error('Check server/.env (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).')
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
