// pages/trend-pressure/index.js
const { PressureService } = require('../../utils/db.js')

Page({
  data: {
    timeRange: 7, // 默认显示7天
    chartData: [],
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
  },

  onLoad() {
    this.loadTrendData()
  },

  // 切换时间范围
  changeTimeRange(e) {
    const days = parseInt(e.currentTarget.dataset.days)
    this.setData({ timeRange: days })
    this.loadTrendData()
  },

  // 加载趋势数据（从CloudBase数据库）
  async loadTrendData() {
    wx.showLoading({ title: '加载中...' })

    try {
      const { timeRange } = this.data

      const res = await PressureService.getTrendData(timeRange)

      if (res.success) {
        // 按日期分组，取每天的最新记录
        const groupedData = this.groupDataByDate(res.data)

        this.setData({
          chartData: this.formatChartData(groupedData),
          statistics: res.statistics
        })

        // 绘制图表
        this.drawChart()
      } else {
        wx.showToast({
          title: res.message || '加载失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载血压趋势数据失败:', error)
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 按日期分组数据
  groupDataByDate(data) {
    const grouped = {}

    data.forEach(item => {
      if (!grouped[item.date]) {
        grouped[item.date] = {
          date: item.date,
          systolic: item.systolic,
          diastolic: item.diastolic,
          heartRate: item.heartRate,
          isAbnormal: item.isAbnormal
        }
      }
    })

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date))
  },

  // 计算血压统计信息
  calculatePressureStatistics(data) {
    const systolicValues = data.map(item => item.systolic)
    const diastolicValues = data.map(item => item.diastolic)
    const heartRateValues = data.map(item => item.heartRate)

    const avgSystolic = systolicValues.length > 0
      ? Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length)
      : 0
    const avgDiastolic = diastolicValues.length > 0
      ? Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length)
      : 0
    const avgHeartRate = heartRateValues.length > 0
      ? Math.round(heartRateValues.reduce((a, b) => a + b, 0) / heartRateValues.length)
      : 0

    const maxSystolic = systolicValues.length > 0 ? Math.max(...systolicValues) : 0
    const maxDiastolic = diastolicValues.length > 0 ? Math.max(...diastolicValues) : 0
    const maxHeartRate = heartRateValues.length > 0 ? Math.max(...heartRateValues) : 0

    const minSystolic = systolicValues.length > 0 ? Math.min(...systolicValues) : 0
    const minDiastolic = diastolicValues.length > 0 ? Math.min(...diastolicValues) : 0
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
  },

  // 格式化图表数据
  formatChartData(data) {
    return data.map(item => ({
      ...item,
      date: this.formatDate(item.date)
    }))
  },

  // 绘制三线图表（收缩压、舒张压、心率）
  drawChart() {
    const query = wx.createSelectorQuery().in(this)
    query.select('.chart-canvas').boundingClientRect()
    query.exec((res) => {
      if (!res || !res[0]) return

      const canvasWidth = res[0].width
      const canvasHeight = res[0].height
      const ctx = wx.createCanvasContext('pressureChart', this)
      const { chartData } = this.data

      if (chartData.length === 0) {
        ctx.draw()
        return
      }

      const padding = { left: 60, right: 40, top: 80, bottom: 60 }
      const chartWidth = canvasWidth - padding.left - padding.right
      const chartHeight = canvasHeight - padding.top - padding.bottom

      // 血压范围 60-180，心率范围 50-120
      const maxPressure = Math.max(...chartData.map(item => item.systolic), 180)
      const minPressure = Math.min(...chartData.map(item => item.diastolic), 60)
      const maxHeartRate = Math.max(...chartData.map(item => item.heartRate), 120)
      const minHeartRate = Math.min(...chartData.map(item => item.heartRate), 50)

      // 绘制坐标轴
      ctx.beginPath()
      ctx.setStrokeStyle('#E0E0E0')
      ctx.setLineWidth(1)
      ctx.moveTo(padding.left, padding.top)
      ctx.lineTo(padding.left, canvasHeight - padding.bottom)
      ctx.lineTo(canvasWidth - padding.right, canvasHeight - padding.bottom)
      ctx.stroke()

      // 绘制Y轴刻度（左侧血压）
      const yStepPressure = (maxPressure - minPressure) / 5
      for (let i = 0; i <= 5; i++) {
        const yValue = minPressure + yStepPressure * i
        const y = canvasHeight - padding.bottom - (i / 5) * chartHeight
        ctx.setFontSize(12)
        ctx.setFillStyle('#999999')
        ctx.fillText(Math.round(yValue), padding.left - 35, y + 4)
      }

      // 绘制参考线 - 收缩压正常上限 140
      const y140 = canvasHeight - padding.bottom - ((140 - minPressure) / (maxPressure - minPressure)) * chartHeight
      ctx.beginPath()
      ctx.setStrokeStyle('#4A90E2')
      ctx.setLineWidth(1)
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding.left, y140)
      ctx.lineTo(canvasWidth - padding.right, y140)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.setFontSize(12)
      ctx.setFillStyle('#4A90E2')
      ctx.fillText('140', padding.left + 5, y140 - 5)

      // 绘制参考线 - 舒张压正常上限 90
      const y90 = canvasHeight - padding.bottom - ((90 - minPressure) / (maxPressure - minPressure)) * chartHeight
      ctx.beginPath()
      ctx.setStrokeStyle('#FFB800')
      ctx.setLineWidth(1)
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding.left, y90)
      ctx.lineTo(canvasWidth - padding.right, y90)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.setFontSize(12)
      ctx.setFillStyle('#FFB800')
      ctx.fillText('90', padding.left + 5, y90 - 5)

      // 绘制X轴日期
      const step = Math.ceil(chartData.length / 10)
      chartData.forEach((item, index) => {
        if (index % step === 0 || index === chartData.length - 1) {
          const x = padding.left + (chartWidth / (chartData.length - 1)) * index
          ctx.setFontSize(10)
          ctx.setFillStyle('#999999')
          ctx.fillText(item.date, x - 15, canvasHeight - padding.bottom + 20)
        }
      })

      // 绘制收缩压线（蓝色 #4A90E2）
      this.drawPressureLine(ctx, chartData, padding, canvasWidth, canvasHeight, chartWidth, chartHeight, maxPressure, minPressure, '#4A90E2', 'systolic')

      // 绘制舒张压线（黄色 #FFB800）
      this.drawPressureLine(ctx, chartData, padding, canvasWidth, canvasHeight, chartWidth, chartHeight, maxPressure, minPressure, '#FFB800', 'diastolic')

      // 绘制心率线（红色 #FF6B6B）
      this.drawPressureLine(ctx, chartData, padding, canvasWidth, canvasHeight, chartWidth, chartHeight, maxHeartRate, minHeartRate, '#FF6B6B', 'heartRate')

      ctx.draw()
    })
  },

  // 绘制单条线
  drawPressureLine(ctx, data, padding, canvasWidth, canvasHeight, chartWidth, chartHeight, maxValue, minValue, color, valueKey) {
    const chartDataValueKey = valueKey === 'heartRate' ? 'heartRate' : valueKey

    // 先绘制连线
    data.forEach((item, index) => {
      if (index > 0) {
        const prevValue = data[index - 1][chartDataValueKey]
        const prevX = padding.left + (chartWidth / (data.length - 1)) * (index - 1)
        const prevY = canvasHeight - padding.bottom - ((prevValue - minValue) / (maxValue - minValue)) * chartHeight

        const value = item[chartDataValueKey]
        const x = padding.left + (chartWidth / (data.length - 1)) * index
        const y = canvasHeight - padding.bottom - ((value - minValue) / (maxValue - minValue)) * chartHeight

        ctx.beginPath()
        ctx.setStrokeStyle(color)
        ctx.setLineWidth(2)
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    })

    // 再绘制点（在连线之上）
    data.forEach((item, index) => {
      const value = item[chartDataValueKey]
      const x = padding.left + (chartWidth / (data.length - 1)) * index
      const y = canvasHeight - padding.bottom - ((value - minValue) / (maxValue - minValue)) * chartHeight

      ctx.beginPath()
      ctx.setFillStyle(color)
      const pointSize = valueKey === 'heartRate' ? 4 : 5
      ctx.arc(x, y, pointSize, 0, 2 * Math.PI)
      ctx.fill()
    })
  },

  // 格式化日期
  formatDate(dateStr) {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}/${day}`
  }
})
