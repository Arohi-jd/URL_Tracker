import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { CronService } from './services/monitoring/cron'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start cron service
const cronService = new CronService()
cronService.start()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})