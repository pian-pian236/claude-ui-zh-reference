# 发布到 GitHub

建议仓库名：claude-ui-zh-reference

建议描述：
> 非官方 Claude 桌面界面中文学习对照工具。支持中英文切换与悬停解释，纯离线演示，无 AI 功能。

## 1. 上传源码

在 GitHub 新建仓库，然后上传干净源码目录中的文件。README.md、LICENSE、
NOTICE.md、THIRD_PARTY_NOTICES.md、.gitignore 和 .github 都应保留。
上传的是解压后的源码文件，不是把源码 ZIP 作为唯一仓库内容。

本项目已经提供 MIT 许可证，不需要在创建仓库时再生成另一份许可证。
勿上传旧个人使用版、提取字体、参考文件、node_modules、运行时、
原版 Claude 安装文件、日志、账号配置、密钥或虚拟机镜像。

## 2. 发布便携版

在仓库的 Releases 中创建 v1.1.0 版本，将便携版 ZIP 和 SHA256SUMS.txt
作为发布附件上传。ZIP 是给用户完整解压后运行的，不要将其中的运行时提交到源码仓库。

建议发布说明：

> 界面对照 v1.1.0：独立制作的非官方中文学习参考。
> 默认中文、浅色；悬停显示英文，可一键切换语言。
> Cowork、Code、菜单与设置仅用于界面对照，所有业务操作均为模拟。
> 完整解压后双击 Claude中文对照.exe。
> 与 Anthropic 无关联或背书关系，不是官方中文版，不是汉化补丁。
> 本程序未进行商业代码签名。

## 3. 后续修改与验证

    npm ci
    npm run audit:release
    npm test
    npm run build -- dist/portable
    npm test -- dist/portable/runtime/ClaudeReference.exe
    npm run audit:release -- dist/portable
    npm run pack:source -- dist/source

GitHub Actions 已配置检查源码、UI 交互和便携版；它不会自动发布或上传 Release。
当前提供的成品已在本机验证。云端工作流需上传后由 GitHub 实际运行验证。
新发布图只截取本工具自身的界面，不包含原版账号或聊天。

## 4. 权利说明

MIT 适用于本项目独立编写的内容，第三方组件保留各自许可。
保留 NOTICE.md 中的非官方和参考产品说明。
不要把工具宣传为 Anthropic 官方产品、已获其授权的产品或完整替代品。
这些发布准备不构成第三方授权或法律审查结论。
