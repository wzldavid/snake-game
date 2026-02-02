# 数据库设计文档 - 老人健康记录小程序

## 文档信息
- **项目名称**: 老人健康记录小程序
- **文档版本**: v1.0
- **创建日期**: 2026-01-31
- **文档类型**: 数据库设计文档
- **云开发环境ID**: wzldavid-4gwhey9fe011d906

## 1. 数据库概述

### 1.1 数据库类型
使用腾讯云开发云数据库(NoSQL,文档型数据库),支持实时同步、权限控制和弹性扩容。

### 1.2 数据库特性
- **实时同步**: 数据变更实时推送
- **权限控制**: 基于角色的细粒度访问控制
- **自动索引**: 支持复合索引和全文索引
- **事务支持**: 支持多文档事务
- **数据加密**: 静态数据加密存储

### 1.3 数据库环境
- **环境ID**: wzldavid-4gwhey9fe011d906
- **数据库位置**: 华南地区(广州)
- **访问协议**: HTTPS

## 2. 数据集合设计

### 2.1 users(用户表)

**集合名称**: `users`

**用途**: 存储老人用户的基本信息和健康档案

**字段说明**:

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | String | 是 | 自动生成 | 文档唯一ID |
| _openid | String | 是 | - | 用户微信openid,作为数据隔离标识 |
| nickname | String | 是 | - | 老人昵称 |
| avatar | String | 否 | "" | 头像URL |
| gender | Number | 是 | 0 | 性别(0:未知 1:男 2:女) |
| birthday | String | 否 | "" | 出生日期,格式YYYY-MM-DD |
| age | Number | 否 | 0 | 年龄(自动计算) |
| hasDiabetes | Boolean | 是 | false | 是否患有糖尿病 |
| hasHypertension | Boolean | 是 | false | 是否患有高血压 |
| emergencyContact | String | 否 | "" | 紧急联系人 |
| emergencyPhone | String | 否 | "" | 紧急联系电话 |
| createTime | Date | 是 | 当前时间 | 创建时间 |
| updateTime | Date | 是 | 当前时间 | 更新时间 |
| lastLoginTime | Date | 否 | null | 最后登录时间 |

**索引设计**:

```javascript
// 主键索引(默认)
{ "_id": 1 }

// openid索引(用户查询)
{ "_openid": 1 }

// 复合索引(后台按注册时间查询)
{ "createTime": -1 }
```

**示例数据**:

```json
{
  "_id": "user_001",
  "_openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
  "nickname": "张大爷",
  "avatar": "https://xxx.cloud.tencent.com/avatars/user_001.jpg",
  "gender": 1,
  "birthday": "1955-03-15",
  "age": 70,
  "hasDiabetes": true,
  "hasHypertension": false,
  "emergencyContact": "张三",
  "emergencyPhone": "138****8888",
  "createTime": "2026-01-15T10:30:00.000Z",
  "updateTime": "2026-01-31T08:20:00.000Z",
  "lastLoginTime": "2026-01-31T08:20:00.000Z"
}
```

---

### 2.2 blood_glucose(血糖记录表)

**集合名称**: `blood_glucose`

**用途**: 存储老人血糖测量记录

**字段说明**:

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | String | 是 | 自动生成 | 文档唯一ID |
| _openid | String | 是 | - | 用户openid |
| measureTime | Date | 是 | 当前时间 | 测量时间 |
| measureType | Number | 是 | 1 | 测量类型(1:空腹 2:早餐后 3:午餐后 4:晚餐后 5:睡前) |
| measureTypeName | String | 是 | - | 测量类型名称 |
| value | Number | 是 | - | 血糖值(mmol/L) |
| isAbnormal | Boolean | 是 | false | 是否异常 |
| abnormalType | Number | 是 | 0 | 异常类型(0:正常 1:高血糖 2:低血糖) |
| abnormalReason | String | 否 | "" | 异常原因说明 |
| photoUrl | String | 否 | "" | 照片URL(拍照记录时) |
| note | String | 否 | "" | 备注 |
| createTime | Date | 是 | 当前时间 | 记录创建时间 |

**索引设计**:

