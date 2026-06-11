import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import express from 'express'
import { router } from './routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../../dist')

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use('/api', router)

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(distPath))
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'))
    })
  }

  app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(400).json({
      message: err.message || '요청 처리 중 오류가 발생했습니다.',
    })
  })

  return app
}
