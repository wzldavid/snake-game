// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return {
      success: false,
      message: '获取用户标识失败'
    }
  }

  try {
    // 查询用户是否已存在
    const res = await db.collection('users').where({
      _openid: OPENID
    }).get()

    let isNewUser = false
    let userInfo = null

    if (res.data.length === 0) {
      // 新用户，创建用户记录
      isNewUser = true

      const createRes = await db.collection('users').add({
        data: {
          _openid: OPENID,
          nickname: '老人',
          avatar: '',
          gender: 0,
          birthday: '',
          age: 0,
          hasDiabetes: false,
          hasHypertension: false,
          emergencyContact: '',
          emergencyPhone: '',
          createTime: db.serverDate(),
          updateTime: db.serverDate(),
          lastLoginTime: db.serverDate()
        }
      })

      // 获取新创建的用户信息
      const newRes = await db.collection('users').doc(createRes._id).get()
      userInfo = newRes.data
    } else {
      // 老用户，更新最后登录时间
      userInfo = res.data[0]
      await db.collection('users').doc(userInfo._id).update({
        data: {
          lastLoginTime: db.serverDate()
        }
      })
    }

    return {
      success: true,
      openid: OPENID,
      isNewUser,
      userInfo: userInfo
    }

  } catch (error) {
    console.error('登录失败:', error)
    return {
      success: false,
      message: error.message || '登录失败'
    }
  }
}