```javascript
// 主键索引(默认)
{ "_id": 1 }

// openid + 测量时间复合索引(查询用户血糖记录)
{ "_openid": 1, "measureTime": -1 }

// openid + 创建时间复合索引(查询最新记录)
{ "_openid": 1, "createTime": -1 }

// 测量类型索引(统计查询)
{ "measureType": 1 }
```

**示例数据**:

```json
{
  "_id": "glucose_001",
  "_openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
  "measureTime": "2026-01-31T07:30:00.000Z",
  "measureType": 1,
  "measureTypeName": "空腹",
  "value": 7.2,
  "isAbnormal": true,
  "abnormalType": 1,
  "abnormalReason": "空腹血糖超过7.0 mmol/L(糖尿病标准)",
  "photoUrl": "",
  "note": "",
  "createTime": "2026-01-31T07:30:00.000Z"
}
```

**测量类型枚举**:

| 值 | 名称 | 说明 |
|----|------|------|
| 1 | 空腹 | 空腹血糖 |
| 2 | 早餐后 | 餐后2小时血糖(早餐) |
| 3 | 午餐后 | 餐后2小时血糖(午餐) |
| 4 | 晚餐后 | 餐后2小时血糖(晚餐) |
| 5 | 睡前 | 睡前血糖 |

---

### 2.3 blood_pressure(血压记录表)

**集合名称**: `blood_pressure`

**用途**: 存储老人血压测量记录

**字段说明**:

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | String | 是 | 自动生成 | 文档唯一ID |
| _openid | String | 是 | - | 用户openid |
| measureTime | Date | 是 | 当前时间 | 测量时间 |
| systolic | Number | 是 | - | 收缩压(mmHg) |
| diastolic | Number | 是 | - | 舒张压(mmHg) |
| heartRate | Number | 否 | null | 心率(次/分) |
| isAbnormal | Boolean | 是 | false | 是否异常 |
| abnormalType | Number | 是 | 0 | 异常类型(0:正常 1:高血压 2:低血压) |
| abnormalReason | String | 否 | "" | 异常原因说明 |
| photoUrl | String | 否 | "" | 照片URL(拍照记录时) |
| note | String | 否 | "" | 备注 |
| createTime | Date | 是 | 当前时间 | 记录创建时间 |

**索引设计**:

```javascript
// 主键索引(默认)
{ "_id": 1 }

// openid + 测量时间复合索引(查询用户血压记录)
{ "_openid": 1, "measureTime": -1 }

// openid + 创建时间复合索引(查询最新记录)
{ "_openid": 1, "createTime": -1 }
```

**示例数据**:

```json
{
  "_id": "pressure_001",
  "_openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
  "measureTime": "2026-01-31T08:00:00.000Z",
  "systolic": 145,
  "diastolic": 95,
  "heartRate": 78,
  "isAbnormal": true,
  "abnormalType": 1,
  "abnormalReason": "收缩压≥140 mmHg或舒张压≥90 mmHg",
  "photoUrl": "",
  "note": "",
  "createTime": "2026-01-31T08:00:00.000Z"
}
```

---

### 2.4 admins(管理员表)

**集合名称**: `admins`

**用途**: 存储后台管理系统管理员账号信息

**字段说明**:

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | String | 是 | 自动生成 | 文档唯一ID |
| username | String | 是 | - | 管理员用户名(唯一) |
| password | String | 是 | - | 加密后的密码(bcrypt) |
| role | Number | 是 | 2 | 角色(1:超级管理员 2:普通管理员) |
| roleName | String | 是 | - | 角色名称 |
| realName | String | 是 | - | 真实姓名 |
| phone | String | 否 | "" | 手机号 |
| email | String | 否 | "" | 邮箱 |
| status | Number | 是 | 1 | 状态(1:正常 2:禁用) |
| createTime | Date | 是 | 当前时间 | 创建时间 |
| updateTime | Date | 是 | 当前时间 | 更新时间 |
| lastLoginTime | Date | 否 | null | 最后登录时间 |
| lastLoginIP | String | 否 | "" | 最后登录IP |

**索引设计**:

```javascript
// 主键索引(默认)
{ "_id": 1 }

// 用户名唯一索引(登录查询)
{ "username": 1 }
```

**示例数据**:

