import type { Deal } from '../types';

export const pdfExport = {
  /**
   * Export invoice as PDF (using browser print)
   */
  async exportInvoicePDF(deal: Deal): Promise<void> {
    const invoiceHtml = this.generateInvoiceHTML(deal);
    
    // Create a new window with the invoice
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    
    // Wait for content to load
    printWindow.onload = () => {
      printWindow.print();
    };
  },

  /**
   * Download invoice as HTML file
   */
  downloadInvoiceHTML(deal: Deal): void {
    const invoiceHtml = this.generateInvoiceHTML(deal);
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${deal.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  generateInvoiceHTML(deal: Deal): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice ${deal.id}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px; 
              color: #333; 
              max-width: 800px;
              margin: 0 auto;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 3px solid #166534; 
              padding-bottom: 20px; 
            }
            .title { 
              font-size: 32px; 
              font-weight: bold; 
              color: #166534; 
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 14px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .meta { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 30px; 
              font-size: 14px; 
            }
            .box { 
              background: #f0fdf4; 
              border: 2px solid #bbf7d0; 
              padding: 20px; 
              border-radius: 12px; 
              margin-bottom: 30px; 
            }
            .box-title {
              font-weight: bold;
              color: #166534;
              margin-bottom: 10px;
              font-size: 16px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0;
            }
            th, td { 
              padding: 15px; 
              text-align: left; 
              border-bottom: 1px solid #ddd; 
            }
            th { 
              background: #f9fafb; 
              font-weight: bold; 
              color: #166534;
            }
            .total { 
              font-size: 24px; 
              font-weight: bold; 
              text-align: right; 
              margin-top: 30px; 
              color: #166534; 
              padding: 20px;
              background: #f0fdf4;
              border-radius: 12px;
            }
            .qr { 
              text-align: center; 
              margin-top: 50px; 
            }
            .qr img { 
              width: 150px; 
              height: 150px; 
              border: 2px solid #ddd;
              padding: 10px;
              border-radius: 8px;
            }
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              font-size: 11px; 
              color: #888; 
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .status-badge {
              display: inline-block;
              padding: 5px 15px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-completed {
              background: #dcfce7;
              color: #166534;
            }
            .print-btn {
              background: #166534;
              color: white;
              border: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              margin: 20px auto;
              display: block;
            }
            .print-btn:hover {
              background: #14532d;
            }
          </style>
        </head>
        <body>
          <button class="print-btn no-print" onclick="window.print()">🖨️ Print Invoice</button>
          
          <div class="header">
            <div class="title">🌾 MANDI MITRA</div>
            <div class="subtitle">Agricultural Trade Invoice</div>
          </div>
          
          <div class="meta">
            <div>
              <strong>Invoice #:</strong> ${deal.id}<br>
              <strong>Date:</strong> ${new Date(deal.timestamp).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}<br>
              <strong>Time:</strong> ${new Date(deal.timestamp).toLocaleTimeString('en-IN')}
            </div>
            <div style="text-align: right;">
              <span class="status-badge status-${deal.status}">
                ${deal.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div class="box">
            <div class="box-title">📤 Seller Information</div>
            <strong>Seller ID:</strong> ${deal.sellerId}<br>
            <strong>Role:</strong> Farmer/Producer
          </div>

          <div class="box">
            <div class="box-title">📥 Buyer Information</div>
            <strong>Buyer ID:</strong> ${deal.buyerId}<br>
            <strong>Role:</strong> Trader/Buyer
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Quantity</th>
                <th>Rate (₹)</th>
                <th style="text-align: right;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${deal.produceName || 'Agricultural Produce'}</strong><br>
                  <small style="color: #666;">Listing #${deal.listingId}</small>
                </td>
                <td>${deal.finalQuantity} ${deal.unit || 'units'}</td>
                <td>₹${deal.finalPrice.toLocaleString('en-IN')}</td>
                <td style="text-align: right;">₹${deal.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            TOTAL AMOUNT: ₹${deal.totalAmount.toLocaleString('en-IN')}
          </div>

          <div class="qr">
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`MANDI-${deal.id}`)}" alt="Verification QR Code" />
             <p style="font-size: 13px; color: #666; margin-top: 15px;">
               Scan to verify deal authenticity
             </p>
          </div>

          <div class="footer">
            <strong>Mandi Mitra Platform</strong><br>
            Connecting Farmers and Buyers Across India<br>
            This is a computer-generated invoice and does not require a signature.<br>
            <br>
            Generated on: ${new Date().toLocaleString('en-IN')}<br>
            For support: support@mandimitra.in
          </div>
        </body>
      </html>
    `;
  }
};
