# UI设计规范文档 - 老人健康记录小程序

## 文档信息
- **项目名称**: 老人健康记录小程序
- **文档版本**: v1.0
- **创建日期**: 2026-01-31
- **文档类型**: UI/UX设计规范文档

## 1. 设计原则

### 1.1 核心设计理念
- **适老化设计**: 针对老年人视力、操作能力的特殊性进行优化
- **简洁直观**: 减少认知负荷,操作流程简单明了
- **温馨亲和**: 通过色彩和视觉元素传递关怀和温暖
- **清晰明确**: 信息层级清晰,重要数据突出显示

### 1.2 设计目标
- 提升老年人使用体验,降低学习成本
- 确保核心功能3步内完成操作
- 提供清晰的视觉反馈和状态提示
- 建立统一的视觉语言和交互规范

---

## 2. 色彩系统

### 2.1 主色调

```css
/* 主色调 - 温暖橙色 */
--primary-color: #FF9F43;
--primary-hover: #FF8C2F;
--primary-active: #FF791B;

/* 辅助色 - 柔和米色 */
--secondary-color: #FFF5E6;
--secondary-hover: #FFE8CC;
```

**使用场景**:
- 主色调: 主要按钮、导航栏、重要操作入口
- 辅助色: 背景、卡片背景、高亮区域

### 2.2 功能色

```css
/* 成功色 - 绿色 */
--success-color: #51CF66;
--success-bg: #E6FCF5;
--success-text: #099268;

/* 警告色 - 橙色 */
--warning-color: #FFB732;
--warning-bg: #FFF9DB;
--warning-text: #E67700;

/* 错误/警示色 - 红色 */
--danger-color: #FF6B6B;
--danger-bg: #FFE3E3;
--danger-text: #C92A2A;

/* 信息色 - 蓝色 */
--info-color: #4DABF7;
--info-bg: #E7F5FF;
--info-text: #1971C2;
```

**使用场景**:
- 成功色: 正常数据、成功提示
- 警告色: 需要注意的数据
- 错误/警示色: 异常数据、警告信息、删除操作
- 信息色: 提示信息、中性状态

### 2.3 中性色

```css
/* 文字颜色 */
--text-primary: #2D3436;      /* 主要文字 */
--text-secondary: #636E72;     /* 次要文字 */
--text-tertiary: #B2BEC3;     /* 辅助文字 */
--text-disabled: #DFE6E9;      /* 禁用文字 */

/* 背景颜色 */
--bg-primary: #FFFFFF;         /* 主背景 */
--bg-secondary: #FAFAFA;       /* 次背景 */
--bg-tertiary: #F5F5F5;       /* 三级背景 */

/* 边框颜色 */
--border-primary: #DFE6E9;     /* 主要边框 */
--border-secondary: #B2BEC3;   /* 次要边框 */
```

### 2.4 色彩对比度要求

- 重要文字与背景对比度 ≥ 4.5:1
- 大标题与背景对比度 ≥ 3:1
- 按钮文字与背景对比度 ≥ 4.5:1

---

## 3. 字体系统

### 3.1 字体家族

```css
/* 主字体 - 微软雅黑 */
--font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;

/* 数字字体 - DIN/Roboto */
--font-family-number: "DIN Alternate", "Roboto", "Arial", sans-serif;
```

### 3.2 字体大小

| 用途 | 字号 | rpx | 行高 | 使用场景 |
|------|------|-----|------|----------|
| H1(大标题) | 48px | 96rpx | 1.2 | 页面主标题 |
| H2(标题) | 36px | 72rpx | 1.3 | 区块标题 |
| H3(副标题) | 30px | 60rpx | 1.4 | 卡片标题 |
| 正文 | 28px | 56rpx | 1.6 | 内容文字 |
| 辅助文字 | 24px | 48rpx | 1.6 | 次要信息 |
| 小字 | 20px | 40rpx | 1.6 | 提示文字 |

### 3.3 字重

