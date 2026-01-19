import nodemailer from 'nodemailer'
import { MonitoredUrl } from '../types/database'

export class AlertService {
  private transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  async sendDownAlert(url: MonitoredUrl, statusCode: number, responseTime: number, userEmail: string) {
    const subject = `🚨 Alert: ${url.url} is DOWN`
    const html = `
      <h2>URL Monitoring Alert</h2>
      <p><strong>URL:</strong> ${url.url}</p>
      <p><strong>Status:</strong> DOWN</p>
      <p><strong>Status Code:</strong> ${statusCode}</p>
      <p><strong>Response Time:</strong> ${responseTime}ms</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <p>Please check your website immediately.</p>
    `

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: userEmail,
      subject,
      html
    })
  }
}