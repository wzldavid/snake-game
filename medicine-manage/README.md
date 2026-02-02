# 老人健康记录小程序

## 项目简介

这是一个帮助老年人记录血糖和血压数据的微信小程序,支持手动记录和照片自动识别记录,并能分析周期性的健康数据变化趋势。

## 项目结构

```
medicine-manage/
├── WeChat/                    # 微信小程序端
│   ├── miniprogram/          # 小程序主目录
│   │   ├── pages/           # 页面文件
│   │   ├── components/      # 组件文件
│   │   ├── utils/           # 工具函数
│   │   └── images/          # 图片资源
│   └── cloudfunctions/      # 云函数
│       ├── login/           # 用户登录云函数
│       └── recognizeFromPhoto/ # 照片识别云函数
├── admin/                    # 后台管理系统
│   └── src/                 # 源代码
│       ├── views/           # 页面组件
│       ├── layouts/         # 布局组件
│       ├── stores/          # 状态管理
│       ├── api/             # API接口
│       └── utils/           # 工具函数
└── specs/                    # 项目设计文档
```

## 技术栈

### 小程序端
- 微信小程序原生开发
- CloudBase云开发(数据库、云存储、云函数)
- AI图像识别(混元大模型)

### 后台管理系统
- Vue 3
- Element Plus
- Vite
- Pinia
- Vue Router

## 环境配置

### CloudBase环境
- 环境ID: `wzldavid-4gwhey9fe011d906`
- 数据库: NoSQL云数据库
- 云存储: 用于存储照片和头像

### 云函数部署

1. 使用微信开发者工具打开项目
2. 右键点击云函数目录,选择"上传并部署:云端安装依赖"
3. 等待部署完成

### 数据库配置

#### 快速建立数据库(5分钟)

1. **打开云开发控制台**
   ```
   https://console.cloud.tencent.com/tcb?envId=wzldavid-4gwhey9fe011d906
   ```

2. **创建集合并导入测试数据**
   - 创建 `users` 集合,导入2条用户数据
   - 创建 `blood_glucose` 集合,导入157条血糖记录
   - 创建 `blood_pressure` 集合,导入87条血压记录

   详细步骤请查看: [DATABASE_QUICK_START.md](./DATABASE_QUICK_START.md)

3. **配置安全规则**
   进入安全规则页面,为3个集合分别配置:

   **测试环境**(推荐用于开发):
   ```json
   {
     "read": true,
     "write": true
   }
   ```

   **生产环境**(推荐用于正式上线):
   ```json
   {
     "read": "auth != null && auth.openid == doc._openid",
     "write": "auth != null && auth.openid == doc._openid"
   }
   ```

   详细指南: [DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)

#### 数据库集合说明

| 集合名称 | 记录数 | 说明 |
|---------|--------|------|
| users | 2 | 张大爷、刘大妈 |
| blood_glucose | 157 | 30天血糖记录 |
| blood_pressure | 87 | 30天血压记录 |

## 小程序开发

### 安装依赖
```bash
cd WeChat
npm install
```

### 开发调试
1. 使用微信开发者工具打开`WeChat`目录
2. 配置AppID
3. 点击"编译"进行调试

### 页面功能
- 首页: 显示今日数据统计、快捷操作、最近记录
- 记录页面: 支持手动输入和拍照识别记录血糖/血压
- 历史记录: 按时间查看所有健康数据
- 趋势分析: 图表展示血糖/血压变化趋势
- 个人中心: 用户信息管理和健康数据统计

## 后台管理系统开发

### 安装依赖
```bash
cd admin
npm install
```

### 开发调试
```bash
npm run dev
```

### 构建部署
```bash
npm run build
```

### 后台功能
- 登录: 管理员登录认证
- 仪表盘: 数据统计概览
- 用户管理: 查看和管理用户信息
- 健康数据: 查看用户的健康数据记录
- 异常预警: 查看和管理异常预警

## 主要功能

### 小程序端
1. 血糖记录
   - 手动输入血糖值
   - 选择测量类型(空腹、餐后)
   - 拍照自动识别血糖值

2. 血压记录
   - 手动输入收缩压、舒张压
   - 可选输入心率
   - 拍照自动识别血压值

3. 数据分析
   - 查看今日、本周、本月的数据统计
   - 图表展示趋势变化
   - 异常数据自动预警

4. 个人中心
   - 编辑个人资料
   - 设置健康信息(是否患有糖尿病、高血压)
   - 查看使用统计数据

### 后台管理
1. 用户管理
   - 查看用户列表
   - 查看用户详细信息
   - 查看用户健康数据

2. 数据统计
   - 总用户数统计
   - 今日测量次数统计
   - 异常预警统计
   - 总记录数统计

## 注意事项

1. CloudBase环境ID已在`app.js`中配置为`wzldavid-4gwhey9fe011d906`
2. 云函数需要上传部署后才能使用
3. 照片识别功能依赖AI服务,需要确保网络连接正常
4. 数据库安全规则配置很重要,确保数据安全

## 后续开发计划

1. 完善后台管理系统的API对接
2. 实现数据导出功能
3. 添加消息通知功能
4. 优化照片识别准确率
5. 添加更多健康指标记录

## 测试数据

项目已生成完整的测试数据,可用于开发和测试:

### 测试数据统计
- **测试用户**: 2个(张大爷、刘大妈)
- **血糖记录**: 157条
- **血压记录**: 87条
- **数据时间范围**: 30天(2026-01-01 ~ 2026-01-31)
- **异常数据**: 血糖7%异常,血压13%异常

### 快速导入测试数据

**方法1: 云开发控制台手动导入(推荐)**
1. 打开控制台: https://console.cloud.tencent.com/tcb?envId=wzldavid-4gwhey9fe011d906
2. 进入数据库管理
3. 创建集合: `users`、`blood_glucose`、`blood_pressure`
4. 打开 `cloud-database-test-data.json`,分别导入对应数据

详细步骤请查看 [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)

**方法2: 使用脚本导入**
```bash
npm install @cloudbase/node-sdk
node scripts/importTestData.js
```

### 测试账号
- 张大爷: `test_openid_zhang_001` (70岁,患有糖尿病和高血压)
- 刘大妈: `test_openid_liu_001` (67岁,患有糖尿病)

### 相关文档
- [快速导入指南](./IMPORT_GUIDE.md)
- [测试数据总结](./TEST_DATA_SUMMARY.md)
- [完整导入说明](./scripts/README.md)

## 文档目录

- [快速导入指南](./IMPORT_GUIDE.md) - 测试数据导入步骤
- [测试数据总结](./TEST_DATA_SUMMARY.md) - 测试数据详细信息
- [项目设计文档](./specs/elderly-health-tracking/) - 完整的设计文档
  - [database.md](./specs/elderly-health-tracking/database.md) - 数据库设计
  - [design.md](./specs/elderly-health-tracking/design.md) - 系统设计
  - [ui-design-spec.md](./specs/elderly-health-tracking/ui-design-spec.md) - UI设计规范
  - [ui-miniprogram-pages.md](./specs/elderly-health-tracking/ui-miniprogram-pages.md) - 小程序页面设计