```css
--font-weight-regular: 400;    /* 常规 */
--font-weight-medium: 500;     /* 中等 */
--font-weight-semibold: 600;   /* 半粗 */
--font-weight-bold: 700;       /* 粗体 */
```

### 3.4 数字显示

重要数值(血糖、血压值)使用数字字体,增强可读性:

```css
.number-large {
  font-family: var(--font-family-number);
  font-size: 80rpx;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}
```

---

## 4. 间距系统

### 4.1 基础间距单位

```css
--spacing-xs: 8rpx;     /* 极小间距 */
--spacing-sm: 16rpx;    /* 小间距 */
--spacing-md: 24rpx;    /* 中间距 */
--spacing-lg: 32rpx;    /* 大间距 */
--spacing-xl: 48rpx;    /* 超大间距 */
--spacing-xxl: 64rpx;   /* 巨大间距 */
```

### 4.2 间距使用规范

| 元素 | 内边距 | 外边距 |
|------|--------|--------|
| 页面容器 | 32rpx | 0 |
| 卡片 | 32rpx | 24rpx |
| 按钮 | 16rpx 32rpx | 16rpx |
| 表单项 | 24rpx | 16rpx |
| 列表项 | 32rpx | 0 |

---

## 5. 圆角系统

```css
--radius-xs: 8rpx;      /* 极小圆角 - 小标签 */
--radius-sm: 16rpx;     /* 小圆角 - 按钮 */
--radius-md: 24rpx;     /* 中圆角 - 卡片 */
--radius-lg: 32rpx;     /* 大圆角 - 容器 */
--radius-xl: 48rpx;     /* 超大圆角 - 特殊元素 */
```

---

## 6. 阴影系统

```css
--shadow-sm: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
--shadow-md: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
--shadow-xl: 0 16rpx 48rpx rgba(0, 0, 0, 0.16);
```

**使用场景**:
- shadow-sm: 输入框、按钮
- shadow-md: 卡片、列表项
- shadow-lg: 弹窗、浮层
- shadow-xl: 特殊效果

---

## 7. 按钮设计

### 7.1 按钮尺寸

| 类型 | 高度 | 字号 | 最小宽度 | 点击区域 |
|------|------|------|----------|----------|
| 超大按钮 | 120rpx | 36rpx | 280rpx | 120rpx × 280rpx |
| 大按钮 | 96rpx | 32rpx | 240rpx | 96rpx × 240rpx |
| 中按钮 | 80rpx | 28rpx | 200rpx | 80rpx × 200rpx |
| 小按钮 | 64rpx | 24rpx | 160rpx | 64rpx × 160rpx |

### 7.2 按钮类型

#### 主按钮
```css
.btn-primary {
  background: var(--primary-color);
  color: #FFFFFF;
  border-radius: var(--radius-sm);
  font-size: 32rpx;
  font-weight: var(--font-weight-medium);
  height: 96rpx;
  padding: 0 48rpx;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-primary:active {
  background: var(--primary-active);
}
```

#### 次按钮
```css
.btn-secondary {
  background: var(--secondary-color);
  color: var(--primary-color);
  border: 2rpx solid var(--primary-color);
  border-radius: var(--radius-sm);
  font-size: 32rpx;
  font-weight: var(--font-weight-medium);
  height: 96rpx;
  padding: 0 48rpx;
}
```

#### 文字按钮
```css
.btn-text {
  background: transparent;
  color: var(--primary-color);
  font-size: 32rpx;
  font-weight: var(--font-weight-medium);
  padding: 16rpx 32rpx;
}
```

#### 危险按钮
```css
.btn-danger {
  background: var(--danger-color);
  color: #FFFFFF;
  border-radius: var(--radius-sm);
  font-size: 32rpx;
  font-weight: var(--font-weight-medium);
  height: 96rpx;
  padding: 0 48rpx;
}
```

### 7.3 按钮状态

