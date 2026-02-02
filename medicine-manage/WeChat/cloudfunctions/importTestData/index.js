// 云函数：导入测试数据
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 张大爷的测试数据
const zhangData = {
  user: {
    _openid: "test_openid_zhang_001",
    nickname: "张大爷",
    avatar: "",
    gender: 1,
    birthday: "1955-03-15",
    age: 70,
    hasDiabetes: true,
    hasHypertension: true,
    emergencyContact: "张三",
    emergencyPhone: "13812348888",
    createTime: new Date("2026-01-01T06:45:09.357Z"),
    updateTime: new Date("2026-01-31T06:45:09.357Z"),
    lastLoginTime: new Date("2026-01-31T06:45:09.357Z")
  }
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  try {
    // 清理旧数据（如果存在）
    const oldUsers = await db.collection('users').where({
      nickname: '张大爷'
    }).get()

    if (oldUsers.data.length > 0) {
      for (const user of oldUsers.data) {
        await db.collection('users').doc(user._id).remove()
      }
    }

    const oldGlucose = await db.collection('blood_glucose').where({
      _openid: zhangData.user._openid
    }).get()

    if (oldGlucose.data.length > 0) {
      for (const record of oldGlucose.data) {
        await db.collection('blood_glucose').doc(record._id).remove()
      }
    }

    const oldPressure = await db.collection('blood_pressure').where({
      _openid: zhangData.user._openid
    }).get()

    if (oldPressure.data.length > 0) {
      for (const record of oldPressure.data) {
        await db.collection('blood_pressure').doc(record._id).remove()
      }
    }

    // 导入用户数据
    await db.collection('users').add({
      data: zhangData.user
    })

    // 导入血糖数据（部分示例数据）
    const glucoseRecords = [
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-31T06:12:00.000Z"),
        measureType: 3,
        measureTypeName: "午餐后",
        value: 5.8,
        isAbnormal: false,
        abnormalType: 0,
        abnormalReason: "",
        photoUrl: "",
        note: "",
        createTime: new Date("2026-01-31T06:12:00.000Z")
      },
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-31T02:41:00.000Z"),
        measureType: 1,
        measureTypeName: "空腹",
        value: 4.9,
        isAbnormal: false,
        abnormalType: 0,
        abnormalReason: "",
        photoUrl: "",
        note: "",
        createTime: new Date("2026-01-31T02:41:00.000Z")
      },
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-31T12:30:00.000Z"),
        measureType: 4,
        measureTypeName: "晚餐后",
        value: 6.2,
        isAbnormal: false,
        abnormalType: 0,
        abnormalReason: "",
        photoUrl: "",
        note: "",
        createTime: new Date("2026-01-31T12:30:00.000Z")
      },
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-30T06:15:00.000Z"),
        measureType: 3,
        measureTypeName: "午餐后",
        value: 7.1,
        isAbnormal: true,
        abnormalType: 2,
        abnormalReason: "偏高",
        photoUrl: "",
        note: "今天午餐吃得有点多",
        createTime: new Date("2026-01-30T06:15:00.000Z")
      },
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-30T02:30:00.000Z"),
        measureType: 1,
        measureTypeName: "空腹",
        value: 5.2,
        isAbnormal: false,
        abnormalType: 0,
        abnormalReason: "",
        photoUrl: "",
        note: "",
        createTime: new Date("2026-01-30T02:30:00.000Z")
      }
    ]

    for (const record of glucoseRecords) {
      await db.collection('blood_glucose').add({
        data: record
      })
    }

    // 导入血压数据（部分示例数据）
    const pressureRecords = [
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-31T07:00:00.000Z"),
        systolic: 128,
        diastolic: 82,
        heartRate: 72,
        isAbnormal: false,
        abnormalType: 0,
        abnormalReason: "",
        note: "",
        createTime: new Date("2026-01-31T07:00:00.000Z")
      },
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-30T07:15:00.000Z"),
        systolic: 135,
        diastolic: 88,
        heartRate: 76,
        isAbnormal: true,
        abnormalType: 1,
        abnormalReason: "血压偏高",
        note: "睡眠不太好",
        createTime: new Date("2026-01-30T07:15:00.000Z")
      },
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-29T06:50:00.000Z"),
        systolic: 125,
        diastolic: 80,
        heartRate: 70,
        isAbnormal: false,
        abnormalType: 0,
        abnormalReason: "",
        note: "",
        createTime: new Date("2026-01-29T06:50:00.000Z")
      },
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-28T07:20:00.000Z"),
        systolic: 130,
        diastolic: 85,
        heartRate: 74,
        isAbnormal: false,
        abnormalType: 0,
        abnormalReason: "",
        note: "",
        createTime: new Date("2026-01-28T07:20:00.000Z")
      },
      {
        _openid: "test_openid_zhang_001",
        measureTime: new Date("2026-01-27T06:45:00.000Z"),
        systolic: 122,
        diastolic: 78,
        heartRate: 68,
        isAbnormal: false,
        abnormalType: 0,
        abnormalReason: "",
        note: "",
        createTime: new Date("2026-01-27T06:45:00.000Z")
      }
    ]

    for (const record of pressureRecords) {
      await db.collection('blood_pressure').add({
        data: record
      })
    }

    return {
      success: true,
      message: '张大爷测试数据导入成功',
      data: {
        userCount: 1,
        glucoseCount: glucoseRecords.length,
        pressureCount: pressureRecords.length
      }
    }
  } catch (error) {
    console.error('导入测试数据失败:', error)
    return {
      success: false,
      message: '导入失败: ' + error.message,
      error: error
    }
  }
}
