import nodemailer from 'nodemailer'
import { renderToStream } from '@react-pdf/renderer'
import InvoiceDocument from '../../app/pdf/InvoiceDocument'

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { invoiceData, recipientEmail } = req.body
  if (!invoiceData || !recipientEmail) {
    res.status(400).json({ error: 'Missing invoice data or recipient email' })
    return
  }

  try {
    const invoiceStream = await renderToStream(<InvoiceDocument data={invoiceData} />)
    const pdfBuffer = await streamToBuffer(invoiceStream)

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      subject: `Vibhava Enterprises Invoice ${invoiceData.invoiceNo || ''}`,
      text: 'Please find attached your invoice in PDF format.',
      attachments: [
        {
          filename: `invoice-${invoiceData.invoiceNo || 'vibhava'}.pdf`,
          content: pdfBuffer,
        },
      ],
    }

    await transport.sendMail(mailOptions)
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to send invoice email' })
  }
}
