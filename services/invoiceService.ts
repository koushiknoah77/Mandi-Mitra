import { Deal } from "../types";

class InvoiceService {
  /**
   * Generates a PDF invoice for the deal and returns the URL.
   * In a real app, this would use a server-side library like PDFKit or a 3rd party API.
   */
  async generateInvoice(deal: Deal): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing

    // Create a rich HTML representation for the invoice
    const invoiceHtml = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #166534; padding-bottom: 10px; }
            .title { font-size: 24px; font-weight: bold; color: #166534; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
            .box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; color: #166534; }
            .qr { text-align: center; margin-top: 40px; }
            .qr img { width: 100px; height: 100px; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">MANDI LINK AI</div>
            <div>Agricultural Trade Invoice</div>
          </div>
          
          <div class="meta">
            <div>
              <strong>Invoice #:</strong> ${deal.id}<br>
              <strong>Date:</strong> ${new Date(deal.timestamp).toLocaleDateString()}
            </div>
            <div style="text-align: right;">
              <strong>Status:</strong> ${deal.status.toUpperCase()}
            </div>
          </div>

          <div class="box">
            <strong>Seller:</strong> ${deal.sellerId} (Farmer)<br>
            <strong>Buyer:</strong> ${deal.buyerId}
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd; text-align: left;">
              <th style="padding: 8px;">Item</th>
              <th style="padding: 8px;">Qty</th>
              <th style="padding: 8px;">Rate</th>
              <th style="padding: 8px; text-align: right;">Amount</th>
            </tr>
            <tr>
              <td style="padding: 8px;">Listing #${deal.listingId}</td>
              <td style="padding: 8px;">${deal.finalQuantity}</td>
              <td style="padding: 8px;">₹${deal.finalPrice}</td>
              <td style="padding: 8px; text-align: right;">₹${deal.totalAmount}</td>
            </tr>
          </table>

          <div class="total">
            TOTAL PAID: ₹${deal.totalAmount}
          </div>

          <div class="qr">
             <!-- Mock QR Code (using a static placeholder service or data URI) -->
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${deal.id}" alt="Verification QR" />
             <p style="font-size: 12px; color: #666;">Scan to verify deal authenticity</p>
          </div>

          <div class="footer">
            Generated securely by Mandi Mitra Platform.<br>
            This is a computer generated invoice and needs no signature.
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }
}

export const invoiceService = new InvoiceService();