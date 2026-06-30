export const numberToIndianWords = (num) => {
  if (num === 0) return 'Zero'

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ]

  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  const twoDigits = (n) => {
    if (n < 20) return ones[n]
    const tenPart = tens[Math.floor(n / 10)]
    const unitPart = ones[n % 10]
    return unitPart ? `${tenPart} ${unitPart}` : tenPart
  }

  const parts = []
  const crore = Math.floor(num / 10000000)
  if (crore) {
    parts.push(`${numberToIndianWords(crore)} Crore`)
    num %= 10000000
  }

  const lakh = Math.floor(num / 100000)
  if (lakh) {
    parts.push(`${numberToIndianWords(lakh)} Lakh`)
    num %= 100000
  }

  const thousand = Math.floor(num / 1000)
  if (thousand) {
    parts.push(`${numberToIndianWords(thousand)} Thousand`)
    num %= 1000
  }

  const hundred = Math.floor(num / 100)
  if (hundred) {
    parts.push(`${ones[hundred]} Hundred`)
    num %= 100
  }

  if (num) {
    if (parts.length && num < 100) {
      parts.push('and')
    }
    parts.push(twoDigits(num))
  }

  return parts.join(' ').trim()
}

export const amountToWords = (amount) => {
  const rupees = Math.floor(amount)
  const paise = Math.round((amount - rupees) * 100)
  const rupeeWords = numberToIndianWords(rupees)
  const paiseWords = paise ? numberToIndianWords(paise) : ''

  if (rupees === 0 && paise === 0) return 'Zero Rupees Only'

  let words = `Rupees ${rupeeWords}`
  if (paise) words += ` and Paise ${paiseWords}`
  return `${words} Only`
}

export const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)
}
