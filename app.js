#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

// === Vercel 专用修复配置 ===
// 1. 强制指定临时文件路径为 /tmp/anonymous_token
// (不要用 os.tmpdir()，防止获取到只读目录)
const tokenPath = '/tmp/anonymous_token'

// 2. 启动前先创建空文件，防止程序读不到报错
try {
  if (!fs.existsSync(tokenPath)) {
    fs.writeFileSync(tokenPath, '', 'utf-8')
    console.log('✅ [Vercel Fix] 临时 Token 文件创建成功')
  }
} catch (error) {
  console.error('❌ [Vercel Fix] 创建文件失败 (但这不一定会导致崩溃):', error)
}

async function start() {
  // 再次确保文件存在 (双重保险)
  if (!fs.existsSync(tokenPath)) {
    try {
      fs.writeFileSync(tokenPath, '', 'utf-8')
    } catch (e) {
      // 忽略写入错误，只要前面创建过就行
    }
  }

  // 3. 加载配置 (如果有这个文件的话)
  try {
    const generateConfig = require('./generateConfig')
    await generateConfig()
  } catch (error) {
    console.log('⚠️ generateConfig 跳过或失败:', error.message)
  }

  // 4. 启动服务 (关键修改：关掉版本检查！)
  require('./server').serveNcmApi({
    checkVersion: false, // <--- 这里必须是 false，否则会超时报错！
    port: process.env.PORT || 3000, // 适配 Vercel 的端口
  })
}

start()
