import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'photo_gallery',
  connectionLimit: 5,
  charset: 'utf8mb4',
  waitForConnections: true,
})

let tablesReady = false

async function createTables() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      role VARCHAR(20) NOT NULL DEFAULT 'admin',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS albums (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      cover_url VARCHAR(1024),
      created_by VARCHAR(36) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS photos (
      id VARCHAR(36) PRIMARY KEY,
      original_url VARCHAR(1024) NOT NULL,
      thumbnail_url VARCHAR(1024) NOT NULL,
      webp_url VARCHAR(1024) NOT NULL,
      width INT,
      height INT,
      file_size INT NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      mime_type VARCHAR(50) NOT NULL,
      hash VARCHAR(255) NOT NULL,
      taken_at DATETIME,
      latitude DOUBLE,
      longitude DOUBLE,
      location_name VARCHAR(255),
      camera_make VARCHAR(100),
      camera_model VARCHAR(100),
      is_video TINYINT(1) DEFAULT 0,
      video_url VARCHAR(1024),
      video_cover VARCHAR(1024),
      uploaded_by VARCHAR(36) NOT NULL,
      deleted_at DATETIME,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_taken (taken_at),
      INDEX idx_uploaded (uploaded_by),
      INDEX idx_hash (hash),
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS album_photos (
      album_id VARCHAR(36) NOT NULL,
      photo_id VARCHAR(36) NOT NULL,
      added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (album_id, photo_id),
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
      FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS face_labels (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_by VARCHAR(36) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_name_user (name, created_by),
      FOREIGN KEY (created_by) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS detected_faces (
      id VARCHAR(36) PRIMARY KEY,
      photo_id VARCHAR(36) NOT NULL,
      face_label_id VARCHAR(36),
      x DOUBLE NOT NULL,
      y DOUBLE NOT NULL,
      width DOUBLE NOT NULL,
      height DOUBLE NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_photo (photo_id),
      INDEX idx_label (face_label_id),
      FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
      FOREIGN KEY (face_label_id) REFERENCES face_labels(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id VARCHAR(36) PRIMARY KEY,
      content TEXT NOT NULL,
      photo_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME,
      INDEX idx_photo (photo_id),
      FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS likes (
      id VARCHAR(36) PRIMARY KEY,
      photo_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_like (photo_id, user_id),
      FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      link VARCHAR(512),
      \`read\` TINYINT(1) DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_read (user_id, \`read\`),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS share_links (
      id VARCHAR(36) PRIMARY KEY,
      album_id VARCHAR(36) NOT NULL,
      code VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(100),
      expires_at DATETIME NOT NULL,
      view_count INT DEFAULT 0,
      created_by VARCHAR(36) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_code (code),
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS anniversaries (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      description TEXT,
      created_by VARCHAR(36) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)
  tablesReady = true
}

async function seedData() {
  const [rows] = (await pool.query('SELECT COUNT(*) as cnt FROM photos')) as any
  if (rows[0].cnt > 0) return

  const userId = crypto.randomUUID()
  await pool.execute('INSERT INTO users (id, role) VALUES (?, ?)', [userId, 'admin'])

  const people = ['宝宝 Emma', '妈妈', '爸爸', '奶奶', '爷爷']
  const faceIds: string[] = []
  for (const name of people) {
    const fid = crypto.randomUUID()
    await pool.execute('INSERT INTO face_labels (id, name, created_by) VALUES (?, ?, ?)', [
      fid,
      name,
      userId,
    ])
    faceIds.push(fid)
  }

  const albumIds: string[] = []
  const albumDefs = [
    '2026 暑假旅行',
    '宝宝第一步',
    '春节团聚',
    '生日派对',
    '周末徒步',
    '毕业季',
    '新年烟花',
    '宠物日常',
    '美食记录',
    '公园漫步',
  ]
  for (const title of albumDefs) {
    const aid = crypto.randomUUID()
    await pool.execute(
      'INSERT INTO albums (id, title, cover_url, created_by) VALUES (?, ?, ?, ?)',
      [aid, title, `https://picsum.photos/seed/alb${albumIds.length}/800/600`, userId],
    )
    albumIds.push(aid)
  }

  const locations = [
    { name: '北京', lat: 39.9, lng: 116.4 },
    { name: '上海', lat: 31.2, lng: 121.5 },
    { name: '杭州', lat: 30.3, lng: 120.2 },
    { name: '三亚', lat: 18.3, lng: 109.5 },
    { name: '成都', lat: 30.6, lng: 104.1 },
    { name: '昆明', lat: 25.0, lng: 102.7 },
    { name: '桂林', lat: 25.2, lng: 110.2 },
    { name: '厦门', lat: 24.5, lng: 118.1 },
  ]

  const cameras = [
    'Apple iPhone 15 Pro',
    'Apple iPhone 14 Pro',
    'Canon EOS R6',
    'Sony A7M4',
    'DJI Mini 3 Pro',
  ]
  const cmts = [
    '太可爱了！',
    '美好的回忆',
    '这张拍得真好',
    '好怀念那天',
    '宝宝笑得好甜',
    '真幸福的时光',
  ]

  let s = 0
  const months = [
    [2026, 7, 50],
    [2026, 6, 45],
    [2026, 5, 35],
    [2026, 3, 40],
    [2026, 1, 30],
    [2025, 12, 55],
    [2025, 10, 40],
    [2025, 8, 60],
    [2025, 5, 35],
    [2025, 2, 25],
    [2024, 11, 45],
    [2024, 7, 50],
    [2024, 3, 30],
  ]

  for (const [year, month, count] of months) {
    for (let i = 0; i < count; i++) {
      s++
      const pid = crypto.randomUUID()
      const w = 400 + (s % 3) * 200
      const h = 300 + (s % 4) * 200
      const isVideo = s % 20 === 0
      const loc = locations[s % locations.length]
      const day = Math.min(28, Math.ceil(Math.random() * 28))
      const hour = Math.ceil(Math.random() * 14) + 6

      await pool.execute(
        `INSERT INTO photos (id,original_url,thumbnail_url,webp_url,width,height,file_size,file_name,mime_type,hash,taken_at,latitude,longitude,location_name,camera_make,camera_model,is_video,uploaded_by)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          pid,
          `https://picsum.photos/seed/s${s}/${w * 2}/${h * 2}`,
          `https://picsum.photos/seed/s${s}/400/300`,
          `https://picsum.photos/seed/s${s}/${w}/${h}`,
          w * 2,
          h * 2,
          500000 + Math.floor(Math.random() * 7500000),
          isVideo ? `MOV_${s}.mp4` : `IMG_${s}.jpg`,
          isVideo ? 'video/mp4' : 'image/jpeg',
          `hash_${s}_${Math.floor(Math.random() * 9000) + 1000}`,
          `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
          loc.lat + (Math.random() - 0.5) * 0.1,
          loc.lng + (Math.random() - 0.5) * 0.1,
          loc.name,
          cameras[s % cameras.length].split(' ').slice(0, -1).join(' '),
          cameras[s % cameras.length].split(' ').slice(-1)[0],
          isVideo ? 1 : 0,
          userId,
        ],
      )

      if (s % 3 === 0) {
        await pool.execute('INSERT INTO album_photos (album_id, photo_id) VALUES (?, ?)', [
          albumIds[Math.floor(Math.random() * albumIds.length)],
          pid,
        ])
      }

      const fid = faceIds[Math.floor(Math.random() * faceIds.length)]
      await pool.execute(
        'INSERT INTO detected_faces (id, photo_id, face_label_id, x, y, width, height) VALUES (?,?,?,?,?,?,?)',
        [
          crypto.randomUUID(),
          pid,
          fid,
          0.2 + Math.random() * 0.6,
          0.1 + Math.random() * 0.4,
          0.1 + Math.random() * 0.2,
          0.1 + Math.random() * 0.2,
        ],
      )

      if (s % 7 === 0) {
        await pool.execute('INSERT INTO likes (id, photo_id, user_id) VALUES (?, ?, ?)', [
          crypto.randomUUID(),
          pid,
          userId,
        ])
      }

      if (s % 11 === 0) {
        await pool.execute(
          'INSERT INTO comments (id, content, photo_id, user_id) VALUES (?, ?, ?, ?)',
          [crypto.randomUUID(), cmts[Math.floor(Math.random() * cmts.length)], pid, userId],
        )
      }
    }
  }

  const anniversaries = [
    ['宝宝 Emma 生日', '2022-03-15', '小天使来到这个世界'],
    ['结婚纪念日', '2019-08-08', '牵手的第 N 年'],
    ['搬进新家', '2024-06-20', '属于我们的温暖小窝'],
    ['爸爸生日', '1985-11-28', null],
    ['妈妈生日', '1988-01-12', null],
  ]
  for (const [title, date, desc] of anniversaries) {
    await pool.execute(
      'INSERT INTO anniversaries (id, title, date, description, created_by) VALUES (?,?,?,?,?)',
      [crypto.randomUUID(), title, date, desc, userId],
    )
  }

  await pool.execute(
    'INSERT INTO notifications (id, user_id, type, title, body, link) VALUES (?,?,?,?,?,?), (?,?,?,?,?,?), (?,?,?,?,?,?)',
    [
      crypto.randomUUID(),
      userId,
      'info',
      '欢迎加入',
      '欢迎来到家庭相册！',
      '/',
      crypto.randomUUID(),
      userId,
      'comment',
      '新评论',
      '妈妈评论了你的照片',
      '/',
      crypto.randomUUID(),
      userId,
      'like',
      '有人点赞',
      '爸爸赞了你的照片',
      '/',
    ],
  )

  console.log(`Seed done: ${s} photos, ${albumIds.length} albums, ${faceIds.length} people`)
}

export function db() {
  return pool
}

export async function ensureDB() {
  if (!tablesReady) {
    try {
      await createTables()
      await seedData()
    } catch (e: any) {
      console.warn('DB init failed (MySQL not running?):', e.message)
    }
  }
}
