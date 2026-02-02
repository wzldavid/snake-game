# 📋 数据库导入实时操作指南

## 🎯 当前状态
✅ 云开发控制台已打开
📍 位置: https://console.cloud.tencent.com/tcb?envId=wzldavid-4gwhey9fe011d906

---

## 📝 操作步骤

### 步骤 1: 进入数据库管理 ⏱️ 30秒

1. 在左侧菜单中找到 **"云开发"** 
2. 点击 **"数据库"**
3. 点击 **"文档数据库"**
4. ✅ 进入数据库管理页面

---

### 步骤 2: 创建 users 集合 ⏱️ 1分钟

#### 2.1 新建集合
1. 点击右上角 **"新建集合"** 按钮
2. 集合名称输入: `users` (必须小写)
3. 点击 **"确定"**

#### 2.2 导入数据
1. 点击刚创建的 `users` 集合
2. 点击右上角 **"添加记录"** 或 **"添加文档"**
3. 选择 **"JSON导入"** 或直接粘贴
4. 复制以下JSON内容并粘贴:

```json
[
  {
    "_openid": "test_openid_zhang_001",
    "nickname": "张大爷",
    "avatar": "",
    "gender": 1,
    "birthday": "1955-03-15",
    "age": 70,
    "hasDiabetes": true,
    "hasHypertension": true,
    "emergencyContact": "张三",
    "emergencyPhone": "13812348888",
    "createTime": "2026-01-01T06:45:09.357Z",
    "updateTime": "2026-01-31T06:45:09.357Z",
    "lastLoginTime": "2026-01-31T06:45:09.357Z"
  },
  {
    "_openid": "test_openid_liu_001",
    "nickname": "刘大妈",
    "avatar": "",
    "gender": 2,
    "birthday": "1958-06-20",
    "age": 67,
    "hasDiabetes": true,
    "hasHypertension": false,
    "emergencyContact": "李四",
    "emergencyPhone": "13987654321",
    "createTime": "2026-01-01T06:45:09.357Z",
    "updateTime": "2026-01-31T06:45:09.357Z",
    "lastLoginTime": "2026-01-31T06:45:09.357Z"
  }
]
```

5. 点击 **"确定"**
6. ✅ 验证: 应该看到 **2条记录**

---

### 步骤 3: 创建 blood_glucose 集合 ⏱️ 2分钟

#### 3.1 新建集合
1. 点击 **"新建集合"** 按钮
2. 集合名称输入: `blood_glucose`
3. 点击 **"确定"**

#### 3.2 导入血糖数据
由于数据较多(157条),建议使用 **JSON文件导入**:

**方式A: JSON文件导入(推荐)**
1. 点击 `blood_glucose` 集合
2. 点击右上角 **"导入"** 或 **"JSON导入"**
3. 选择文件: `d:/project/medicine-manage/cloud-database-test-data.json`
4. **重要**: 需要先提取 `blood_glucose` 部分的数据
5. 我会为您准备一个单独的文件

**方式B: 手动创建(如果文件导入不成功)**
1. 打开 `cloud-database-test-data.json` 文件
2. 找到第34行 `"blood_glucose": [`
3. 复制从第34行到第660行的内容
4. 在控制台粘贴并确定

✅ 验证: 应该看到 **157条记录**

---

### 步骤 4: 创建 blood_pressure 集合 ⏱️ 2分钟

#### 4.1 新建集合
1. 点击 **"新建集合"** 按钮
2. 集合名称输入: `blood_pressure`
3. 点击 **"确定"**

#### 4.2 导入血压数据
**方式A: JSON文件导入(推荐)**
使用准备的blood_pressure数据文件

**方式B: 手动导入**
1. 打开 `cloud-database-test-data.json` 文件
2. 找到第661行 `"blood_pressure": [`
3. 复制从第661行到第3209行的内容
4. 在控制台粘贴并确定

✅ 验证: 应该看到 **87条记录**

---

### 步骤 5: 配置安全规则 ⏱️ 2分钟

#### 5.1 进入安全规则
1. 在数据库页面点击顶部 **"安全规则"** 标签
2. 或直接访问: https://tcb.cloud.tencent.com/dev?envId=wzldavid-4gwhey9fe011d906#/db/doc/security

#### 5.2 配置规则(测试环境)

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

3. 配置完成后点击 **"保存"** 或 **"应用"**

---

## ✅ 验证检查表

完成所有步骤后,请验证:

- [ ] users 集合有 **2条** 记录
- [ ] blood_glucose 集合有 **157条** 记录
- [ ] blood_pressure 集合有 **87条** 记录
- [ ] 3个集合的安全规则都已配置
- [ ] 每个集合可以正常查看记录

---

## 🚨 常见问题

### Q1: 导入数据失败?
**解决**:
- 确保JSON格式正确,检查是否有多余逗号
- 尝试分批导入,每次50-100条

### Q2: 找不到"导入"按钮?
**解决**:
- 点击集合后,在右上角寻找
- 可能显示为"添加记录"或"添加文档"

### Q3: 提示权限错误?
**解决**:
- 检查是否登录了正确的腾讯云账号
- 确认环境ID是否正确

### Q4: 数据导入后看不到记录?
**解决**:
- 刷新页面
- 检查集合名称是否正确(区分大小写)

---

## 📞 需要帮助?

如果遇到问题,请查看:
- 详细指南: `DATABASE_SETUP_GUIDE.md`
- 检查清单: `DATABASE_CHECKLIST.md`

---

**预计总时间: 7-10分钟** 🎯
