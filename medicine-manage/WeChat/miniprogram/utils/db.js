/**
 * CloudBase 数据库服务模块
 * 提供统一的数据访问接口
 */

const db = wx.cloud.database()
const _ = db.command

// 数据集合名称
const COLLECTIONS = {
  USERS: 'users',
  BLOOD_GLUCOSE: 'blood_glucose',
  BLOOD_PRESSURE: 'blood_pressure',
  ABNORMAL_ALERTS: 'abnormal_alerts'
}

// 测量类型枚举
const MEASURE_TYPES = {
  FASTING: 1,           // 空腹
  AFTER_BREAKFAST: 2,    // 早餐后
  AFTER_LUNCH: 3,       // 午餐后
  AFTER_DINNER: 4,      // 晚餐后
  BEFORE_SLEEP: 5       // 睡前
}

// 测量类型名称映射
const MEASURE_TYPE_NAMES = {
  [MEASURE_TYPES.FASTING]: '空腹',
  [MEASURE_TYPES.AFTER_BREAKFAST]: '早餐后',
  [MEASURE_TYPES.AFTER_LUNCH]: '午餐后',
  [MEASURE_TYPES.AFTER_DINNER]: '晚餐后',
  [MEASURE_TYPES.BEFORE_SLEEP]: '睡前'
}

/**
 * 血糖相关操作
 */
const GlucoseService = {
  /**
   * 添加血糖记录
   * @param {Object} data - 血糖数据
   * @param {Number} data.measureType - 测量类型
   * @param {Number} data.value - 血糖值
   * @param {String} data.measureTime - 测量时间
   * @param {String} data.photoUrl - 照片URL
   * @param {String} data.note - 备注
   */
  async addRecord(data) {
    try {
      const { measureType, value, measureTime, photoUrl, note } = data

      // 判断是否异常
      const abnormal = this.checkAbnormal(value, measureType)

      const res = await db.collection(COLLECTIONS.BLOOD_GLUCOSE).add({
        data: {
          measureTime: measureTime || db.serverDate(),
          measureType,
          measureTypeName: MEASURE_TYPE_NAMES[measureType] || '未知',
          value,
          isAbnormal: abnormal.isAbnormal,
          abnormalType: abnormal.type,
          abnormalReason: abnormal.reason,
          photoUrl: photoUrl || '',
          note: note || '',
          createTime: db.serverDate()
        }
      })

      return {
        success: true,
        data: res
      }
    } catch (error) {
      console.error('添加血糖记录失败:', error)
      return {
        success: false,
        message: error.message || '添加失败'
      }
    }
  },

  /**
   * 查询今日血糖记录
   */
  async getTodayRecords() {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const res = await db.collection(COLLECTIONS.BLOOD_GLUCOSE)
        .where({
          measureTime: _.gte(today)
        })
        .orderBy('measureTime', 'desc')
        .get()

      return {
        success: true,
        data: res.data.map(item => this.formatRecord(item))
      }
    } catch (error) {
      console.error('查询今日血糖记录失败:', error)
      return {
        success: false,
        message: error.message || '查询失败',
        data: []
      }
    }
  },

  /**
   * 查询血糖趋势数据
   * @param {Number} days - 查询天数
   * @param {Number} measureType - 测量类型（可选）
   */
  async getTrendData(days, measureType = null) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      let whereCondition = {
        measureTime: _.gte(startDate).and(_.lte(endDate))
      }

      if (measureType) {
        whereCondition.measureType = measureType
      }

      const res = await db.collection(COLLECTIONS.BLOOD_GLUCOSE)
        .where(whereCondition)
        .orderBy('measureTime', 'asc')
        .get()

      const formattedData = res.data.map(item => this.formatRecord(item))

      // 计算统计信息
      const statistics = this.calculateStatistics(formattedData, measureType)

      return {
        success: true,
        data: formattedData,
        statistics
      }
    } catch (error) {
      console.error('查询血糖趋势数据失败:', error)
      return {
        success: false,
        message: error.message || '查询失败',
        data: [],
        statistics: {
          avgFasting: 0,
          avgPostprandial: 0,
          max: 0,
          abnormalCount: 0
        }
      }
    }
  },

  /**
   * 检查血糖是否异常
   */
  checkAbnormal(value, measureType) {
    let isAbnormal = false
    let type = 0
    let reason = ''

    // 空腹血糖
    if (measureType === MEASURE_TYPES.FASTING) {
      if (value < 3.9) {
        isAbnormal = true
        type = 2 // 低血糖
        reason = '空腹血糖低于3.9 mmol/L'
      } else if (value > 7.0) {
        isAbnormal = true
        type = 1 // 高血糖
        reason = '空腹血糖超过7.0 mmol/L(糖尿病标准)'
      }
    }
    // 餐后血糖
    else {
      if (value < 3.9) {
        isAbnormal = true
        type = 2 // 低血糖
        reason = '血糖低于3.9 mmol/L'
      } else if (value > 10.0) {
        isAbnormal = true
        type = 1 // 高血糖
        reason = '餐后血糖超过10.0 mmol/L(糖尿病标准)'
      }
    }

    return { isAbnormal, type, reason }
  },

  /**
   * 格式化血糖记录
   */
  formatRecord(item) {
    const date = new Date(item.measureTime)
    const dateStr = date.toISOString().split('T')[0]
    const measureTypeName = item.measureTypeName || MEASURE_TYPE_NAMES[item.measureType] || '未知'

    return {
      id: item._id,
      date: dateStr,
      type: 1,
      value: item.value,
      measureType: measureTypeName,
      isAbnormal: item.isAbnormal,
      abnormalType: item.abnormalType,
      abnormalReason: item.abnormalReason,
      photoUrl: item.photoUrl,
      note: item.note,
      measureTime: item.measureTime,
      createdAt: item.createTime
    }
  },

  /**
   * 计算血糖统计信息
   */
  calculateStatistics(data, measureType = null) {
    if (data.length === 0) {
      return {
        avgFasting: 0,
        avgPostprandial: 0,
        max: 0,
        abnormalCount: 0
      }
    }

    // 空腹血糖
    const fastingData = data.filter(item => item.measureType === '空腹')
    const fastingValues = fastingData.map(item => item.value)
    const avgFasting = fastingValues.length > 0
      ? parseFloat((fastingValues.reduce((a, b) => a + b, 0) / fastingValues.length).toFixed(1))
      : 0

    // 餐后血糖
    const postprandialData = data.filter(item => item.measureType !== '空腹')
    const postprandialValues = postprandialData.map(item => item.value)
    const avgPostprandial = postprandialValues.length > 0
      ? parseFloat((postprandialValues.reduce((a, b) => a + b, 0) / postprandialValues.length).toFixed(1))
      : 0

    // 最高值
    const allValues = data.map(item => item.value)
    const max = Math.max(...allValues)

    // 异常次数
    const abnormalCount = data.filter(item => item.isAbnormal).length

    return {
      avgFasting,
      avgPostprandial,
      max,
      abnormalCount
    }
  }
}

