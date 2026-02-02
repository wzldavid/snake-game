# 测试数据快速参考卡

## 📋 快速开始

```bash
# 1. 生成测试数据
node scripts/generateTestData.js

# 2. 验证数据
node scripts/validateTestData.js

# 3. 导入数据(可选)
node scripts/importTestData.js
```

## 👤 测试用户

| 昵称 | OpenID | 年龄 | 糖尿病 | 高血压 | 血糖 | 血压 |
|------|--------|------|--------|--------|------|------|
| 张大爷 | test_openid_zhang_001 | 70 | ✅ | ✅ | 77条 | 42条 |
| 刘大妈 | test_openid_liu_001 | 67 | ✅ | ❌ | 80条 | 45条 |

## 📊 数据概览

- **总记录数**: 244条
  - 血糖记录: 157条
  - 血压记录: 87条
- **数据时间**: 2026-01-01 ~ 2026-01-31 (30天)
- **异常率**: 血糖7%, 血压13%
- **血糖类型**: 空腹35, 早餐后28, 午餐后32, 晚餐后31, 睡前31

## 🔍 数据验证状态

```
✓ 用户验证: 通过
✓ 血糖验证: 通过
✓ 血压验证: 通过
```

## 📁 生成的文件

```
project-root/
├── cloud-database-test-data.json  # 测试数据文件
├── scripts/
│   ├── generateTestData.js        # 数据生成脚本
│   ├── importTestData.js          # 数据导入脚本
│   ├── validateTestData.js        # 数据验证脚本
│   ├── README.md                  # 完整文档
│   └── QUICK_REFERENCE.md         # 本文件
├── IMPORT_GUIDE.md                # 快速导入指南
└── TEST_DATA_SUMMARY.md           # 测试数据总结
```

## 🚀 导入数据

### 最简单的方法: 云开发控制台手动导入

1. 打开: https://console.cloud.tencent.com/tcb?envId=wzldavid-4gwhey9fe011d906
2. 数据库 → 文档数据库
3. 创建3个集合: `users`, `blood_glucose`, `blood_pressure`
4. 打开 `cloud-database-test-data.json`
5. 分别导入 `users`, `blood_glucose`, `blood_pressure` 数组
6. 配置安全规则(测试用): `{"read": true, "write": true}`

详细步骤: 查看 `IMPORT_GUIDE.md`

## ⚙️ 测试配置

### CloudBase环境
- 环境ID: `wzldavid-4gwhey9fe011d906`
- 数据库: NoSQL云数据库

### 数据库集合
- `users` - 用户信息
- `blood_glucose` - 血糖记录
- `blood_pressure` - 血压记录

### 安全规则(测试环境)
```json
{
  "read": true,
  "write": true
}
```

## 🧪 测试场景

### 小程序测试
- [ ] 使用张大爷账号登录
- [ ] 查看首页数据概览
- [ ] 查看历史记录
- [ ] 查看血糖趋势图
- [ ] 查看血压趋势图
- [ ] 查看异常预警
- [ ] 手动记录新数据
- [ ] 查看个人资料

使用刘大妈账号重复以上测试

### 后台测试
- [ ] 查看用户列表(2个用户)
- [ ] 查看用户详情
- [ ] 查看健康数据统计
- [ ] 查看异常预警列表

## 📝 数据说明

### 血糖测量类型
| 值 | 名称 |
|----|------|
| 1 | 空腹 |
| 2 | 早餐后 |
| 3 | 午餐后 |
| 4 | 晚餐后 |
| 5 | 睡前 |

### 血糖正常范围
- 正常人空腹: 3.9-6.1 mmol/L
- 糖尿病患者空腹: 4.4-7.0 mmol/L
- 低血糖: < 3.9 mmol/L

### 血压正常范围
- 收缩压: 90-140 mmHg
- 舒张压: 60-90 mmHg
- 高血压: > 140/90 mmHg
- 低血压: < 90/60 mmHg

## 🔗 相关文档

- [快速导入指南](../IMPORT_GUIDE.md)
- [测试数据总结](../TEST_DATA_SUMMARY.md)
- [完整说明文档](./README.md)
- [数据库设计](../specs/elderly-health-tracking/database.md)

## 💡 提示

1. 测试openid格式: `test_openid_{nickname}_{id}`
2. 异常数据已标记 `isAbnormal: true`
3. 所有数据在过去30天内
4. 每天有多条记录,可以测试趋势图

## 🆘 问题排查

| 问题 | 解决方案 |
|------|----------|
| 导入失败 | 检查环境ID是否正确 |
| 看不到数据 | 检查安全规则配置 |
| openid错误 | 确认使用测试openid |
| 数据格式错误 | 运行验证脚本检查 |

---

**生成时间**: 2026-01-31
**数据版本**: v1.0
**状态**: ✓ 验证通过,可导入
