# 后台管理系统UI页面设计 - 老人健康记录小程序

## 文档信息
- **项目名称**: 老人健康记录小程序
- **文档版本**: v1.0
- **创建日期**: 2026-01-31
- **文档类型**: 后台管理系统UI页面设计文档

## 1. 整体布局

### 1.1 布局结构

```
┌────────┬──────────────────────────────────────────────┐
│        │  ┌──────────────────────────────────────┐  │
│        │  │  老人健康管理系统                    │  │
│  侧    │  │  [logo]  [admin] [退出] [🔔 3]    │  │
│  边    │  └──────────────────────────────────────┘  │
│  导    │                                              │
│  航    │  ┌──────────────────────────────────────┐  │
│        │  │  面包屑导航 > 首页 > 用户列表     │  │
│        │  └──────────────────────────────────────┘  │
│        │                                              │
│ [首页] │         主内容区域                        │
│ [用户] │                                              │
│ [数据] │                                              │
│ [异常] │                                              │
│ [导出] │                                              │
│        │                                              │
│        │                                              │
│        │                                              │
└────────┴──────────────────────────────────────────────┘
```

### 1.2 侧边栏设计

```css
.sidebar {
  width: 240px;
  height: 100vh;
  background: #2D3436;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  font-size: 20px;
  font-weight: 600;
  color: #FF9F43;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.sidebar-menu {
  flex: 1;
  padding: 24px 0;
  overflow-y: auto;
}

.menu-item {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: #B2BEC3;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.menu-item:hover {
  background: rgba(255,255,255,0.05);
  color: #FFFFFF;
}

.menu-item.active {
  background: var(--primary-color);
  color: #FFFFFF;
  font-weight: 500;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.menu-text {
  font-size: 14px;
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
```

---

## 2. 登录页面

### 2.1 页面布局图

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│              ┌─────────────────┐              │
│              │                 │              │
│              │    🏥          │              │
│              │                 │              │
│              │  老人健康管理系统  │              │
│              │                 │              │
│              └─────────────────┘              │
│                                             │
│              ┌─────────────────┐              │
│              │ 用户名          │              │
│              │ ──────────────  │              │
│              │                 │              │
│              └─────────────────┘              │
│                                             │
│              ┌─────────────────┐              │
│              │ 密码            │              │
│              │ ──────────────  │              │
│              │                 │              │
│              └─────────────────┘              │
│                                             │
│              [记住密码]  忘记密码?           │
│                                             │
│              ┌─────────────────┐              │
│              │                 │              │
│              │      登录       │              │
│              │                 │              │
│              └─────────────────┘              │
│                                             │
│          © 2026 老人健康管理系统            │
│                                             │
└─────────────────────────────────────────────┘
```

### 2.2 设计规范

```css
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF5E6 0%, #FFFFFF 100%);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}

.login-logo {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: var(--primary-color);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-size: 14px;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 159, 67, 0.1);
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
}

