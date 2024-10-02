---
title: 并行计算入门
category: CSDIY
tags:
  - hpc
  - OpenMP
  - mpi
  - mpi4py
date: 2024-09-22
summary: OpenMP, mpi的简单介绍
---

关于并行计算的简单介绍可以读读[这篇文章](https://hpc.llnl.gov/documentation/tutorials/introduction-parallel-computing-tutorial)，此处不多赘述。

## OpenMP

```c
#include <omp.h>
```

OpenMP (open multi-processing) 是一种应用程序接口，可以用相对简洁直观的代码结构实现在共享内存架构机器中的并行计算，支持c/c++和fortran等语言。在c/c++编程中，其通过添加指令 `#pragma omp <args>` 的形式来实现并行化的需求，以下列出一些比较常见的一些参数：

- `parallel` : 最基础的指令，用于启动一个并行的区域，其所指明的作用域中的代码都将并行运行
- `for` : 在并行区域中运行循环代码
- `sections` : 将代码分为不同段，每个段可由不同线程执行
- `section` : 不同线程执行的不同代码段
- `single` : 使接下来的代码由且仅由其中任意的一个线程执行
- `master` : 使接下来的代码由且仅由主线程（pid == 0）的线程执行
- `critical` : 使接下来的函数同时只会有一个函数执行，防止数据竞争
- `atomic` : 与 `critical` 相似，但开销相对较小
- `reduction` : 用于汇总不同线程的结果
- `barrier` : 强制在此处同步所有线程，当所有线程都执行至此时才可以继续程序
- `private() shared()` : 决定参数能否在不同线程间共享，若在并行区域外声明的变量默认为shared，区域内声明的变量默认为private
- `schedule()` ： 决定调度方法，可选：static, auto, guided, runtime
- `num_threads()` : 决定线程数
- `firstprivate()` : 将每个并行区的私有变量初始化为串行区对应的变量的值
- `lastprivate()` : 将最后一个并行区的变量值赋给后续串行区
  上述的参数大部分还是比较清晰的，不过有些的作用尚不明显，接下来我们看几个例子来分析openMP编程的特性和部分指令的作用

````c++
#pragma omp parallel sections
  #pragma omp section
  std::cout << "The first section.\n"
  #pragma omp section
  std::cout << "The second section. \n"
  #pragma omp section
  std::cout << "The third section.\n"
```c++
由于理论上是同时执行的三个section，所以你会发现这三个的输出顺序是不定的，如果你希望三个section以一个特定的顺序先后执行，那可能有个东西叫串行更适合你。

```c++
#pragma omp parallel num_threads(16)
{
  std::cout << "a" << "b" << "c\n"；
}
````

如果你运气好你可以看见16行abc整整齐齐地排在一起，但如果再运行几次会发现可能会出现错位的现象，这就是因为此处可以同时有多个线程在调用cout，然后可能就会出现如线程1已经向缓冲区添加了a，b，然后突然插进来个线程9又加了个a，导致错位。
欲避免这种办法便是使用 `critical` 或者 `atomic` ，即

```c++
#pragma omp parallel num_threads(16)
{
  #pragma omp atomic
  // #pragma omp critical
  std::cout << "a" << "b" << "c\n"；
}
```

考虑接下来这段代码

```c++
int main() {
    int x{10};
    int i;
    int res{0};
    #pragma omp parallel \
                for \
                num_threads(8) \
                private(x, i)
    for (i = 0; i < 10; i++) {
        res += i;
        std::cout << x << std::endl;
    }
    std::cout << res << std::endl;
    std::cout << i << std::endl;
}
```

多运行几遍会发现这个程序把所有能出错的地方全做错了：x，最后的res，i全部都有可能出问题，接下来我们一个一个分析其原因

- x : 这里我们可以看到x在串行区初始化了，但是以private的形式传入并行区后，并没有初始化，因此在并行区中的x实际上是一个没有初始化的x。解决方案：使用shared()或者firstprivate()参数
- res ： 实际上这里的res是不同线程干各负责一部分加法，其在最后并没有把不同线程的res加在一起的环节
- i : 这里的问题和x类似，在并行区的定义与赋值并不会直接给到后续的串行区中，解决方案：使用shared()或者lastprivate()，后者会将最后一个执行的线程中的变量赋值传递给串行区的变量
  所以我们对程序略作修改，就好些啦：

```c++
int main() {
    int x{10};
    int i;
    int res{0};
    #pragma omp parallel \
                for \
                num_threads(8) \
                firstprivate(x) \
                lastprivate(i) \
                reduction(+:res）
    for (i = 0; i < 10; i++) {
        res += i;
        std::cout << x << std::endl;
    }
    std::cout << res << std::endl;
    std::cout << i << std::endl;
}
```

## MPI

MPI(message passing interface) 是另一种实现并行计算的方式，其主要实现了开启多线程和实现多线程间通信的功能。MPI本身并不是一个代码实现，而是一个标准，常用的此标准的实现为mpich和openmpi，从使用的层面二者几乎没有区别。

```c
#include <mpi.h>
#include <stdio.h>

int main(int argc, char** argv) {
    MPI_Init(NULL, NULL);
    int worldSize, worldRank;
    MPI_Comm_size(MPI_COMM_WORLD, &worldSize);
    MPI_Comm_rank(MPI_COMM_WORLD, &worldRank);
    printf("The size is %d, the current rank is %d.\n", worldSize, worldRank);
    MPI_Finalize();
    return 0;
}
```

上述几个函数的意义：

- `MPI_Init` `MPI_Finalize` 用来开始和结束MPI环境，期间的代码都将会多进程运行
- `MPI_Comm_size` 求得当前总进程数
- `MPI_Comm_rank` 求得当前进程的编号
  mpi的编译与运行与一般的c/cpp程序稍有不同：

```bash
mpicc source.c -o main #编译
mpicexec -np 8 ./main #运行，-np的效果为设置运行时的进程数

```

输出结果为(顺序可能不同)，如果你出现了程序无误但输出size为1的情况，建议换一个mpi的实现。

```
The size is 8, the current rank is 2.
The size is 8, the current rank is 3.
The size is 8, the current rank is 4.
The size is 8, the current rank is 5.
The size is 8, the current rank is 6.
The size is 8, the current rank is 7.
The size is 8, the current rank is 0.
The size is 8, the current rank is 1.
```

### 点对点阻塞通信

这是最简单的一种通信方式，我们通过此可以了解一些最简单的mpi编程方法

```c
#include <mpi.h>
#include <stdio.h>

int main(int argc, char** argv) {
    MPI_Init(NULL, NULL);
    int world_rank;
    MPI_Comm_rank(MPI_COMM_WORLD, &world_rank);
    int world_size;
    MPI_Comm_size(MPI_COMM_WORLD, &world_size);
    int number;
    int source = 0;
    int destination = 1;

    if (world_rank == 0) {
        number = -1;
        MPI_Send(
            &number,
            1,
            MPI_INT,
            destination,
            0,
            MPI_COMM_WORLD
        );
        printf("Sending %d from %d to %d\n", number, source, destination);
    } else if (world_rank == 1) {
        number = 1;
        MPI_Recv(
            &number,
            1,
            MPI_INT,
            0,
            0,
            MPI_COMM_WORLD,
            MPI_STATUS_IGNORE
        );
        printf("Receiving %d from %d to %d\n", number, source, destination);
    }
    MPI_Finalize();
    return 0;
}
```

我们重点关注`MPI_Send` `MPI_Recv` 两个函数。在mpi的通信中，一个信息通常包含以下元素：内容，数量，内容类型，接受者/发出者，标签，通信子，也就是 `MPI_Send` 和 `MPI_Recv` 中的前五个参数，Recv还有第六个状态参数，在最简单的情况下我们可将其忽略，在这里的一对发送接受函数也就是将一个类型为MPI_INT的number变量通过MPI_COMM_WORLD通信子从进程0发送到了进程1,标签为0。值的一提的是此处为阻塞通信，即当某个进程调用 `MPI_Send` 发送信息后，将会停止运行等待对方通过 `MPI_Recv` 接收，反之亦然。
在某些情况下可能接收进程不在接受前不是很清楚消息的参数（如大小等），此时我们可以用 `MPI_Probe` 来“预测”消息参数，类似于peek的功能。

```c
MPI_Status status;
MPI_Probe(
  source,
  tag,
  MPI_COMM_WORLD,
  &status
)
```

probe函数可以在不接收消息的情况下先检视消息的相关信息，并将其保存在status中，我们可以用相关函数和方法来调取相关信息

```c
int itemNum;
MPI_Get_Count(&status, <type>, &itemNum) //在已知发送内容的类型的情况下获得发送内容的数量
status.MPI_SOURCE();
status.MPI_TAG();
```

### 集体通信

在点对点通信之外，大部分时候我们同样需要一对多，多对多的通信：

- `MPI_Bcast` 由某一个节点向所有的节点发送同样的内容，其效果可以被理解为

  ```c
  if (rank == sender) {
    MPI_Send(...)；
  }
  MPI_Recv(...)；

  ```

  但在性能角度做了优化，其发送与接收的结构是树状的。

  ```c
  MPI_Bcast(
    &contents,
    contentsCount,
    contentsType,
    root,
    MPI_COMM_WORLD
  );
  ```

  此函数可以从root进程向所有进程发送相同的contents

- `MPI_Scatter` 其作用与Bcast类似，但其是向不同的进程发送不同的内容，例如：
  ```c
  ...
  MPI_Scatter(
        numbers, //{0, 1, 2, 3}
        1,
        MPI_INT,
        &number,
        1,
        MPI_INT,
        0,
        MPI_COMM_WORLD
    );
  printf("rank %d: %d\n", worldRank, number);
  ...
  ```
  那么输出结果是
  ```
  rank 0: 0
  rank 1: 1
  rank 2: 2
  rank 3: 3
  ```
  其参数与Bcast类似，但在Bcast中，值是被自动赋给了其他线程中的同名变量，但在scatter中要自定接收变量和数据的数量（第4,5,6个参数）
- `MPI_Gather` 是Scatter的反义词，将不同线程的数据集中到某一个线程
  ```c
  MPI_Gather(
    &contentsSend,
    contentsSendCount,
    contentsSendDataType,
    &contentsRecv,
    contentsRecvCount,
    contentsRecvDataType，
    recvRank,
    MPI_COMM_WORLD
  );
  ```
- `MPI_Allgather` 与Gather类似，但在数据集中后，其不会只将数据给一个线程，而会给所有线程
- `MPI_Reduce MPI_Allreduce` 类似上文中omp的reduction一样，提供了整合的功能

```c
MPI_Reduce(
  &contentsSend,
  &contentsRecv,
  contentsCount,
  contentsDataType,
  reduceOperator， //包括MPI_SUM, MPI_MAX, MPI_PROD等
  recvRank,
  MPI_COMM_WORLD
);
```

### 通信子与进程组

在之前的程序中我们一直在使用 `MPI_COMM_WORLD` 作为通信子(communicator)，这也是在 `MPI_Init()` 到 `MPI_Finalize()` 之间默认启动的通信子，包含了所有的进程。在简单的小型程序中使用此全局通信子当然可以，但在更大更复杂的场合下，我们难免会需要创建通信子和进程组。
一个通信子除了记录其所管理的进程之外，还需要对这些进程进行标识，以确保进程间的通信不会出现混淆。如果我们在某些任务中不需要进行进程通信，只需要知道当前通信子中有哪些进程，那我们就可以单独取出通信子中的进程组(MPI_Group)来进行操作.

#### 创建新的通信子

- `MPI_Comm_Split` 通过规则将一个通信子中的进程划分到新的通信子中：
  ```c
  MPI_Comm_Split(
    communicator,
    color,
    key,
    newCommunicator
  );
  ```
  此处的拥有同样的color值的进程将被分到同一个通信子中，假设我们用8个进程运行下面这段程序
  ```c
  ...
  int worldSize, worldRank;
      MPI_Comm_size(MPI_COMM_WORLD, &worldSize);
      MPI_Comm_rank(MPI_COMM_WORLD, &worldRank);
      int color = worldRank / 4;
      MPI_Comm newSubCom;
      MPI_Comm_split(
          MPI_COMM_WORLD,
          color,
          worldSize - worldRank,
          &newSubCom
      );
      int subComRank;
      MPI_Comm_rank(newSubCom, &subComRank);
      printf("rand %d in world communicator, rank %d in the sub communicators\n", worldRank, subComRank);
  ...
  ```
  我们会得到结果
  ```
  rand 0 in world communicator, rank 3 in the sub communicators
  rand 1 in world communicator, rank 2 in the sub communicators
  rand 2 in world communicator, rank 1 in the sub communicators
  rand 3 in world communicator, rank 0 in the sub communicators
  rand 4 in world communicator, rank 3 in the sub communicators
  rand 5 in world communicator, rank 2 in the sub communicators
  rand 6 in world communicator, rank 1 in the sub communicators
  rand 7 in world communicator, rank 0 in the sub communicators
  ```
  可见，同一个color值的被分到了同一个通信子中，在通信子中的编号由key决定。
- `MPI_Comm_dup` 将一个通信子复制到一个新通信子中，在某些情况情况下用来保持独立性和防止冲突.
- `MPI_Comm_create`
  ```c
    MPI_Comm_create(
      originalComm,
      originalCommGroup,
      &newComm
    )
  ```
  通过group来创建一个新的通信子

#### 进程组的创建与操作

进程组保留的通信子所控制的所有进程的信息，但是因为其并不能区分不同的进程与通信组，所以其只能用来完成一些不涉及通信的任务，例如创建新的通信子，或者查询通信组中的进程编号等。

- group的基础方法：
  - `MPI_Comm_group(communicator, &group)` 用来获取communicator中的group
  - `MPI_Group_union(group1, group2, &newGroup)` 求并集，将union改为intersection即为求交
  - `MPI_Group_incl(group, procCount, proc, &newGroup)` 这其中proc为一个长度为procCount的数组，此函数会从group中选取proc中的进程建立一个新组
- 使用group创建新的通信子：主要有两种方法
  - `MPI_Comm_create(communicator, group, &newCommunicator)` 从communicator中选取包含在group中的进程创建一个新的进程
  - `MPI_Comm_create_group(communicator, group, tag, &newCommunicator)` 与上面那个看起来很相似，实际上也确实很相似，但上面那个在调用时，无论进程是否在group内都会调用，但这个只会调用在group内的进程，相对更安全且在进程较大时更快速。
