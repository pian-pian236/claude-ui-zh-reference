# 第三方依赖说明

## 分发给用户的桌面运行时

- Electron 45.1.0：MIT。完整许可附在便携包的 runtime/LICENSE。
- Electron 内含的 Chromium、Node.js、V8 及其他组件：
  各自许可与声明附在 runtime/LICENSES.chromium.html，按其各自条款提供。
- 构建脚本完整保留官方 Electron 运行时的上述许可文件。

本项目的 MIT 许可不会覆盖或替换第三方组件的许可。

## 开发与测试依赖

Electron、Playwright 以及它们的开发依赖仅由 npm 按 package-lock.json 安装；
源码仓库不包含 node_modules。Playwright 使用 Apache-2.0 许可；
具体版本和其他依赖的许可见安装后的各依赖包。
Playwright 不包含在用户便携包中。

## 字体、图标与参考产品

- 系统字体只通过 CSS 字体族名称引用，不附带任何字体文件。
- assets/reference.svg 与 assets/reference.ico 是本项目自行绘制的双语书页图标，采用本项目 MIT 许可。
- 其他界面图标为本项目代码中绘制的简单线条图形。
- 第三方产品名称和参考界面说明见 NOTICE.md；项目许可证不授予这些产品的权利。

此文件是依赖概览；发行包附带的完整第三方许可与声明应一并保留。
