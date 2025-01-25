const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');
const DB_VERSION = 1; 
const db = new sqlite3.Database("sasafinda.db");
const { dialog } = require('electron');

// Check and update schema version
function updateSchema() {
  db.get("SELECT version FROM db_version", (err, row) => {
    if (!row) {
      db.run("INSERT INTO db_version VALUES (?)", [DB_VERSION]);
    } else if (row.version < DB_VERSION) {
      // Run migration scripts based on version difference
      migrateDatabase(row.version, DB_VERSION);
    }
  });
}

ipcMain.handle('export-database', async () => {
  return new Promise((resolve, reject) => {
    dialog.showSaveDialog({
      title: 'Save Database Backup',
      defaultPath: 'sasafinda_backup.json',
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    }).then(({ filePath }) => {
      if (!filePath) {
        resolve(false);
        return;
      }

      db.serialize(() => {
        const backup = {
          customers: [],
          orders: [],
          purchases: [],
          cash_desk_transactions: []
        };

        db.all("SELECT * FROM customers", (err, rows) => {
          backup.customers = rows;
          db.all("SELECT * FROM orders", (err, rows) => {
            backup.orders = rows;
            db.all("SELECT * FROM purchases", (err, rows) => {
              backup.purchases = rows;
              db.all("SELECT * FROM cash_desk_transactions", (err, rows) => {
                backup.cash_desk_transactions = rows;
                fs.writeFileSync(filePath, JSON.stringify(backup));
                resolve(true);
              });
            });
          });
        });
      });
    });
  });
});

//import
ipcMain.handle('import-database', async () => {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({
      title: 'Import Database Backup',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
      properties: ['openFile']
    }).then(({ filePaths }) => {
      if (!filePaths || filePaths.length === 0) {
        resolve(false);
        return;
      }

      const backup = JSON.parse(fs.readFileSync(filePaths[0], 'utf8'));

      db.serialize(() => {
        // Clear existing data
        db.run("DELETE FROM customers");
        db.run("DELETE FROM orders");
        db.run("DELETE FROM purchases");
        db.run("DELETE FROM cash_desk_transactions");

        // Import customers
        backup.customers.forEach(customer => {
          db.run(`INSERT INTO customers (id, type, firstName, lastName, companyName, contactPerson, phone, email, address, taxNumber, cin) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [customer.id, customer.type, customer.firstName, customer.lastName, customer.companyName, 
             customer.contactPerson, customer.phone, customer.email, customer.address, customer.taxNumber, customer.cin]);
        });

        // Import orders
        backup.orders.forEach(order => {
          db.run(`INSERT INTO orders (id, customerId, date, status, total, description, payment_method, items) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [order.id, order.customerId, order.date, order.status, order.total, 
             order.description, order.payment_method, order.items]);
        });

        // Import purchases
        backup.purchases.forEach(purchase => {
          db.run(`INSERT INTO purchases (id, date, description, status, payment_method, total, items) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [purchase.id, purchase.date, purchase.description, purchase.status, 
             purchase.payment_method, purchase.total, purchase.items]);
        });

        // Import cash desk transactions
        backup.cash_desk_transactions.forEach(transaction => {
          db.run(`INSERT INTO cash_desk_transactions (id, transaction_date, type, amount, description, reference_type, reference_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [transaction.id, transaction.transaction_date, transaction.type, transaction.amount, 
             transaction.description, transaction.reference_type, transaction.reference_id]);
        });

        resolve(true);
      });
    }).catch(err => reject(err));
  });
});

