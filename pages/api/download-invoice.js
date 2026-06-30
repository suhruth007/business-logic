import { renderToStream } from '@react-pdf/renderer'
import InvoiceDocument from '../../app/pdf/InvoiceDocument'

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

  const { invoiceData } = req.body
  if (!invoiceData) {
    res.status(400).json({ error: 'Missing invoice data' })
    return
  }

  try {
    const pdfStream = await renderToStream(<InvoiceDocument data={invoiceData} />)
    const pdfBuffer = await streamToBuffer(pdfStream)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.invoiceNo || 'vibhava'}.pdf`)
    res.send(pdfBuffer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
}
