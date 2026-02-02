// 云函数:获取用户列表 - 供后台管理系统使用
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { page = 1, pageSize = 20, keyword = '' } = event

  try {
    let query = db.collection('users')

    // 搜索条件
    if (keyword) {
      query = query.where({
        nickname: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      })
    }

    // 查询总数
    const countRes = await query.count()
    const total = countRes.total

    // 查询分页数据
    const skip = (page - 1) * pageSize
    const dataRes = await query
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    // 处理返回数据,去除敏感信息
    const processedData = dataRes.data.map(user => {
      const { _openid, ...safeUser } = user
      return safeUser
    })

    return {
      success: true,
      data: processedData,
      total,
      page,
      pageSize
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return {
      success: false,
      message: error.message || '获取失败'
    }
  }
}
