import './load-env.js'
import cors from 'cors'
import express from 'express'
import { pool } from './db.js'
import { router } from './routes.js'

const app = express()
const port = Number(process.env.PORT || 4000)

app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(400).json({
    message: err.message || '요청 처리 중 오류가 발생했습니다.',
  })
})

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`)
})

process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})