```json
{
  "_id": "admin_001",
  "username": "admin",
  "password": "$2b$10$rKzY3z8Z8Z8Z8Z8Z8Z8Z8O",
  "role": 1,
  "roleName": "超级管理员",
  "realName": "系统管理员",
  "phone": "138****8888",
  "email": "admin@example.com",
  "status": 1,
  "createTime": "2026-01-10T10:00:00.000Z",
  "updateTime": "2026-01-31T08:00:00.000Z",
  "lastLoginTime": "2026-01-31T08:00:00.000Z",
  "lastLoginIP": "192.168.1.100"
}
```

**角色权限说明**:

| 角色 | 权限范围 |
|------|----------|
| 超级管理员(1) | 所有功能权限,包括管理员账号管理 |
| 普通管理员(2) | 用户查看、健康数据查看、异常数据查看、数据导出 |

---

### 2.5 abnormal_alerts(异常预警表)

**集合名称**: `abnormal_alerts`

**用途**: 存储健康数据异常预警记录

**字段说明**:

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| _id | String | 是 | 自动生成 | 文档唯一ID |
| _openid | String | 是 | - | 用户openid |
| nickname | String | 是 | - | 老人昵称(冗余字段,便于后台查询) |
| alertType | Number | 是 | - | 预警类型(1:高血糖 2:低血糖 3:高血压 4:低血压) |
| alertTypeName | String | 是 | - | 预警类型名称 |
| alertValue | Number | 是 | - | 异常值 |
| alertUnit | String | 是 | - | 数值单位 |
| alertTime | Date | 是 | 当前时间 | 预警时间(测量时间) |
| recordId | String | 是 | - | 关联记录ID |
| recordType | Number | 是 | - | 记录类型(1:血糖 2:血压) |
| status | Number | 是 | 0 | 处理状态(0:未处理 1:已查看 2:已处理) |
| handlerName | String | 否 | "" | 处理人 |
| handleTime | Date | 否 | null | 处理时间 |
| handleNote | String | 否 | "" | 处理备注 |
| createTime | Date | 是 | 当前时间 | 创建时间 |

**索引设计**:

```javascript
// 主键索引(默认)
{ "_id": 1 }

// 预警时间索引(按时间倒序查询)
{ "alertTime": -1 }

// openid + 状态复合索引(查询用户未处理预警)
{ "_openid": 1, "status": 1 }

// 预警类型索引(类型筛选)
{ "alertType": 1 }
```

**示例数据**:

```json
{
  "_id": "alert_001",
  "_openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
  "nickname": "张大爷",
  "alertType": 1,
  "alertTypeName": "高血糖",
  "alertValue": 7.2,
  "alertUnit": "mmol/L",
  "alertTime": "2026-01-31T07:30:00.000Z",
  "recordId": "glucose_001",
  "recordType": 1,
  "status": 0,
  "handlerName": "",
  "handleTime": null,
  "handleNote": "",
  "createTime": "2026-01-31T07:30:00.000Z"
}
```

**预警类型枚举**:

| 值 | 名称 | 说明 |
|----|------|------|
| 1 | 高血糖 | 血糖值超过正常范围上限 |
| 2 | 低血糖 | 血糖值低于正常范围下限 |
| 3 | 高血压 | 血压值超过正常范围上限 |
| 4 | 低血压 | 血压值低于正常范围下限 |

---

## 3. 数据库安全规则

### 3.1 users集合安全规则

```javascript
{
  "read": "auth != null && auth.openid == doc._openid",
  "write": "auth != null && auth.openid == doc._openid"
}
```

**规则说明**:
- 仅用户本人可以读写自己的用户数据
- 云函数可通过admin权限直接访问(绕过规则)

### 3.2 blood_glucose集合安全规则

```javascript
{
  "read": "auth != null && auth.openid == doc._openid",
  "write": "auth != null && auth.openid == doc._openid"
}
```

**规则说明**:
- 仅用户本人可以读写自己的血糖记录
- 云函数可通过admin权限直接访问(绕过规则)

### 3.3 blood_pressure集合安全规则

```javascript
{
  "read": "auth != null && auth.openid == doc._openid",
  "write": "auth != null && auth.openid == doc._openid"
}
```

