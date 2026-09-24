# Roadmap / 路线图

Status recorded at repository bootstrap. “Available” means present in the current local prototype; it does not imply a stable public release.

以下状态记录于仓库初始化阶段。“已有”表示当前本地原型包含此能力，不代表已稳定公开发行。

## Available in the prototype / 原型已有

- Standalone Godot 4 Control-based client with English and Simplified Chinese UI.
- 可独立运行的 Godot 4 Control 客户端，提供英语和简体中文界面。
- Bundled demo discussions and MOD metadata for offline browsing.
- 用于离线浏览的本地演示讨论与 MOD 元数据。
- macOS local export and a GitHub Actions design for generating a public guest feed.
- macOS 本地导出，以及生成游客公开 Feed 的 GitHub Actions 实现。

## In progress / 进行中

- Publish and verify the community feed and the separate metadata registry.
- 发布并验证社区 Feed 与独立的 MOD 元数据注册表。
- Verify public content reads from the community repositories in the client.
- 在客户端验证社区仓库公开内容读取。

## Planned / 规划中

- GitHub Device Flow sign-in and secure token lifecycle.
- GitHub Device Flow 登录与安全的令牌生命周期管理。
- User-authorized discussion creation, comments, replies and pagination.
- 以用户本人授权创建讨论、评论、回复及内容分页。
- Android input method, soft keyboard, long-reading and image-load checks; Windows and Linux builds.
- Android 输入法、软键盘、长文阅读和图片加载验收；Windows 与 Linux 构建。
- Resource-use measurements on more than one platform and idle-state tuning.
- 在多个平台实测资源占用并优化闲置状态。
- A reviewed MOD metadata community. No MOD installer or execution capability is planned in this bootstrap.
- 建立经审核的 MOD 元数据社区。本次初始化不实现 MOD 安装或执行能力。

## Not released / 尚未发布

Plyra Compositor, Plyra World, and a production MOD ecosystem are not released by this project. Any integration with them remains future work.

本项目并未发布 Plyra Compositor、Plyra World 或正式 MOD 生态。与这些项目的集成仍属于未来工作。
