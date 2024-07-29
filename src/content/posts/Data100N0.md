---
title: Data100 Note 0： 开荒
category: CSDIY
tags:
  - python
  - Data Science
date: 2024-03-22
summary: Data100环境配置等
---

# Data100 Note 0: 开荒

Data100是数据科学的入门课程。介绍了数据处理的全流程（Data Science Lifecycles）
这门课的大部分录像是要权限的，除了正在更新的最新一期可以看之外，由Josh Hug讲授的22sp也是可以直接观看的，他讲授的cs61b（21sp）也是最热门的cs自学课程之一，让我们谢谢Josh😚

不过虽然大部分内容都是开源的，[作业可从这里clone](https://github.com/DS-100/sp22)，但部分环境仍然需要自己设置，而这会 ~~有点~~ 非常折磨。

本人在配环境时遇见了[这位朋友在配data8环境](https://www.cnblogs.com/tsrigo/p/16653029.html#module%E7%9A%84%E5%AE%89%E8%A3%85)时遇见的几乎所有问题，所以本文部分解决方案与此文相同，不过我还遇见了更多的问题🤡

## Anaconda

Anaconda是一个用于数据科学、机器学习和科学计算的开源软件套件，它包含了多个常用的Python库和相应工具，和一个对应的python本体。你可以从个镜像站选择不同的版本，也可以直接在官网上一键下载最新版本，两者都有需要注意的地方，而我很不幸把两边的坑都踩了一遍。

如果下载的是老版本，那么进入安装界面后，安装向导会询问是否添加到PATH，建议勾选，在之后的下载过程中，可能会弹出来一个终端界面，这是anaconda自带的新anaconda prompt，**此时不要直接关闭此prompt**， 我在它弹出来之后就随手关了，之后的安装过程正常完成，但完成后再次打开anaconda prompt，会得到如下报错信息 `active 不是内部或外部命令，也不是可运行的程序` , 同时打开菜单也会发现只安装了anaconda prompt，而成功安装还会安装有如anaconda navigator， spyder等配套应用， 推测原因可能就是在安装过程中弹出anaconda prompt之后需要通过prompt安装部分内容，而直接关掉就打断了这次安装，建议重装。

“下镜像站的老版有这样的问题，那我直接下官网最新版是不是就会好些呢。”于是我从官网上第二次下载了anaconda，这次安装异常顺利，中途也并没有弹出来prompt，最后所有配套应用也顺利安装且可运行。这时候我打开vscode选择python，却发现仍然只能选择原有的python，并没有新选项出现。这里出现的问题便是在新版安装时默认没有添加到PATH，解决方案是可以从anaconda navigator中打开vscode，当然更建议手动将anaconda里的python添加至环境变量。

## 相关库的安装

主要要安装的库

```bash
pip install otter-grader #本地评测系统
```

**请一定注意你是在anaconda prompt中执行此操作**，如果你直接在vscode里打开的相关文件，并使用vscode自带的终端的话，那你大概率不是用的anaconda prompt，那么你安装完之后就会发现没用，于是你就开始研究如何新建内核，结果新建了内核你会发现还是没用。
若第一个cell里的代码可运行不报错，则下载和安装相关库成功。

## 修改全局变量

我们在cell6中需要写相关代码并在cell7中完成检测，而这一次，它又报错了……

```bash
......
RuntimeError: Malformed test file: does not define the global variable 'OK_FORMAT'
......
```

大概看得出来是环境变量没有定义，参考官方文档和先辈经验得知可以进入 `q1.py`，在第一行加入 `OK_FORMAT=True` 即可
不过test有这么多，总不能做一个改一个吧😖，所以可以写一个脚本来自动化修改：

```bash
# !/bin/bash
sed "1i OK_FORMAT=True" */*/*.py -i
```

此处sed命令即指是在所有 .py文件的第一行插入 `OK_FORMAT=True` , \*\/\*\/\* 是文件路径，此处是从lab文件夹修改了，所以有三层。

到现在差不多算是配完了……真是一场酣畅淋漓的赤石啊😆