**规则说明**:
- 仅用户本人可以读写自己的血压记录
- 云函数可通过admin权限直接访问(绕过规则)

### 3.4 admins集合安全规则

```javascript
{
  "read": false,
  "write": false
}
```

**规则说明**:
- 禁止客户端直接访问管理员表
- 仅云函数可通过admin权限访问

### 3.5 abnormal_alerts集合安全规则

```javascript
{
  "read": false,
  "write": false
}
```

**规则说明**:
- 禁止客户端直接访问异常预警表
- 仅云函数可通过admin权限访问

---

## 4. 数据库操作示例

### 4.1 小程序端操作

#### 4.1.1 用户登录/注册

```javascript
// pages/login/login.js
const db = wx.cloud.database()
const _ = db.command

// 检查用户是否存在
async function checkUserExists(openid) {
  const res = await db.collection('users').where({
    _openid: openid
  }).get()
  return res.data.length > 0
}

// 创建新用户
async function createNewUser(openid, userInfo) {
  const res = await db.collection('users').add({
    data: {
      _openid: openid,
      nickname: userInfo.nickName,
      avatar: userInfo.avatarUrl,
      gender: userInfo.gender,
      hasDiabetes: false,
      hasHypertension: false,
      emergencyContact: '',
      emergencyPhone: '',
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
      lastLoginTime: db.serverDate()
    }
  })
  return res
}
```

#### 4.1.2 添加血糖记录

```javascript
// pages/record-glucose/index.js
const db = wx.cloud.database()

async function addGlucoseRecord(data) {
  const { openid, measureTime, measureType, value, photoUrl } = data
  
  // 判断是否异常
  const abnormal = checkGlucoseAbnormal(value, measureType, false)
  
  const res = await db.collection('blood_glucose').add({
    data: {
      _openid: openid,
      measureTime,
      measureType,
      measureTypeName: getMeasureTypeName(measureType),
      value,
      isAbnormal: abnormal.isAbnormal,
      abnormalType: abnormal.type,
      abnormalReason: abnormal.reason,
      photoUrl: photoUrl || '',
      note: '',
      createTime: db.serverDate()
    }
  })
  
  // 如果异常,创建预警
  if (abnormal.isAbnormal) {
    await createAbnormalAlert(openid, {
      alertType: abnormal.type,
      alertValue: value,
      alertUnit: 'mmol/L',
      alertTime: measureTime,
      recordId: res._id,
      recordType: 1
    })
  }
  
  return res
}
```

#### 4.1.3 查询今日血糖记录

```javascript
// pages/index/index.js
const db = wx.cloud.database()
const _ = db.command

async function getTodayGlucoseRecords(openid) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const res = await db.collection('blood_glucose')
    .where({
      _openid: openid,
      measureTime: _.gte(today)
    })
    .orderBy('measureTime', 'desc')
    .get()
  
  return res.data
}
```

#### 4.1.4 查询血糖趋势数据

```javascript
// pages/trend-glucose/index.js
const db = wx.cloud.database()
const _ = db.command

async function getGlucoseTrend(openid, days, measureType) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  let whereCondition = {
    _openid: openid,
    measureTime: _.gte(startDate).and(_.lte(endDate))
  }
  
  if (measureType) {
    whereCondition.measureType = measureType
  }
  
  const res = await db.collection('blood_glucose')
    .where(whereCondition)
    .orderBy('measureTime', 'asc')
    .get()
  
  // 计算统计数据
  const values = res.data.map(item => item.value)
  const avg = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0
  const max = values.length ? Math.max(...values) : 0
  const min = values.length ? Math.min(...values) : 0
  const abnormalCount = res.data.filter(item => item.isAbnormal).length
  
  return {
    data: res.data,
    statistics: {
      avg: parseFloat(avg),
      max,
      min,
      abnormalCount
    }
  }
}
```

### 4.2 后台管理操作

#### 4.2.1 查询用户列表

