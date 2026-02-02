// pages/record-glucose/index.js
const { GlucoseService, MEASURE_TYPE_NAMES } = require('../../utils/db.js')

Page({
  data: {
    glucoseValue: '',
    measureType: 1,
    measureTime: '',
    photoUrl: '',
    recognizing: false,
    showConfirm: false,
    isAbnormal: false,
    abnormalMessage: '',
    focus: true
  },

  onLoad() {
    // 设置默认时间为当前时间
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    this.setData({
      measureTime: `${hours}:${minutes}`
    })
  },

  // 血糖值输入
  onGlucoseInput(e) {
    let value = e.detail.value
    // 限制小数点后1位
    if (value.includes('.')) {
      const parts = value.split('.')
      if (parts[1] && parts[1].length > 1) {
        value = `${parts[0]}.${parts[1].substring(0, 1)}`
      }
    }
    // 限制最大值
    if (parseFloat(value) > 30) {
      value = '30'
    }
    this.setData({
      glucoseValue: value,
      showConfirm: false
    })
  },

  // 选择测量时间类型
  selectMeasureType(e) {
    const type = parseInt(e.currentTarget.dataset.type)
    this.setData({
      measureType: type
    })
  },

  // 测量时间改变
  onTimeChange(e) {
    this.setData({
      measureTime: e.detail.value
    })
  },

  // 拍照
  takePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      success: (res) => {
        this.handlePhoto(res.tempFiles[0].tempFilePath)
      }
    })
  },

  // 从相册选择
  chooseFromAlbum() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        this.handlePhoto(res.tempFiles[0].tempFilePath)
      }
    })
  },

  // 处理照片
  handlePhoto(filePath) {
    this.setData({ recognizing: true })
    
    // 上传照片到云存储
    wx.cloud.uploadFile({
      cloudPath: `glucose/${Date.now()}.jpg`,
      filePath: filePath
    }).then(uploadRes => {
      this.setData({ photoUrl: uploadRes.fileID })
      
      // 调用AI识别
      return wx.cloud.callFunction({
        name: 'recognizeFromPhoto',
        data: {
          photoUrl: uploadRes.fileID,
          type: 1
        }
      })
    }).then(res => {
      const result = res.result
      if (result.success && result.result.glucoseValue) {
        this.setData({
          glucoseValue: String(result.result.glucoseValue),
          recognizing: false
        })
        wx.showToast({
          title: '识别成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: '识别失败,请手动输入',
          icon: 'none'
        })
        this.setData({ recognizing: false })
      }
    }).catch(err => {
      console.error('照片识别失败:', err)
      wx.showToast({
        title: '识别失败,请手动输入',
        icon: 'none'
      })
      this.setData({ recognizing: false })
    })
  },

  // 移除照片
  removePhoto() {
    this.setData({
      photoUrl: ''
    })
  },

  // 保存记录
  onSave() {
    const { glucoseValue, measureType, measureTime, photoUrl } = this.data
    
    // 验证输入
    if (!glucoseValue) {
      wx.showToast({
        title: '请输入血糖值',
        icon: 'none'
      })
      return
    }
    
    const value = parseFloat(glucoseValue)
    if (value < 2.0 || value > 30.0) {
      wx.showToast({
        title: '血糖值应在2.0-30.0之间',
        icon: 'none'
      })
      return
    }
    
    if (!measureTime) {
      wx.showToast({
        title: '请选择测量时间',
        icon: 'none'
      })
      return
    }

    // 检查是否异常
    this.checkAbnormal(value, measureType)
  },

  // 检查是否异常
  checkAbnormal(value, measureType) {
    // 这里简化处理,实际应从用户信息获取病史
    const hasDiabetes = false
    
    let isAbnormal = false
    let abnormalMessage = ''
    
    if (measureType === 1) { // 空腹
      if (value < 3.9) {
        isAbnormal = true
        abnormalMessage = '血糖偏低,请注意补充糖分'
      } else if (hasDiabetes && value > 7.0) {
        isAbnormal = true
        abnormalMessage = '血糖偏高,请注意饮食'
      } else if (!hasDiabetes && value > 6.1) {
        isAbnormal = true
        abnormalMessage = '血糖偏高,建议咨询医生'
      }
    } else { // 餐后
      if (value < 3.9) {
        isAbnormal = true
        abnormalMessage = '血糖偏低,请注意补充糖分'
      } else if (hasDiabetes && value > 10.0) {
        isAbnormal = true
        abnormalMessage = '血糖偏高,请注意饮食'
      } else if (!hasDiabetes && value > 7.8) {
        isAbnormal = true
        abnormalMessage = '血糖偏高,建议咨询医生'
      }
    }
    
    this.setData({
      isAbnormal,
      abnormalMessage,
      showConfirm: true
    })
    
    // 显示确认对话框
    wx.showModal({
      title: '确认保存',
      content: `血糖值: ${value} mmol/L\n${this.getMeasureTypeText(measureType)}\n${isAbnormal ? abnormalMessage : '数据正常'}`,
      confirmText: '保存',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          this.saveToDatabase()
        } else {
          this.setData({ showConfirm: false })
        }
      }
    })
  },

  // 保存到数据库
  async saveToDatabase() {
    wx.showLoading({ title: '保存中...' })

    try {
      const now = new Date()
      const measureDateTime = new Date()
      const [hours, minutes] = this.data.measureTime.split(':')
      measureDateTime.setHours(parseInt(hours), parseInt(minutes))

      const res = await GlucoseService.addRecord({
        measureType: this.data.measureType,
        value: parseFloat(this.data.glucoseValue),
        measureTime: measureDateTime,
        photoUrl: this.data.photoUrl
      })

      wx.hideLoading()

      if (res.success) {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        wx.showToast({
          title: res.message || '保存失败',
          icon: 'none'
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('保存失败:', error)
      wx.showToast({
        title: '保存失败,请重试',
        icon: 'none'
      })
    }
  },

  // 取消
  onCancel() {
    wx.showModal({
      title: '提示',
      content: '确定要放弃本次记录吗?',
      confirmText: '放弃',
      cancelText: '继续',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  },

  // 获取测量类型文本
  getMeasureTypeText(type) {
    const types = {
      1: '空腹',
      2: '早餐后',
      3: '午餐后',
      4: '晚餐后',
      5: '睡前'
    }
    return types[type] || '其他'
  }
})
