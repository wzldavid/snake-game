// pages/edit-profile/index.js
const { UserService } = require('../../utils/db.js')

Page({
  data: {
    userInfo: {},
    nickname: '',
    gender: 0,
    birthday: '',
    hasDiabetes: false,
    hasHypertension: false,
    emergencyContact: '',
    emergencyPhone: ''
  },

  onLoad() {
    this.loadUserInfo()
  },

  // 加载用户信息
  async loadUserInfo() {
    try {
      const res = await UserService.getUserInfo()
      if (res.success && res.data) {
        const userInfo = res.data
        this.setData({
          userInfo: userInfo,
          nickname: userInfo.nickname || '',
          gender: userInfo.gender || 0,
          birthday: userInfo.birthday || '',
          hasDiabetes: userInfo.hasDiabetes || false,
          hasHypertension: userInfo.hasHypertension || false,
          emergencyContact: userInfo.emergencyContact || '',
          emergencyPhone: userInfo.emergencyPhone || ''
        })
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 昵称输入
  onNicknameInput(e) {
    this.setData({
      nickname: e.detail.value
    })
  },

  // 选择性别
  selectGender(e) {
    const gender = parseInt(e.currentTarget.dataset.gender)
    this.setData({
      gender
    })
  },

  // 选择生日
  onDateChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },

  // 切换糖尿病状态
  toggleDiabetes() {
    this.setData({
      hasDiabetes: !this.data.hasDiabetes
    })
  },

  // 切换高血压状态
  toggleHypertension() {
    this.setData({
      hasHypertension: !this.data.hasHypertension
    })
  },

  // 紧急联系人输入
  onContactInput(e) {
    this.setData({
      emergencyContact: e.detail.value
    })
  },

  // 紧急联系电话输入
  onPhoneInput(e) {
    this.setData({
      emergencyPhone: e.detail.value
    })
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.uploadAvatar(tempFilePath)
      }
    })
  },

  // 上传头像
  uploadAvatar(filePath) {
    wx.showLoading({ title: '上传中...' })

    wx.cloud.uploadFile({
      cloudPath: `avatars/${Date.now()}.jpg`,
      filePath: filePath
    }).then(res => {
      wx.hideLoading()
      this.setData({
        'userInfo.avatar': res.fileID
      })
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      })
    }).catch(err => {
      wx.hideLoading()
      console.error('上传失败:', err)
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      })
    })
  },

  // 保存
  onSave() {
    const { nickname, gender, birthday, hasDiabetes, hasHypertension, emergencyContact, emergencyPhone } = this.data

    // 验证
    if (!nickname || nickname.trim().length === 0) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    if (birthday) {
      // 验证生日是否合理
      const birthDate = new Date(birthday)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 0 || age > 120) {
        wx.showToast({
          title: '生日日期不合理',
          icon: 'none'
        })
        return
      }
    }

    if (emergencyPhone && emergencyPhone.length > 0) {
      // 验证手机号格式
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(emergencyPhone)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return
      }
    }

    this.updateProfile()
  },

  // 更新资料
  async updateProfile() {
    wx.showLoading({ title: '保存中...' })

    try {
      // 先获取当前用户信息以包含_id和_openid
      const currentRes = await wx.cloud.database().collection('users').limit(1).get()

      if (!currentRes.data || currentRes.data.length === 0) {
        wx.hideLoading()
        wx.showToast({
          title: '用户不存在',
          icon: 'none'
        })
        return
      }

      const currentData = currentRes.data[0]

      // 计算年龄
      let age = 0
      if (this.data.birthday) {
        const birthDate = new Date(this.data.birthday)
        const today = new Date()
        age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
      }

      const updateData = {
        _id: currentData._id,
        _openid: currentData._openid,
        createTime: currentData.createTime,
        nickname: this.data.nickname.trim(),
        gender: this.data.gender,
        birthday: this.data.birthday,
        age: age,
        hasDiabetes: this.data.hasDiabetes,
        hasHypertension: this.data.hasHypertension,
        emergencyContact: this.data.emergencyContact.trim(),
        emergencyPhone: this.data.emergencyPhone.trim(),
        avatar: this.data.userInfo.avatar || currentData.avatar || ''
      }

      const res = await UserService.updateUserInfo(updateData)

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
      content: '确定要放弃修改吗?',
      confirmText: '放弃',
      cancelText: '继续',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  },

  // 获取性别文本
  getGenderText(gender) {
    const genders = {
      0: '未知',
      1: '男',
      2: '女'
    }
    return genders[gender] || ''
  }
})