```javascript
// admin/src/api/user.js
const tcb = require('@cloudbase/node-sdk')
const app = tcb.init({
  env: 'wzldavid-4gwhey9fe011d906'
})
const db = app.database()

async function getUserList({ page, pageSize, keyword }) {
  const skip = (page - 1) * pageSize
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
  
  // 查询列表
  const listRes = await query
    .orderBy('createTime', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()
  
  // 获取每个用户的最后记录时间
  const listWithLastRecord = await Promise.all(
    listRes.data.map(async user => {
      const lastGlucose = await db.collection('blood_glucose')
        .where({ _openid: user._openid })
        .orderBy('createTime', 'desc')
        .limit(1)
        .get()
      
      const lastPressure = await db.collection('blood_pressure')
        .where({ _openid: user._openid })
        .orderBy('createTime', 'desc')
        .limit(1)
        .get()
      
      const lastRecordTime = Math.max(
        lastGlucose.data[0]?.createTime || 0,
        lastPressure.data[0]?.createTime || 0
      )
      
      return {
        ...user,
        lastRecordTime: lastRecordTime ? new Date(lastRecordTime).toLocaleString('zh-CN') : '暂无记录'
      }
    })
  )
  
  return {
    list: listWithLastRecord,
    total: countRes.total
  }
}
```

#### 4.2.2 查询用户某日健康数据

```javascript
// admin/src/api/health.js
async function getUserHealthData({ openid, date }) {
  const startDate = new Date(date)
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(date)
  endDate.setHours(23, 59, 59, 999)
  
  const db = app.database()
  const _ = db.command
  
  // 查询血糖记录
  const glucoseRes = await db.collection('blood_glucose')
    .where({
      _openid: openid,
      measureTime: _.gte(startDate).and(_.lte(endDate))
    })
    .orderBy('measureTime', 'asc')
    .get()
  
  // 查询血压记录
  const pressureRes = await db.collection('blood_pressure')
    .where({
      _openid: openid,
      measureTime: _.gte(startDate).and(_.lte(endDate))
    })
    .orderBy('measureTime', 'asc')
    .get()
  
  // 合并并按时间排序
  const allRecords = [
    ...glucoseRes.data.map(item => ({
      ...item,
      type: '血糖',
      value: `${item.value} ${item.measureTypeName}`,
      displayValue: item.value
    })),
    ...pressureRes.data.map(item => ({
      ...item,
      type: '血压',
      value: `${item.systolic}/${item.diastolic}`,
      displayValue: item.systolic
    }))
  ].sort((a, b) => a.measureTime - b.measureTime)
  
  return {
    date,
    records: allRecords,
    glucoseCount: glucoseRes.data.length,
    pressureCount: pressureRes.data.length
  }
}
```

#### 4.2.3 查询异常预警列表

```javascript
// admin/src/api/abnormal.js
async function getAbnormalAlerts({ page, pageSize, alertType, status }) {
  const skip = (page - 1) * pageSize
  let query = db.collection('abnormal_alerts')
  
  const whereCondition = {}
  
  if (alertType) {
    whereCondition.alertType = parseInt(alertType)
  }
  
  if (status !== undefined && status !== null && status !== '') {
    whereCondition.status = parseInt(status)
  }
  
  // 查询总数
  const countRes = await query.where(whereCondition).count()
  
  // 查询列表
  const listRes = await query
    .where(whereCondition)
    .orderBy('alertTime', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()
  
  return {
    list: listRes.data,
    total: countRes.total
  }
}
```

#### 4.2.4 导出健康数据

