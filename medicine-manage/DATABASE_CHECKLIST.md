# 📋 数据库建立检查清单

## 🗂️ 集合创建检查

### users 集合
- [ ] 集合 `users` 已创建
- [ ] 集合包含 2 条记录
- [ ] 记录包含字段: _openid, nickname, avatar, gender, birthday, age, hasDiabetes, hasHypertension, emergencyContact, emergencyPhone, createTime, updateTime, lastLoginTime
- [ ] 用户1: 张大爷 (test_openid_zhang_001)
- [ ] 用户2: 刘大妈 (test_openid_liu_001)

### blood_glucose 集合
- [ ] 集合 `blood_glucose` 已创建
- [ ] 集合包含 157 条记录
- [ ] 记录包含字段: _openid, measureTime, measureType, measureTypeName, value, isAbnormal, abnormalType, abnormalReason, photoUrl, note, createTime
- [ ] 测量类型正确(1-5)
- [ ] 时间格式正确(ISO 8601)

### blood_pressure 集合
- [ ] 集合 `blood_pressure` 已创建
- [ ] 集合包含 87 条记录
- [ ] 记录包含字段: _openid, measureTime, systolic, diastolic, heartRate, isAbnormal, abnormalType, abnormalReason, photoUrl, note, createTime
- [ ] 数值字段类型正确
- [ ] 时间格式正确(ISO 8601)

## 🔒 安全规则检查

### users 集合安全规则
- [ ] 安全规则已配置
- [ ] 规则内容:
  ```json
  {
    "read": true,
    "write": true
  }
  ```
- [ ] 规则已保存

### blood_glucose 集合安全规则
- [ ] 安全规则已配置
- [ ] 规则内容:
  ```json
  {
    "read": true,
    "write": true
  }
  ```
- [ ] 规则已保存

### blood_pressure 集合安全规则
- [ ] 安全规则已配置
- [ ] 规则内容:
  ```json
  {
    "read": true,
    "write": true
  }
  ```
- [ ] 规则已保存

## 🧪 功能测试检查

### 小程序访问测试
- [ ] 微信开发者工具已打开项目
- [ ] 小程序已编译成功
- [ ] 进入"我的"页面
- [ ] 用户信息正常显示
- [ ] 没有报错信息

### 数据查询测试
- [ ] users 集合可以查询数据
- [ ] blood_glucose 集合可以查询数据
- [ ] blood_pressure 集合可以查询数据
- [ ] 查询结果正确

### 新用户注册测试
- [ ] 清除小程序缓存
- [ ] 重新打开小程序
- [ ] 进入"我的"页面
- [ ] 自动注册新用户成功
- [ ] users 集合记录数增加

### 数据写入测试
- [ ] 添加血糖记录成功
- [ ] blood_glucose 集合记录数增加
- [ ] 添加血压记录成功
- [ ] blood_pressure 集合记录数增加

## 📊 数据完整性检查

### 用户数据检查
- [ ] 张大爷的 _openid: test_openid_zhang_001
- [ ] 张大爷年龄: 70
- [ ] 张大爷性别: 男(1)
- [ ] 张大爷糖尿病: 是(true)
- [ ] 张大爷高血压: 是(true)
- [ ] 刘大妈的 _openid: test_openid_liu_001
- [ ] 刘大妈年龄: 67
- [ ] 刘大妈性别: 女(2)
- [ ] 刘大妈糖尿病: 是(true)
- [ ] 刘大妈高血压: 否(false)

### 血糖数据检查
- [ ] blood_glucose 记录总数: 157
- [ ] 张大爷血糖记录数: 77
- [ ] 刘大妈血糖记录数: 80
- [ ] 所有记录都有 _openid
- [ ] 所有记录都有 measureTime
- [ ] 所有记录都有 measureType(1-5)
- [ ] 所有记录都有 value
- [ ] 异常数据标记正确

### 血压数据检查
- [ ] blood_pressure 记录总数: 87
- [ ] 张大爷血压记录数: 42
- [ ] 刘大妈血压记录数: 45
- [ ] 所有记录都有 _openid
- [ ] 所有记录都有 measureTime
- [ ] 所有记录都有 systolic
- [ ] 所有记录都有 diastolic
- [ ] 异常数据标记正确

## 🔗 控制台访问检查

### 快速链接验证
- [ ] 主控台可以打开: https://console.cloud.tencent.com/tcb
- [ ] 环境选择正确: wzldavid-4gwhey9fe011d906
- [ ] 数据库页面可以打开
- [ ] 安全规则页面可以打开

### 集合管理检查
- [ ] 可以查看 users 集合详情
- [ ] 可以查看 blood_glucose 集合详情
- [ ] 可以查看 blood_pressure 集合详情
- [ ] 可以添加新文档
- [ ] 可以编辑现有文档
- [ ] 可以删除文档

## 🎯 完成标准

### 完成标志
✅ 所有集合已创建
✅ 所有数据已导入
✅ 安全规则已配置
✅ 小程序可以正常访问
✅ 数据读写功能正常

### 数据库状态
```
┌────────────────────┬────────┐
│ 集合名称         │ 记录数  │
├────────────────────┼────────┤
│ users            │   2    │
│ blood_glucose   │  157   │
│ blood_pressure   │   87   │
├────────────────────┼────────┤
│ 总计            │  246   │
└────────────────────┴────────┘
```

## 📞 问题排查

### 如果集合创建失败
1. 检查网络连接
2. 确认环境ID正确
3. 查看浏览器控制台错误

### 如果数据导入失败
1. 检查JSON格式是否正确
2. 尝试分批导入
3. 查看导入错误提示

### 如果安全规则配置失败
1. 确认JSON格式正确
2. 检查权限设置
3. 确认规则已保存

### 如果小程序无法访问
1. 确认安全规则已配置
2. 检查环境ID是否正确
3. 查看小程序控制台错误

## ✅ 完成后的下一步

1. ✅ 部署云函数
2. ✅ 测试新用户注册
3. ✅ 测试数据读写
4. ✅ 启动后台系统
5. ✅ 验证前后端同步

---

**按照检查清单逐项完成,确保数据库正常工作!** 🎯
