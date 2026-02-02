# 后台管理系统配置指南

## ✅ 已创建的配置文件

已在 `admin/` 目录下创建以下环境配置文件:

### 1. `.env.development` - 开发环境
```env
VITE_API_BASE_URL=https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com
```

### 2. `.env.production` - 生产环境
```env
VITE_API_BASE_URL=https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com
```

### 3. `.env.example` - 配置示例
```env
VITE_API_BASE_URL=https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com
```

## 🔧 如何使用

### 开发环境运行

```bash
cd admin
npm run dev
```

Vite 会自动加载 `.env.development` 文件中的配置。

### 生产环境构建

```bash
cd admin
npm run build
```

Vite 会自动加载 `.env.production` 文件中的配置。

## 📝 配置说明

### API基础URL

`VITE_API_BASE_URL` 是CloudBase云函数的HTTP访问地址。

**注意**:
1. 必须为云函数配置HTTP触发器才能使用此URL
2. URL格式: `https://环境ID.service.tcloudbase.com`
3. 云函数路径通过API接口拼接,例如: `/getUsers`

**示例**:
```
基础URL: https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com
完整路径: https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com/getUsers
```

## 🔑 配置HTTP触发器

### 步骤1: 进入CloudBase控制台

1. 打开: https://console.cloud.tencent.com/tcb
2. 选择环境: `wzldavid-4gwhey9fe011d906`
3. 进入"云开发" → "云函数"

### 步骤2: 为 getUsers 配置HTTP触发器

1. 找到 `getUsers` 云函数
2. 点击"触发管理"
3. 点击"创建触发器"
4. 配置:
   - **触发方式**: HTTP
   - **路径**: `/getUsers`
   - **鉴权方式**: 免鉴权(开发环境) / API网关鉴权(生产环境)
   - **访问方式**: GET
5. 点击"保存"

### 步骤3: 获取HTTP访问路径

触发器创建成功后,会显示HTTP访问路径:
```
https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com/getUsers
```

## 🧪 测试配置

### 1. 测试HTTP访问

使用curl测试:
```bash
curl -X GET "https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com/getUsers?page=1&pageSize=20"
```

或使用浏览器访问:
```
https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com/getUsers?page=1&pageSize=20
```

**预期响应**:
```json
{
  "success": true,
  "data": [...],
  "total": 2,
  "page": 1,
  "pageSize": 20
}
```

### 2. 启动后台系统测试

```bash
cd admin
npm run dev
```

1. 打开浏览器访问: `http://localhost:3000`
2. 登录后台管理系统
3. 进入"用户管理"页面
4. 查看是否显示真实用户数据

## 🔍 调试技巧

### 查看环境变量

在浏览器控制台执行:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```

应该输出:
```
https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com
```

### 查看网络请求

打开浏览器开发者工具(F12) → Network标签:
1. 刷新页面
2. 查看发出的HTTP请求
3. 确认请求URL是否正确
4. 查看响应内容

## ⚠️ 常见问题

### 问题1: 环境变量不生效

**原因**: 文件名不正确

**解决**:
- 开发环境: 必须是 `.env.development`
- 生产环境: 必须是 `.env.production`
- 注意文件名前的点 `.`

### 问题2: HTTP请求失败

**原因**: 云函数未配置HTTP触发器

**解决**:
1. 确认云函数已部署
2. 确认HTTP触发器已配置
3. 检查触发器路径是否正确

### 问题3: CORS错误

**原因**: 跨域访问被限制

**解决**:
在云函数中添加CORS头:
```javascript
exports.main = async (event, context) => {
  // ... 业务逻辑 ...

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    },
    body: JSON.stringify(result)
  }
}
```

## 📋 配置检查清单

- [ ] `.env.development` 文件已创建
- [ ] `VITE_API_BASE_URL` 已设置
- [ ] 云函数 `getUsers` 已部署
- [ ] HTTP触发器已配置
- [ ] HTTP访问路径可正常访问
- [ ] 后台系统可正常启动
- [ ] 用户列表显示正常

## 🎯 完成配置后

1. ✅ 后台管理系统可以访问CloudBase云函数
2. ✅ 可以查询真实用户数据
3. ✅ 前后端数据同步

## 📚 相关文档

- 部署指南: `../DEPLOYMENT_GUIDE.md`
- 快速开始: `../START_HERE.md`
- 修复总结: `../NEW_USER_FIX_COMPLETE.md`

---

**配置完成!现在可以启动后台管理系统了。** 🎉