.forgot-password {
  font-size: 14px;
  color: var(--primary-color);
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 48px;
  background: var(--primary-color);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.login-button:hover {
  background: var(--primary-hover);
}

.login-button:active {
  background: var(--primary-active);
}

.login-footer {
  text-align: center;
  margin-top: 32px;
  font-size: 12px;
  color: var(--text-tertiary);
}
```

---

## 3. 首页仪表盘

### 3.1 页面布局图

```
┌─────────────────────────────────────────────┐
│  老人健康管理系统  [admin] [退出] [🔔 3] │
├─────────────────────────────────────────────┤
│  面包屑导航 > 首页                         │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  今日统计                            │  │
│  │ ┌─────────┐  ┌─────────┐  ┌───────┐ │  │
│  │ │注册用户  │  │今日记录  │  │异常   │ │  │
│  │ │   256   │  │   128   │  │  12   │ │  │
│  │ └─────────┘  └─────────┘  └───────┘ │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  本周趋势                            │  │
│  │  [本周血糖记录趋势图]                │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌────────────────┬───────────────────────┐  │
│  │  最新异常预警   │  最近活跃用户          │  │
│  ├────────────────┼───────────────────────┤  │
│  │ ⚠️ 张大爷     │  👤 王大妈           │  │
│  │   高血糖      │  刚刚记录血压        │  │
│  │   10:30       │                      │  │
│  ├────────────────┼───────────────────────┤  │
│  │ ⚠️ 李大妈     │  👤 张大爷           │  │
│  │   高血压      │  5分钟前记录血糖     │  │
│  │   09:15       │                      │  │
│  ├────────────────┼───────────────────────┤  │
│  │ ⚠️ 王大爷     │  👤 李大爷           │  │
│  │   低血糖      │  10分钟前记录血压    │  │
│  │   08:00       │                      │  │
│  ├────────────────┼───────────────────────┤  │
│  │ ⚠️ 赵大妈     │  👤 赵大妈           │  │
│  │   高血压      │  20分钟前记录血糖    │  │
│  │   07:30       │                      │  │
│  └────────────────┴───────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### 3.2 组件设计规范

#### 统计卡片
```css
.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-family-number);
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 28px;
}

.stat-icon.blue {
  background: #E7F5FF;
  color: #4DABF7;
}

.stat-icon.green {
  background: #E6FCF5;
  color: #51CF66;
}

.stat-icon.red {
  background: #FFE3E3;
  color: #FF6B6B;
}
```

#### 趋势图表卡片
```css
.chart-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 32px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-actions {
  display: flex;
  gap: 8px;
}

.chart-container {
  height: 300px;
  width: 100%;
}
```

#### 双列表卡片
```css
.double-list-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.list-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.list-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.list-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.list-card-link {
  font-size: 14px;
  color: var(--primary-color);
  text-decoration: none;
}

.list-card-link:hover {
  text-decoration: underline;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-primary);
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-icon {
  font-size: 20px;
  margin-right: 12px;
}

.alert-content {
  flex: 1;
}

.alert-user {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.alert-type {
  font-size: 12px;
  color: var(--text-secondary);
}

.alert-time {
  font-size: 12px;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.user-activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-primary);
}

.user-activity-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--secondary-color);
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.user-activity-info {
  flex: 1;
}

.user-activity-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.user-activity-time {
  font-size: 12px;
  color: var(--text-tertiary);
}
```

---

## 4. 用户列表页面

### 4.1 页面布局图

```
┌─────────────────────────────────────────────┐
│  老人健康管理系统  [admin] [退出] [🔔 3] │
├─────────────────────────────────────────────┤
│  面包屑导航 > 首页 > 用户列表               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  [搜索老人昵称...]            [搜索] │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ 昵称      │ 性别 │ 注册时间  │操作  │  │
│  ├───────────────────────────────────────┤  │
│  │ 👤 张大爷  │ 男   │01-15     │查看  │  │
│  │           │      │10:30     │      │  │
│  ├───────────────────────────────────────┤  │
│  │ 👤 王大妈  │ 女   │01-16     │查看  │  │
│  │           │      │09:15     │      │  │
│  ├───────────────────────────────────────┤  │
│  │ 👤 李大爷  │ 男   │01-18     │查看  │  │
│  │           │      │14:20     │      │  │
│  ├───────────────────────────────────────┤  │
│  │ 👤 赵大妈  │ 女   │01-20     │查看  │  │
│  │           │      │11:00     │      │  │
│  ├───────────────────────────────────────┤  │
│  │ 👤 孙大爷  │ 男   │01-22     │查看  │  │
│  │           │      │16:45     │      │  │
│  └───────────────────────────────────────┘  │
│                                             │
│         [<上一页]  第1/13页  [下一页>]    │
│         每页显示: [20▼]                   │
│                                             │
└─────────────────────────────────────────────┘
```

### 4.2 表格设计规范

```css
.search-bar {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  gap: 16px;
}

.search-input {
  flex: 1;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
}

.search-button {
  height: 40px;
  padding: 0 24px;
  background: var(--primary-color);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.data-table {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: #FAFAFA;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-primary);
}

.table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-primary);
  font-size: 14px;
  color: var(--text-primary);
}

.table tr:hover {
  background: var(--secondary-color);
}

.table tr:last-child td {
  border-bottom: none;
}

.user-cell {
  display: flex;
  align-items: center;
}

.user-avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--secondary-color);
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.user-name {
  font-weight: 500;
}

.view-button {
  padding: 6px 16px;
  background: var(--primary-color);
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-button:hover {
  background: var(--primary-hover);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-button {
  height: 36px;
  padding: 0 16px;
  background: #FFFFFF;
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: var(--text-secondary);
}

.page-size-selector {
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-primary);
}
```

---

## 5. 健康数据页面

### 5.1 页面布局图

```
┌─────────────────────────────────────────────┐
│  老人健康管理系统  [admin] [退出] [🔔 3] │
├─────────────────────────────────────────────┤
│  面包屑导航 > 用户列表 > 健康数据           │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  👤 张大爷  70岁  男              │  │
│  │  糖尿病:是  高血压:否             │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌────────────┬──────────────────────────┐  │
│  │ 日期选择   │  [2026-01-31▼]        │  │
│  └────────────┴──────────────────────────┘  │
│                                             │
│  ┌────────────┬──────────────────────────┐  │
│  │血糖趋势   │  血压趋势               │  │
│  │(最近7天)  │  (最近7天)              │  │
│  ├────────────┼──────────────────────────┤  │
│  │           │                         │  │
│  │  [折线图] │  [双曲线图]             │  │
│  │           │                         │  │
│  └────────────┴──────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  2026年01月31日 健康记录            │  │
│  ├───────────────────────────────────────┤  │
│  │ 时间    │ 类型   │ 数值     │状态  │  │
│  ├───────────────────────────────────────┤  │
│  │ 07:30   │血糖    │ 7.2      │异常  │  │
│  │         │空腹    │ mmol/L   │高血糖│  │
│  ├───────────────────────────────────────┤  │
│  │ 08:00   │血压    │145/95    │异常  │  │
│  │         │        │78次/分   │高血压│  │
│  ├───────────────────────────────────────┤  │
│  │ 09:00   │血糖    │10.5     │异常  │  │
│  │         │早餐后  │ mmol/L   │高血糖│  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [导出数据]  [返回列表]                     │
│                                             │
└─────────────────────────────────────────────┘
```

### 5.2 组件设计规范

#### 用户信息卡片
```css
.user-profile-card {
  background: linear-gradient(135deg, var(--primary-color), #FFB732);
  border-radius: 12px;
  padding: 32px;
  color: #FFFFFF;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-profile-avatar-lg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  border: 3px solid rgba(255,255,255,0.3);
}

.user-profile-info {
  flex: 1;
}

.user-profile-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.user-profile-details {
  font-size: 14px;
  opacity: 0.9;
}

.user-profile-tag {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 100rpx;
  margin-right: 8px;
  font-size: 13px;
}
```

#### 趋势图表卡片
```css
.trend-charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.chart-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-container {
  height: 250px;
  width: 100%;
}
```

#### 健康记录表格
```css
.records-table-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.records-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.records-table-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.date-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-picker-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.date-picker {
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-primary);
}

.records-table th {
  background: #FAFAFA;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-primary);
}

.records-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-primary);
  font-size: 14px;
  color: var(--text-primary);
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100rpx;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.normal {
  background: var(--success-bg);
  color: var(--success-text);
}

.status-badge.abnormal {
  background: var(--danger-bg);
  color: var(--danger-text);
}

.action-bar {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.action-bar-button {
  flex: 1;
  height: 40px;
  padding: 0 24px;
  background: #FFFFFF;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-bar-button.primary {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #FFFFFF;
}

.action-bar-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

---

## 6. 异常预警页面

### 6.1 页面布局图

```
┌─────────────────────────────────────────────┐
│  老人健康管理系统  [admin] [退出] [🔔 3] │
├─────────────────────────────────────────────┤
│  面包屑导航 > 首页 > 异常预警              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  筛选: [全部▼]  [高血糖] [低血糖]  │  │
│  │         [高血压] [低血压]            │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ ⚠️ 高血糖  │老人   │数值  │时间   │状态│  │
│  ├───────────────────────────────────────┤  │
│  │ ⚠️ 高血糖  │张大爷 │10.5  │10:30  │未处理│  │
│  │          │      │mmol/L │01-31  │[查看]│  │
│  ├───────────────────────────────────────┤  │
│  │ ⚠️ 高血压  │王大妈 │145/95│09:15  │未处理│  │
│  │          │      │mmHg  │01-31  │[查看]│  │
│  ├───────────────────────────────────────┤  │
│  │ ⚠️ 低血糖  │李大爷 │ 3.5  │08:00  │已查看│  │
│  │          │      │mmol/L │01-31  │[查看]│  │
│  ├───────────────────────────────────────┤  │
│  │ ⚠️ 高血压  │赵大妈 │152/98│07:30  │已处理│  │
│  │          │      │mmHg  │01-30  │[查看]│  │
│  ├───────────────────────────────────────┤  │
│  │ ⚠️ 高血糖  │孙大爷 │11.2  │07:00  │已处理│  │
│  │          │      │mmol/L │01-30  │[查看]│  │
│  └───────────────────────────────────────┘  │
│                                             │
│         [<上一页]  第1/5页  [下一页>]       │
│                                             │
│  [批量标记已处理]  [导出异常列表]           │
│                                             │
└─────────────────────────────────────────────┘
```

### 6.2 组件设计规范

#### 异常类型筛选
```css
.alert-filter-bar {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-right: 12px;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  height: 36px;
  padding: 0 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 100rpx;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-chip.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #FFFFFF;
}
```

#### 异常表格
```css
.alerts-table th {
  background: #FFF5E6;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-primary);
}

.alerts-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-primary);
  font-size: 14px;
  color: var(--text-primary);
}

