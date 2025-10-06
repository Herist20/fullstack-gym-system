import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ea580c',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 10,
    color: '#666',
    lineHeight: 1.4,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    flex: 1,
    color: '#666',
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    padding: 10,
  },
  tableCol1: {
    flex: 2,
  },
  tableCol2: {
    flex: 1,
    textAlign: 'right',
  },
  tableCol3: {
    flex: 1,
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1 solid #e5e7eb',
    fontSize: 9,
    color: '#999',
    textAlign: 'center',
  },
  notes: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fef3c7',
    borderRadius: 5,
    fontSize: 10,
  },
  notesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
}

export const InvoiceDocument = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>GYM SYSTEM</Text>
        <Text style={styles.companyInfo}>
          Jl. Fitness No. 123{'\n'}
          Jakarta Selatan, 12345{'\n'}
          Phone: (021) 1234-5678{'\n'}
          Email: info@gymsystem.com
        </Text>
      </View>

      {/* Invoice Title & Info */}
      <Text style={styles.invoiceTitle}>INVOICE</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice Number:</Text>
          <Text style={styles.value}>{data.invoiceNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice Date:</Text>
          <Text style={styles.value}>{data.invoiceDate}</Text>
        </View>
        {data.dueDate && (
          <View style={styles.row}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>{data.dueDate}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{data.status.toUpperCase()}</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Bill To:</Text>
        <Text style={{ marginBottom: 3 }}>{data.customerName}</Text>
        <Text style={{ marginBottom: 3, color: '#666' }}>{data.customerEmail}</Text>
        {data.customerPhone && (
          <Text style={{ color: '#666' }}>{data.customerPhone}</Text>
        )}
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCol1}>Item</Text>
          <Text style={styles.tableCol2}>Quantity</Text>
          <Text style={styles.tableCol3}>Amount</Text>
        </View>

        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCol1}>{item.name}</Text>
            <Text style={styles.tableCol2}>{item.quantity}</Text>
            <Text style={styles.tableCol3}>
              Rp {item.price.toLocaleString('id-ID')}
            </Text>
          </View>
        ))}
      </View>

      {/* Total Section */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text>Subtotal:</Text>
          <Text>Rp {data.subtotal.toLocaleString('id-ID')}</Text>
        </View>

        {data.tax && data.tax > 0 && (
          <View style={styles.totalRow}>
            <Text>Tax:</Text>
            <Text>Rp {data.tax.toLocaleString('id-ID')}</Text>
          </View>
        )}

        {data.discount && data.discount > 0 && (
          <View style={styles.totalRow}>
            <Text>Discount:</Text>
            <Text>- Rp {data.discount.toLocaleString('id-ID')}</Text>
          </View>
        )}

        <View style={[styles.totalRow, { borderTop: '1 solid #000', paddingTop: 5 }]}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalAmount}>
            Rp {data.total.toLocaleString('id-ID')}
          </Text>
        </View>

        {data.paymentMethod && (
          <View style={[styles.totalRow, { marginTop: 10 }]}>
            <Text>Payment Method:</Text>
            <Text>{data.paymentMethod}</Text>
          </View>
        )}
      </View>

      {/* Notes */}
      {data.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text>{data.notes}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
        <Text style={{ marginTop: 5 }}>
          This is a computer-generated invoice. No signature required.
        </Text>
      </View>
    </Page>
  </Document>
);

/**
 * Generate invoice PDF as buffer (for server-side)
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const ReactPDF = await import('@react-pdf/renderer');
  const buffer = await ReactPDF.renderToBuffer(<InvoiceDocument data={data} />);
  return buffer as Buffer;
}

/**
 * Generate invoice PDF as blob (for client-side download)
 */
export async function generateInvoicePDFBlob(data: InvoiceData): Promise<Blob> {
  const ReactPDF = await import('@react-pdf/renderer');
  const blob = await ReactPDF.pdf(<InvoiceDocument data={data} />).toBlob();
  return blob;
}

/**
 * Download invoice PDF
 */
export async function downloadInvoicePDF(data: InvoiceData, filename?: string) {
  const blob = await generateInvoicePDFBlob(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `invoice-${data.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
