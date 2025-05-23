# Cosmic Dreams with BB-8 🌌🤖

一个将Star Wars BB-8机器人融入宇宙梦境场景的交互式网页项目。

## 功能特色

### 🌟 Cosmic Dreams 原有功能
- 美丽的星空和行星动画
- 3D宇宙场景与人物
- 粒子流星效果
- 背景音乐控制

### 🤖 BB-8 机器人新功能
- 跟随鼠标移动的BB-8机器人
- 可调节的移动速度和加速度
- 与宇宙主题匹配的银白色配色
- 流畅的头部和天线跟踪动画
- 轻微的悬浮效果

## 控制说明

### 鼠标控制
- **移动鼠标**: BB-8会跟随鼠标位置移动
- **音频按钮**: 点击右上角的音频按钮播放/暂停背景音乐

### BB-8 控制面板（左上角）
- **Speed**: 调节BB-8的基础移动速度 (0-11)
- **Acceleration**: 调节BB-8的加速响应 (0-3)

## 自定义背景音乐

### 添加你的音乐文件
1. 将你的音乐文件放在项目目录中
2. 支持的格式：MP3、OGG、WAV
3. 修改 `index.html` 中的音频源：

```html
<audio id="audio" loop preload="auto">
  <source src="./your-music-file.mp3" type="audio/mpeg">
  <source src="./your-music-file.ogg" type="audio/ogg">
</audio>
```

### 推荐音乐类型
- 环境音乐 (Ambient)
- 太空主题音乐 (Space/Sci-Fi)
- 电子音乐 (Electronic)
- 冥想音乐 (Meditation)

## 文件结构

```
cosmic-dreams-css/dist/
├── index.html          # 主HTML文件
├── style.css           # 样式文件（包含BB-8样式）
├── bb8-script.js       # BB-8控制逻辑
├── your-music-file.*   # 你的自定义音乐文件
└── README.md           # 此说明文件
```

## 技术实现

### BB-8机器人
- 纯JavaScript实现，无需React依赖
- CSS3动画和变换
- 实时鼠标位置跟踪
- 平滑的物理运动模拟

### 视觉效果
- CSS @layer 分层管理
- 自定义CSS属性
- 径向渐变和阴影效果
- 响应式设计

### 色彩主题
BB-8的配色已调整为与Cosmic Dreams协调：
- 主体: 银白色渐变
- 细节: 半透明白色
- 眼部: 深色对比
- 发光效果: 柔和白光

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 启动方法

1. 直接在浏览器中打开 `index.html`
2. 或使用本地服务器（推荐）：
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx serve .
   ```

## 自定义建议

### 调整BB-8位置
在CSS中修改 `.bb8` 的 `bottom` 和 `left` 属性：

```css
.bb8 {
  bottom: 20%;  /* 调整垂直位置 */
  left: 0;      /* 调整水平起始位置 */
}
```

### 修改BB-8大小
调整 `.bb8` 的 `width` 属性和相关尺寸。

### 更改配色
修改CSS变量或直接修改BB-8相关的颜色值。

享受你的宇宙BB-8之旅！ 🚀✨ 