.alerts-table tr.abnormal-row {
  background: var(--danger-bg);
}

.alert-type-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.alert-type-icon.high-glucose {
  color: #FF8787;
}

.alert-type-icon.low-glucose {
  color: #74C0FC;
}

.alert-type-icon.high-pressure {
  color: #FF6B6B;
}

.alert-type-icon.low-pressure {
  color: #4DABF7;
}

.alert-value {
  font-family: var(--font-family-number);
  font-weight: 600;
  color: var(--text-primary);
}

.alert-unit {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: 4px;
}

.status-dropdown {
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  font-size: 13px;
  background: #FFFFFF;
  cursor: pointer;
}

.status-dropdown.status-unprocessed {
  background: var(--danger-bg);
  border-color: var(--danger-color);
  color: var(--danger-text);
}

.status-dropdown.status-viewed {
  background: var(--warning-bg);
  border-color: var(--warning-color);
  color: var(--warning-text);
}

.status-dropdown.status-processed {
  background: var(--success-bg);
  border-color: var(--success-color);
  color: var(--success-text);
}
```

---

## 7. 数据导出页面

### 7.1 页面布局图

```
┌─────────────────────────────────────────────┐
│  老人健康管理系统  [admin] [退出] [🔔 3] │
├─────────────────────────────────────────────┤
│  面包屑导航 > 首页 > 数据导出              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  选择用户                            │  │
│  │  [张大爷 ▼]                         │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  导出类型                            │  │
│  │  ● 全部数据                          │  │
│  │  ○ 仅血糖数据                        │  │
│  │  ○ 仅血压数据                        │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  时间范围                            │  │
│  │  ○ 最近7天                          │  │
│  │  ● 最近30天                          │  │
│  │  ○ 自定义                            │  │
│  │                                     │  │
│  │  开始日期: [2026-01-01]              │  │
│  │  结束日期: [2026-01-31]              │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  导出格式                            │  │
│  │  ● Excel (.xlsx)                    │  │
│  │  ○ CSV (.csv)                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────   │
│  │  ☑ 包含异常预警                     │   │
│  └──────────────────────────────────────   │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │                                     │  │
│  │        [开始导出]                   │  │
│  │                                     │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### 7.2 组件设计规范