| 状态 | 背景色 | 文字色 | 阴影 |
|------|--------|--------|------|
| 默认 | 主色 | #FFFFFF | shadow-sm |
| 悬停 | 悬停色 | #FFFFFF | shadow-md |
| 按下 | 按下色 | #FFFFFF | shadow-sm |
| 禁用 | #DFE6E9 | #B2BEC3 | none |

---

## 8. 表单设计

### 8.1 输入框

```css
.input-large {
  height: 96rpx;
  padding: 0 32rpx;
  font-size: 32rpx;
  border: 2rpx solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
}

.input-large:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4rpx rgba(255, 159, 67, 0.1);
}

.input-large::placeholder {
  color: var(--text-tertiary);
}
```

### 8.2 大数字输入框(适用于血糖/血压值)

```css
.input-number {
  height: 120rpx;
  padding: 0 48rpx;
  font-size: 56rpx;
  font-family: var(--font-family-number);
  font-weight: var(--font-weight-bold);
  text-align: center;
  border: 3rpx solid var(--primary-color);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  color: var(--primary-color);
}
```

### 8.3 选择器

```css
.select {
  height: 96rpx;
  padding: 0 32rpx;
  font-size: 32rpx;
  border: 2rpx solid var(--border-primary);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.select-arrow {
  width: 32rpx;
  height: 32rpx;
  color: var(--text-tertiary);
}
```

### 8.4 表单项间距

```css
.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  font-size: 32rpx;
  color: var(--text-primary);
  margin-bottom: 16rpx;
  font-weight: var(--font-weight-medium);
}

.form-hint {
  font-size: 24rpx;
  color: var(--text-tertiary);
  margin-top: 8rpx;
}
```

---

## 9. 卡片设计

### 9.1 基础卡片

```css
.card {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 32rpx;
  margin-bottom: 24rpx;
}
```

### 9.2 数据卡片

```css
.card-data {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-data-value {
  font-size: 80rpx;
  font-family: var(--font-family-number);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  line-height: 1;
}

.card-data-label {
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-top: 16rpx;
}
```

### 9.3 统计卡片

```css
.card-stat {
  background: linear-gradient(135deg, var(--primary-color), #FFB732);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  color: #FFFFFF;
}

.card-stat-title {
  font-size: 24rpx;
  opacity: 0.9;
  margin-bottom: 8rpx;
}

.card-stat-value {
  font-size: 48rpx;
  font-family: var(--font-family-number);
  font-weight: var(--font-weight-bold);
}

.card-stat-unit {
  font-size: 24rpx;
  margin-left: 8rpx;
}
```

---

## 10. 列表设计

### 10.1 列表项

```css
.list-item {
  background: var(--bg-primary);
  padding: 32rpx;
  border-bottom: 1rpx solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-item:first-child {
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
}

.list-item:last-child {
  border-bottom: none;
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}
```

### 10.2 分组列表

```css
.list-group {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 24rpx;
}

.list-group-title {
  padding: 24rpx 32rpx;
  font-size: 28rpx;
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  background: var(--bg-secondary);
}
```

---

## 11. 标签设计

### 11.1 状态标签

```css
.tag {
  display: inline-flex;
  align-items: center;
  padding: 8rpx 24rpx;
  border-radius: 100rpx;
  font-size: 24rpx;
  font-weight: var(--font-weight-medium);
}

.tag-success {
  background: var(--success-bg);
  color: var(--success-text);
}

.tag-warning {
  background: var(--warning-bg);
  color: var(--warning-text);
}

.tag-danger {
  background: var(--danger-bg);
  color: var(--danger-text);
}

.tag-info {
  background: var(--info-bg);
  color: var(--info-text);
}
```

### 11.2 测量类型标签

```css
.tag-measure {
  background: var(--secondary-color);
  color: var(--primary-color);
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: var(--font-weight-medium);
}
```

---

## 12. 图标设计

### 12.1 图标尺寸

