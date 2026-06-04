import '../src/load-env.js'
import pg from 'pg'

const { Client } = pg

async function run() {
  const admin = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  })

  await admin.connect()

  const dbName = process.env.DB_NAME || 'mycafe'
  const exists = await admin.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName],
  )

  if (exists.rowCount === 0) {
    await admin.query(`CREATE DATABASE ${dbName}`)
    console.log(`Database "${dbName}" created.`)
  } else {
    console.log(`Database "${dbName}" already exists.`)
  }

  await admin.end()
}

run().catch((error) => {
  console.error('Failed to create database:', error.message)
  process.exitCode = 1
})
