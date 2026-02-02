# 新用户注册和编辑保存问题修复方案

## 🔍 问题分析

### 问题1: 小程序新用户没有注册流程
**现状:**
- `profile/index.js` 的 `loadUserInfo` 方法检测到用户不存在时,直接调用 `createNewUser`
- `createNewUser` 直接调用 `db.collection('users').add()` 创建用户
- 没有调用 `login` 云函数获取 `_openid`

**问题:**
- 新用户创建时缺少 `_openid` 字段
- 导致后续更新操作失败

### 问题2: 后台系统使用模拟数据
**现状:**
- `admin/src/views/users/index.vue` 的 `loadUserList` 方法使用 `setTimeout` 返回模拟数据
- 没有调用 CloudBase API

**问题:**
- 后台无法看到真实用户数据
- 无法实现前后端数据同步

### 问题3: 编辑保存失败
**现状:**
- `edit-profile/index.js` 的 `updateProfile` 调用 `UserService.updateUserInfo`
- 之前修复的代码已经包含了获取 `_id` 的逻辑

**问题:**
- 新用户可能还是缺少某些字段导致保存失败

## ✅ 解决方案

### 1. 修复小程序新用户注册流程

修改 `profile/index.js`:
```javascript
// 加载用户信息
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
    
    if (loginRes.result.success) {
      // 登录成功,重新加载用户信息
      this.loadUserInfo()
    } else {
      wx.showToast({
        title: loginRes.result.message || '注册失败',
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
}
```

### 2. 部署登录云函数

云函数 `login` 已经存在,需要部署:
```bash
cd d:/project/medicine-manage/WeChat/cloudfunctions/login
npm install
```

然后在微信开发者工具中右键点击 `login` 文件夹,选择"上传并部署:云端安装依赖"

### 3. 修复后台系统连接CloudBase

#### 方案A: 使用CloudBase HTTP API (推荐)

创建云函数提供HTTP访问接口:

`getUsers` 云函数:
```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { page = 1, pageSize = 20, keyword = '' } = event
  
  try {
    let query = db.collection('users')
    
    if (keyword) {
      query = query.where({
        nickname: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      })
    }
    
    // 查询总数
    const countRes = await query.count()
    const total = countRes.total
    
    // 查询分页数据
    const skip = (page - 1) * pageSize
    const dataRes = await query
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      data: dataRes.data,
      total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return {
      success: false,
      message: error.message || '获取失败'
    }
  }
}
```

修改后台 API 调用:
```javascript
// admin/src/api/users.js
import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/cloudapi/getUsers',
    method: 'get',
    params
  })
}
```

#### 方案B: 使用CloudBase Node SDK (需要后端服务)

创建Express后端服务,使用 `@cloudbase/node-sdk` 连接CloudBase

### 4. 优化新用户编辑保存

确保 `edit-profile/index.js` 的 `updateProfile` 包含所有必要字段:
```javascript
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
      avatar: this.data.userInfo.avatar || currentData.avatar || '',
      updateTime: new Date().toISOString()
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
}
```

## 📋 实施步骤

### 步骤1: 修复小程序注册流程
- [ ] 修改 `profile/index.js` 使用登录云函数
- [ ] 部署 `login` 云函数
- [ ] 测试新用户注册流程

### 步骤2: 创建后台API接口
- [ ] 创建 `getUsers` 云函数
- [ ] 创建 `getUserDetail` 云函数
- [ ] 部署云函数
- [ ] 修改后台API调用

### 步骤3: 优化编辑保存
- [ ] 完善 `edit-profile/index.js` 的 `updateProfile` 方法
- [ ] 测试新用户编辑保存

### 步骤4: 配置HTTP访问
- [ ] 为云函数配置HTTP访问路径
- [ ] 更新后台API基础URL

## 🧪 测试计划

1. **新用户注册测试**
   - 清除小程序缓存
   - 重新打开小程序
   - 进入"我的"页面
   - 验证是否自动注册

2. **编辑保存测试**
   - 新用户进入编辑页面
   - 修改信息并保存
   - 验证保存成功

3. **后台数据同步测试**
   - 在小程序中注册/编辑用户
   - 在后台管理系统查看用户列表
   - 验证数据是否同步

## ⚠️ 注意事项

1. CloudBase云函数需要HTTP访问权限才能被后台调用
2. 后台系统需要配置正确的API基础URL
3. 建议先在开发环境测试,确认无误后再部署到生产环境