// Initialize database tables
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS db_version (version INTEGER)");
      db.run("INSERT OR IGNORE INTO db_version VALUES (?)", [DB_VERSION]); 
  // Create unified customers table with CIN
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT CHECK(type IN ('person', 'company')),
    firstName TEXT,
    lastName TEXT,
    companyName TEXT,
    contactPerson TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    taxNumber TEXT,
    cin TEXT
  )`);

  // Create orders table with customer relationship
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER,
    date TEXT,
    status TEXT,
    total DECIMAL,
    description TEXT,
    payment_method TEXT CHECK(payment_method IN ('espéces', 'chéque', 'virement bancaire', 'letter de change', 'versement')),
    items TEXT,
    FOREIGN KEY(customerId) REFERENCES customers(id),
    UNIQUE(customerId, date, total)
  )`);

  // Create purchases table
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    description TEXT,
    status TEXT,
    payment_method TEXT CHECK(payment_method IN ('espéces', 'chéque', 'virement bancaire', 'letter de change', 'versement')),
    total DECIMAL,
    items TEXT
  )`);
  updateSchema();

  // Get Local Purchases
  ipcMain.handle("get-local-purchases", () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM purchases WHERE type = 'local'`, (err, rows) => {
        if (err) reject(err);
        rows.forEach((row) => {
          row.items = JSON.parse(row.items);
        });
        resolve(rows);
      });
    });
  });

  // Get Import Purchases
  ipcMain.handle("get-import-purchases", () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM purchases WHERE type = 'import'`, (err, rows) => {
        if (err) reject(err);
        rows.forEach((row) => {
          row.items = JSON.parse(row.items);
        });
        resolve(rows);
      });
    });
  });
});
ipcMain.handle("create-purchase", (event, purchase) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `INSERT INTO purchases (date, status, payment_method, total, items, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          purchase.date,
          purchase.status,
          purchase.paymentMethod,
          purchase.total,
          JSON.stringify(purchase.items),
          purchase.description,
        ],
        function (err) {
          if (err) reject(err);

          if (
            purchase.status === "completed" &&
            purchase.paymentMethod === "espéces"
          ) {
            db.run(
              `INSERT INTO cash_desk_transactions
                (transaction_date, type, amount, description, reference_type, reference_id)
                VALUES (?, ?, ?, ?, ?, ?)`,
              [
                purchase.date,
                "expense",
                purchase.total,
                purchase.description,
                "purchase",
                this.lastID,
              ]
            );
          }
          resolve({ id: this.lastID, ...purchase });
        }
      );
    });
  });
});

ipcMain.handle("update-purchase", (event, purchase) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(
        `SELECT id FROM cash_desk_transactions
         WHERE reference_type = 'purchase' AND reference_id = ?`,
        [purchase.id],
        (err, existingTransaction) => {
          if (err) reject(err);

          if (
            purchase.status === "completed" &&
            purchase.paymentMethod === "espéces"
          ) {
            if (!existingTransaction) {
              // Create new transaction
              db.run(
                `INSERT INTO cash_desk_transactions
                  (transaction_date, type, amount, description, reference_type, reference_id)
                  VALUES (?, ?, ?, ?, ?, ?)`,
                [
                  purchase.date,
                  "expense",
                  purchase.total,
                  `${purchase.description}`,
                  "purchase",
                  purchase.id,
                ]
              );
            } else {
              // Update existing transaction amount
              db.run(
                `UPDATE cash_desk_transactions
                 SET amount = ?, transaction_date = ?, description = ?
                 WHERE reference_type = 'purchase' AND reference_id = ?`,
                [
                  purchase.total,
                  purchase.date,
                  purchase.description,
                  purchase.id,
                ]
              );
            }
          } else if (
            (purchase.status !== "completed" ||
              purchase.paymentMethod !== "espéces") &&
            existingTransaction
          ) {
            db.run(
              `DELETE FROM cash_desk_transactions
               WHERE reference_type = 'purchase' AND reference_id = ?`,
              [purchase.id]
            );
          }

          db.run(
            `UPDATE purchases
             SET date = ?, status = ?, payment_method = ?, total = ?, items = ?, description = ?
             WHERE id = ?`,
            [
              purchase.date,
              purchase.status,
              purchase.paymentMethod,
              purchase.total,
              JSON.stringify(purchase.items),
              purchase.description,
              purchase.id,
            ],
            (err) => {
              if (err) reject(err);
              resolve(purchase);
            }
          );
        }
      );
    });
  });
});

// Delete Purchase
ipcMain.handle("delete-purchase", (event, purchaseId) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        "DELETE FROM cash_desk_transactions WHERE reference_type = 'purchase' AND reference_id = ?",
        [purchaseId]
      );
      db.run("DELETE FROM purchases WHERE id = ?", [purchaseId], (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  });
});

// Register IPC Handlers
ipcMain.handle("get-person-orders", () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        orders.*,
        customers.firstName,
        customers.lastName,
        customers.phone,
        customers.email
      FROM orders 
      JOIN customers ON orders.customerId = customers.id
      WHERE customers.type = 'person'
    `,
      (err, rows) => {
        if (err) reject(err);
        rows.forEach((row) => {
          row.items = JSON.parse(row.items);
          row.customerName = `${row.firstName} ${row.lastName}`;
        });
        resolve(rows);
      }
    );
  });
});

ipcMain.handle("get-company-orders", () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        orders.*,
        customers.companyName,
        customers.contactPerson,
        customers.phone,
        customers.email
      FROM orders 
      JOIN customers ON orders.customerId = customers.id
      WHERE customers.type = 'company'
    `,
      (err, rows) => {
        if (err) reject(err);
        rows.forEach((row) => {
          row.items = JSON.parse(row.items);
        });
        resolve(rows);
      }
    );
  });
});

