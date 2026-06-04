import cors from 'cors'
import express from 'express'
import { router } from './routes.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use('/api', router)

  app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(400).json({
      message: err.message || '요청 처리 중 오류가 발생했습니다.',
    })
  })

  return app
}