/**
 * 血压相关操作
 */
const PressureService = {
  /**
   * 添加血压记录
   * @param {Object} data - 血压数据
   * @param {Number} data.systolic - 收缩压
   * @param {Number} data.diastolic - 舒张压
   * @param {Number} data.heartRate - 心率
   * @param {String} data.measureTime - 测量时间
   * @param {String} data.photoUrl - 照片URL
   * @param {String} data.note - 备注
   */
  async addRecord(data) {
    try {
      const { systolic, diastolic, heartRate, measureTime, photoUrl, note } = data

      // 判断是否异常
      const abnormal = this.checkAbnormal(systolic, diastolic)

      const res = await db.collection(COLLECTIONS.BLOOD_PRESSURE).add({
        data: {
          measureTime: measureTime || db.serverDate(),
          systolic,
          diastolic,
          heartRate: heartRate || null,
          isAbnormal: abnormal.isAbnormal,
          abnormalType: abnormal.type,
          abnormalReason: abnormal.reason,
          photoUrl: photoUrl || '',
          note: note || '',
          createTime: db.serverDate()
        }
      })

      return {
        success: true,
        data: res
      }
    } catch (error) {
      console.error('添加血压记录失败:', error)
      return {
        success: false,
        message: error.message || '添加失败'
      }
    }
  },

  /**
   * 查询今日血压记录
   */
  async getTodayRecords() {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const res = await db.collection(COLLECTIONS.BLOOD_PRESSURE)
        .where({
          measureTime: _.gte(today)
        })
        .orderBy('measureTime', 'desc')
        .get()

      return {
        success: true,
        data: res.data.map(item => this.formatRecord(item))
      }
    } catch (error) {
      console.error('查询今日血压记录失败:', error)
      return {
        success: false,
        message: error.message || '查询失败',
        data: []
      }
    }
  },

  /**
   * 查询血压趋势数据
   * @param {Number} days - 查询天数
   */
  async getTrendData(days) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const res = await db.collection(COLLECTIONS.BLOOD_PRESSURE)
        .where({
          measureTime: _.gte(startDate).and(_.lte(endDate))
        })
        .orderBy('measureTime', 'asc')
        .get()

      const formattedData = res.data.map(item => this.formatRecord(item))

      // 计算统计信息
      const statistics = this.calculateStatistics(formattedData)

      return {
        success: true,
        data: formattedData,
        statistics
      }
    } catch (error) {
      console.error('查询血压趋势数据失败:', error)
      return {
        success: false,
        message: error.message || '查询失败',
        data: [],
        statistics: {
          avgSystolic: 0,
          avgDiastolic: 0,
          avgHeartRate: 0,
          maxSystolic: 0,
          maxDiastolic: 0,
          maxHeartRate: 0,
          minSystolic: 0,
          minDiastolic: 0,
          minHeartRate: 0,
          abnormalCount: 0
        }
      }
    }
  },

  /**
   * 检查血压是否异常
   */
  checkAbnormal(systolic, diastolic) {
    let isAbnormal = false
    let type = 0
    let reason = ''

    if (systolic >= 140 || diastolic >= 90) {
      isAbnormal = true
      type = 1 // 高血压
      reason = '收缩压≥140 mmHg或舒张压≥90 mmHg'
    } else if (systolic < 90 || diastolic < 60) {
      isAbnormal = true
      type = 2 // 低血压
      reason = '收缩压<90 mmHg或舒张压<60 mmHg'
    }

    return { isAbnormal, type, reason }
  },

  /**
   * 格式化血压记录
   */
  formatRecord(item) {
    const date = new Date(item.measureTime)
    const dateStr = date.toISOString().split('T')[0]

    return {
      id: item._id,
      date: dateStr,
      type: 2,
      systolic: item.systolic,
      diastolic: item.diastolic,
      heartRate: item.heartRate,
      isAbnormal: item.isAbnormal,
      abnormalType: item.abnormalType,
      abnormalReason: item.abnormalReason,
      photoUrl: item.photoUrl,
      note: item.note,
      measureTime: item.measureTime,
      createdAt: item.createTime
    }
  },

  /**
   * 计算血压统计信息
   */
  calculateStatistics(data) {
    if (data.length === 0) {
      return {
        avgSystolic: 0,
        avgDiastolic: 0,
        avgHeartRate: 0,
        maxSystolic: 0,
        maxDiastolic: 0,
        maxHeartRate: 0,
        minSystolic: 0,
        minDiastolic: 0,
        minHeartRate: 0,
        abnormalCount: 0
      }
    }

    const systolicValues = data.map(item => item.systolic)
    const diastolicValues = data.map(item => item.diastolic)
    const heartRateValues = data.filter(item => item.heartRate).map(item => item.heartRate)

    const avgSystolic = Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length)
    const avgDiastolic = Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length)
    const avgHeartRate = heartRateValues.length > 0
      ? Math.round(heartRateValues.reduce((a, b) => a + b, 0) / heartRateValues.length)
      : 0

    const maxSystolic = Math.max(...systolicValues)
    const maxDiastolic = Math.max(...diastolicValues)
    const maxHeartRate = heartRateValues.length > 0 ? Math.max(...heartRateValues) : 0

    const minSystolic = Math.min(...systolicValues)
    const minDiastolic = Math.min(...diastolicValues)
    const minHeartRate = heartRateValues.length > 0 ? Math.min(...heartRateValues) : 0

    const abnormalCount = data.filter(item => item.isAbnormal).length

    return {
      avgSystolic,
      avgDiastolic,
      avgHeartRate,
      maxSystolic,
      maxDiastolic,
      maxHeartRate,
      minSystolic,
      minDiastolic,
      minHeartRate,
      abnormalCount
    }
  }
}

