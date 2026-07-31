import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const LOCATIONS = [
  { name: '北京', lat: 39.9042, lng: 116.4074 },
  { name: '上海', lat: 31.2304, lng: 121.4737 },
  { name: '杭州', lat: 30.2741, lng: 120.1551 },
  { name: '三亚', lat: 18.2528, lng: 109.512 },
  { name: '成都', lat: 30.5728, lng: 104.0668 },
  { name: '昆明', lat: 25.0389, lng: 102.7183 },
  { name: '桂林', lat: 25.2345, lng: 110.18 },
  { name: '厦门', lat: 24.4798, lng: 118.0894 },
]

const PEOPLE = ['宝宝 Emma', '妈妈', '爸爸', '奶奶', '爷爷']

const ANNIVERSARIES = [
  { title: '宝宝 Emma 生日', date: '2022-03-15', description: '小天使来到这个世界' },
  { title: '结婚纪念日', date: '2019-08-08', description: '牵手的第 N 年' },
  { title: '搬进新家', date: '2024-06-20', description: '属于我们的温暖小窝' },
  { title: '爸爸生日', date: '1985-11-28', description: null },
  { title: '妈妈生日', date: '1988-01-12', description: null },
]

const CAMERAS = [
  { make: 'Apple', model: 'iPhone 15 Pro' },
  { make: 'Apple', model: 'iPhone 14 Pro' },
  { make: 'Canon', model: 'EOS R6' },
  { make: 'Sony', model: 'A7M4' },
  { make: 'DJI', model: 'Mini 3 Pro' },
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generatePhotoUrls(seed: number) {
  const w = rand(400, 600) + (seed % 3) * 200
  const h = rand(300, 500) + (seed % 4) * 200
  return {
    originalUrl: `https://picsum.photos/seed/s${seed}/${w * 2}/${h * 2}`,
    webpUrl: `https://picsum.photos/seed/s${seed}/${w}/${h}`,
    thumbnailUrl: `https://picsum.photos/seed/s${seed}/400/300`,
  }
}

async function main() {
  console.log('Seeding...')

  await prisma.albumPhoto.deleteMany()
  await prisma.detectedFace.deleteMany()
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.shareLink.deleteMany()
  await prisma.photo.deleteMany()
  await prisma.album.deleteMany()
  await prisma.faceLabel.deleteMany()
  await prisma.anniversary.deleteMany()
  await prisma.user.deleteMany()

  const user = await prisma.user.create({ data: { role: 'admin' } })
  const user2 = await prisma.user.create({ data: { role: 'member' } })
  const users = [user, user2]

  const faceLabels = []
  for (const name of PEOPLE) {
    const fl = await prisma.faceLabel.create({ data: { name, createdBy: user.id } })
    faceLabels.push(fl)
  }

  for (const a of ANNIVERSARIES) {
    await prisma.anniversary.create({ data: { ...a, date: new Date(a.date), createdBy: user.id } })
  }

  const albums = []
  const albumDefs = [
    { title: '2026 暑假旅行', description: '三亚的阳光和海滩' },
    { title: '宝宝第一步', description: 'Emma 学会走路的那天' },
    { title: '春节团聚', description: '全家团圆的幸福时光' },
    { title: '生日派对', description: '最快乐的生日回忆' },
    { title: '周末徒步', description: '山野间的呼吸' },
    { title: '毕业季', description: '成长的里程碑' },
    { title: '新年烟花', description: '辞旧迎新的夜晚' },
    { title: '宠物日常', description: '毛孩子的可爱瞬间' },
    { title: '美食记录', description: '舌尖上的幸福' },
    { title: '公园漫步', description: '风和日丽的下午' },
  ]
  for (const a of albumDefs) {
    const album = await prisma.album.create({
      data: {
        ...a,
        coverUrl: `https://picsum.photos/seed/alb${albums.length}/800/600`,
        createdBy: pick(users).id,
      },
    })
    albums.push(album)
  }

  let photoSeed = 0
  const months = [
    { year: 2026, month: 7, count: 50 },
    { year: 2026, month: 6, count: 45 },
    { year: 2026, month: 5, count: 35 },
    { year: 2026, month: 3, count: 40 },
    { year: 2026, month: 1, count: 30 },
    { year: 2025, month: 12, count: 55 },
    { year: 2025, month: 10, count: 40 },
    { year: 2025, month: 8, count: 60 },
    { year: 2025, month: 5, count: 35 },
    { year: 2025, month: 2, count: 25 },
    { year: 2024, month: 11, count: 45 },
    { year: 2024, month: 7, count: 50 },
    { year: 2024, month: 3, count: 30 },
  ]

  for (const m of months) {
    for (let i = 0; i < m.count; i++) {
      photoSeed++
      const day = rand(1, 28)
      const urls = generatePhotoUrls(photoSeed)
      const loc = pick(LOCATIONS)
      const cam = pick(CAMERAS)
      const isVideo = photoSeed % 20 === 0

      const photo = await prisma.photo.create({
        data: {
          ...urls,
          width: rand(800, 2400),
          height: rand(600, 1800),
          fileSize: rand(500000, 8000000),
          fileName: isVideo ? `MOV_${photoSeed}.mp4` : `IMG_${photoSeed}.jpg`,
          mimeType: isVideo ? 'video/mp4' : 'image/jpeg',
          hash: `hash_${photoSeed}_${rand(1000, 9999)}`,
          takenAt: new Date(m.year, m.month - 1, day, rand(6, 20), rand(0, 59)),
          latitude: loc.lat + (Math.random() - 0.5) * 0.1,
          longitude: loc.lng + (Math.random() - 0.5) * 0.1,
          locationName: loc.name,
          cameraMake: cam.make,
          cameraModel: cam.model,
          isVideo,
          videoUrl: isVideo ? `https://example.com/videos/${photoSeed}.mp4` : null,
          videoCover: isVideo ? `https://picsum.photos/seed/vc${photoSeed}/400/300` : null,
          uploadedBy: pick(users).id,
        },
      })

      if (photoSeed % 3 === 0) {
        const album = pick(albums)
        await prisma.albumPhoto.create({ data: { albumId: album.id, photoId: photo.id } })
      }
      if (photoSeed % 5 === 0) {
        const targetAlbum = albums[photoSeed % albums.length]
        await prisma.albumPhoto
          .create({ data: { albumId: targetAlbum.id, photoId: photo.id } })
          .catch(() => {})
      }

      const faceLabel = pick(faceLabels)
      await prisma.detectedFace.create({
        data: {
          photoId: photo.id,
          faceLabelId: faceLabel.id,
          descriptor: Array.from({ length: 128 }, () => Math.random()),
          x: Math.random() * 0.6 + 0.2,
          y: Math.random() * 0.4 + 0.1,
          width: Math.random() * 0.2 + 0.1,
          height: Math.random() * 0.2 + 0.1,
        },
      })

      if (photoSeed % 7 === 0) {
        const liker = pick(users)
        await prisma.like.create({ data: { photoId: photo.id, userId: liker.id } }).catch(() => {})
      }

      if (photoSeed % 11 === 0) {
        await prisma.comment.create({
          data: {
            content: pick([
              '太可爱了！',
              '美好的回忆',
              '这张拍得真好',
              '好怀念那天',
              '宝宝笑得好甜',
              '真幸福的时光',
            ]),
            photoId: photo.id,
            userId: pick(users).id,
          },
        })
      }
    }
  }

  for (const u of users) {
    await prisma.notification.createMany({
      data: [
        {
          userId: u.id,
          type: 'info',
          title: '欢迎加入',
          body: '欢迎来到家庭相册！开始上传你的第一张照片吧。',
        },
        { userId: u.id, type: 'comment', title: '新评论', body: '妈妈评论了你的照片', link: '/' },
        { userId: u.id, type: 'like', title: '有人点赞', body: '爸爸赞了你的照片', link: '/' },
      ],
    })
  }

  console.log(`Done! ${photoSeed} photos seeded across ${months.length} months.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
