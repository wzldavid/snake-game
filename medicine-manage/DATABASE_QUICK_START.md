# 📊 数据库快速建立指南

## 🎯 目标
在云开发控制台建立3个集合并导入测试数据:
- `users` - 用户表(2条)
- `blood_glucose` - 血糖记录表(157条)
- `blood_pressure` - 血压记录表(87条)

---

## 🚀 快速开始(5分钟完成)

### 第1步: 打开控制台

点击链接打开云开发控制台:
```
https://console.cloud.tencent.com/tcb?envId=wzldavid-4gwhey9fe011d906
```

### 第2步: 进入数据库

1. 左侧菜单 → "云开发" → "数据库" → "文档数据库"
2. 进入数据库管理页面

### 第3步: 创建集合并导入(重复3次)

#### 3.1 创建 users 集合
1. 点击"新建集合"
2. 名称输入: `users`
3. 点击"确定"

#### 3.2 导入用户数据
1. 打开文件: `d:/project/medicine-manage/cloud-database-test-data.json`
2. 找到 `"users": [` 部分(第2-33行)
3. 复制全部内容
4. 在控制台点击 `users` 集合
5. 点击"添加文档"
6. 粘贴JSON,点击"确定"
7. ✅ 应该看到 2 条记录

#### 3.3 创建 blood_glucose 集合
1. 点击"新建集合"
2. 名称输入: `blood_glucose`
3. 点击"确定"

#### 3.4 导入血糖数据
1. 在JSON文件中找到 `"blood_glucose": [` 部分(第34-660行)
2. 复制全部内容
3. 在控制台点击 `blood_glucose` 集合
4. 点击"添加文档"
5. 粘贴JSON,点击"确定"
6. ✅ 应该看到 157 条记录

#### 3.5 创建 blood_pressure 集合
1. 点击"新建集合"
2. 名称输入: `blood_pressure`
3. 点击"确定"

#### 3.6 导入血压数据
1. 在JSON文件中找到 `"blood_pressure": [` 部分(第661-3209行)
2. 复制全部内容
3. 在控制台点击 `blood_pressure` 集合
4. 点击"添加文档"
5. 粘贴JSON,点击"确定"
6. ✅ 应该看到 87 条记录

### 第4步: 配置安全规则

#### 4.1 进入安全规则页面
点击"安全规则"或访问:
```
https://tcb.cloud.tencent.com/dev?envId=wzldavid-4gwhey9fe011d906#/db/doc/security
```

#### 4.2 为每个集合配置规则(共3个集合)

**users 集合**:
```json
{
  "read": true,
  "write": true
}
```

**blood_glucose 集合**:
```json
{
  "read": true,
  "write": true
}
```

**blood_pressure 集合**:
```json
{
  "read": true,
  "write": true
}
```

点击"保存"

---

## ✅ 完成检查

### 集合检查
- [ ] users - 2条记录 ✅
- [ ] blood_glucose - 157条记录 ✅
- [ ] blood_pressure - 87条记录 ✅

### 安全规则检查
- [ ] users 规则已保存 ✅
- [ ] blood_glucose 规则已保存 ✅
- [ ] blood_pressure 规则已保存 ✅

---

## 📝 数据统计

| 集合名称 | 记录数 | 说明 |
|---------|--------|------|
| users | 2 | 张大爷、刘大妈 |
| blood_glucose | 157 | 30天血糖记录 |
| blood_pressure | 87 | 30天血压记录 |
| **总计** | **246** | 完整测试数据 |

---

## 🔍 验证方法

### 方法1: 控制台查看
在数据库页面点击每个集合,查看记录数量

### 方法2: 小程序测试
1. 打开微信开发者工具
2. 编译小程序
3. 进入"我的"页面
4. 查看是否显示用户信息

---

## ⚠️ 重要提示

### 导入失败?
- 尝试分批导入,每次20-50条
- 检查JSON格式是否正确
- 刷新页面重试

### 看不到数据?
- 刷新浏览器页面
- 重新点击集合
- 检查是否有错误提示

### 小程序无法访问?
- 确认安全规则已配置
- 使用测试规则: `{"read": true, "write": true}`
- 确认规则已保存

---

## 📖 详细文档

- **完整指南**: `DATABASE_SETUP_GUIDE.md`
- **数据库设计**: `specs/elderly-health-tracking/database.md`
- **测试数据说明**: `TEST_DATA_SUMMARY.md`
- **快速导入**: `IMPORT_GUIDE.md`

---

## 🎉 完成!

数据库已建立完成,包含:
- ✅ 3个数据集合
- ✅ 246条测试数据
- ✅ 完整的安全规则

现在可以:
1. ✅ 部署云函数
2. ✅ 测试小程序
3. ✅ 启动后台系统

继续下一步: `START_HERE.md`