/**
 * 用户相关操作
 */
const UserService = {
  /**
   * 获取用户信息
   */
  async getUserInfo() {
    try {
      const res = await db.collection(COLLECTIONS.USERS).get()

      if (res.data.length > 0) {
        return {
          success: true,
          data: res.data[0]
        }
      }

      return {
        success: false,
        message: '用户不存在',
        data: null
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return {
        success: false,
        message: error.message || '获取失败',
        data: null
      }
    }
  },

  /**
   * 更新用户信息
   */
  async updateUserInfo(data) {
    try {
      // 先获取当前用户信息以获取_id
      const currentRes = await db.collection(COLLECTIONS.USERS).limit(1).get()

      if (!currentRes.data || currentRes.data.length === 0) {
        return {
          success: false,
          message: '用户不存在'
        }
      }

      const docId = currentRes.data[0]._id

      // 更新用户信息,排除_id和_openid字段
      const { _id, _openid, createTime, ...updateData } = data

      const res = await db.collection(COLLECTIONS.USERS).doc(docId).update({
        data: {
          ...updateData,
          updateTime: db.serverDate()
        }
      })

      return {
        success: true,
        data: res
      }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return {
        success: false,
        message: error.message || '更新失败'
      }
    }
  }
}

module.exports = {
  GlucoseService,
  PressureService,
  UserService,
  MEASURE_TYPES,
  MEASURE_TYPE_NAMES,
  COLLECTIONS
}
