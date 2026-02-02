// pages/profile/index.js
const app = getApp()
const { UserService, GlucoseService, PressureService } = require('../../utils/db.js')

Page({
  data: {
    userInfo: {},
    totalRecords: 0,
    glucoseRecords: 0,
    pressureRecords: 0,
    usingDays: 0,
    isDev: true  // 开发环境标识
  },

  onLoad() {
    this.loadUserInfo()
    this.loadStatistics()
  },

  onShow() {
    this.loadUserInfo()
  },

  // 加载用户信息（从CloudBase数据库）
  async loadUserInfo() {
    try {
      const res = await UserService.getUserInfo()
      if (res.success && res.data) {
        this.setData({
          userInfo: {
            ...res.data,
            genderText: this.getGenderText(res.data.gender),
            age: this.calculateAge(res.data.birthday)
          }
        })
      } else if (!res.data) {
        // 用户不存在,调用登录云函数注册
        await this.registerNewUser()
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  },

  // 注册新用户(通过登录云函数)
  async registerNewUser() {
    try {
      wx.showLoading({ title: '注册中...' })

      // 调用登录云函数
      const loginRes = await wx.cloud.callFunction({
        name: 'login'
      })

      wx.hideLoading()

      if (loginRes.result && loginRes.result.success) {
        // 登录成功,重新加载用户信息
        this.loadUserInfo()
      } else {
        wx.showToast({
          title: loginRes.result?.message || '注册失败',
          icon: 'none'
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('注册失败:', error)
      wx.showToast({
        title: '注册失败',
        icon: 'none'
      })
    }
  },

  // 加载统计数据（从CloudBase数据库）
  async loadStatistics() {
    try {
      const [glucoseRes, pressureRes] = await Promise.all([
        GlucoseService.getTrendData(365),
        PressureService.getTrendData(365)
      ])

      const glucoseCount = glucoseRes.success ? glucoseRes.data.length : 0
      const pressureCount = pressureRes.success ? pressureRes.data.length : 0

      // 计算使用天数（取最早的记录日期）
      let usingDays = 0
      if (glucoseRes.success && glucoseRes.data.length > 0) {
        const firstRecord = glucoseRes.data[0]
        const firstDate = new Date(firstRecord.measureTime)
        const today = new Date()
        usingDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24)) + 1
      }

      this.setData({
        totalRecords: glucoseCount + pressureCount,
        glucoseRecords: glucoseCount,
        pressureRecords: pressureCount,
        usingDays: usingDays
      })
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  },

  // 编辑个人资料
  navigateToEditProfile() {
    wx.navigateTo({
      url: '/pages/edit-profile/index'
    })
  },

  // 切换糖尿病状态
  toggleDiabetes() {
    const hasDiabetes = !this.data.userInfo.hasDiabetes
    wx.showModal({
      title: '确认',
      content: `确定将糖尿病状态设置为"${hasDiabetes ? '已患病' : '未患病'}"吗?`,
      success: (res) => {
        if (res.confirm) {
          this.updateUserInfo({ hasDiabetes })
        }
      }
    })
  },

  // 切换高血压状态
  toggleHypertension() {
    const hasHypertension = !this.data.userInfo.hasHypertension
    wx.showModal({
      title: '确认',
      content: `确定将高血压状态设置为"${hasHypertension ? '已患病' : '未患病'}"吗?`,
      success: (res) => {
        if (res.confirm) {
          this.updateUserInfo({ hasHypertension })
        }
      }
    })
  },

  // 更新用户信息（从CloudBase数据库）
  async updateUserInfo(data) {
    wx.showLoading({ title: '更新中...' })

    try {
      // 先获取当前用户信息以包含_id
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

      const res = await UserService.updateUserInfo({
        _id: currentData._id,
        _openid: currentData._openid,
        createTime: currentData.createTime,
        ...currentData,
        ...data
      })

      wx.hideLoading()

      if (res.success) {
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })
        this.loadUserInfo()
      } else {
        wx.showToast({
          title: res.message || '更新失败',
          icon: 'none'
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('更新失败:', error)
      wx.showToast({
        title: '更新失败,请重试',
        icon: 'none'
      })
    }
  },

  // 查看血糖趋势
  navigateToTrendGlucose() {
    wx.navigateTo({
      url: '/pages/trend-glucose/index'
    })
  },

  // 查看血压趋势
  navigateToTrendPressure() {
    wx.navigateTo({
      url: '/pages/trend-pressure/index'
    })
  },

  // 显示关于
  showAbout() {
    wx.showModal({
      title: '关于',
      content: '老人健康记录小程序\n版本: 1.0.0\n\n帮助老年人便捷记录血糖、血压数据,了解健康状况变化。',
      showCancel: false
    })
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗?',
      confirmText: '退出',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          // 清除本地数据
          app.globalData.userInfo = null
          wx.showToast({
            title: '已退出',
            icon: 'success'
          })
        }
      }
    })
  },

  // 导入测试数据
  async importTestData() {
    wx.showModal({
      title: '导入测试数据',
      content: '此操作将导入张大爷的测试数据,原有的测试数据会被覆盖,是否继续?',
      confirmText: '导入',
      confirmColor: '#3B82F6',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '导入中...' })

          try {
            const importRes = await wx.cloud.callFunction({
              name: 'importTestData'
            })

            wx.hideLoading()

            if (importRes.result && importRes.result.success) {
              wx.showModal({
                title: '导入成功',
                content: `用户: ${importRes.result.data.userCount}条\n血糖: ${importRes.result.data.glucoseCount}条\n血压: ${importRes.result.data.pressureCount}条`,
                showCancel: false,
                success: () => {
                  // 重新加载数据
                  this.loadUserInfo()
                  this.loadStatistics()
                }
              })
            } else {
              wx.showToast({
                title: importRes.result?.message || '导入失败',
                icon: 'none',
                duration: 3000
              })
            }
          } catch (error) {
            wx.hideLoading()
            console.error('导入测试数据失败:', error)
            wx.showToast({
              title: '导入失败,请检查云函数是否已部署',
              icon: 'none',
              duration: 3000
            })
          }
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
  },

  // 计算年龄
  calculateAge(birthday) {
    if (!birthday) return ''
    const birth = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }
})
