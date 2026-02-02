# 个人资料编辑功能修复说明

## 问题描述

在小程序的"我的"页面编辑个人资料后,保存时出现错误:
```
collection.doc:fail -1.docId must not be empty
```

## 问题原因

错误的原因是在更新用户信息时,缺少必要的文档ID (`_id`)。

### 具体问题

1. **UserService.updateUserInfo 方法** (utils/db.js:529)
   - 直接使用 `data._id` 作为文档ID
   - 但传入的数据中可能没有包含 `_id` 字段

2. **profile/index.js 的 updateUserInfo 方法**
   - 合并数据时没有确保包含 `_id` 字段

3. **edit-profile/index.js 的 updateProfile 方法**
   - 同样存在 `_id` 缺失的问题

## 修复方案

### 1. 修复 UserService.updateUserInfo 方法

**文件**: `WeChat/miniprogram/utils/db.js`

**修改内容**:
```javascript
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
```

**修复要点**:
1. 在更新前先查询获取当前用户的 `_id`
2. 使用正确的 `_id` 进行更新
3. 排除不能修改的字段 (`_id`, `_openid`, `createTime`)

### 2. 修复 profile/index.js 的 updateUserInfo 方法

**文件**: `WeChat/miniprogram/pages/profile/index.js`

**修改内容**:
```javascript
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
}
```

**修复要点**:
1. 先查询获取完整的用户信息(包括 `_id`, `_openid`, `createTime`)
2. 确保传递完整的用户数据给 UserService

### 3. 修复 edit-profile/index.js 的 updateProfile 方法

**文件**: `WeChat/miniprogram/pages/edit-profile/index.js`

**修改内容**:
```javascript
async updateProfile() {
  wx.showLoading({ title: '保存中...' })

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

    const updateData = {
      _id: currentData._id,
      _openid: currentData._openid,
      createTime: currentData.createTime,
      nickname: this.data.nickname.trim(),
      gender: this.data.gender,
      birthday: this.data.birthday,
      hasDiabetes: this.data.hasDiabetes,
      hasHypertension: this.data.hasHypertension,
      emergencyContact: this.data.emergencyContact.trim(),
      emergencyPhone: this.data.emergencyPhone.trim(),
      avatar: this.data.userInfo.avatar || ''
    }

    // 计算年龄
    if (updateData.birthday) {
      const birthDate = new Date(updateData.birthday)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      updateData.age = age
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

**修复要点**:
1. 先查询获取完整的用户信息
2. 构建包含 `_id` 的更新数据
3. 确保所有必要字段都正确传递

## 修复后的效果

### 修复前
```
collection.doc:fail -1.docId must not be empty
```

### 修复后
```
✓ 更新成功
```

## 测试步骤

1. 打开小程序
2. 进入"我的"页面
3. 点击"编辑资料"
4. 修改昵称、性别、生日等信息
5. 点击"保存"
6. 应该显示"保存成功"提示
7. 返回"我的"页面,确认信息已更新

## 影响范围

修复的文件:
1. `WeChat/miniprogram/utils/db.js` - UserService.updateUserInfo 方法
2. `WeChat/miniprogram/pages/profile/index.js` - updateUserInfo 方法
3. `WeChat/miniprogram/pages/edit-profile/index.js` - updateProfile 方法

## 相关功能

修复后,以下功能将正常工作:
- ✓ 个人资料编辑保存
- ✓ 糖尿病状态切换
- ✓ 高血压状态切换
- ✓ 个人信息更新

## 技术要点

1. **CloudBase 数据库更新需要文档ID**
   - 使用 `db.collection('users').doc(docId).update()` 更新数据
   - `docId` 必须是有效的文档ID

2. **不能修改的字段**
   - `_id`: 文档唯一标识
   - `_openid`: 用户openid(系统字段)
   - `createTime`: 创建时间(历史数据不应修改)

3. **正确的更新流程**
   - 先查询获取文档ID
   - 使用文档ID进行更新
   - 排除不能修改的字段

## 注意事项

1. 更新前确保用户已存在
2. 查询使用 `limit(1)` 只获取一条记录
3. 更新失败时提供友好的错误提示
4. 更新成功后刷新页面数据

---

**修复时间**: 2026-01-31
**修复状态**: ✅ 已完成
**测试状态**: 待测试
**影响文件**: 3个文件
