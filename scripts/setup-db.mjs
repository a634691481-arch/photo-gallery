import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: '120.77.81.21',
  port: 3306,
  user: 'photo-gallery',
  password: '2WrsTYEACYmCtpX2',
  database: 'photo-gallery',
  connectionLimit: 3,
  charset: 'utf8mb4',
})

try {
  await pool.query('SELECT 1')
  console.log('MySQL connected to photo-gallery database')
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

const [r] = await pool.query('SELECT COUNT(*) as cnt FROM photos')
if (r[0].cnt > 0) {
  console.log('Already seeded')
  await pool.end()
  process.exit(0)
}

const uid = '10000000-0000-0000-0000-000000000001'
await pool.execute('INSERT INTO users (id, role) VALUES (?, ?)', [uid, 'admin'])

const people = ['宝宝 Emma', '妈妈', '爸爸', '奶奶', '爷爷']
const faceIds = []
for (let fi = 0; fi < people.length; fi++) {
  const fid = `${10000001 + fi}0000-0000-0000-000000000000`
  await pool.execute('INSERT INTO face_labels (id, name, created_by) VALUES (?, ?, ?)', [
    fid,
    people[fi],
    uid,
  ])
  faceIds.push(fid)
}

const albumIds = []
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
for (let ai = 0; ai < albumDefs.length; ai++) {
  const aid = `2000000${ai}0000-0000-0000-000000000000`
  await pool.execute('INSERT INTO albums (id, title, cover_url, created_by) VALUES (?, ?, ?, ?)', [
    aid,
    albumDefs[ai],
    `https://picsum.photos/seed/alb${ai}/800/600`,
    uid,
  ])
  albumIds.push(aid)
}

const locations = [
  { n: '北京', la: 39.9, ln: 116.4 },
  { n: '上海', la: 31.2, ln: 121.5 },
  { n: '杭州', la: 30.3, ln: 120.2 },
  { n: '三亚', la: 18.3, ln: 109.5 },
  { n: '成都', la: 30.6, ln: 104.1 },
  { n: '昆明', la: 25.0, ln: 102.7 },
  { n: '桂林', la: 25.2, ln: 110.2 },
  { n: '厦门', la: 24.5, ln: 118.1 },
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
const monthBatches = [
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

let s = 0
for (const [year, month, count] of monthBatches) {
  for (let i = 0; i < count; i++) {
    s++
    const pid = `3000${String(s).padStart(4, '0')}0000-0000-0000-000000000000`
    const w = 400 + (s % 3) * 200
    const h = 300 + (s % 4) * 200
    const isV = s % 20 === 0
    const loc = locations[s % locations.length]
    const day = Math.min(28, Math.ceil(Math.random() * 28))
    const hour = Math.ceil(Math.random() * 14) + 6
    const min = Math.floor(Math.random() * 60)
    const cam = cameras[s % cameras.length]
    const camParts = cam.split(' ')
    const camMake = camParts.slice(0, -1).join(' ')
    const camModel = camParts[camParts.length - 1]
    await pool.execute(
      'INSERT INTO photos (id,original_url,thumbnail_url,webp_url,width,height,file_size,file_name,mime_type,hash,taken_at,latitude,longitude,location_name,camera_make,camera_model,is_video,uploaded_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        pid,
        `https://picsum.photos/seed/s${s}/${w * 2}/${h * 2}`,
        `https://picsum.photos/seed/s${s}/400/300`,
        `https://picsum.photos/seed/s${s}/${w}/${h}`,
        w * 2,
        h * 2,
        500000 + Math.floor(Math.random() * 7500000),
        isV ? `MOV_${s}.mp4` : `IMG_${s}.jpg`,
        isV ? 'video/mp4' : 'image/jpeg',
        `hash_${s}_${Math.floor(Math.random() * 9000) + 1000}`,
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`,
        loc.la + (Math.random() - 0.5) * 0.1,
        loc.ln + (Math.random() - 0.5) * 0.1,
        loc.n,
        camMake,
        camModel,
        isV ? 1 : 0,
        uid,
      ],
    )
    if (s % 3 === 0)
      await pool.execute('INSERT INTO album_photos (album_id, photo_id) VALUES (?,?)', [
        albumIds[Math.floor(Math.random() * albumIds.length)],
        pid,
      ])
    const fid = faceIds[Math.floor(Math.random() * faceIds.length)]
    await pool.execute(
      'INSERT INTO detected_faces (id,photo_id,face_label_id,x,y,width,height) VALUES (?,?,?,?,?,?,?)',
      [
        `4${String(s).padStart(6, '0')}0000-0000-0000-000000000000`,
        pid,
        fid,
        0.2 + Math.random() * 0.6,
        0.1 + Math.random() * 0.4,
        0.1 + Math.random() * 0.2,
        0.1 + Math.random() * 0.2,
      ],
    )
    if (s % 7 === 0)
      await pool.execute('INSERT INTO likes (id,photo_id,user_id) VALUES (?,?,?)', [
        `5${String(s).padStart(6, '0')}0000-0000-0000-000000000000`,
        pid,
        uid,
      ])
    if (s % 11 === 0)
      await pool.execute('INSERT INTO comments (id,content,photo_id,user_id) VALUES (?,?,?,?)', [
        `6${String(s).padStart(6, '0')}0000-0000-0000-000000000000`,
        cmts[Math.floor(Math.random() * cmts.length)],
        pid,
        uid,
      ])
  }
  console.log(`  ${year}/${month}: ${count} photos`)
}
console.log(`Total: ${s} photos`)

const anns = [
  ['宝宝 Emma 生日', '2022-03-15', '小天使来到这个世界'],
  ['结婚纪念日', '2019-08-08', '牵手的第 N 年'],
  ['搬进新家', '2024-06-20', '属于我们的温暖小窝'],
  ['爸爸生日', '1985-11-28', null],
  ['妈妈生日', '1988-01-12', null],
]
for (let ai = 0; ai < anns.length; ai++) {
  await pool.execute(
    'INSERT INTO anniversaries (id,title,date,description,created_by) VALUES (?,?,?,?,?)',
    [
      `70${String(ai).padStart(6, '0')}0000-0000-0000-000000000000`,
      anns[ai][0],
      anns[ai][1],
      anns[ai][2],
      uid,
    ],
  )
}

await pool.execute(
  'INSERT INTO notifications (id,user_id,type,title,body,link) VALUES (?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?)',
  [
    '80000000-0000-0000-0000-000000000001',
    uid,
    'info',
    '欢迎加入',
    '欢迎来到家庭相册！',
    '/',
    '80000000-0000-0000-0000-000000000002',
    uid,
    'comment',
    '新评论',
    '妈妈评论了你的照片',
    '/',
    '80000000-0000-0000-0000-000000000003',
    uid,
    'like',
    '有人点赞',
    '爸爸赞了你的照片',
    '/',
  ],
)

console.log('Seed complete!')
await pool.end()
