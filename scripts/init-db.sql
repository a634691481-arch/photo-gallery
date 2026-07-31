-- 在 MySQL Workbench / Navicat / DBeaver 中执行此文件
CREATE DATABASE IF NOT EXISTS photo_gallery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE photo_gallery;

-- 表和系统用户由代码自动创建（server/utils/db.ts 的 createTables）
-- 启动 npm run dev 后首次调用任何 API 即可自动建表
-- 如需手动初始化，可运行 node scripts/setup-db.mjs
