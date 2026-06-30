"use client"
import { useState } from 'react'

function formatINR(value){
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value)
}

export default function Page(){
  const [gross, setGross] = useState('18440')
  const [rate, setRate] = useState('25.5')
  const [brokerage, setBrokerage] = useState('')

  const grossNum = parseFloat(gross) || 0
  const rateNum = parseFloat(rate) || 0
  const brokerageNum = brokerage === '' ? 0.05 : (parseFloat(brokerage) || 0)

  const deduction = Math.ceil(grossNum * 0.01)
  const adjustedWeight = Math.max(0, grossNum - deduction)
  const adjustedRate = rateNum + brokerageNum
  const totalAmount = adjustedWeight * adjustedRate
  const bags = Math.round(adjustedWeight / 60)

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Invoice Calculator</h2>
        <p className="text-sm text-gray-500 mb-4">Products: Maize, Broken Rice, Poultry Ingredients</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Gross Weight (Kg)</span>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={gross}
              onChange={e=>setGross(e.target.value)}
              />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Rate (per Kg)</span>
            <input
              type="number"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={rate}
              onChange={e=>setRate(e.target.value)}
              />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Brokerage (per Kg) — default Rs 5/quintal</span>
            <input
              type="number"
              step="0.01"
              placeholder="0.05"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={brokerage}
              onChange={e=>setBrokerage(e.target.value)}
              />
          </label>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Calculated Results</h3>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Deduction (1% rounded up)</span>
            <span className="font-medium">{deduction} Kg</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Adjusted Weight</span>
            <span className="font-medium">{adjustedWeight} Kg</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Adjusted Rate</span>
            <span className="font-medium">{adjustedRate.toFixed(2)} / Kg</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="font-medium">{formatINR(totalAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Number of Bags (60 Kg)</span>
            <span className="font-medium">{bags} bag(s)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
