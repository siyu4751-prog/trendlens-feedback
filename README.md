# trendlens-feedback
# TrendLens 用户反馈智能分析看板

一个使用 **HTML、CSS、原生 JavaScript** 开发的前端数据分析项目，可在浏览器本地完成用户反馈的情感判断、主题归类、指标统计、筛选和 CSV 导出。
# 在线体验

GitHub Pages：[项目地址](https://siyu4751-prog.github.io/trendlens-feedback/)

# 项目截图

![TrendLens Dashboard](docs/screens.png)
# 功能

多行文本批量分析 CSV 文件导入
正向 / 中性 / 负向情感判断 产品功能、性能稳定、价格权益、客服服务等主题识别，情感与主题分布可视化，自动生成运营洞察，搜索、筛选、深色模式和本地存储，导出分析结果为 CSV

# 运行

直接双击 `index.html`，或在 VS Code 中安装 Live Server 后打开项目文件夹并点击 **Go Live**。

# GitHub Pages 部署

1. 新建 GitHub 仓库，例如 `trendlens-feedback-lab`。
2. 上传项目中的全部文件。
3. 打开仓库 `Settings → Pages`。
4. 在 `Build and deployment` 中选择 `Deploy from a branch`。
5. Branch 选择 `main` 和 `/root`，保存后等待生成网页地址。

# 项目结构

```text
trendlens-feedback-lab/
├─ index.html
├─ style.css
├─ script.js
├─ README.md
├─ LICENSE
├─ .gitignore
└─ data/
   └─ sample-feedback.csv
```


# 可继续升级

接入真实大模型 API
增加词云、趋势图和时间维度分析 使用 Vue 或 React 重构
增加单元测试与 CI
