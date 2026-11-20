-- Database Schema for SpecSense – BestBuy Timing Hack

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  current_price REAL NOT NULL,
  rating REAL DEFAULT 4.5,
  processor TEXT,
  ram TEXT,
  storage TEXT,
  display TEXT,
  display_type TEXT,
  refresh_rate TEXT,
  battery TEXT,
  charging_speed TEXT,
  camera TEXT,
  front_camera TEXT,
  operating_system TEXT,
  benchmark_score INTEGER,
  weight TEXT,
  connectivity TEXT,
  refurbished_price REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS retailers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  badge_color TEXT
);

CREATE TABLE IF NOT EXISTS price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  retailer_id INTEGER NOT NULL,
  price REAL NOT NULL,
  recorded_at TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (retailer_id) REFERENCES retailers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_price_history_product_date ON price_history(product_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_price_history_retailer ON price_history(retailer_id);

CREATE TABLE IF NOT EXISTS price_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  target_price REAL NOT NULL,
  user_email TEXT DEFAULT 'shopper@specsense.io',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TEXT NOT NULL,
  triggered_at TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sales_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  period TEXT NOT NULL,
  discount_range TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Upcoming'
);
