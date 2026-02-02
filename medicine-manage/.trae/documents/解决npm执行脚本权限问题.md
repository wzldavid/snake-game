# 解决npm执行脚本权限问题

## 问题分析
用户在运行 `npm install` 命令时遇到了以下错误：
```
npm : 无法加载文件 C:\Program Files\nodejs\npm.ps1，因为在此系统上禁止运行脚本。
```

这是由于Windows PowerShell的执行策略限制导致的，默认情况下，PowerShell不允许运行未签名的脚本。

## 解决方案

### 步骤1：以管理员身份运行PowerShell
1. 在Windows搜索栏中输入 "PowerShell"
2. 右键点击 "Windows PowerShell"
3. 选择 "以管理员身份运行"

### 步骤2：修改执行策略
在管理员模式的PowerShell中执行以下命令：

```powershell
# 设置执行策略为RemoteSigned（推荐）
Set-ExecutionPolicy RemoteSigned

# 或者设置为Unrestricted（更宽松）
# Set-ExecutionPolicy Unrestricted
```

### 步骤3：验证执行策略
执行以下命令验证执行策略是否已修改：

```powershell
Get-ExecutionPolicy
```

### 步骤4：重新运行npm命令
现在可以重新尝试运行 `npm install` 命令：

```powershell
cd d:\project\medicine-manage\WeChat
npm install
```

## 执行策略说明
- **Restricted**：默认策略，不允许运行任何脚本
- **RemoteSigned**：允许运行本地脚本，远程脚本必须有签名
- **Unrestricted**：允许运行所有脚本，无论是否签名

推荐使用 `RemoteSigned` 策略，它提供了足够的权限同时保持一定的安全性。

## 注意事项
- 修改执行策略需要管理员权限
- 完成npm安装后，可以根据需要将执行策略改回默认值
- 如果遇到其他权限问题，可以尝试使用 `--no-script` 参数运行npm命令

## 预期结果
执行完上述步骤后，用户应该能够成功运行 `npm install` 命令，安装项目依赖。