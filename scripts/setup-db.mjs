#!/usr/bin/env node
/**
 * Initialize the MySQL database: create tables and the system user.
 * Usage: node scripts/setup-db.mjs
 * No mock/seed data is inserted.
 */
import mysql from 'mysql2/promise'
import { randomUUID } from 'node:crypto'

const pool = mysql.createPool({
  host: process.env.DB_HOST || '120.77.81.21',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'photo-gallery',
  password: process.env.DB_PASSWORD || '2WrsTYEACYmCtpX2',
  database: process.env.DB_NAME || 'photo-gallery',
  connectionLimit: 3,
  charset: 'utf8mb4',
})

try {
  await pool.query('SELECT 1')
  console.log('MySQL connected')
} catch (e) {
  console.error('Connection failed:', e.message)
  process.exit(1)
}

const tbls = [
  `CREATE TABLE IF NOT EXISTS users (id VARCHAR(36) PRIMARY KEY, role VARCHAR(20) NOT NULL DEFAULT 'admin', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS albums (id VARCHAR(36) PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, cover_url VARCHAR(1024), created_by VARCHAR(36) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (created_by) REFERENCES users(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS photos (id VARCHAR(36) PRIMARY KEY, original_url VARCHAR(1024) NOT NULL, thumbnail_url VARCHAR(1024) NOT NULL, webp_url VARCHAR(1024) NOT NULL, width INT, height INT, file_size INT NOT NULL, file_name VARCHAR(255) NOT NULL, mime_type VARCHAR(50) NOT NULL, hash VARCHAR(255) NOT NULL, taken_at DATETIME, latitude DOUBLE, longitude DOUBLE, location_name VARCHAR(255), camera_make VARCHAR(100), camera_model VARCHAR(100), is_video TINYINT(1) DEFAULT 0, video_url VARCHAR(1024), video_cover VARCHAR(1024), uploaded_by VARCHAR(36) NOT NULL, deleted_at DATETIME, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_taken (taken_at), INDEX idx_hash (hash), FOREIGN KEY (uploaded_by) REFERENCES users(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS album_photos (album_id VARCHAR(36) NOT NULL, photo_id VARCHAR(36) NOT NULL, added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (album_id, photo_id), FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE, FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS face_labels (id VARCHAR(36) PRIMARY KEY, name VARCHAR(100) NOT NULL, created_by VARCHAR(36) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY uq_name_user (name, created_by), FOREIGN KEY (created_by) REFERENCES users(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS detected_faces (id VARCHAR(36) PRIMARY KEY, photo_id VARCHAR(36) NOT NULL, face_label_id VARCHAR(36), x DOUBLE NOT NULL, y DOUBLE NOT NULL, width DOUBLE NOT NULL, height DOUBLE NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_photo (photo_id), INDEX idx_label (face_label_id), FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE, FOREIGN KEY (face_label_id) REFERENCES face_labels(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS comments (id VARCHAR(36) PRIMARY KEY, content TEXT NOT NULL, photo_id VARCHAR(36) NOT NULL, user_id VARCHAR(36) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, deleted_at DATETIME, INDEX idx_photo (photo_id), FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS likes (id VARCHAR(36) PRIMARY KEY, photo_id VARCHAR(36) NOT NULL, user_id VARCHAR(36) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY uq_like (photo_id, user_id), FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS notifications (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36) NOT NULL, type VARCHAR(50) NOT NULL, title VARCHAR(255) NOT NULL, body TEXT NOT NULL, link VARCHAR(512), \`read\` TINYINT(1) DEFAULT 0, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_user_read (user_id, \`read\`), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS share_links (id VARCHAR(36) PRIMARY KEY, album_id VARCHAR(36) NOT NULL, code VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(100), expires_at DATETIME NOT NULL, view_count INT DEFAULT 0, created_by VARCHAR(36) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_code (code), FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE, FOREIGN KEY (created_by) REFERENCES users(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS anniversaries (id VARCHAR(36) PRIMARY KEY, title VARCHAR(255) NOT NULL, date DATE NOT NULL, description TEXT, created_by VARCHAR(36) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (created_by) REFERENCES users(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
]
for (const sql of tbls) await pool.query(sql)
console.log('Tables created')

// Ensure at least one system user exists (app requires it for FK references)
const [users] = await pool.query('SELECT id FROM users LIMIT 1')
if (!users.length) {
  await pool.execute('INSERT INTO users (id, role) VALUES (?, ?)', [randomUUID(), 'admin'])
  console.log('System user created')
} else {
  console.log('System user exists')
}

await pool.end()
console.log('Done')
