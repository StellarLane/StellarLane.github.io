---
title: C++ 温故
category: CSDIY
tags:
  - C++
date: 2024-09-25
summary: C++基础知识回顾与补全
---

# C++ 温故

虽然上过上交的c++入门课，但一方面也基本忘完了，加上当时也确实学的比较简单，最近正在看[learningcpp](https://www.learncpp.com/)，就把一些自己所学到的记录于此.

## cin cout的buffer机制

cin， cout都是存在缓冲区域的，这也是为什么

```c++
std::cout << 0;
std::cout << 1 << std::flush;
std::cout << 2 << std::endl;
```

在debug时如果你在上面的代码段的第二行前打了一个断点，你大概率下是不会看到console上打印了0的，因为此时0只是进入了cout的缓冲区域，一般会在缓冲区域中的内容达到一定量时一并输出，或者在执行flush/endl时会直接输出缓冲区域中的所有内容，即在第二行执行之后会输出0,1，第三行执行时输出2,并换行。

## cin输入失败

cin输入失败时会默认返回0，同时若不做处理，之后的cin会默认

```c++
int a;
cin >> a;
cout << a; //若输入时输入的不是正确的a，如输入了字符等，则会此处会输出0
```

cin同样也有很多方法用来防止输入失败 - `std::cin.eof()` 若输入为输入流中最后一项则返回true - `std::cin.clear()` 清除输入流 - `std::cin.peak()` 在不提取的情况下检查下一个输入 - `std::cin.ignore(<int>, <char>)` 忽略之后的int个输入，直到char出现

## cin与getline

假设如下的情景

```c++
#include <iostream>
#include <string>

int main()
{
    std::cout << "Pick 1 or 2: ";
    int choice{};
    std::cin >> choice;

    std::cout << "Now enter your name: ";
    std::string name{};
    std::getline(std::cin, name);

    std::cout << "Hello, " << name << ", you picked " << choice << '\n';

    return 0;
}
```

运行上面的程序时，我们在控制台上输入，比如1，然后敲击回车，我们会发现其会直接跳过第二轮输出直接输出了，原因是因为在第一轮cin时，我们输入了一个数字+"\n"， 数字被赋值给了choice没问题，然后缓冲区留下了"\n"，而实际上这个"\n"由于也是合法的字符串值，所以直接赋给了字符串，完成了第二轮的流程。欲解决此我们可以让其忽略输入有效字符前的空格等无效输入，代码实现则是将getline行调整为 `std::getline(std::cin >> std::ws, name)`

## 固定长度的类型

标准类型如 `int` 的实际长度可能因平台而异，而这可能会在跨平台开发等场合遇见一些问题，于是就有了固定长度类型 `int32_t` `uint32_t` 等，除此之外，在需要表达比ascii更大的字符集时，也有 `char16_t` `char32_t` 等。
但是需要注意的是，`std::uint8_t` 可能实际上是 `unsigned char` 的另一种形式，例如

```c++
std::uint8_t a{};
std::cin >> a;
```

在执行上面这段代码时，假设你输入了如”20“，则大概率a的值是ascii中'2'的值。

## constexpr

`const` 类的常量通常分为两种，即编译时就确定的，和运行时才可以确定的，编译器会自动区分。为了追求更高的效率，现代c++编译器若条件允许即使是非const也有很可以被自动优化成编译时常量，不过编译器偷偷改得越多可能会导致debug的难度上升
c++提供了可以指定在编译时确定的 `constexpr` 关键词，constexpr类变量和const的使用方式类似，constexpr变量的值必须要在编译的时候确定。constexpr变量不能被一般函数赋值，但若函数也为constexpr函数的话也可以。
不过，constexpr标记并不会真的检查constexpr函数是否真的是可在编译时确定的，如果需要检查，可使用更新版c++中引入的consteval标记。

## 预处理指令

在C++中，预处理器（Preprocessor）是编译器的一个阶段，它在编译之前对代码进行处理，主要负责处理一些编译前的指令。这些指令通常以 # 开头，称为预处理指令。预处理器的工作是在编译之前对源代码进行文本替换或宏展开等操作。

预处理器并不会检查语法错误，也不生成目标代码。它只是将源代码中的预处理指令按照要求进行替换、包含文件、条件编译等操作，然后生成处理后的代码供编译器使用。

- `#include` <> or ""， <>用来include系统库/标准库头文件，""用来引入用户自己的头文件，在预处理阶段，include的行为可以理解为将头文件内容直接插入到#include语句处
- `#define` / `#undef` 定义/取消定理全局（且不可改变）的变量或函数
- 条件编译：`#if` `#ifdef` `#ifndef` `#else` `#endif`
  条件编译指令用于在编译时根据某些条件有选择地编译某段代码。它常用于跨平台编程或者根据不同的条件编译不同的代码。- `#ifdef` / `#ifndef`：检测宏是否已定义。- `#else`：用于指定条件不满足时的代码。- `#endif`：结束条件编译块。

```c++
#include <iostream>

#define PRINT_JOE

int main() {
    #ifdef PRINT_JOE
        std::cout << "Joe\n"; // will be compiled since PRINT_JOE is defined
    #endif

    #ifdef PRINT_BOB
        std::cout << "Bob\n"; // will be excluded since PRINT_BOB is not defined
    #endif

    #if 0
    you can write whatever you like because the compiler will ignore this line.
    #endif

    return 0;
}
```

## 头文件保护

上述提到的预处理的一大作用便是在头文件保护中，防止函数在有多个头文件被引入的时候重复定义

```c++
#ifndef A_UNIQUE_FLAG
#define A_UNIQUE_FLAG
//contents
#endif
```

或者更加现代的 `#pragma once`

## 既生类何生namespace？

👆这种想法搞混了类的效果（之一）和引入namespace的目的，类的诞生是OOP的体现，不同类中可以有不同的方法，这是自然的OOP的体现，而namespace则是专门为防止出现同名函数或者变量定制的机制， namespace的用法

```c++
//定义
namespace namespaceName {
    int functionName(){
        return 0;
    }
}

//使用
int main() {
    namespaceName::functionName();
    return 0;
}
```

可以在多个文件中多次定义namespace，只要同一个namespace内部的函数不重复即可，namespace可以嵌套。

## = delete

想象如下的一个场面

```c++
#include <iostream>

int add(int x, int y) {
    return x + y;
}

int main() {
    add(1, 1);
    add(true, 'x');
    return 0;
}
```

由于类型转换的原理，第二个add可以被正常调用，但显然这个调用没有任何实际意义，我们可以用 `= delete` 运算符来显式禁止这样的操作 `int add(bool, char) = delete;`

## std::optional与std::nullopt

当我们去查询某个值的时候，或许因为程序设计问题或者特殊情况，可能我们查询的这个值实际上并不存在，这样往往会导致报错等问题。为了解决这个问题在c++17中引入了std::optional std::nullopt，作为表示“不存在”的情况的更安全的方法。

```c++
#include <iostream>
#include <optional>

std::optional<int> findValue(bool found) {
    if (found) {
        return 42;  // 返回有效值
    } else {
        return std::nullopt;  // 返回无值状态
    }
}

int main() {
    std::optional<int> result = findValue(false);

    if (result == std::nullopt) {
        std::cout << "No value found" << std::endl;
    } else {
        std::cout << "Found value: " << *result << std::endl;
    }

    return 0;
}
```

## const

分清这个const是修饰成员函数本身的，还是返回值的，还是参数的

## 模板

模板是cpp中常用的工具，可以用来编写泛型代码，降低代码的重复度。常见的模板包括函数模板和类/结构体模板，最简单的语法：

```c++
template <typename T1, typename T2, typename T0>
T0 functionName(T1 param1, T2 param2) {
    // 函数体
}

template <tyoename T>
class Foo {
    private:
    public:
        T t;
};
```

在调用的时候，最简单清楚的方法是显式指明此次调用的参数类型，如

```c++
functionName<int, double>(1, 1.0);
FOO<char>("A");
```

不过在大部分简单的情况下，即使不是直接写明，编译器也可以自动推断出参数的类型，但在复杂情况下可能出现推断失败的问题，所以在C++17及以后，引入了人为指定的辅助推导指引，示例

```c++
template <template T>
Foo(T) -> Foo<T>；
```

当然，用模板指定类型只是最常用一种用法，事实上模板也可以用来传普通参数，如下

```c++
#include <iostream>

template <int size>
void print() {
	std::cout << size << std:endl;
}

int main() {
	print<1>(); // 打印“1”
	return 0;
}
```

### 显式模板特化（explicit template specification）

我觉得他的功能很大程度上受到了重载的启发，其设计背景时如果你想编写一个泛型代码，但是又希望对某几个特别的数据类型有特殊的操作，就可以显式特化某个类型模板函数或者类。

```c++
#include <iostream>
#include <string>
#include <string_view>

// A dull example for function template specification
template <typename T>
void print(const T& t) {
    std::cout << "this is a normal print function.";
}

template <>
void print<double> (const double& d) {
    std::cout << "this is a print function designed for double specifically";
}

// A dull example for class template specification
template <typename T>
class aClass {
public:
    T t;
    std::string msg{"This is a ordinary template class."};
	aClass(T t) {
		this -> t = t;
	}
	void print() const {
		std::cout << std::string_view{msg} << std::endl;
	}
};

template <>
class aClass<double> {
public:
    double t;
    std::string msg{"This is a specified template class"};
	aClass(double t) {
		this -> t = t;
	}
	void print()const {
		std::cout << std::string_view{msg} << std::endl;
	}
};
```

上述展示的是全部特化，也可以局部特化，语法比较相似。

## lambda函数

c++中lambda函数的结构如下

```c++
[捕获列表](函数参数) -> returnType {
    //函数体
}
```

捕获列表表示该lambda函数所需的外部参数，可以指定不同的捕获类型，例如 `[x]` 则表示只捕获x的值，不会改变外部x的实际值，而 `[&x]` 则表示捕获的是x的引用，函数内部对x的改变会影响外部的x，这个结构中 `-> returnType` 不是必须的，编译器可以自动推导返回类型
lambda函数的一大用法是用于stl部分算法的谓词中，例如：

```c++
#include <bits/stdc++.h>
#include <vector>
#include <algorithm>

void print(std::vector<int> v) {
	for (auto ptr = v.begin(); ptr != v.end(); ptr++) {
		std::cout << *ptr << " ";
	}
	std::cout << std::endl;
}

int main() {
	std::vector<int> v1{{1,2,3,4,5,6}};
	std::vector<int> v2(6);
	std::copy_if(v1.begin(), v1.end(), v2.begin(), [](int i){return i % 2 == 1;});
	print(v1);
	print(v2);
}
//结果
//1 2 3 4 5 6
//1 3 5 0 0 0
```
