import { Injectable } from '@angular/core';

interface ElectronWindow extends Window {
  require: (module: string) => any;
}

declare const window: ElectronWindow;

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private readonly ipcRenderer = window.require('electron').ipcRenderer;

  getPersonOrders() {
    return this.ipcRenderer.invoke('get-person-orders');
  }

  getCompanyOrders() {
    return this.ipcRenderer.invoke('get-company-orders');
  }

  createOrder(order: any) {
    return this.ipcRenderer.invoke('create-order', order);
  }

  updateOrder(order: any) {
    return this.ipcRenderer.invoke('update-order', order);
  }

  deleteOrder(orderId: number) {
    return this.ipcRenderer.invoke('delete-order', orderId);
  }

  searchOrders(searchTerm: string, customerType: string) {
    return this.ipcRenderer.invoke('search-orders', { searchTerm, customerType });
  }

  getCustomers() {
    return this.ipcRenderer.invoke('get-customers');
  }

  createCustomer(customer: any) {
    return this.ipcRenderer.invoke('create-customer', customer);
  }

  updateCustomer(customer: any) {
    return this.ipcRenderer.invoke('update-customer', customer);
  }

  deleteCustomer(customerId: number) {
    return this.ipcRenderer.invoke('delete-customer', customerId);
  }
  
  getCustomerById(customerId: string) {
    return this.ipcRenderer.invoke('get-customer-by-id', customerId);
  }  

  getDashboardStats() {
    return this.ipcRenderer.invoke('get-dashboard-stats');
  }

  getRevenueHistory() {
    return this.ipcRenderer.invoke('get-revenue-history');
  }

  async getOrders(): Promise<any[]> {
    return this.ipcRenderer.invoke('get-orders');
  }
  getPurchases() {
    return this.ipcRenderer.invoke('get-purchases');
  }  

    createPurchase(purchase: any) {
      return this.ipcRenderer.invoke('create-purchase', purchase);
    }

    updatePurchase(purchase: any) {
      return this.ipcRenderer.invoke('update-purchase', purchase);
    }

    deletePurchase(purchaseId: number) {
      return this.ipcRenderer.invoke('delete-purchase', purchaseId);
    }

  getCashDeskTransactions() {
    return this.ipcRenderer.invoke('get-cash-desk-transactions');
  }

  getCashDeskBalance() {
    return this.ipcRenderer.invoke('get-cash-desk-balance');
  }
  

  addCashDeskTransaction(transaction: {
    type: 'income' | 'expense',
    amount: number,
    description: string,
    referenceType: string,
    referenceId: number
  }) {
    return this.ipcRenderer.invoke('add-cash-desk-transaction', transaction);
  }
  
// Add to IpcService class:
exportDatabase() {
  return this.ipcRenderer.invoke('export-database');
}

importDatabase() {
  return this.ipcRenderer.invoke('import-database');
}
}





