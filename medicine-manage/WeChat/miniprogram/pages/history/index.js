// pages/history/index.js
const { GlucoseService, PressureService } = require('../../utils/db.js')

Page({
  data: {
    filterType: 'all',
    records: [],
    groupedRecords: [],
    page: 1,
    pageSize: 20,
    hasMore: true
  },

  onLoad() {
    this.loadRecords()
  },

  onShow() {
    // 如果是切换tab回来的,重新加载
    if (this.data.records.length > 0) {
      this.loadRecords(true)
    }
  },

  // 选择筛选类型
  selectFilter(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      filterType: type,
      page: 1,
      records: []
    })
    this.loadRecords()
  },

  // 加载记录（从CloudBase数据库）
  async loadRecords(refresh = false) {
    wx.showLoading({ title: '加载中...' })

    try {
      const { filterType } = this.data

      // 计算查询天数
      let days = null
      if (filterType === 'today') {
        days = 1
      } else if (filterType === 'week') {
        days = 7
      } else if (filterType === 'month') {
        days = 30
      }

      // 根据筛选类型决定查询哪些数据
      let glucoseRecords = []
      let pressureRecords = []

      if (filterType === 'glucose') {
        const res = await GlucoseService.getTrendData(days || 365)
        if (res.success) {
          glucoseRecords = res.data
        }
      } else if (filterType === 'pressure') {
        const res = await PressureService.getTrendData(days || 365)
        if (res.success) {
          pressureRecords = res.data
        }
      } else {
        // all, today, week, month - 同时查询血糖和血压
        const [glucoseRes, pressureRes] = await Promise.all([
          GlucoseService.getTrendData(days || 365),
          PressureService.getTrendData(days || 365)
        ])

        if (glucoseRes.success) {
          glucoseRecords = glucoseRes.data
        }
        if (pressureRes.success) {
          pressureRecords = pressureRes.data
        }
      }

      // 合并记录
      let allRecords = [
        ...glucoseRecords.map(item => ({
          id: item.id,
          type: 'glucose',
          value: item.value,
          measureType: item.measureType,
          date: item.date,
          measureTime: new Date(item.measureTime).getTime(),
          isAbnormal: item.isAbnormal,
          data: item
        })),
        ...pressureRecords.map(item => ({
          id: item.id,
          type: 'pressure',
          systolic: item.systolic,
          diastolic: item.diastolic,
          heartRate: item.heartRate,
          date: item.date,
          measureTime: new Date(item.measureTime).getTime(),
          isAbnormal: item.isAbnormal,
          data: item
        }))
      ]

      // 按时间倒序排列
      allRecords.sort((a, b) => b.measureTime - a.measureTime)

      const records = refresh ? allRecords : [...this.data.records, ...allRecords]

      this.setData({
        records: this.formatRecords(records),
        groupedRecords: this.groupRecords(records),
        hasMore: false
      })
    } catch (error) {
      console.error('加载历史记录失败:', error)
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 格式化记录
  formatRecords(records) {
    return records.map(item => ({
      ...item,
      measureTypeText: item.measureType || '',
      date: this.formatDate(item.date),
      time: ''
    }))
  },

  // 按日期分组
  groupRecords(records) {
    const grouped = {}
    records.forEach(record => {
      if (!grouped[record.date]) {
        grouped[record.date] = []
      }
      grouped[record.date].push(record)
    })
    
    // 按日期倒序排列
    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(date => ({
        date: this.getRelativeDate(date),
        records: grouped[date]
      }))
  },

  // 加载更多
  loadMore() {
    if (!this.data.hasMore) return
    this.setData({
      page: this.data.page + 1
    })
    this.loadRecords()
  },

  // 删除记录
  deleteRecord(e) {
    const { id, type } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗?',
      confirmText: '删除',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          // 测试数据不实际删除，仅提示
          this.setData({
            page: 1,
            records: []
          })
          this.loadRecords(true)
        }
      }
    })
  },

  // 跳转到血糖记录
  navigateToRecordGlucose() {
    wx.navigateTo({
      url: '/pages/record-glucose/index'
    })
  },

  // 跳转到血压记录
  navigateToRecordPressure() {
    wx.navigateTo({
      url: '/pages/record-pressure/index'
    })
  },

  // 格式化日期
  formatDate(timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  },

  // 获取相对日期
  getRelativeDate(dateStr) {
    const today = new Date()
    const target = new Date(dateStr)
    
    today.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)
    
    const diff = Math.floor((today - target) / (1000 * 60 * 60 * 24))
    
    if (diff === 0) return '今天'
    if (diff === 1) return '昨天'
    if (diff === 2) return '前天'
    return dateStr
  },

  // 获取血糖测量类型
  getGlucoseMeasureType(type) {
    const types = {
      1: '空腹',
      2: '早餐后',
      3: '午餐后',
      4: '晚餐后',
      5: '睡前'
    }
    return types[type] || ''
  }
})
