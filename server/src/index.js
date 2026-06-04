import './load-env.js'
import { pool } from './db.js'
import { createApp } from './app.js'

const app = createApp()
const port = Number(process.env.PORT || 4000)

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})

process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})
