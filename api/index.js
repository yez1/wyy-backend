const app = require('../main') // 引入根目录的 app.js

// 这一步是为了适配 Vercel 的 Serverless 环境
module.exports = (req, res) => {
  // // 某些版本的 API 需要手动设置 cookie 保存路径（虽然 Vercel 还是写不了，但能防止崩溃）
  // // 这里其实主要是为了导出一个函数给 Vercel 调用
  // return app(req, res)

  // 确保 app 存在后再处理请求
  if (typeof app === 'function') {
    return app(req, res)
  }

  res.status(500).send('Server construction error: app is not a function')
}
