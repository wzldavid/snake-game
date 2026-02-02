// pages/record-pressure/index.js
const { PressureService } = require('../../utils/db.js')

Page({
  data: {
    systolic: '',
    diastolic: '',
    heartRate: '',
    measureTime: '',
    photoUrl: '',
    recognizing: false,
    showConfirm: false,
    isAbnormal: false,
    abnormalMessage: ''
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

  // 收缩压输入
  onSystolicInput(e) {
    let value = e.detail.value
    // 限制最大值
    if (parseInt(value) > 250) {
      value = '250'
    }
    this.setData({
      systolic: value,
      showConfirm: false
    })
  },

  // 舒张压输入
  onDiastolicInput(e) {
    let value = e.detail.value
    // 限制最大值
    if (parseInt(value) > 150) {
      value = '150'
    }
    this.setData({
      diastolic: value,
      showConfirm: false
    })
  },

  // 心率输入
  onHeartRateInput(e) {
    let value = e.detail.value
    // 限制范围
    if (parseInt(value) > 150) {
      value = '150'
    }
    this.setData({
      heartRate: value
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
      cloudPath: `pressure/${Date.now()}.jpg`,
      filePath: filePath
    }).then(uploadRes => {
      this.setData({ photoUrl: uploadRes.fileID })
      
      // 调用AI识别
      return wx.cloud.callFunction({
        name: 'recognizeFromPhoto',
        data: {
          photoUrl: uploadRes.fileID,
          type: 2
        }
      })
    }).then(res => {
      const result = res.result
      if (result.success) {
        const data = result.result
        if (data.systolic && data.diastolic) {
          this.setData({
            systolic: String(data.systolic),
            diastolic: String(data.diastolic),
            heartRate: data.heartRate ? String(data.heartRate) : '',
            recognizing: false
          })
          wx.showToast({
            title: '识别成功',
            icon: 'success'
          })
        }
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
    const { systolic, diastolic, heartRate, measureTime, photoUrl } = this.data
    
    // 验证输入
    if (!systolic) {
      wx.showToast({
        title: '请输入收缩压',
        icon: 'none'
      })
      return
    }
    
    if (!diastolic) {
      wx.showToast({
        title: '请输入舒张压',
        icon: 'none'
      })
      return
    }
    
    const systolicVal = parseInt(systolic)
    const diastolicVal = parseInt(diastolic)
    
    if (systolicVal < 60 || systolicVal > 250) {
      wx.showToast({
        title: '收缩压应在60-250之间',
        icon: 'none'
      })
      return
    }
    
    if (diastolicVal < 40 || diastolicVal > 150) {
      wx.showToast({
        title: '舒张压应在40-150之间',
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
    this.checkAbnormal(systolicVal, diastolicVal)
  },

  // 检查是否异常
  checkAbnormal(systolic, diastolic) {
    let isAbnormal = false
    let abnormalMessage = ''
    
    if (systolic < 90 || diastolic < 60) {
      isAbnormal = true
      abnormalMessage = '血压偏低,请注意休息'
    } else if (systolic >= 140 || diastolic >= 90) {
      isAbnormal = true
      abnormalMessage = '血压偏高,建议咨询医生'
    }
    
    this.setData({
      isAbnormal,
      abnormalMessage,
      showConfirm: true
    })
    
    // 显示确认对话框
    wx.showModal({
      title: '确认保存',
      content: `血压值: ${systolic}/${diastolic} mmHg\n${this.data.heartRate ? `心率: ${this.data.heartRate} 次/分\n` : ''}${isAbnormal ? abnormalMessage : '数据正常'}`,
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

      const res = await PressureService.addRecord({
        systolic: parseInt(this.data.systolic),
        diastolic: parseInt(this.data.diastolic),
        heartRate: this.data.heartRate ? parseInt(this.data.heartRate) : null,
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
  }
})