```javascript
// admin/src/api/export.js
async function exportHealthData({ openid, startDate, endDate, type }) {
  const db = app.database()
  const _ = db.command
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  
  let data = []
  let filename = ''
  
  if (type === 1 || type === 3) {
    // 导出血糖数据
    const glucoseRes = await db.collection('blood_glucose')
      .where({
        _openid: openid,
        measureTime: _.gte(start).and(_.lte(end))
      })
      .orderBy('measureTime', 'asc')
      .get()
    
    data = data.concat(glucoseRes.data.map(item => ({
      '记录类型': '血糖',
      '测量时间': new Date(item.measureTime).toLocaleString('zh-CN'),
      '测量时段': item.measureTypeName,
      '血糖值(mmol/L)': item.value,
      '状态': item.isAbnormal ? '异常' : '正常',
      '备注': item.note
    })))
  }
  
  if (type === 2 || type === 3) {
    // 导出血压数据
    const pressureRes = await db.collection('blood_pressure')
      .where({
        _openid: openid,
        measureTime: _.gte(start).and(_.lte(end))
      })
      .orderBy('measureTime', 'asc')
      .get()
    
    data = data.concat(pressureRes.data.map(item => ({
      '记录类型': '血压',
      '测量时间': new Date(item.measureTime).toLocaleString('zh-CN'),
      '收缩压(mmHg)': item.systolic,
      '舒张压(mmHg)': item.diastolic,
      '心率(次/分)': item.heartRate || '-',
      '状态': item.isAbnormal ? '异常' : '正常',
      '备注': item.note
    })))
  }
  
  // 按测量时间排序
  data.sort((a, b) => new Date(a['测量时间']) - new Date(b['测量时间']))
  
  // 使用云存储生成Excel文件
  const Excel = require('exceljs')
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('健康数据')
  
  // 添加表头
  const headers = Object.keys(data[0] || {})
  worksheet.addRow(headers)
  
  // 添加数据
  data.forEach(row => {
    worksheet.addRow(Object.values(row))
  })
  
  // 生成文件
  const buffer = await workbook.xlsx.writeBuffer()
  const cloudPath = `exports/health_${openid}_${Date.now()}.xlsx`
  const uploadRes = await app.uploadFile({
    cloudPath,
    fileContent: buffer
  })
  
  // 获取文件URL
  const fileList = await app.getTempFileURL({
    fileList: [uploadRes.fileID]
  })
  
  filename = type === 1 ? '血糖数据' : type === 2 ? '血压数据' : '健康数据'
  
  return {
    success: true,
    fileUrl: fileList.fileList[0].tempFileURL,
    filename: `${filename}_${startDate}_至_${endDate}.xlsx`,
    count: data.length
  }
}
```

---

## 5. 数据库初始化脚本

### 5.1 创建集合

```javascript
// cloudfunctions/initDatabase/index.js
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 创建集合(首次插入数据时自动创建)
    
    // 1. 创建默认管理员账号
    const adminCollection = db.collection('admins')
    
    // 检查是否已存在管理员
    const { data: existingAdmins } = await adminCollection.get()
    
    if (existingAdmins.length === 0) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      
      await adminCollection.add({
        data: {
          username: 'admin',
          password: hashedPassword,
          role: 1,
          roleName: '超级管理员',
          realName: '系统管理员',
          phone: '',
          email: 'admin@example.com',
          status: 1,
          createTime: db.serverDate(),
          updateTime: db.serverDate(),
          lastLoginTime: null,
          lastLoginIP: ''
        }
      })
      
      console.log('默认管理员账号创建成功')
      console.log('用户名: admin')
      console.log('密码: admin123')
    }
    
    return {
      success: true,
      message: '数据库初始化成功'
    }
  } catch (error) {
    console.error('数据库初始化失败:', error)
    return {
      success: false,
      message: error.message
    }
  }
}
```

### 5.2 创建索引

```javascript
// cloudfunctions/createIndexes/index.js
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  try {
    // 注意: 云开发数据库索引需要在控制台手动创建
    // 或者使用云开发HTTP API创建
    
    const indexConfigs = [
      // blood_glucose索引
      {
        collection: 'blood_glucose',
        indexes: [
          { name: 'openid_measureTime', keys: { _openid: 1, measureTime: -1 } },
          { name: 'openid_createTime', keys: { _openid: 1, createTime: -1 } },
          { name: 'measureType', keys: { measureType: 1 } }
        ]
      },
      // blood_pressure索引
      {
        collection: 'blood_pressure',
        indexes: [
          { name: 'openid_measureTime', keys: { _openid: 1, measureTime: -1 } },
          { name: 'openid_createTime', keys: { _openid: 1, createTime: -1 } }
        ]
      },
      // abnormal_alerts索引
      {
        collection: 'abnormal_alerts',
        indexes: [
          { name: 'alertTime', keys: { alertTime: -1 } },
          { name: 'openid_status', keys: { _openid: 1, status: 1 } },
          { name: 'alertType', keys: { alertType: 1 } }
        ]
      }
    ]
    
    // 输出索引创建配置(需要在控制台手动执行)
    console.log('请在云开发控制台手动创建以下索引:')
    console.log(JSON.stringify(indexConfigs, null, 2))
    
    return {
      success: true,
      message: '索引配置已生成,请在控制台手动创建',
      configs: indexConfigs
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}
```

