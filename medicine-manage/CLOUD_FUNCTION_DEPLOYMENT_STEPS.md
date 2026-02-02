# 云函数部署步骤

## ✅ 依赖安装状态

依赖已安装在项目根目录的 `node_modules` 中:
- `@cloudbase/node-sdk@3.17.0`
- `wx-server-sdk@2.6.3`

CloudBase 云函数在部署时会自动从这些依赖中提取所需的包。

## 🚀 部署方法

### 方法1: 微信开发者工具(推荐)

#### 步骤1: 打开项目
1. 打开微信开发者工具
2. 打开项目: `d:/project/medicine-manage/WeChat`

#### 步骤2: 部署 login 云函数
1. 在左侧目录树找到 `cloudfunctions/login` 文件夹
2. 右键点击 `login` 文件夹
3. 选择"上传并部署:云端安装依赖"
4. 等待部署完成(约30秒)
5. 看到"云函数上传成功"提示即完成

#### 步骤3: 部署 getUsers 云函数
1. 在左侧目录树找到 `cloudfunctions/getUsers` 文件夹
2. 右键点击 `getUsers` 文件夹
3. 选择"上传并部署:云端安装依赖"
4. 等待部署完成(约30秒)
5. 看到"云函数上传成功"提示即完成

### 方法2: 使用CloudBase CLI

```bash
# 安装CLI
npm install -g @cloudbase/cli

# 登录
cloudbase login

# 部署login云函数
cd d:/project/medicine-manage/WeChat
npx tcb functions:deploy login

# 部署getUsers云函数
npx tcb functions:deploy getUsers
```

## ✅ 验证部署

### 1. 检查云函数列表
1. 点击顶部菜单"云开发"
2. 进入"云函数"页面
3. 查看是否有 `login` 和 `getUsers` 云函数

### 2. 测试 login 云函数
在小程序控制台执行:
```javascript
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
  "isNewUser": true/false,
  "userInfo": { ... }
}
```

### 3. 测试 getUsers 云函数
在CloudBase控制台:
1. 进入"云函数"
2. 点击 `getUsers` 云函数
3. 点击"测试"
4. 输入测试参数:
   ```json
   {
     "page": 1,
     "pageSize": 20,
     "keyword": ""
   }
   ```
5. 点击"测试运行"

**预期结果**:
```json
{
  "success": true,
  "data": [...],
  "total": 2,
  "page": 1,
  "pageSize": 20
}
```

## 🔧 配置HTTP访问(可选,用于后台系统)

### 在控制台配置HTTP触发器

1. 进入CloudBase控制台: https://console.cloud.tencent.com/tcb
2. 选择环境: `wzldavid-4gwhey9fe011d906`
3. 进入"云开发" → "云函数"
4. 找到 `getUsers` 云函数
5. 点击"触发管理"
6. 点击"创建触发器"
7. 配置:
   - 触发方式: HTTP
   - 路径: `/getUsers`
   - 鉴权方式: 免鉴权(测试环境)
8. 点击"保存"
9. 复制显示的HTTP访问URL

### 配置后台API基础URL

修改 `admin/.env.development` 文件:
```env
VITE_API_BASE_URL=https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com
```

## 📋 部署检查清单

- [ ] 微信开发者工具已打开项目
- [ ] `login` 云函数已上传并部署
- [ ] `getUsers` 云函数已上传并部署
- [ ] 云函数列表中显示两个云函数
- [ ] login 云函数测试通过
- [ ] getUsers 云函数测试通过
- [ ] (可选) HTTP触发器已配置
- [ ] (可选) 后台API基础URL已配置

## 🎯 部署完成后

1. **小程序测试**
   - 清除小程序缓存
   - 重新打开小程序
   - 进入"我的"页面
   - 验证是否自动注册

2. **编辑功能测试**
   - 进入编辑资料页面
   - 修改信息并保存
   - 验证保存成功

3. **后台系统测试**
   - 启动后台: `cd admin && npm run dev`
   - 登录后台
   - 进入用户管理
   - 验证显示真实数据

## ⚠️ 常见问题

### 问题1: 右键菜单中没有"上传并部署"
**解决**: 确保当前打开的是小程序项目,不是普通的目录

### 问题2: 部署失败
**解决**:
- 检查网络连接
- 检查是否已登录微信开发者工具
- 查看"云开发"面板的错误提示

### 问题3: 云函数调用失败
**解决**:
- 确认云函数已部署
- 检查云函数名称是否正确
- 查看"云函数" → "日志"排查问题

## 📞 需要帮助?

- 查看部署指南: `DEPLOYMENT_GUIDE.md`
- 查看修复总结: `NEW_USER_FIX_COMPLETE.md`
- 查看云函数日志排查问题

---

**准备就绪!现在请在微信开发者工具中执行上述部署步骤。**
