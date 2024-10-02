---
title: C/C++ 编译入门
category: CSDIY
tags:
  - C++
  - Makefile
  - CMake
date: 2024-10-01
summary: makefile， cmake的基础用法
---

## Makefile

实际的c++项目通常涉及多个文件，其内部的连接与其和外部库的连接十分复杂，若每次都是手动编译则费力又费时还容易出错，make是一个自动编译的工具，其可以通过makefile来定义如何编译和链接程序。
最最简单的Makefile中的三要素（[图源](https://zhuanlan.zhihu.com/p/618350718)）
![](https://picx.zhimg.com/80/v2-cc4597a8e6603ffbcc622683db96332f_1440w.webp)
目标是最后的编译后的文件，依赖则是其源文件，make会在依赖发生变化的时候，重新执行执行语句中的命令。

### Makefile常用符号

当然要是makefile只能有上述这么简单的结构话那makefile就没有任何存在的意义了，makefile也有调用函数，变量等功能：

- 变量的赋值与调用
  - `:=` 一般的赋值符号，和cpp里的=差不多
  - `=` 递归赋值，即在赋值时会展开引用的变量
    ```makefile
    A = $(B)
    B = $(C)
    C = D
    #等效于
    A := D
    ```
  - `+=` 添加新的内容
  - `?=` 条件赋值，仅在变量未被赋值时才会执行
  - 调用变量时使用 `$(变量名)`
- 函数

  - 调用函数时使用 `$(函数名 函数参数)`
  - wildcard: 进行模式匹配的函数，如寻找当前目录下所有.c的文件即是 `$(wildcard *.c)`
  - foreach: 有遍历功能的函数，使用示例

    ```makefile
    SUBDIR := .
    SUBDIR += ./func

    EXPANDED := $(foreach dir,$(SUBDIR),$(dir)/*.c)
    # 等效于EXPANDED := ./*.c ./func/*.c
    ```

  - patsubst: `$(patsubst pattern,replacement,text)` 将text中符合pattern的部分替换为replacement

### makefile的简化

有些时候我们在编译的时候有特别的需求，例如保存.o文件，这种情况我们可以分步编译，体现在makefile上，我们可以设置多个目标，例如：

```makefile
# Makefile
# 假设我们有一个main.c 和一个在helper子目录中的helper.h helper.c

#用于包含头文件
INCS ：= -I. -I./helper

main : main.o helper/helper.o
        gcc main.o helper/helper.o -o main

main.o : main.c
        gcc -c $(INCS) main.c -o main.o

helper/helper.o : helper/helper.c
        gcc -c $(INCS) helper/helper.c -o helper/helper.o
```

上述三个目标，会先从命令行指定的（或默认第一个）开始，然后会检查目标的依赖项，发现不存在/需要更新时，会尝试生成依赖项，也就是会执行这里的第二和第三个目标。
不过我们注意到这里第二和第三个目标时高度相似的，我们可以简化成

```makefile
%.o : %.c
        gcc $(INCS）$< -o $@
#会在执行时自动展开为上述第二，第三条的样子
```

这里如 `%.o` `%.c` 表示会查询（包括子目录）内所有的.c文件作为依赖项尝试生成.c，此处的 `$<` `$@` 时一种叫自动变量的特殊变量，分别表示第一个依赖项和目标，其余的自动变量例如 `$^` （表示所有依赖）等
然后我们再结合 `patsubst` 函数，我们就可以得到简化版的makefile

```makefile
# Makefile

SUBDIR := .
SUBDIR += ./helper

INCS := $(foreach dir,$(SUBDIR),-I$(dir))
SRCS := $(foreach dir,$(SUBDIR),$(wildcard $(dir)/*.c))
OBJS := $(patsubst %.c,%.o,$(SRCS))

main : $(OBJS)
        gcc $(OBJS) -o main

%.o : %.c
        gcc -c $(INCS) $< -o $@
```

~~真，真简化了吗~~

### makefile的更多功能

- 伪目标
  `make clean` 是一个常见的指令，但如果按一般的指令去实现的话，若文件中恰有一个文件名叫clean则会出现冲突，我们可以采用伪目标的方式来解决这种问题，
  ```makefile
  .PHONY ： clean
  clean ：
          # clean some files
  ```
- 优化终端输出
  可以在命令前加@禁止该命令输出在终端上，同样，makefile本身支持终端命令，所以也可以使用echo等自定义输出
- 自动生成依赖
  在上述实现的分步make流程中有一个小问题，在main环节，依赖只有.o而非.c，因此如果某个文件的.h文件发生了变化，make不会重新编译文件，这是一个很严重的问题！在简单的项目中，我们可以将.h加入依赖中，但在复杂项目中，能理清依赖十分困难，gcc提供了自动生成依赖的参数 `gcc -MMD -MP` -MMD 会自动在你的.o文件所在目录中生成一个包含其依赖列表的.d文件， -MP 可以为依赖添加伪目标，让其在即使.h被删除之后也不会报错，之后，我们可以将.d文件添加到makefile中使makefile能自动追踪所有的依赖
  ```makefile
  DEPS := $(patsubst %.o, %.d, $(OBJS))
  # makefile
  -include $(DEPS) #这里include前的-可以让DEPS即使不存在也不会报错
  ```

### makefile

那么一个比较完整的makefile大概长这样

```makefile
# Makefile

SUBDIR := ./
SUBDIR += ./helper
OUTPUT := ./output

INCS := $(foreach dir, $(SUBDIR), -I$(dir))
SRCS := $(foreach dir, $(SUBDIR), $(wildcard $(dir)/*.c))
OBJS := $(patsubst %.c, $(OUTPUT)/%.o, $(SRCS))
DEPS := $(patsubst %.o, %.d, $(OBJS))

main : $(OBJS)
		@echo linking...
		@gcc -MMD -MP $(OBJS) -o main
		@echo done!

$(OUTPUT)/%.o : %.c
		@echo compiling $< ...
		@mkdir -p $(dir $@)
		@gcc -c -MMD -MP $(INCS) $< -o $@

-include {DEPS}

.PHONY : clean
clean :
		@echo cleaning...
		@rm -r $(OUTPUT)
		@echo done!
```

## CMake

手动编译费时费力，于是就有了makefile这种自动编译的工具，但当项目继续膨胀，人们意识到手写makefile也越来越费时费力，于是就有了cmake的出现。cmake本身不是编译自动化工具，他是生成自动化工具（比如makefile）的工具，好比促甲状腺激素释放激素（cmake）-促甲状腺激素（makefile）-甲状腺激素（实际调用编译器来编译的过程）。

### CMake基础语法

通常我们会用一个名为CMakeLists.txt的文件来配置CMake工作流，我们通过一个简单的例子来了解CMake里最简单的一部分语法，设想如下这个项目

```
MyProject/
├── CMakeLists.txt
├── src/
│   ├── main.cpp
│   ├── a.cpp
│   └── lib.cpp
│
└── include/
    ├── a.h
    └── lib.h
```

我们得到的CMakeLists.txt如下

```cmake
#指定cmake最低版本
cmake_minimum_required(VERSION 3.10)

#项目名（和文件夹名相同）
project(MyProject)

#设定c++标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

#头文件搜索路径
include_directories(${PROJECT_SOURCE_DIR/include})

#编译库，括号中第一个参数为编译后的库名，第二个参数为源文件路径
add_library(lib src/lib.cpp)
#编译可执行文件，类似与编译库
add_executable(main src/main.cpp src/a.cpp)

#连接可执行文件与库
#在这里PUBILC代表如果有目标依赖main的话其也可以访问lib中的内容，但若为PRIVATE则只有main可以访问
target_link_libraries(main PUBLIC lib)
```

### 使用方式

可以直接在cmake所在目录中输入 `cmake .` ，但这不是一个十分鼓励的做法，因为cmake除了makefile以外还会生成一系列文件，将这些文件集中在某个特定文件夹里更简洁，因此我们可以手动创建一个子文件夹然后在子文件夹中运行 ``cmake ..` ，或者

```bash
cmake -B <dir>
```

然后cmake会自动在当前目录下生成一个子文件夹并将相关文件置与其中,然后可以进入目录运行makefile，或者使用

```bash
cmake --build <dir>
```

进行编译。

<!-- TODO 高级语法 -->

### CMake进阶语法

#### 在编译时传入参数（宏）

我们可以在cmake中定义宏并在编译时传入cpp文件中，例如

```cmake
#其他配置
set(TEST_MACRO #参数名
    "" #默认值
    CACHE STRING "enter TEST_MACRO")
#其他配置
target_compile_definitions(main TEST_MACRO="${TEST_MACRO}")
```

main.cpp

```cpp
include <iostream>

int main() {
  std::cout << TEST_MACRO
}
```

此时cmake配置中的参数TEST_MACRO会赋值给main.cpp编译后得到的main中的宏TEST_MACRO，在这里我们TEST_MACRO的内容是在cmake时通过命令行指定的

```bash
cmake -B build -DTEST_MACRO="hello!"
```

#### 为不同的编译过程设定不同的标准

`set(CMAKE_CXX_STANDARDS 14)` 可以用来设置全局的编译标准，但如果我们在某些情况下，我们对部分文件想用某个标准，另外部分文件用另一部分标准，那我们还有一种思路

```cmake
target_compiler_features(a_specific_lib PRIVATE cxx_std_17)
```

#### cmake模块

cmake同样有模块化设计，可以在主CMakeLists中包括其他文件中的模块，部分官方自带的（如CTest）可以直接 `include(CTest)`，同样我们也可以自定义模块和函数。一般，我们会在CMakeLists所在目录建一个子目录 `/cmake` ， 然后我们可以添加文件 `myOp.cmake` 示例如下

```cmake
function(myFunc arg1)
    message(STATUS ${arg1})
endfunction()
```

对自定义的模块我们需要在include时写明路径，如

```cmake
include(${CMAKE_SOURCE_DIR}/cmake/myOp.cmake)
myFunc(1) #调用函数
```

### Compile Database

cmake可以产生一个compile_commands.json文件，其包含了源文件的编译信息，若需生成此文件需在cmake配置中添加

```cmake
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
```

该文件可以帮助ide/代码编辑器提供更好的自动补全与语法高亮服务，（以vscode为例）开启时需要配置项目文件夹中的 `./.vscode/c_cpp_properties.json` 中添加

```json
"compileCommands": "${workspaceFolder}/path/to/compile_commands.json",
```
