import express from 'express'
import { getMenusWithOptions } from './services/menu-service.js'
import {
  advanceOrderStatus,
  createOrder,
  getOrderById,
  getOrders,
} from './services/order-service.js'

export const router = express.Router()

router.get('/health', (_req, res) => {
  res.json({ ok: true })
})

router.get('/menus', async (_req, res, next) => {
  try {
    const menus = await getMenusWithOptions()
    res.json(menus)
  } catch (error) {
    next(error)
  }
})

router.post('/orders', async (req, res, next) => {
  try {
    const order = await createOrder(req.body)
    res.status(201).json(order)
  } catch (error) {
    next(error)
  }
})

router.get('/orders', async (_req, res, next) => {
  try {
    const orders = await getOrders()
    res.json(orders)
  } catch (error) {
    next(error)
  }
})

router.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await getOrderById(Number(req.params.id))
    if (!order) {
      return res.status(404).json({ message: '주문을 찾을 수 없습니다.' })
    }
    return res.json(order)
  } catch (error) {
    return next(error)
  }
})

router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const order = await advanceOrderStatus(Number(req.params.id))
    if (!order) {
      return res.status(404).json({ message: '주문을 찾을 수 없습니다.' })
    }
    return res.json(order)
  } catch (error) {
    return next(error)
  }
})
