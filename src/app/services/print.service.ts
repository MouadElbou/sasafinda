import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  generateBill(order: any, allOrders: any[], customer: any) {
    const formattedDate = new Date(Number(order.date)).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const generateInvoiceNumber = (date: number, orderId: string, orders: any[]) => {
      const year = new Date(Number(date)).getFullYear();
      const yearOrders = orders
        .filter(order => new Date(Number(order.date)).getFullYear() === year)
        .sort((a, b) => Number(a.date) - Number(b.date));
      const orderIndex = yearOrders.findIndex(order => order.id === orderId);
      const invoiceNumber = orderIndex + 1;
      return `${String(invoiceNumber).padStart(3, '0')}/${year}`;
    };

    const data = `
      <div style="margin: 0 auto; width: 210mm;">
        <div style="width: 210mm; min-height: 297mm; padding: 20mm; position: relative;">
          <div class="invoice" style="padding: 20px; font-family: Arial; height: 100%;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="assets/logo.png" style="width: 150px;">
              <h1 style="color: #FFC107; margin: 10px 0;">INVOICE</h1>
            </div>
           
       <div style="display: flex; justify-content: space-between; margin: 30px 0; font-family: Arial;">
  <div style="line-height: 1.8;">
    <strong style="font-size: 15px;">Client:</strong> 
    <span style="margin-left: 10px;">${order.companyName ? order.companyName : `${order.firstName} ${order.lastName}`}</span><br>
    <strong style="font-size: 15px;">${order.companyName ? 'ICE' : 'CIN'}:</strong>
    <span style="margin-left: 10px;">${order.companyName ? (customer.ice || '-') : (customer.cin || '-')}</span>
  </div>
  
  <div style="text-align: right; line-height: 1.8;">
    <strong style="font-size: 15px;">Date:</strong>
    <span style="margin-left: 10px;">${formattedDate}</span><br>
    <strong style="font-size: 15px;">Invoice:</strong>
    <span style="margin-left: 10px;">${generateInvoiceNumber(order.date, order.id, allOrders)}</span>
  </div>
</div>


        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; min-height: 500px;">
    <tr style="background: #FFC107;">
      <th style="padding: 10px; border: 1px solid #ddd;">Item Name</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Unit Price</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Amount</th>
    </tr>
    ${order.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.price} MAD</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity * item.price} MAD</td>
      </tr>
    `).join('')}
    ${generateEmptyRows(order.items.length)}
  </table>
    <table style="width: 45%; border-collapse: collapse; margin-left: 55%; margin-top: -1px; border: 1px solid #ddd;">
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right; width: 22.5%;">Total HT:</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right; width: 22.5%;">${order.total} MAD</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">TVA (20%):</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${(order.total * 0.2).toFixed(2)} MAD</td>
      </tr>
      <tr style="background-color: #f8f9fa;">
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>Total TTC:</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>${(order.total * 1.2).toFixed(2)} MAD</strong></td>
      </tr>
    </table>

    <div style="margin-top: 30px; text-align: left;">
      <p style="font-family: Arial; margin: 0; font-size: 14px;">
        <strong>Arrêtée la présente facture à la somme de:</strong>
        <span style="font-style: italic; margin-left: 10px; color: #333;">${convertNumberToFrenchWords(order.total * 1.2)} dirhams</span>
      </p>
    </div>

    <hr style="margin: 30px 0; border-top: 1px solid #666;">

    <div style="text-align: center; font-family: Arial;">
      <p style="margin: 0; color: #333; font-size: 13px; line-height: 1.6;">
        Imm El Harti Angle Bd Allal Ben Abdellah Et Bd Youssef Ben Tachfine Oujda<br>
        Tel/Fax: 05.36.70.17.83 | E-mail: satsafindaartl@gmail.com<br>
        Patente: 10700835 | RC: 37439 | I.F: 50259167 | ICE: 002808820000049
      </p>
    </div>        </div>
      </div>    `;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow?.document.write(data);
    printWindow?.document.close();
    printWindow?.print();
  }
  generateAllBills(orders: any[]) {
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const allOrdersHtml = `
      <div style="padding: 20px; font-family: Arial;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="assets/logo.png" style="width: 150px;">
          <h1 style="color: #FFC107; margin: 10px 0;">CONSOLIDATED ORDERS REPORT</h1>
          <p>Date: ${formattedDate}</p>
        </div>
      
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #FFC107;">
            <th style="padding: 10px; text-align: left;">Date</th>
            <th style="padding: 10px; text-align: left;">Customer</th>
            <th style="padding: 10px; text-align: left;">Items</th>
            <th style="padding: 10px; text-align: right;">Total</th>
            <th style="padding: 10px; text-align: center;">Status</th>
          </tr>
          ${orders.map(order => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${new Date(Number(order.date)).toLocaleDateString()}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${order.firstName} ${order.lastName || order.companyName}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${order.items.length}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                ${order.total} MAD
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
                ${order.status}
              </td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="3" style="text-align: right; padding: 10px;"><strong>Total Revenue:</strong></td>
            <td style="text-align: right; padding: 10px;"><strong>
              ${orders.reduce((sum, order) => sum + order.total, 0)} MAD
            </strong></td>
            <td></td>
          </tr>
        </table>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(allOrdersHtml);
    printWindow?.document.close();
    printWindow?.print();
  }

  generatePurchaseInvoice(purchase: any, allPurchases: any[]) {
    const formattedDate = new Date(Number(purchase.date)).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const generateInvoiceNumber = (date: number, purchaseId: string, purchases: any[]) => {
      const year = new Date(Number(date)).getFullYear();
      const yearPurchases = purchases
        .filter(p => new Date(Number(p.date)).getFullYear() === year)
        .sort((a, b) => Number(a.date) - Number(b.date));
      const purchaseIndex = yearPurchases.findIndex(p => p.id === purchaseId);
      const invoiceNumber = purchaseIndex + 1;
      return `${String(invoiceNumber).padStart(3, '0')}/${year}`;
    };

    const data = `
      <div style="margin: 0 auto; width: 210mm;">
        <div style="width: 210mm; min-height: 297mm; padding: 20mm; position: relative;">
          <div class="invoice" style="padding: 20px; font-family: Arial; height: 100%;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="assets/logo.png" style="width: 150px;">
              <h1 style="color: #FFC107; margin: 10px 0;">PURCHASE INVOICE</h1>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin: 30px 0; font-family: Arial;">
              <div style="line-height: 1.8;">
                <strong style="font-size: 15px;">Description:</strong>
                <span style="margin-left: 10px;">${purchase.description}</span><br>
                <strong style="font-size: 15px;">Status:</strong>
                <span style="margin-left: 10px;">${purchase.status}</span>
              </div>
              
              <div style="text-align: right; line-height: 1.8;">
                <strong style="font-size: 15px;">Date:</strong>
                <span style="margin-left: 10px;">${formattedDate}</span><br>
                <strong style="font-size: 15px;">Invoice:</strong>
                <span style="margin-left: 10px;">${generateInvoiceNumber(purchase.date, purchase.id, allPurchases)}</span>
              </div>
            </div>
  
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; min-height: 500px;">
              <tr style="background: #FFC107;">
                <th style="padding: 10px; border: 1px solid #ddd;">Item Name</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Unit Price</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Amount</th>
              </tr>
              ${purchase.items.map((item: any) => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.name}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.price} MAD</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity * item.price} MAD</td>
                </tr>
              `).join('')}
              ${generateEmptyRows(purchase.items.length)}
            </table>
  
            <table style="width: 45%; border-collapse: collapse; margin-left: 55%; margin-top: -1px; border: 1px solid #ddd;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; width: 22.5%;">Total HT:</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; width: 22.5%;">${purchase.total} MAD</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">TVA (20%):</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${(purchase.total * 0.2).toFixed(2)} MAD</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>Total TTC:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>${(purchase.total * 1.2).toFixed(2)} MAD</strong></td>
              </tr>
            </table>
  
            <div style="margin-top: 30px; text-align: left;">
              <p style="font-family: Arial; margin: 0; font-size: 14px;">
                <strong>Arrêtée la présente facture à la somme de:</strong>
                <span style="font-style: italic; margin-left: 10px; color: #333;">${convertNumberToFrenchWords(purchase.total * 1.2)} dirhams</span>
              </p>
            </div>
  
            <hr style="margin: 30px 0; border-top: 1px solid #666;">
  
            <div style="text-align: center; font-family: Arial;">
              <p style="margin: 0; color: #333; font-size: 13px; line-height: 1.6;">
                Imm El Harti Angle Bd Allal Ben Abdellah Et Bd Youssef Ben Tachfine Oujda<br>
                Tel/Fax: 05.36.70.17.83 | E-mail: satsafindaartl@gmail.com<br>
                Patente: 10700835 | RC: 37439 | I.F: 50259167 | ICE: 002808820000049
              </p>
            </div>
          </div>
        </div>
      </div>`;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow?.document.write(data);
    printWindow?.document.close();
    printWindow?.print();
  }
  generateAllPurchaseInvoices(purchases: any[]) {
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const data = `
      <div style="margin: 0 auto; width: 210mm;">
        <div style="width: 210mm; min-height: 297mm; padding: 20mm; position: relative;">
          <div class="invoice" style="padding: 20px; font-family: Arial; height: 100%;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="assets/logo.png" style="width: 150px;">
              <h1 style="color: #FFC107; margin: 10px 0;">PURCHASES REPORT</h1>
            </div>
  
            <div style="display: flex; justify-content: space-between; margin: 30px 0; font-family: Arial;">
              <div style="line-height: 1.8;">
                <strong style="font-size: 15px;">Report Date:</strong>
                <span style="margin-left: 10px;">${formattedDate}</span>
              </div>
            </div>
  
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <tr style="background: #FFC107;">
                <th style="padding: 10px; border: 1px solid #ddd;">Date</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Description</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Items</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
              </tr>
              ${purchases.map(purchase => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    ${new Date(Number(purchase.date)).toLocaleDateString()}
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    ${purchase.description}
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    ${purchase.items.length}
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    ${purchase.total} MAD
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                    ${purchase.status}
                  </td>
                </tr>
              `).join('')}
            </table>
  
            <table style="width: 45%; border-collapse: collapse; margin-left: 55%; margin-top: -1px; border: 1px solid #ddd;">
           <tr style="background-color: #f8f9fa;">
    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>Total:</strong></td>
    <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">
      <strong>${purchases.reduce((sum, purchase) => sum + purchase.total, 0)} MAD</strong>
    </td>
  </tr>
</table>

  
            <hr style="margin: 30px 0; border-top: 1px solid #666;">
  
            <div style="text-align: center; font-family: Arial;">
              <p style="margin: 0; color: #333; font-size: 13px; line-height: 1.6;">
                Imm El Harti Angle Bd Allal Ben Abdellah Et Bd Youssef Ben Tachfine Oujda<br>
                Tel/Fax: 05.36.70.17.83 | E-mail: satsafindaartl@gmail.com<br>
                Patente: 10700835 | RC: 37439 | I.F: 50259167 | ICE: 002808820000049
              </p>
            </div>
          </div>
        </div>
      </div>`;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow?.document.write(data);
    printWindow?.document.close();
    printWindow?.print();
  }

  generateCashDeskReport(balance: number, transactions: any[]) {
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const data = `
      <div class="invoice" style="padding: 20px; font-family: Arial;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="assets/logo.png" style="width: 150px;">
          <h1 style="color: #FFC107; margin: 10px 0;">CASH DESK REPORT</h1>
          <p>Date: ${formattedDate}</p>
        </div>

        <div style="margin: 20px 0; text-align: center;">
          <h2 style="color: #333;">Current Balance: ${balance.toFixed(2)} MAD</h2>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #FFC107;">
            <th style="padding: 10px; text-align: left;">Date</th>
            <th style="padding: 10px; text-align: left;">Type</th>
            <th style="padding: 10px; text-align: left;">Description</th>
            <th style="padding: 10px; text-align: right;">Amount</th>
          </tr>
          ${transactions.map(t => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${new Date(t.transaction_date).toLocaleDateString()}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: ${t.type === 'income' ? '#4CAF50' : '#f44336'};">
                ${t.type.toUpperCase()}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                ${t.description}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                ${t.amount.toFixed(2)} MAD
              </td>
            </tr>
          `).join('')}
        </table>

        <div style="margin-top: 30px; text-align: right;">
          <p><strong>Total Income:</strong> ${this.calculateTransactionsTotal(transactions, 'income').toFixed(2)} MAD</p>
          <p><strong>Total Expenses:</strong> ${this.calculateTransactionsTotal(transactions, 'expense').toFixed(2)} MAD</p>
          <p style="color: #FFC107; font-size: 18px; margin-top: 20px;">
            <strong>Net Balance: ${balance.toFixed(2)} MAD</strong>
          </p>
        </div>

        <div style="margin-top: 40px; text-align: center; color: #666;">
          <p>SASAFINDA - Your Trusted Partner</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(data);
    printWindow?.document.close();
    printWindow?.print();
  }
  private calculateTransactionsTotal(transactions: any[], type: 'income' | 'expense'): number {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  }

}


