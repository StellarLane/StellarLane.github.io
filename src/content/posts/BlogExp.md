---
title: 搭建博客小记
category: nichijou
tags:
  - hexo
date: 2024-02-26
summary: 利用hexo框架搭建博客时的记录
---

依托hexo框架和广大开发者开发的对应的主题，现在人们已经可以在完全没有web development知识的情况下，也可以轻松的搭建出一个美观的个人博客。如今网上的视频教程也很多，各主题开发者编写的documents也非常详尽，不过在搭建过程中总会出现这样那样的问题，本文则记录了StellarLane在搭建这个博客的过程中遇到的问题，及其对应的解决方案。

_注：本文基于StellarLane使用Async主题搭建博客时的体验，一切内容仅供参考_

**首先，个人认为在开始一切安装操作前，把所有相关的文档都先通读一遍是很有必要的。事实上，如果我一开始把文档都通读了一遍的话，可能也就不会有这篇文章了**

# 安装git和部署

- hexo官方文档中建议在安装hexo前先下载git，对于像我这样之前并没有用过git的人来说，最好在下载了git之后一并下载一个第三方GUI（比如github desktop），使用图形交互界面还是比命令行要友好一些。
- 在使用一键部署`hexo deploy`时，我出现了

  ```
  fatal: unable to auto-detect email address (got 'StellarLane@StellarLane-Laptop.(none)')
  ```

  的报错信息，这是因为并没有在git中设置自己的电子邮件等信息，可以在图形化界面中进行相关操作或在命令行中运行:

  ```
  git config --global user.email "你的邮箱"
  git config --global user.name "你的用户名"
  ```

- 在`hexo deploy`成功之后，我并没有第一时间看见我的网页，于是我还在github对应项目的settings-pages-build and deployment处采用deploy from a branch处进行了手动部署。此时在repo页右下角“deployments”会出现一个正在部署的黄点，一段时间后博客便会成功部署到对应网页上。

# 配置Async主题时

- 下载hexo时由于附带有一默认主题landscape，因此会有两份配置文件`_config.yml`和`_config.landscape.yml`，第一个为通用设置，第二个为主题特有设置，请记得将第二个文件名中的`landscape`改为所选的主题名。
- 因为尚不明确的原因，我的博客始终都无法加载本地的图片，我目前采用的解决方案是将所有图片都放在图床上。
- 在添加新的页面类型时，我的网页出现了`Cannot GET /<我想添加的页面>/`的报错，原因是除了添加一个新页面时，除了要在导航栏添加对应入口，还需执行`hexo new page <some sort of new page>`的命令创建新的页面。（事实上这一条在文档里写得很清楚，在主题文档中处在靠后的位置，而我当时没有读到那里，所以最好在开始配置前就通读一下整个文档）

以上便是我在搭建个人博客时遇见的比较苦恼的问题，不过整体来说，搭建博客仍然是简单而有趣的，感谢您的阅读，也祝您能轻松愉快地搭建自己的博客🥰
