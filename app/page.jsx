"use client"
import { useMemo, useState } from 'react'
import { formatINR } from '../lib/invoiceUtils'

const defaultValues = {
  clientDetails: '',
  through: '',
  invoiceNo: '',
  date: new Date().toISOString().slice(0, 10),
  gstNo: 'POULTRY USE ONLY',
  lrNo: '',
  hsnCode: '',
  particulars: 'MAIZE',
  grossWeight: '18440',
  rate: '25.50',
  brokerage: '',
}

export default function Page() {
  const [values, setValues] = useState(defaultValues)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [sendStatus, setSendStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const invoiceData = useMemo(() => {
    const grossNum = parseFloat(values.grossWeight) || 0
    const rateNum = parseFloat(values.rate) || 0
    const brokerageNum = values.brokerage === '' ? 0.05 : parseFloat(values.brokerage) || 0
    const deduction = Math.ceil(grossNum * 0.01)
    const adjustedWeight = Math.max(0, grossNum - deduction)
    const adjustedRate = rateNum + brokerageNum
    const amount = adjustedWeight * adjustedRate
    const bags = Math.round(adjustedWeight / 60)

    return {
      ...values,
      deduction,
      adjustedWeight,
      adjustedRate,
      amount,
      bags,
    }
  }, [values])

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSendInvoice = async () => {
    if (!recipientEmail) {
      setSendStatus('Enter an email recipient before sending.')
      return
    }

    setSending(true)
    setSendStatus('Sending invoice...')

    try {
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceData, recipientEmail }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Email send failed')

      setSendStatus('Invoice emailed successfully.')
    } catch (error) {
      setSendStatus(`Error: ${error.message}`)
    } finally {
      setSending(false)
    }
  }

  const handleDownloadInvoice = async () => {
    setDownloading(true)
    try {
      const response = await fetch('/api/download-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceData }),
      })
      if (!response.ok) {
        throw new Error('Failed to generate PDF invoice')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${invoiceData.invoiceNo || 'vibhava'}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert(error.message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Vibhava Enterprises Invoice Generator</h2>
            <p className="text-sm text-gray-500">Fill the customer and invoice details below.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={downloading}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {downloading ? 'Generating PDF…' : 'Download Invoice PDF'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { label: 'Client Details (M/S)', field: 'clientDetails' },
            { label: 'Through', field: 'through' },
            { label: 'Invoice No', field: 'invoiceNo' },
            { label: 'Date', field: 'date', type: 'date' },
            { label: 'GST No', field: 'gstNo', placeholder: 'POULTRY USE ONLY' },
            { label: 'L.R. No', field: 'lrNo' },
            { label: 'HSN Code', field: 'hsnCode' },
            { label: 'Particulars', field: 'particulars', placeholder: 'MAIZE' },
          ].map(({ label, field, type = 'text', placeholder }) => (
            <label key={field} className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <input
                type={type}
                value={values[field]}
                placeholder={placeholder || ''}
                onChange={handleChange(field)}
                className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              />
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Gross Weight (Kg)</span>
            <input
              type="number"
              step="1"
              value={values.grossWeight}
              onChange={handleChange('grossWeight')}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Rate (per Kg)</span>
            <input
              type="number"
              step="0.01"
              value={values.rate}
              onChange={handleChange('rate')}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Brokerage (per Kg)</span>
            <input
              type="number"
              step="0.01"
              value={values.brokerage}
              placeholder="0.05"
              onChange={handleChange('brokerage')}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
            />
          </label>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Calculated Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Deduction</span>
              <span>{invoiceData.deduction} Kg</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Adjusted Weight</span>
              <span>{invoiceData.adjustedWeight} Kg</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Adjusted Rate</span>
              <span>{invoiceData.adjustedRate.toFixed(2)} / Kg</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Amount</span>
              <span>{formatINR(invoiceData.amount)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Bags</span>
              <span>{invoiceData.bags} bag(s)</span>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Invoice Preview Notes</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Gross Weight shows under Quintals</li>
              <li>Deduction is 1% rounded up</li>
              <li>Watermark appears on generated PDF</li>
              <li>Amount is converted to words in the PDF</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Email Invoice</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <label className="flex flex-col lg:col-span-2">
            <span className="text-sm font-medium text-gray-700">Recipient Email</span>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              placeholder="customer@example.com"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSendInvoice}
              disabled={sending}
              className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {sending ? 'Sending…' : 'Send Invoice by Email'}
            </button>
          </div>
        </div>
        {sendStatus ? <p className="mt-3 text-sm text-gray-700">{sendStatus}</p> : null}
      </div>
    </div>
  )
}
