# 🚀 快速开始 - 项目完整配置

## ✅ 已完成
- ✅ 云函数代码已编写完成
- ✅ 依赖包已安装(`@cloudbase/node-sdk@3.17.0`, `wx-server-sdk@2.6.3`)
- ✅ 小程序代码已修复
- ✅ 后台API已对接
- ✅ 环境配置文件已创建

## 📝 现在需要做的(4步)

---

## 第0步: 建立数据库(重要!)⚠️

**在部署云函数前,必须先建立数据库!**

### 快速建立(5分钟)

1. **打开控制台**
   ```
   https://console.cloud.tencent.com/tcb?envId=wzldavid-4gwhey9fe011d906
   ```

2. **创建集合并导入**(重复3次)

   **users 集合**:
   - 新建集合,名称: `users`
   - 打开 `cloud-database-test-data.json`
   - 复制 `"users": [` 部分的内容(第2-33行)
   - 粘贴到集合,确定
   - ✅ 应该看到 2 条记录

   **blood_glucose 集合**:
   - 新建集合,名称: `blood_glucose`
   - 复制 `"blood_glucose": [` 部分的内容(第34-660行)
   - 粘贴到集合,确定
   - ✅ 应该看到 157 条记录

   **blood_pressure 集合**:
   - 新建集合,名称: `blood_pressure`
   - 复制 `"blood_pressure": [` 部分的内容(第661-3209行)
   - 粘贴到集合,确定
   - ✅ 应该看到 87 条记录

3. **配置安全规则**

   进入安全规则页面,为3个集合分别配置:

   ```json
   {
     "read": true,
     "write": true
   }
   ```

4. **验证**

   - users: 2条 ✅
   - blood_glucose: 157条 ✅
   - blood_pressure: 87条 ✅

**详细指南**: `DATABASE_QUICK_START.md` 或 `DATABASE_SETUP_GUIDE.md`

---

## 第1步: 部署云函数

### 第1步: 部署云函数(在微信开发者工具中)

1. 打开微信开发者工具,打开项目: `d:/project/medicine-manage/WeChat`

2. 右键点击 `cloudfunctions/login` → 选择"上传并部署:云端安装依赖"
   - 等待约30秒,看到"云函数上传成功"即完成

3. 右键点击 `cloudfunctions/getUsers` → 选择"上传并部署:云端安装依赖"
   - 等待约30秒,看到"云函数上传成功"即完成

**完成标志**: 在"云开发" → "云函数"页面能看到 `login` 和 `getUsers` 两个云函数

### 第2步: 测试小程序

1. 清除小程序缓存(工具栏 → 清除缓存 → 清除全部)
2. 点击"编译"重新编译小程序
3. 进入"我的"页面
4. 看到自动注册提示 ✅

### 第3步: 测试编辑保存

1. 点击"编辑资料"
2. 修改昵称、性别、生日等
3. 点击"保存"
4. 看到"保存成功"提示 ✅

## 🎯 完成!

现在:
- ✅ 新用户可以自动注册
- ✅ 编辑资料可以正常保存
- ✅ 数据会保存到CloudBase数据库

## (可选) 配置后台系统访问

如果需要在后台管理系统查看用户数据:

### 1. 配置环境变量
已创建 `admin/.env.development` 文件,API基础URL已设置:
```env
VITE_API_BASE_URL=https://wzldavid-4gwhey9fe011d906.service.tcloudbase.com
```

### 2. 配置HTTP触发器
1. 进入CloudBase控制台: https://console.cloud.tencent.com/tcb
2. 为 `getUsers` 云函数配置HTTP触发器
   - 路径: `/getUsers`
   - 鉴权方式: 免鉴权(开发环境)

### 3. 启动后台系统
```bash
cd admin
npm run dev
```

4. 登录后台,进入用户管理,查看真实数据

详细配置说明: `admin/CONFIG_GUIDE.md`

## 📖 相关文档

- **快速步骤**: `CLOUD_FUNCTION_DEPLOYMENT_STEPS.md`
- **详细指南**: `DEPLOYMENT_GUIDE.md`
- **修复总结**: `NEW_USER_FIX_COMPLETE.md`

---

**立即开始部署吧!** 👍