| 尺寸 | rpx | 使用场景 |
|------|-----|----------|
| 超小 | 32rpx | 小标签图标 |
| 小 | 40rpx | 列表项图标 |
| 中 | 48rpx | 按钮图标 |
| 大 | 64rpx | 页面图标 |
| 超大 | 96rpx | 空状态图标 |

### 12.2 图标颜色

```css
.icon-primary { color: var(--primary-color); }
.icon-success { color: var(--success-color); }
.icon-warning { color: var(--warning-color); }
.icon-danger { color: var(--danger-color); }
.icon-secondary { color: var(--text-secondary); }
```

---

## 13. 导航设计

### 13.1 底部导航栏

```css
.tab-bar {
  height: 112rpx;
  background: var(--bg-primary);
  border-top: 1rpx solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.tab-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.tab-bar-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 4rpx;
}

.tab-bar-label {
  font-size: 20rpx;
  color: var(--text-secondary);
}

.tab-bar-item.active .tab-bar-icon {
  color: var(--primary-color);
}

.tab-bar-item.active .tab-bar-label {
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
}
```

### 13.2 页面头部导航

```css
.nav-bar {
  height: 88rpx;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  border-bottom: 1rpx solid var(--border-primary);
}

.nav-bar-title {
  font-size: 36rpx;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.nav-bar-back {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 14. 弹窗设计

### 14.1 对话框

```css
.dialog {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  width: 600rpx;
  max-width: 90%;
  overflow: hidden;
}

.dialog-header {
  padding: 48rpx 48rpx 24rpx;
  text-align: center;
}

.dialog-title {
  font-size: 36rpx;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.dialog-content {
  padding: 24rpx 48rpx 48rpx;
  font-size: 32rpx;
  color: var(--text-primary);
  text-align: center;
  line-height: 1.6;
}

.dialog-footer {
  display: flex;
  border-top: 1rpx solid var(--border-primary);
}

.dialog-button {
  flex: 1;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: var(--font-weight-medium);
  border: none;
  background: transparent;
}

.dialog-button.primary {
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
}

.dialog-button.cancel {
  color: var(--text-secondary);
}

.dialog-button + .dialog-button {
  border-left: 1rpx solid var(--border-primary);
}
```

### 14.2 提示信息

```css
.toast {
  background: rgba(45, 52, 54, 0.9);
  border-radius: var(--radius-md);
  padding: 24rpx 48rpx;
  color: #FFFFFF;
  font-size: 28rpx;
  max-width: 600rpx;
  text-align: center;
}

.toast-success { background: var(--success-text); }
.toast-error { background: var(--danger-text); }
.toast-warning { background: var(--warning-text); }
```

---

## 15. 加载设计

### 15.1 加载动画

```css
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64rpx;
}

.loading-spinner {
  width: 64rpx;
  height: 64rpx;
  border: 4rpx solid var(--border-secondary);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-top: 24rpx;
}
```

---

## 16. 空状态设计

### 16.1 空状态容器

```css
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
}

.empty-icon {
  width: 192rpx;
  height: 192rpx;
  margin-bottom: 32rpx;
  opacity: 0.3;
}

.empty-title {
  font-size: 32rpx;
  color: var(--text-secondary);
  margin-bottom: 16rpx;
}

.empty-description {
  font-size: 28rpx;
  color: var(--text-tertiary);
  text-align: center;
  line-height: 1.6;
  max-width: 500rpx;
}
```

---

## 17. 适配老化设计

### 17.1 大字体模式

```css
/* 老年人大字体模式 */
@media (prefers-reduced-motion: no-preference) {
  .accessibility-large {
    --font-scale: 1.2;
  }
}

