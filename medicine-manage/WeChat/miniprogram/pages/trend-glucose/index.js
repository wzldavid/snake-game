// pages/trend-glucose/index.js
const { GlucoseService } = require('../../utils/db.js')

Page({
  data: {
    chartData: [],
    statistics: {
      avgFasting: 0,
      avgPostprandial: 0,
      max: 0,
      abnormalCount: 0
    }
  },

  onLoad() {
    this.loadTrendData()
  },

  onReady() {
    // 数据加载完成后会自动绘制图表
  },

  // 加载趋势数据（从CloudBase数据库）
  async loadTrendData() {
    wx.showLoading({ title: '加载中...' })

    try {
      // 查询最近30天的数据
      const res = await GlucoseService.getTrendData(30)

      if (res.success) {
        // 按日期分组，合并空腹和餐后血糖
        const groupedData = this.groupDataByDate(res.data)

        this.setData({
          chartData: this.formatChartData(groupedData),
          statistics: res.statistics
        })

        // 数据加载完成后绘制图表
        this.drawChart()
      } else {
        wx.showToast({
          title: res.message || '加载失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载血糖趋势数据失败:', error)
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
          fastingValue: null,
          postprandialValue: null,
          fastingIsAbnormal: false,
          postprandialIsAbnormal: false
        }
      }
      
      // 判断是否为空腹或餐后血糖
      if (item.measureType === '空腹') {
        grouped[item.date].fastingValue = item.value
        grouped[item.date].fastingIsAbnormal = item.isAbnormal
      } else {
        // 其他都视为餐后血糖（早餐后、午餐后、晚餐后）
        grouped[item.date].postprandialValue = item.value
        grouped[item.date].postprandialIsAbnormal = item.isAbnormal
      }
    })
    
    // 转换为数组并按日期排序
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date))
  },

  // 计算统计信息
  calculateStatistics(data) {
    const fastingValues = data
      .filter(item => item.fastingValue !== null)
      .map(item => item.fastingValue)
    
    const postprandialValues = data
      .filter(item => item.postprandialValue !== null)
      .map(item => item.postprandialValue)
    
    const avgFasting = fastingValues.length > 0 
      ? parseFloat((fastingValues.reduce((a, b) => a + b, 0) / fastingValues.length).toFixed(1))
      : 0
    
    const avgPostprandial = postprandialValues.length > 0
      ? parseFloat((postprandialValues.reduce((a, b) => a + b, 0) / postprandialValues.length).toFixed(1))
      : 0
    
    const allValues = [...fastingValues, ...postprandialValues]
    const max = allValues.length > 0 ? Math.max(...allValues) : 0
    
    const abnormalCount = data.filter(item => 
      item.fastingIsAbnormal || item.postprandialIsAbnormal
    ).length
    
    return {
      avgFasting,
      avgPostprandial,
      max,
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

  // 绘制双线图表
  drawChart() {
    const query = wx.createSelectorQuery().in(this)
    query.select('.chart-canvas').boundingClientRect()
    query.exec((res) => {
      if (!res || !res[0]) return
      
      const canvasWidth = res[0].width
      const canvasHeight = res[0].height
      const ctx = wx.createCanvasContext('glucoseChart', this)
      const { chartData } = this.data

      if (chartData.length === 0) {
        ctx.draw()
        return
      }

      const padding = { left: 80, right: 80, top: 60, bottom: 60 }
      const chartWidth = canvasWidth - padding.left - padding.right
      const chartHeight = canvasHeight - padding.top - padding.bottom

      // 找出所有血糖值的最大最小值
      const allValues = [
        ...chartData.filter(item => item.fastingValue !== null).map(item => item.fastingValue),
        ...chartData.filter(item => item.postprandialValue !== null).map(item => item.postprandialValue)
      ]
      const maxValue = Math.max(...allValues, 12)
      const minValue = Math.min(...allValues, 3)

      // 绘制坐标轴
      ctx.beginPath()
      ctx.setStrokeStyle('#E0E0E0')
      ctx.setLineWidth(1)
      ctx.moveTo(padding.left, padding.top)
      ctx.lineTo(padding.left, canvasHeight - padding.bottom)
      ctx.lineTo(canvasWidth - padding.right, canvasHeight - padding.bottom)
      ctx.stroke()

      // 绘制Y轴刻度
      const yStep = (maxValue - minValue) / 5
      for (let i = 0; i <= 5; i++) {
        const yValue = minValue + yStep * i
        const y = canvasHeight - padding.bottom - (i / 5) * chartHeight
        ctx.setFontSize(14)
        ctx.setFillStyle('#999999')
        ctx.fillText(parseFloat(yValue.toFixed(1)), padding.left - 50, y + 5)
      }

      // 绘制X轴日期（每隔5个数据点显示一个日期）
      chartData.forEach((item, index) => {
        if (index % 5 === 0 || index === chartData.length - 1) {
          const x = padding.left + (chartWidth / (chartData.length - 1)) * index
          ctx.setFontSize(12)
          ctx.setFillStyle('#999999')
          ctx.fillText(item.date, x - 20, canvasHeight - padding.bottom + 20)
        }
      })

      // 绘制空腹血糖线（蓝色）
      const fastingData = chartData.filter(item => item.fastingValue !== null)
      this.drawLine(ctx, fastingData, chartData, padding, canvasWidth, canvasHeight, chartWidth, chartHeight, maxValue, minValue, '#4A90E2', 5)

      // 绘制餐后血糖线（橙色）
      const postprandialData = chartData.filter(item => item.postprandialValue !== null)
      this.drawLine(ctx, postprandialData, chartData, padding, canvasWidth, canvasHeight, chartWidth, chartHeight, maxValue, minValue, '#FF9F43', 5)

      // 绘制参考线（空腹正常值上限 7.0）
      const y7 = canvasHeight - padding.bottom - ((7.0 - minValue) / (maxValue - minValue)) * chartHeight
      ctx.beginPath()
      ctx.setStrokeStyle('#FFB800')
      ctx.setLineWidth(1)
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding.left, y7)
      ctx.lineTo(canvasWidth - padding.right, y7)
      ctx.stroke()
      ctx.setLineDash([])

      // 绘制参考线（餐后正常值上限 11.1）
      const y11 = canvasHeight - padding.bottom - ((11.1 - minValue) / (maxValue - minValue)) * chartHeight
      ctx.beginPath()
      ctx.setStrokeStyle('#FFB800')
      ctx.setLineWidth(1)
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding.left, y11)
      ctx.lineTo(canvasWidth - padding.right, y11)
      ctx.stroke()
      ctx.setLineDash([])

      // 绘制参考线标签
      ctx.setFontSize(14)
      ctx.setFillStyle('#FFB800')
      ctx.fillText('7.0', padding.left + 10, y7 - 5)
      ctx.fillText('11.1', padding.left + 10, y11 - 5)

      ctx.draw()
    })
  },

  // 绘制单条线
  drawLine(ctx, lineData, allData, padding, canvasWidth, canvasHeight, chartWidth, chartHeight, maxValue, minValue, color, pointSize) {
    // 先绘制连线
    lineData.forEach((item, index) => {
      if (index > 0) {
        const prevItem = lineData[index - 1]
        const prevValue = prevItem.fastingValue !== null ? prevItem.fastingValue : prevItem.postprandialValue
        const prevDataIndex = allData.findIndex(d => d.date === prevItem.date)
        const prevX = padding.left + (chartWidth / (allData.length - 1)) * prevDataIndex
        const prevY = canvasHeight - padding.bottom - ((prevValue - minValue) / (maxValue - minValue)) * chartHeight

        const value = item.fastingValue !== null ? item.fastingValue : item.postprandialValue
        const dataIndex = allData.findIndex(d => d.date === item.date)
        const x = padding.left + (chartWidth / (allData.length - 1)) * dataIndex
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
    lineData.forEach((item, index) => {
      const value = item.fastingValue !== null ? item.fastingValue : item.postprandialValue

      // 找到该数据在 allData 中的索引
      const dataIndex = allData.findIndex(d => d.date === item.date)
      const x = padding.left + (chartWidth / (allData.length - 1)) * dataIndex
      const y = canvasHeight - padding.bottom - ((value - minValue) / (maxValue - minValue)) * chartHeight

      // 绘制点
      ctx.beginPath()
      ctx.setFillStyle(color)
      ctx.arc(x, y, pointSize, 0, 2 * Math.PI)
      ctx.fill()

      // 如果是异常值，用红色边框
      const isAbnormal = item.fastingIsAbnormal || item.postprandialIsAbnormal
      if (isAbnormal) {
        ctx.beginPath()
        ctx.setStrokeStyle('#FF6B6B')
        ctx.setLineWidth(2)
        ctx.arc(x, y, pointSize + 2, 0, 2 * Math.PI)
        ctx.stroke()
      }
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