---

## 6. 数据库维护

### 6.1 数据备份

```javascript
// cloudfunctions/backupDatabase/index.js
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const collections = ['users', 'blood_glucose', 'blood_pressure', 'abnormal_alerts']
  const backups = []
  
  for (const collection of collections) {
    const { data } = await db.collection(collection).get()
    backups.push({
      collection,
      count: data.length,
      data: data
    })
  }
  
  // 上传到云存储
  const cloudPath = `backups/backup_${Date.now()}.json`
  const uploadRes = await cloud.uploadFile({
    cloudPath,
    fileContent: JSON.stringify(backups)
  })
  
  return {
    success: true,
    message: '备份成功',
    fileID: uploadRes.fileID
  }
}
```

### 6.2 数据清理

```javascript
// cloudfunctions/cleanupOldData/index.js
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  // 删除1年前的异常预警(已处理)
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  
  const deleteRes = await db.collection('abnormal_alerts')
    .where({
      status: 2, // 已处理
      alertTime: _.lt(oneYearAgo)
    })
    .remove()
  
  return {
    success: true,
    message: '清理成功',
    deletedCount: deleteRes.stats.removed
  }
}
```

---

## 7. 数据库性能优化

### 7.1 查询优化建议

1. **使用索引**: 为常用查询字段创建索引
2. **限制返回字段**: 使用 `.field()` 只查询需要的字段
3. **分页查询**: 使用 `.skip()` 和 `.limit()` 实现分页
4. **避免大文档**: 单个文档大小不超过16MB
5. **使用聚合操作**: 复杂统计使用聚合而非多次查询

### 7.2 索引优化建议

1. **创建复合索引**: 对经常一起查询的字段创建复合索引
2. **索引字段顺序**: 区分度高的字段放在前面
3. **定期分析索引**: 删除未使用的索引
4. **避免过多索引**: 索引过多会影响写入性能

### 7.3 缓存策略

1. **热点数据缓存**: 使用云开发缓存或Redis缓存热点数据
2. **趋势数据缓存**: 趋势图表数据缓存1小时
3. **用户信息缓存**: 用户基本信息缓存30分钟

---

## 8. 数据库监控

### 8.1 监控指标

- **查询性能**: 平均查询时间、慢查询数量
- **存储空间**: 各集合存储使用量
- **文档数量**: 各集合文档总数
- **索引使用率**: 索引命中情况
- **错误率**: 操作失败率

### 8.2 告警规则

- 查询时间 > 5秒 → 告警
- 存储空间使用率 > 80% → 告警
- 单集合文档数 > 100万 → 告警
- 错误率 > 5% → 告警

---

## 9. 附录

### 9.1 血糖正常范围

| 测量时段 | 无糖尿病 | 有糖尿病 |
|---------|---------|---------|
| 空腹 | 3.9-6.1 mmol/L | 3.9-7.0 mmol/L |
| 餐后2小时 | < 7.8 mmol/L | < 10.0 mmol/L |

### 9.2 血压正常范围

| 分类 | 收缩压(mmHg) | 舒张压(mmHg) |
|------|------------|------------|
| 正常血压 | < 120 | < 80 |
| 正常高值 | 120-139 | 80-89 |
| 高血压 | ≥ 140 | ≥ 90 |
| 低血压 | < 90 | < 60 |

### 9.3 云开发控制台入口

- 数据库管理: https://tcb.cloud.tencent.com/dev?envId=wzldavid-4gwhey9fe011d906#/db/doc
- 集合管理: https://tcb.cloud.tencent.com/dev?envId=wzldavid-4gwhey9fe011d906#/db/doc/collection/{collectionName}
- 索引管理: https://tcb.cloud.tencent.com/dev?envId=wzldavid-4gwhey9fe011d906#/db/doc/index
- 安全规则: https://tcb.cloud.tencent.com/dev?envId=wzldavid-4gwhey9fe011d906#/security/database

---

**文档结束**