function generateEmptyRows(itemCount: number) {
  const minRows = 15;
  if (itemCount >= minRows) return '';

  return Array(minRows - itemCount).fill('').map(() => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; height: 30px;"> </td>
      <td style="padding: 10px; border: 1px solid #ddd;"> </td>
      <td style="padding: 10px; border: 1px solid #ddd;"> </td>
      <td style="padding: 10px; border: 1px solid #ddd;"> </td>
    </tr>
  `).join('');
}

function convertNumberToFrenchWords(number: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';

    let words = '';

    // Handle hundreds
    if (n >= 100) {
      if (Math.floor(n / 100) === 1) {
        words += 'cent ';
      } else {
        words += units[Math.floor(n / 100)] + ' cent ';
      }
      n = n % 100;
    }

    // Handle tens and units
    if (n >= 10) {
      if (n < 20) {
        words += teens[n - 10];
        return words.trim();
      } else {
        const ten = Math.floor(n / 10);
        const unit = n % 10;

        if (ten === 7 || ten === 9) {
          words += tens[ten - 1] + '-';
          words += teens[unit];
        } else {
          words += tens[ten];
          if (unit > 0) {
            words += '-' + units[unit];
          }
        }
      }
    } else if (n > 0) {
      words += units[n];
    }

    return words.trim();
  };

  const wholePart = Math.floor(number);
  let result = convertLessThanThousand(wholePart);

  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);

}

const invoiceCounter = new Map<string, string>();

function generateInvoiceNumber(date: number, orderId: string, allOrders: any[]) {
  const year = new Date(Number(date)).getFullYear();

  // Sort orders by date for the current year
  const yearOrders = allOrders
    .filter(order => new Date(Number(order.date)).getFullYear() === year)
    .sort((a, b) => Number(a.date) - Number(b.date));

  // Find position of current order in sorted list
  const orderIndex = yearOrders.findIndex(order => order.id === orderId);

  // Generate invoice number based on position
  const invoiceNumber = `${String(orderIndex + 1).padStart(3, '0')}/${year}`;

  return invoiceNumber;
}