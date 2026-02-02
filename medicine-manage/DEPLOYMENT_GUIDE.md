# 云函数部署指南

本指南说明如何部署修复后的云函数,使小程序和后台系统能够正常工作。

## 📋 需要部署的云函数

### 1. login - 用户登录云函数
- **功能**: 自动注册新用户,更新老用户登录时间
- **使用场景**: 小程序首次打开或用户信息不存在时
- **路径**: `WeChat/cloudfunctions/login/`

### 2. getUsers - 获取用户列表云函数
- **功能**: 提供用户列表给后台管理系统
- **使用场景**: 后台管理系统查询用户数据
- **路径**: `WeChat/cloudfunctions/getUsers/`

## 🚀 部署步骤

### 步骤1: 安装依赖

#### Windows系统
```powershell
cd d:/project/medicine-manage/WeChat/cloudfunctions/login
npm install

cd ../getUsers
npm install
```

#### Mac/Linux系统
```bash
cd d:/project/medicine-manage/WeChat/cloudfunctions/login
npm install

cd ../getUsers
npm install
```

### 步骤2: 在微信开发者工具中部署

#### 方法A: 右键部署(推荐)
1. 打开微信开发者工具,打开 `medicine-manage/WeChat` 项目
2. 在左侧目录树找到 `cloudfunctions/login` 文件夹
3. 右键点击 `login` 文件夹
4. 选择"上传并部署:云端安装依赖"
5. 等待部署完成(约30秒)
6. 对 `getUsers` 文件夹重复上述操作

#### 方法B: 使用命令行部署
```bash
# 部署login云函数
cd d:/project/medicine-manage/WeChat
npx tcb functions:deploy login

# 部署getUsers云函数
npx tcb functions:deploy getUsers
```

### 步骤3: 配置HTTP访问(用于后台系统)

#### 3.1 获取云函数HTTP访问路径

在微信开发者工具中:
1. 点击顶部菜单"云开发"
2. 进入"云函数"页面
3. 找到 `getUsers` 云函数
4. 点击"详情"
5. 点击"云函数管理"进入控制台
6. 找到"触发方式" → "HTTP触发"
7. 复制HTTP访问路径

#### 3.2 配置后台API基础URL

打开 `admin/.env` 或 `admin/.env.development` 文件:
```env
VITE_API_BASE_URL=https://your-cloud-base-env-id.service.tcloudbase.com
```

**实际URL格式**:
```
https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com
```

#### 3.3 在控制台配置HTTP触发器

1. 进入CloudBase控制台: https://console.cloud.tencent.com/tcb
2. 选择环境: `wzldavid-4gwhey9fe011d906`
3. 进入"云函数"
4. 点击 `getUsers` 云函数
5. 点击"触发管理"
6. 点击"创建触发器"
7. 选择"HTTP触发器"
8. 配置:
   - 触发方式: HTTP
   - 路径: `/getUsers`
   - 鉴权方式: 免鉴权(测试环境)或API网关鉴权(生产环境)
9. 点击"保存"

## ✅ 验证部署

### 验证login云函数

#### 小程序端验证
1. 清除小程序缓存
2. 重新打开小程序
3. 进入"我的"页面
4. 查看是否显示"注册中..."
5. 注册成功后查看用户信息

#### 控制台验证
1. 进入CloudBase控制台
2. 进入"云开发" → "数据库" → "文档数据库"
3. 查看是否有新的用户记录
4. 验证用户数据是否包含 `_openid` 字段

### 验证getUsers云函数

#### 后台系统验证
1. 启动后台管理系统: `cd admin && npm run dev`
2. 登录后台系统
3. 进入"用户管理"页面
4. 查看是否显示真实用户数据

#### HTTP请求验证
使用curl测试:
```bash
curl -X GET "https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com/getUsers?page=1&pageSize=20"
```

或使用Postman测试。

## 🧪 测试流程

### 1. 新用户注册测试
```javascript
// 小程序控制台执行
wx.cloud.callFunction({
  name: 'login'
}).then(res => {
  console.log('登录结果:', res.result)
})
```

**预期结果**:
```json
{
  "success": true,
  "openid": "oxxxxxx...",
  "isNewUser": true,
  "userInfo": {
    "_id": "xxxxx",
    "_openid": "oxxxxxx...",
    "nickname": "老人",
    ...
  }
}
```

### 2. 编辑保存测试
1. 进入"我的"页面
2. 点击"编辑资料"
3. 修改昵称、性别、生日等信息
4. 点击"保存"
5. 验证保存成功
6. 在控制台查看用户数据是否更新

### 3. 后台数据同步测试
1. 在小程序中注册/编辑用户
2. 在后台管理系统查看用户列表
3. 验证数据是否同步

## 🔧 常见问题

### 问题1: 云函数部署失败
**错误**: `云函数上传失败`

**解决方案**:
1. 检查是否已登录微信开发者工具
2. 检查网络连接
3. 尝试重新安装依赖: `npm install`
4. 尝试使用"上传并部署:不安装依赖"

### 问题2: 云函数调用失败
**错误**: `cloud.callFunction:fail -501001`

**解决方案**:
1. 检查云函数是否已部署
2. 检查云函数名称是否正确
3. 查看云函数日志排查问题

### 问题3: 后台无法获取用户数据
**错误**: `Network Error`

**解决方案**:
1. 检查云函数HTTP触发器是否已配置
2. 检查后台API基础URL是否正确
3. 检查网络连接
4. 查看浏览器控制台详细错误信息

### 问题4: 新用户注册后编辑保存失败
**错误**: `docId must not be empty`

**解决方案**:
1. 确认用户已成功注册(包含 `_openid`)
2. 确认调用 `login` 云函数
3. 清除小程序缓存重试

## 📊 部署检查清单

- [ ] 已安装 `login` 云函数依赖
- [ ] 已安装 `getUsers` 云函数依赖
- [ ] `login` 云函数已部署
- [ ] `getUsers` 云函数已部署
- [ ] `getUsers` 云函数已配置HTTP触发器
- [ ] 后台API基础URL已配置
- [ ] 小程序新用户注册测试通过
- [ ] 小程序编辑保存测试通过
- [ ] 后台用户列表显示正常

## 🎯 下一步

部署完成后:
1. ✅ 小程序新用户可以正常注册
2. ✅ 新用户编辑资料可以保存
3. ✅ 后台管理系统可以查看真实用户数据
4. ✅ 前后端数据同步正常

如需更多功能,可以继续开发其他云函数:
- `getUserDetail` - 获取用户详情
- `updateUser` - 更新用户信息
- `getHealthData` - 获取健康数据
- 等等...