ipcMain.handle("get-customers", () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM customers", (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
});

ipcMain.handle("delete-customer", (event, customerId) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM customers WHERE id = ?", [customerId], (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
});

ipcMain.handle("update-customer", (event, customer) => {
  return new Promise((resolve, reject) => {
    const {
      id,
      type,
      firstName,
      lastName,
      companyName,
      contactPerson,
      phone,
      email,
      address,
      taxNumber,
      cin,
    } = customer;

    db.run(
      `UPDATE customers SET 
         type = ?, firstName = ?, lastName = ?, companyName = ?,
         contactPerson = ?, phone = ?, email = ?, address = ?, 
         taxNumber = ?, cin = ?
        WHERE id = ?`,
      [
        type,
        firstName,
        lastName,
        companyName,
        contactPerson,
        phone,
        email,
        address,
        taxNumber,
        cin,
        id,
      ],
      (err) => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });
});

ipcMain.handle("create-customer", (event, customer) => {
  return new Promise((resolve, reject) => {
    const {
      type,
      firstName,
      lastName,
      companyName,
      contactPerson,
      phone,
      email,
      address,
      taxNumber,
      cin,
    } = customer;

    db.run(
      `
      INSERT INTO customers (
        type, firstName, lastName, companyName, contactPerson, 
        phone, email, address, taxNumber, cin
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        type,
        firstName,
        lastName,
        companyName,
        contactPerson,
        phone,
        email,
        address,
        taxNumber,
        cin,
      ],
      function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID, ...customer });
      }
    );
  });
});

ipcMain.handle("create-order", (event, order) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `INSERT INTO orders (customerId, date, status, total, description, payment_method, items)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          order.customerId,
          order.date,
          order.status,
          order.total,
          order.description,
          order.paymentMethod,
          JSON.stringify(order.items),
        ],
        function (err) {
          if (err) reject(err);

          if (
            order.status === "completed" &&
            order.paymentMethod === "espéces"
          ) {
            db.run(
              `INSERT INTO cash_desk_transactions
                (transaction_date, type, amount, description, reference_type, reference_id)
                VALUES (?, ?, ?, ?, ?, ?)`,
              [
                order.date,
                "income",
                order.total,
                order.description,
                "order",
                this.lastID,
              ]
            );
          }
          resolve({ id: this.lastID, ...order });
        }
      );
    });
  });
});

ipcMain.handle("update-order", (event, order) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(
        `SELECT id FROM cash_desk_transactions
         WHERE reference_type = 'order' AND reference_id = ?`,
        [order.id],
        (err, existingTransaction) => {
          if (err) reject(err);

          if (
            order.status === "completed" &&
            order.paymentMethod === "espéces"
          ) {
            if (!existingTransaction) {
              // Create new transaction if none exists
              db.run(
                `INSERT INTO cash_desk_transactions
                  (transaction_date, type, amount, description, reference_type, reference_id)
                  VALUES (?, ?, ?, ?, ?, ?)`,
                [
                  order.date,
                  "income",
                  order.total,
                  order.description,
                  "order",
                  result.lastID
                ]
              );
            } else {
              // Update existing transaction amount
              db.run(
                `UPDATE cash_desk_transactions 
                   SET amount = ?, transaction_date = ?, description = ?
   WHERE reference_type = 'order' AND reference_id = ?`,
                [order.total, order.date, order.description, order.id]
              );
            }
          } else if (
            (order.status !== "completed" ||
              order.paymentMethod !== "espéces") &&
            existingTransaction
          ) {
            // Delete transaction if order is no longer completed
            db.run(
              `DELETE FROM cash_desk_transactions
               WHERE reference_type = 'order' AND reference_id = ?`,
              [order.id]
            );
          }

          db.run(
            `UPDATE orders
             SET customerId = ?, date = ?, status = ?, total = ?, description = ?, payment_method = ?, items = ? 
     WHERE id = ?`,
            [
              order.customerId,
              order.date,
              order.status,
              order.total,
              order.description,
              order.paymentMethod,
              JSON.stringify(order.items),
              order.id,
            ],
            (err) => {
              if (err) reject(err);
              resolve(order);
            }
          );
        }
      );
    });
  });
});

