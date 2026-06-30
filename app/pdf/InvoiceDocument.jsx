import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { amountToWords, formatINR } from '../../lib/invoiceUtils'

Font.register({
  family: 'Helvetica',
})

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.3,
    color: '#222222',
  },
  header: {
    marginBottom: 10,
    textAlign: 'center',
  },
  redTitle: {
    color: '#b91c1c',
    fontSize: 22,
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 8,
    color: '#444444',
  },
  billHeader: {
    marginTop: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#222222',
    paddingVertical: 5,
    marginBottom: 3,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
  },
  cell: {
    paddingHorizontal: 4,
    fontSize: 9,
  },
  slNo: { width: '8%' },
  particulars: { width: '28%' },
  hsn: { width: '16%' },
  quant: { width: '16%' },
  rate: { width: '16%' },
  amount: { width: '16%' },
  sideRow: {
    flexDirection: 'row',
  },
  footer: {
    marginTop: 14,
    fontSize: 8,
    color: '#444',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '5%',
    transform: 'rotate(-30deg)',
    fontSize: 40,
    color: '#777777',
    opacity: 0.12,
    textAlign: 'center',
    width: '90%',
  },
  gridField: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  gridCell: {
    width: '50%',
    paddingVertical: 2,
  },
  tableCellText: {
    fontSize: 9,
  },
  bold: {
    fontWeight: 'bold',
  },
})

const InvoiceDocument = ({ data }) => {
  const grossNum = parseFloat(data.grossWeight) || 0
  const rateNum = parseFloat(data.rate) || 0
  const brokerageNum = data.brokerage === '' ? 0.05 : parseFloat(data.brokerage) || 0
  const deduction = Math.ceil(grossNum * 0.01)
  const adjustedWeight = Math.max(0, grossNum - deduction)
  const adjustedRate = rateNum + brokerageNum
  const amount = adjustedWeight * adjustedRate
  const bags = Math.round(adjustedWeight / 60)
  const amountWords = amountToWords(amount)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>POULTRY USE ONLY</Text>
        <View style={styles.header}>
          <Text style={styles.smallText}>Subject to R.R. District Jurisdiction</Text>
          <Text style={[styles.redTitle, { marginVertical: 2 }]}>VIBHAVA ENTERPRISES</Text>
          <Text style={styles.smallText}>Poultry Ingredients, Maize, Jawari, Bajra, Param</Text>
          <Text style={styles.smallText}>H.No. 11-13-980/1/A, Road No. 1/A, Green Hills Colony, Kothapet, Saroor Nagar, Hyderabad-35. (T.S)</Text>
          <Text style={[styles.smallText, { marginTop: 4 }]}>CASH / CREDIT BILL | (M).: 9848118771</Text>
        </View>

        <View style={styles.billHeader}>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <Text style={styles.label}>M/S:</Text>
              <Text>{data.clientDetails || ''}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>Invoice No:</Text>
              <Text>{data.invoiceNo || ''}</Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <Text style={styles.label}>Through:</Text>
              <Text>{data.through || ''}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>Date:</Text>
              <Text>{data.date || ''}</Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <Text style={styles.label}>GST No:</Text>
              <Text>{data.gstNo || ''}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.label}>L.R. No:</Text>
              <Text>{data.lrNo || ''}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.slNo, styles.bold]}>Sl.No</Text>
          <Text style={[styles.cell, styles.particulars, styles.bold]}>PARTICULARS</Text>
          <Text style={[styles.cell, styles.hsn, styles.bold]}>HSN CODE</Text>
          <Text style={[styles.cell, styles.quant, styles.bold]}>Quintals</Text>
          <Text style={[styles.cell, styles.rate, styles.bold]}>Rate</Text>
          <Text style={[styles.cell, styles.amount, styles.bold]}>Amount (Rs. Ps.)</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.cell, styles.slNo]}>1</Text>
          <View style={[styles.cell, styles.particulars]}>
            <Text>{data.particulars || ''}</Text>
            <Text style={styles.smallText}>BAG {bags}</Text>
          </View>
          <Text style={[styles.cell, styles.hsn]}>{data.hsnCode || ''}</Text>
          <View style={[styles.cell, styles.quant]}>
            <Text>{grossNum}</Text>
            <Text>- {deduction}</Text>
            <View style={{ borderBottomWidth: 1, borderColor: '#222', marginVertical: 2 }} />
            <Text style={styles.bold}>{adjustedWeight}</Text>
          </View>
          <Text style={[styles.cell, styles.rate]}>{adjustedRate.toFixed(2)}</Text>
          <Text style={[styles.cell, styles.amount]}>{formatINR(amount)}</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.bold}>Amount in words:</Text>
          <Text>{amountWords}</Text>
        </View>

        <View style={styles.footer}>
          <Text>Bank Details: VIBHAVA ENTERPRISES, KARUR VYSYA BANK, MOZAMJAHI MARKET Br., A/c. 1404283000000995, IFSC: KVBL0001404</Text>
          <Text style={{ marginTop: 6 }}>1. We are responsible for any loss of goods once it leaves our permises</Text>
          <Text>2. Interest will be charged 2% Per month from condition.date of Late Period</Text>
          <Text>3. Goods once sold will not be taken back or exchanged.</Text>
          <View style={styles.signatureRow}>
            <Text>Customer Signature</Text>
            <Text>For VIBHAVA ENTERPRISES</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default InvoiceDocument
