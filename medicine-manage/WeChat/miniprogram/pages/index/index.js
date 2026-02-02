// pages/index/index.js
const app = getApp()
const { GlucoseService, PressureService, MEASURE_TYPE_NAMES } = require('../../utils/db.js')

Page({
  data: {
    today: '',
    todayMeasureCount: 0,
    todayGlucoseCount: 0,
    todayPressureCount: 0,
    todayGlucose: [],
    todayPressure: [],
    abnormalAlerts: [],
    recentRecords: []
  },

  onLoad() {
    this.initCloud()
    this.loadTodayData()
    this.loadAbnormalAlerts()
    this.loadRecentRecords()
  },

  onShow() {
    this.loadTodayData()
    this.loadAbnormalAlerts()
    this.loadRecentRecords()
  },

  // 初始化云开发
  initCloud() {
    if (!wx.cloud) {
      wx.showToast({
        title: '请升级微信版本',
        icon: 'none'
      })
      return
    }
  },

  // 加载今日数据（从CloudBase数据库）
  async loadTodayData() {
    wx.showLoading({ title: '加载中...' })

    try {
      const today = new Date()
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

      this.setData({
        today: dateStr
      })

      // 并行查询今日血糖和血压记录
      const [glucoseRes, pressureRes] = await Promise.all([
        GlucoseService.getTodayRecords(),
        PressureService.getTodayRecords()
      ])

      if (glucoseRes.success) {
        this.setData({
          todayGlucose: glucoseRes.data,
          todayGlucoseCount: glucoseRes.data.length
        })
      }

      if (pressureRes.success) {
        this.setData({
          todayPressure: pressureRes.data,
          todayPressureCount: pressureRes.data.length,
          todayMeasureCount: (glucoseRes.success ? glucoseRes.data.length : 0) + pressureRes.data.length
        })
      }
    } catch (error) {
      console.error('加载今日数据失败:', error)
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 加载异常预警（从CloudBase数据库）
  async loadAbnormalAlerts() {
    try {
      // 查询最近7天的血糖记录
      const glucoseRes = await GlucoseService.getTrendData(7)
      // 查询最近7天的血压记录
      const pressureRes = await PressureService.getTrendData(7)

      const alerts = []

      if (glucoseRes.success) {
        glucoseRes.data.forEach(item => {
          if (item.isAbnormal) {
            alerts.push({
              id: item.id,
              alertType: item.abnormalType === 1 ? '高血糖预警' : '低血糖预警',
              alertValue: `${item.value} mmol/L (${item.measureType})`,
              alertTime: new Date(item.measureTime).getTime(),
              date: item.date,
              type: 'glucose',
              data: item
            })
          }
        })
      }

      if (pressureRes.success) {
        pressureRes.data.forEach(item => {
          if (item.isAbnormal) {
            alerts.push({
              id: item.id,
              alertType: item.abnormalType === 1 ? '高血压预警' : '低血压预警',
              alertValue: `${item.systolic}/${item.diastolic} mmHg`,
              alertTime: new Date(item.measureTime).getTime(),
              date: item.date,
              type: 'pressure',
              data: item
            })
          }
        })
      }

      // 按时间倒序排序，取最近3条
      alerts.sort((a, b) => b.alertTime - a.alertTime)

      this.setData({
        abnormalAlerts: alerts.slice(0, 3).map(item => ({
          ...item,
          alertTime: this.formatDate(item.date)
        }))
      })
    } catch (error) {
      console.error('加载异常预警失败:', error)
    }
  },

  // 加载最近记录（从CloudBase数据库）
  async loadRecentRecords() {
    try {
      // 查询最近7天的数据
      const [glucoseRes, pressureRes] = await Promise.all([
        GlucoseService.getTrendData(7),
        PressureService.getTrendData(7)
      ])

      const allRecords = []

      if (glucoseRes.success) {
        glucoseRes.data.forEach(item => {
          allRecords.push({
            id: item.id,
            type: 'glucose',
            value: item.value,
            measureType: item.measureType,
            date: item.date,
            measureTime: new Date(item.measureTime).getTime(),
            data: item
          })
        })
      }

      if (pressureRes.success) {
        pressureRes.data.forEach(item => {
          allRecords.push({
            id: item.id,
            type: 'pressure',
            systolic: item.systolic,
            diastolic: item.diastolic,
            heartRate: item.heartRate,
            date: item.date,
            measureTime: new Date(item.measureTime).getTime(),
            data: item
          })
        })
      }

      // 按时间倒序排序，取最近5条
      allRecords.sort((a, b) => b.measureTime - a.measureTime)

      this.setData({
        recentRecords: allRecords.slice(0, 5).map(item => ({
          ...item,
          measureTime: this.formatDate(item.date)
        }))
      })
    } catch (error) {
      console.error('加载最近记录失败:', error)
    }
  },

  // 跳转到血糖记录页面
  navigateToRecordGlucose() {
    wx.navigateTo({
      url: '/pages/record-glucose/index'
    })
  },

  // 跳转到血压记录页面
  navigateToRecordPressure() {
    wx.navigateTo({
      url: '/pages/record-pressure/index'
    })
  },

  // 查看血糖趋势
  viewTrendGlucose() {
    wx.navigateTo({
      url: '/pages/trend-glucose/index'
    })
  },

  // 查看血压趋势
  viewTrendPressure() {
    wx.navigateTo({
      url: '/pages/trend-pressure/index'
    })
  },

  // 跳转到历史记录
  navigateToHistory() {
    wx.switchTab({
      url: '/pages/history/index'
    })
  },

  // 查看记录详情
  viewRecordDetail(e) {
    const item = e.currentTarget.dataset.item
    // 跳转到详情页面(暂时跳转到历史记录)
    wx.switchTab({
      url: '/pages/history/index'
    })
  },

  // 处理预警点击
  handleAlertTap(e) {
    const alert = e.currentTarget.dataset.alert
    wx.showModal({
      title: alert.alertType,
      content: `日期: ${alert.date}\n数值: ${alert.alertValue}`,
      showCancel: false
    })
  },

  // 格式化日期
  formatDate(dateStr) {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}/${day}`
  },

  // 获取血糖测量类型文本
  getGlucoseMeasureType(type) {
    const types = {
      1: '空腹',
      2: '早餐后',
      3: '午餐后',
      4: '晚餐后',
      5: '睡前'
    }
    return types[type] || '其他'
  },

  // 获取预警类型文本
  getAlertTypeText(type) {
    const types = {
      1: '高血糖预警',
      2: '低血糖预警',
      3: '高血压预警',
      4: '低血压预警'
    }
    return types[type] || '异常预警'
  }
})