.accessibility-large * {
  font-size: calc(var(--original-size) * 1.2) !important;
}
```

### 17.2 高对比度模式

```css
/* 高对比度模式 */
.accessibility-high-contrast {
  --primary-color: #FF8C00;
  --text-primary: #000000;
  --text-secondary: #333333;
  --border-primary: #666666;
}
```

### 17.3 触控区域优化

```css
/* 最小触控区域 44px × 44px */
.touch-target {
  min-width: 88rpx;
  min-height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 18. 动画设计

### 18.1 缓动函数

```css
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0.0, 1, 1);
```

### 18.2 动画时长

```css
--duration-fast: 150ms;      /* 快速交互 */
--duration-normal: 250ms;    /* 常规交互 */
--duration-slow: 350ms;      /* 慢速过渡 */
--duration-slower: 500ms;    /* 复杂动画 */
```

### 18.3 页面切换动画

```css
.page-enter {
  animation: slideInRight 250ms var(--ease-in-out);
}

.page-exit {
  animation: slideOutLeft 250ms var(--ease-in-out);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
```

---

## 19. 小程序端页面布局规范

### 19.1 页面容器

```css
.page {
  min-height: 100vh;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 32rpx;
}

.page-header {
  padding: 24rpx 32rpx;
  background: var(--bg-primary);
  border-bottom: 1rpx solid var(--border-primary);
}

.page-title {
  font-size: 36rpx;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}
```

### 19.2 首页布局

```
┌─────────────────────────┐
│   异常预警横幅(如有)    │
├─────────────────────────┤
│   今日血糖卡片          │
├─────────────────────────┤
│   今日血压卡片          │
├─────────────────────────┤
│   快捷操作按钮区域      │
│   [记录血糖][记录血压]  │
├─────────────────────────┤
│   最近记录标题          │
├─────────────────────────┤
│   记录列表              │
│   ─────────────────    │
│   ─────────────────    │
│   ─────────────────    │
└─────────────────────────┘
```

### 19.3 记录页面布局

```
┌─────────────────────────┐
│   [返回] 记录血糖      │
├─────────────────────────┤
│                        │
│   血糖值(大输入框)     │
│   [ 7.2  ]            │
│                        │
│   测量时段(选择器)     │
│   [空腹 ▼]            │
│                        │
│   测量时间(选择器)     │
│   [07:30 ▼]           │
│                        │
│   [拍照识别]按钮       │
│                        │
│   [保存] 大按钮        │
│                        │
└─────────────────────────┘
```

### 19.4 趋势页面布局

```
┌─────────────────────────┐
│   [返回] 血糖趋势      │
├─────────────────────────┤
│   测量时段筛选         │
│   [空腹][早餐后]...    │
├─────────────────────────┤
│   统计卡片(横向)       │
│   平均|最高|最低|异常  │
├─────────────────────────┤
│   折线图区域           │
│   (大图表)             │
│                        │
│   数据明细列表         │
│   ─────────────────    │
└─────────────────────────┘
```

---

## 20. 后台管理系统设计规范

### 20.1 后台布局结构

```
┌────────┬────────────────────────────────┐
│        │   [logo] 老人健康管理系统    │
│ 侧    ├────────────────────────────────┤
│ 边    │                                │
│ 导    │                                │
│ 航    │       主内容区域              │
│        │                                │
│        │                                │
│        │                                │
└────────┴────────────────────────────────┘
```

### 20.2 侧边栏导航

```css
.sidebar {
  width: 240px;
  background: #2D3436;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #B2BEC3;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
}

.sidebar-item.active {
  background: var(--primary-color);
  color: #FFFFFF;
}
```

### 20.3 表格设计

```css
.table {
  width: 100%;
  border-collapse: collapse;
  background: #FFFFFF;
}

.table th {
  background: #FAFAFA;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #636E72;
  border-bottom: 1px solid #DFE6E9;
}

.table td {
  padding: 16px;
  border-bottom: 1px solid #DFE6E9;
  color: #2D3436;
}

.table tr:hover {
  background: var(--secondary-color);
}
```

---

## 21. 图表设计

### 21.1 趋势图配色

```css
--chart-primary: #FF9F43;     /* 主数据线 */
--chart-secondary: #4DABF7;   /* 次数据线 */
--chart-success: #51CF66;     /* 正常范围 */
--chart-danger: #FF6B6B;      /* 异常数据点 */
--chart-grid: #E9ECEF;        /* 网格线 */
--chart-text: #636E72;        /* 坐标轴文字 */
```

### 21.2 图表尺寸

```css
.chart-container {
  width: 100%;
  height: 500rpx;  /* 小程序 */
  /* 或 400px; */  /* 后台管理 */
  padding: 24rpx;
  background: #FFFFFF;
  border-radius: var(--radius-md);
}
```

---

## 22. 响应式设计

### 22.1 小屏幕适配

```css
/* iPhone SE */
@media (max-width: 375px) {
  :root {
    --font-scale: 0.95;
  }
}

/* 小屏幕 */
@media (max-width: 414px) {
  .page-content {
    padding: 24rpx;
  }
}
```

### 22.2 大屏幕适配(后台)

```css
/* 大屏幕 */
@media (min-width: 1920px) {
  .container {
    max-width: 1600px;
    margin: 0 auto;
  }
}
```

---

## 23. 无障碍设计

### 23.1 屏幕阅读器支持

```html
<!-- 为图标添加描述 -->
<button aria-label="返回">
  <icon type="back" />
</button>

<!-- 为表单添加标签 -->
<label for="glucose-input">血糖值</label>
<input id="glucose-input" type="number" />
```

### 23.2 键盘导航

```css
/* 焦点样式 */
:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}

/* 跳过导航链接 */
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--primary-color);
  color: #FFFFFF;
  padding: 16rpx;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

---

## 24. 设计资源

### 24.1 图标库
- 项目图标: 自定义SVG图标
- 图标尺寸: 32rpx、48rpx、64rpx、96rpx

### 24.2 插画
- 空状态插画: 风格统一、色彩温和
- 引导插画: 简洁易懂、符合老年人认知

### 24.3 字体
- 中文字体: 微软雅黑 / 苹方
- 数字字体: DIN / Roboto
- 下载链接: (根据项目需要提供)

---

## 25. 设计交付规范

### 25.1 设计文件命名

```
 elderly-health-tracking/
 ├── assets/
 │   ├── icons/
 │   │   ├── icon-home.svg
 │   │   ├── icon-glucose.svg
 │   │   └── ...
 │   └── images/
 │       ├── empty-state.png
 │       └── ...
 ├── design-tokens/
 │   ├── colors.json
 │   ├── typography.json
 │   └── spacing.json
 └── pages/
     ├── index/
     │   ├── index.png
     │   ├── index-@2x.png
     │   └── index-@3x.png
     └── ...
```

### 25.2 图片导出规格

| 设备 | @1x | @2x | @3x |
|------|-----|-----|-----|
| iPhone SE | 320w | 640w | 960w |
| iPhone 12/13 | 390w | 780w | 1170w |
| iPhone 14 Pro | 393w | 786w | 1179w |

### 25.3 切图要求
- 格式: PNG(带透明背景) / JPG(照片)
- 色彩模式: RGB
- 压缩: PNG-24,JPEG-80%
- 文件大小: 单图 < 200KB

---

## 26. 设计检查清单

### 26.1 视觉检查
- [ ] 颜色对比度符合WCAG 2.1 AA标准
- [ ] 字体大小符合适老化要求
- [ ] 按钮点击区域 ≥ 88rpx × 88rpx
- [ ] 图标清晰、含义明确
- [ ] 图片质量清晰、不模糊

### 26.2 交互检查
- [ ] 加载状态明确
- [ ] 操作反馈及时
- [ ] 错误提示友好
- [ ] 表单验证合理
- [ ] 导航路径清晰

### 26.3 适老化检查
- [ ] 字体大小可调
- [ ] 操作流程简单(≤3步)
- [ ] 颜色区分不单一
- [ ] 避免闪烁动画
- [ ] 提供语音提示(可选)

---

**文档结束**
