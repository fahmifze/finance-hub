import pool from '../models/db';

async function migrate() {
  console.log('Running database migration for Finance Hub tables...\n');

  try {
    // Create saved_articles table
    console.log('Creating saved_articles table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS saved_articles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        article_uuid VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        url VARCHAR(2000) NOT NULL,
        image_url VARCHAR(2000),
        source VARCHAR(255),
        published_at DATETIME NOT NULL,
        categories JSON,
        tickers JSON,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        UNIQUE KEY unique_article_per_user (user_id, article_uuid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ saved_articles table created');

    // Create watchlist table
    console.log('Creating watchlist table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        name VARCHAR(255) NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        UNIQUE KEY unique_symbol_per_user (user_id, symbol)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ watchlist table created');

    // Create portfolio_holdings table
    console.log('Creating portfolio_holdings table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS portfolio_holdings (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        name VARCHAR(255) NOT NULL,
        quantity DECIMAL(15, 6) NOT NULL,
        average_cost DECIMAL(15, 4) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        UNIQUE KEY unique_holding_per_user (user_id, symbol)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ portfolio_holdings table created');

    // Create portfolio_transactions table
    console.log('Creating portfolio_transactions table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS portfolio_transactions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        holding_id INT UNSIGNED NOT NULL,
        type ENUM('buy', 'sell') NOT NULL,
        quantity DECIMAL(15, 6) NOT NULL,
        price DECIMAL(15, 4) NOT NULL,
        transaction_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (holding_id) REFERENCES portfolio_holdings(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_holding_id (holding_id),
        INDEX idx_transaction_date (transaction_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ portfolio_transactions table created');

    // Create price_alerts table
    console.log('Creating price_alerts table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS price_alerts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        name VARCHAR(255) NOT NULL,
        condition_type ENUM('above', 'below') NOT NULL,
        target_price DECIMAL(15, 4) NOT NULL,
        is_triggered BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        triggered_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_symbol (symbol),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ price_alerts table created');

    // Create crypto_watchlist table
    console.log('Creating crypto_watchlist table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS crypto_watchlist (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        coin_uuid VARCHAR(50) NOT NULL,
        symbol VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        UNIQUE KEY unique_coin_per_user (user_id, coin_uuid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ crypto_watchlist table created');

    // Create crypto_holdings table
    console.log('Creating crypto_holdings table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS crypto_holdings (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        coin_uuid VARCHAR(50) NOT NULL,
        symbol VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        quantity DECIMAL(20, 8) NOT NULL,
        average_cost DECIMAL(20, 8) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        UNIQUE KEY unique_crypto_per_user (user_id, coin_uuid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ crypto_holdings table created');

    // Create crypto_alerts table
    console.log('Creating crypto_alerts table...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS crypto_alerts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        coin_uuid VARCHAR(50) NOT NULL,
        symbol VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        condition_type ENUM('above', 'below') NOT NULL,
        target_price DECIMAL(20, 8) NOT NULL,
        is_triggered BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        triggered_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_coin_uuid (coin_uuid),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ crypto_alerts table created');

    console.log('\n========================================');
    console.log('Migration completed successfully!');
    console.log('========================================');
    console.log('Created tables:');
    console.log('  - saved_articles (News)');
    console.log('  - watchlist (Stocks)');
    console.log('  - portfolio_holdings (Stocks)');
    console.log('  - portfolio_transactions (Stocks)');
    console.log('  - price_alerts (Stocks)');
    console.log('  - crypto_watchlist (Crypto)');
    console.log('  - crypto_holdings (Crypto)');
    console.log('  - crypto_alerts (Crypto)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