ipcMain.handle("delete-order", (event, orderId) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        "DELETE FROM cash_desk_transactions WHERE reference_type = 'order' AND reference_id = ?",
        [orderId]
      );
      db.run("DELETE FROM orders WHERE id = ?", [orderId], (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  });
});

// Get Orders
ipcMain.handle("get-orders", () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT orders.*, customers.firstName, customers.lastName, customers.companyName
      FROM orders 
      JOIN customers ON orders.customerId = customers.id
      ORDER BY orders.date DESC
    `,
      (err, rows) => {
        if (err) reject(err);
        rows.forEach((row) => {
          row.items = JSON.parse(row.items);
        });
        resolve(rows);
      }
    );
  });
});

let mainWindow = null;
const indexPath = path.join(__dirname, "dist/sasafinda_management/browser/index.html");

function createWindow() {
  const isLogin = !mainWindow;
  const win = new BrowserWindow({
    transparent: true,
    width: isLogin ? 445 : 1200,
    height: isLogin ? 439 : 800,
    frame: !isLogin,
    icon: path.join(__dirname, 'src/assets/logo.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: "SASAFINDA",
    titleBarStyle: 'hidden',
    roundedCorners: true,
    hasShadow: true
  });

  win.loadFile(indexPath);
  
 // win.webContents.openDevTools();

  if (!isLogin) {
    mainWindow = win;
  }
}  ipcMain.on('login-success', () => {
    try {
      const { screen } = require('electron');
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width, height } = primaryDisplay.workAreaSize;
    
      const windowWidth = 1200;
      const windowHeight = 800;
      const x = Math.floor((width - windowWidth) / 2);
      const y = Math.floor((height - windowHeight) / 2);
    
      const currentWindow = BrowserWindow.getAllWindows()[0];
    
      mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: x,
        y: y,
        frame: false,
        icon: path.join(__dirname, 'src/assets/logo.png'),
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        title: "SASAFINDA"
      });

      const dashboardUrl = `file://${indexPath}?route=dashboard`;
      mainWindow.loadURL(dashboardUrl);
    
      mainWindow.webContents.on('did-finish-load', () => {
        currentWindow.destroy();
      });

   //   mainWindow.webContents.openDevTools();

    } catch (error) {
      console.log('Window transition error:', error);
    }
  });
  app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// Dashboard Stats Handler
ipcMain.handle("db:query", async (event, query) => {
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
});

// Get Dashboard Stats
ipcMain.handle("get-dashboard-stats", async () => {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split("T")[0];

    db.get(
      `
      SELECT 
        (SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) 
         FROM cash_desk_transactions) as todayRevenue,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as activeOrders,
        (SELECT COUNT(*) FROM customers) as totalCustomers
    `,
      [],
      (err, stats) => {
        if (err) reject(err);
        resolve(stats);
      }
    );
  });
});

// Get Revenue History
ipcMain.handle("get-revenue-history", async () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        COALESCE(strftime('%m', date), 'Current') as month,
        SUM(total) as revenue
      FROM orders
      WHERE status = 'completed'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `,
      [],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
});

// Get Purchases
ipcMain.handle("get-purchases", () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM purchases 
      ORDER BY date DESC
    `,
      (err, rows) => {
        if (err) reject(err);
        rows.forEach((row) => {
          row.items = JSON.parse(row.items);
        });
        resolve(rows);
      }
    );
  });
});

db.run(`CREATE TABLE IF NOT EXISTS cash_desk_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  type TEXT CHECK(type IN ('income', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Add IPC handlers for cash desk operations
ipcMain.handle("get-cash-desk-transactions", () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM cash_desk_transactions ORDER BY transaction_date DESC`,
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
});

ipcMain.handle("get-cash-desk-balance", () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance 
       FROM cash_desk_transactions`,
      (err, result) => {
        if (err) reject(err);
        resolve(result?.balance || 0);
      }
    );
  });
});

ipcMain.handle("add-cash-desk-transaction", (event, transaction) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO cash_desk_transactions 
       (type, amount, description, reference_type, reference_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        transaction.type,
        transaction.amount,
        transaction.description,
        transaction.referenceType,
        transaction.referenceId,
      ],
      function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID, ...transaction });
      }
    );
  });
});

ipcMain.handle("get-customer-by-id", (event, customerId) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM customers WHERE id = ?", [customerId], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
});

ipcMain.on('minimize-window', () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on('maximize-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) {
    win.unmaximize();
  } else {
    win?.maximize();
  }
});

ipcMain.on('close-window', () => {
  BrowserWindow.getFocusedWindow()?.close();
});
