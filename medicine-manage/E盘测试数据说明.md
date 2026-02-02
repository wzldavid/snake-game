# 测试数据Excel文件说明

## ✅ 已生成的文件

测试数据已成功转换为CSV格式,保存在E盘根目录:

1. **E:\users.csv** - 用户数据表 (2条记录)
2. **E:\blood_glucose.csv** - 血糖记录表 (157条记录)
3. **E:\blood_pressure.csv** - 血压记录表 (87条记录)

## 📊 文件说明

### 1. users.csv - 用户数据表

**字段说明**:
| 字段名 | 说明 | 示例 |
|--------|------|------|
| _openid | 用户唯一标识 | test_openid_zhang_001 |
| nickname | 用户昵称 | 张大爷 |
| avatar | 头像URL | |
| gender | 性别(0:未知 1:男 2:女) | 1 |
| birthday | 出生日期 | 1955-03-15 |
| age | 年龄 | 70 |
| hasDiabetes | 是否患有糖尿病 | 是/否 |
| hasHypertension | 是否患有高血压 | 是/否 |
| emergencyContact | 紧急联系人 | 张三 |
| emergencyPhone | 紧急联系电话 | 13812348888 |
| createTime | 创建时间 | 2026-01-01T06:45:09.357Z |
| updateTime | 更新时间 | 2026-01-31T06:45:09.357Z |
| lastLoginTime | 最后登录时间 | 2026-01-31T06:45:09.357Z |

**数据统计**:
- 张大爷: 70岁,男性,患有糖尿病和高血压
- 刘大妈: 67岁,女性,患有糖尿病(无高血压)

### 2. blood_glucose.csv - 血糖记录表

**字段说明**:
| 字段名 | 说明 | 示例 |
|--------|------|------|
| _openid | 用户唯一标识 | test_openid_zhang_001 |
| nickname | 用户昵称 | 张大爷 |
| measureTime | 测量时间(完整) | 2026-01-31T06:12:00.000Z |
| measureDate | 测量日期 | 2026-01-31 |
| measureType | 测量类型(1-5) | 3 |
| measureTypeName | 测量类型名称 | 午餐后 |
| value | 血糖值 | 5.8 |
| unit | 单位 | mmol/L |
| isAbnormal | 是否异常 | 是/否 |
| abnormalType | 异常类型(0:正常 1:高血糖 2:低血糖) | 0 |
| abnormalTypeName | 异常类型名称 | 正常 |
| abnormalReason | 异常原因说明 | |
| photoUrl | 照片URL | |
| note | 备注 | 测试数据 |
| createTime | 记录创建时间 | 2026-01-31T06:12:00.000Z |

**测量类型说明**:
- 1: 空腹
- 2: 早餐后
- 3: 午餐后
- 4: 晚餐后
- 5: 睡前

**数据统计**:
- 总记录数: 157条
- 张大爷: 77条
- 刘大妈: 80条
- 异常记录: 11条 (7%)
- 时间范围: 2026-01-01 ~ 2026-01-31 (30天)

### 3. blood_pressure.csv - 血压记录表

**字段说明**:
| 字段名 | 说明 | 示例 |
|--------|------|------|
| _openid | 用户唯一标识 | test_openid_zhang_001 |
| nickname | 用户昵称 | 张大爷 |
| measureTime | 测量时间(完整) | 2026-01-31T00:11:00.000Z |
| measureDate | 测量日期 | 2026-01-31 |
| systolic | 收缩压(mmHg) | 117 |
| diastolic | 舒张压(mmHg) | 69 |
| heartRate | 心率(次/分) | 78 |
| unit | 单位 | mmHg |
| isAbnormal | 是否异常 | 是/否 |
| abnormalType | 异常类型(0:正常 1:高血压 2:低血压) | 0 |
| abnormalTypeName | 异常类型名称 | 正常 |
| abnormalReason | 异常原因说明 | |
| photoUrl | 照片URL | |
| note | 备注 | 测试数据 |
| createTime | 记录创建时间 | 2026-01-31T00:11:00.000Z |

**异常类型说明**:
- 0: 正常
- 1: 高血压 (收缩压>140 或 舒张压>90)
- 2: 低血压 (收缩压<90 或 舒张压<60)

**数据统计**:
- 总记录数: 87条
- 张大爷: 42条
- 刘大妈: 45条
- 异常记录: 11条 (13%)
- 时间范围: 2026-01-01 ~ 2026-01-31 (30天)

## 📈 如何使用CSV文件

### 方法1: 直接用Excel打开(推荐)

1. 双击CSV文件,Excel会自动打开
2. 文件使用UTF-8编码,带BOM头,支持中文正确显示
3. 如果显示乱码,可以在Excel中使用"数据" → "从文本/CSV导入"功能

### 方法2: 在Excel中导入数据

1. 打开Excel
2. 点击"数据" → "从文本/CSV"
3. 选择CSV文件
4. 设置编码为UTF-8
5. 点击"加载"

### 方法3: 另存为xlsx格式

1. 用Excel打开CSV文件
2. 点击"文件" → "另存为"
3. 选择文件类型: "Excel工作簿(*.xlsx)"
4. 保存即可

## 📊 数据特点

### 血糖数据特点
- 空腹血糖: 35条
- 早餐后血糖: 28条
- 午餐后血糖: 32条
- 晚餐后血糖: 31条
- 睡前血糖: 31条
- 正常血糖: 146条 (93%)
- 异常血糖: 11条 (7%)

### 血压数据特点
- 张大爷(有高血压): 偶尔出现高血压数据
- 刘大妈(无高血压): 血压基本在正常范围
- 正常血压: 76条 (87%)
- 异常血压: 11条 (13%)

### 数据完整性
- ✅ 所有记录包含完整的时间戳
- ✅ 异常数据已标记并说明原因
- ✅ 数据按时间倒序排列
- ✅ 每天有多条记录,便于趋势分析

## 🔄 重新生成CSV文件

如果需要重新生成CSV文件,运行以下命令:

```bash
cd d:/project/medicine-manage
node scripts/jsonToExcel.js
```

## 💡 提示

1. CSV文件可以在Excel、WPS、Google Sheets等表格软件中打开
2. 文件编码为UTF-8,带BOM头,确保中文正确显示
3. CSV文件可以直接导入数据库
4. 如需修改数据,编辑CSV文件后保存即可
5. 建议在Excel中另存为xlsx格式,便于后续编辑

## 📚 相关文档

- 测试数据生成脚本: `scripts/generateTestData.js`
- JSON转Excel脚本: `scripts/jsonToExcel.js`
- 测试数据总结: `TEST_DATA_SUMMARY.md`
- 快速导入指南: `IMPORT_GUIDE.md`

---

**生成时间**: 2026-01-31
**文件位置**: E盘根目录
**文件格式**: CSV (UTF-8编码,带BOM)
**记录总数**: 246条