```css
.export-form {
  max-width: 600px;
}

.form-section {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.form-select {
  width: 100%;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  background: #FFFFFF;
  color: var(--text-primary);
  cursor: pointer;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-item:hover {
  border-color: var(--primary-color);
}

.radio-item.selected {
  border-color: var(--primary-color);
  background: var(--secondary-color);
}

.radio-input {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  accent-color: var(--primary-color);
}

.radio-label {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.date-range-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  accent-color: var(--primary-color);
}

.checkbox-label {
  font-size: 14px;
  color: var(--text-primary);
}

.export-button {
  width: 100%;
  height: 48px;
  background: var(--primary-color);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.export-button:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 159, 67, 0.3);
}
```

---

## 8. 弹窗设计

### 8.1 确认对话框

```
┌─────────────────────────────────┐
│  ┌─────────────────────────┐    │
│  │  确认删除?              │    │
│  ├─────────────────────────┤    │
│  │  确定要删除这条记录吗?    │    │
│  │  此操作不可恢复!         │    │
│  ├─────────────────────────┤    │
│  │  [取消]     [确认删除]  │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

### 8.2 详情对话框

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │  记录详情  ×              │    │
│  ├─────────────────────────────┤    │
│  │  类型: 血糖                │    │
│  │  测量时段: 空腹          │    │
│  │  血糖值: 7.2 mmol/L     │    │
│  │  测量时间: 2026-01-31 07:30│    │
│  │  状态: [异常] 高血糖      │    │
│  │  备注: (无)               │    │
│  ├─────────────────────────────┤    │
│  │          [关闭]            │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 12px 48px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  margin-bottom: 24px;
}

.modal-footer {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.modal-button {
  height: 40px;
  padding: 0 24px;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: #FFFFFF;
  transition: all 0.2s;
}

.modal-button.primary {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #FFFFFF;
}

.modal-button.danger {
  background: var(--danger-color);
  border-color: var(--danger-color);
  color: #FFFFFF;
}

.detail-item {
  display: flex;
  margin-bottom: 16px;
}

.detail-label {
  width: 100px;
  font-size: 14px;
  color: var(--text-secondary);
}

.detail-value {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}
```

---

**文档结束**
