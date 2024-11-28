---
title: Machine Learning Notes 1
category: CSDIY
tags:
  - Machine Learning
  - python
  - Data Science
date: 2024-06-22
summary: 科普视频级别的机器学习：模型训练的大致流程
---

## Tensor

Tensor是pytorch中的一个核心概念，其实质为一个多维数组对象，与numpy数组类似。在机器学习等方面，pytorch的优势则在于可以调用GPU大幅度加速运算，以及包含自动微分库，因此受到了相关领域的喜爱。
创建一个torch.tensor有很多方法，由python默认数组，numpy数组，另一个tensor均可用来给新的tensor赋值

```python
a=[[1,2],[3,4]]
b=np.array([[1,2],[3,4]])
```

上述均可用来初始化一个tensor如 `x=torch.tensor(a)` 而所生成的x也可以用来给新的tensor赋值。一个tensor也可以通过 `.numpy()` 方法转化为一个numpy数组
一个tensor除了其中包含的数据以外，还有很多属性，如

- `.shape` 表示tensor的形状；
- `dtype` 表示其存储类型（一般为 `torch.float32` 或 `torch.float64` ）；
- `.device` 表示其存储设备（一般为 `cpu` 或 `cuda` ，pytorch要求其数据，模型等必须在同一设备上才可以运行）；
- `.requires_grad` 和 `.grad` 若前者为True则在之后运算时会自动计算梯度并存储在后者中

## 模型训练流程概览

首先我们要明确我们的目标，其本质即是要求解一个函数，其接受一个输入得到一个输出（输入和输出一般是向量形式），训练模型就是寻找其中这亿点参数的最优值。

### “神经网络”之得名由来

如上文所述，我们其实就是为了找到一个函数，这个函数接受一个向量输入输出一个向量。由过往理论与实践我们可知，在总参数量相似的情况下，将多个单个参数较小的函数嵌套得到的大函数的准确度高于单个巨无霸函数。我们称这样的嵌套函数中的每一个函数为一个层。
不难知道这样的一层同样也是一个输入一组向量输出一组向量的函数。那么我们不妨再把范围缩小一点，我们把这样的函数层再拆分，看作是多个函数的组合，其中每个函数接受多个未知数（向量），输出一个标量作为结果，这个就和我们传统理解上的多元函数一样了，然后这样的很多函数在组合得到了这一层的输入向量输出向量的机制。
我们将最小的这个输入向量输出标量的函数认为是一个“神经元"，就可以整个层内多个”神经元“组合，多层嵌套的这个超级函数视为”神经网络”
注：这个只做最简单的全连接层的说明，实际神经网络可能有更多特殊的结构。

### 总体流程

一般，我们得到一个数据集后，通常会将整个数据集划分为多个batch，一个batch可能包含多组数据。我们最开始可以将目标参数设定为随机值，然后一次一个batch代入，利用（大概率下）以梯度下降法为核心的优化器来对目标参数进行一次优化，随后再代入一个新的batch，重复执行直到所有训练数据集都全部遍历后，成为一个epoch，之后（一般将测试集打乱重新划分epoch）重复此流程，直到达到设定的epoch数或者模型的准确率已不再上升。接下来我们来看看一次batch训练到底经历了什么。

### 单次训练的流程

> 下面这点不能理解的话，可以先想想，我们所说的这个求偏导，哪些部分是求的这个偏导的表达式，哪些部分是求的偏导数值。

学过高数的多元函数部分一定能对梯度下降法有所印象，即多元函数对每个未知数求偏导数组成的向量的方向就是函数“下降最快”的方向，其实这里单次训练也是同理。在训练时我们制定时需要制定一个计算损失的函数，并求这个损失函数对所有参数的偏导来找到梯度。
而我们常说的深度神经网络的深度，就是体现在神经网络有多层，每一层又可以被视作一个独立的函数，因此整体作为一个超级嵌套函数，其求对应损失函数偏导的过程是很复杂的。由于我高数稀烂也不在这里嗯装了，简单来说就是根据链式法则展开后可以注意到其偏导数有一部分可以从输入到输出的方向展开更好算（前向传播），然后另一部分是要从输出向输入展开（反向传播），最后得到所求的梯度。然后知道了梯度，那么也就是在这一处沿梯度下降最快，那还要下降多久呢，这个是由学习率和优化器来决定的，不同优化器，对这个梯度下降的具体策略也各有不同。

## pipeline walkthrough

接下来我们简单看一下模型训练是如何实现的（以pytorch为例）

### 数据载入

pytorch中存在一抽象类dataset，一般载入数据可载入由dataset派生得到的新类，一般来说主要包含三个函数，构造函数，长度统计函数和在训练时调用数据的 `_getitem_` 函数。下为一个简单的dataset派生类实现。

```python
from torch.utils.data import Dataset, DataLoader

class MyDataset(Dataset):
    def __init__(self, data, labels):
        self.data = data
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        #preprocessing
        return self.data[idx], self.labels[idx]

```

可见此处载入的data需要我们的输入和预期输出，在构造环节，数据类型不会发生改变，可能的数据预处理和类型转换发生在 `_getitem_` 环节。

### 网络架构

在实际使用中，pytorch提供了许多内置的层类型，如 `nn.Linear` （全连接层）、`nn.Conv2d` （二维卷积层）、 `nn.BatchNorm2d` （批量归一化层）等，这些内置层已经包含了权重、偏置（如果适用）和激活函数（如果适用）的定义。
那么我们在构建自己的神经网络的时候只要按自己的需求搭就好了。

```python
class Classifier(nn.Module):
    def __init__(self):
        super(Classifier, self).__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(3, 64, 3, 1, 1),  # [64, 128, 128]
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2, 0),      # [64, 64, 64]

            nn.Conv2d(64, 128, 3, 1, 1), # [128, 64, 64]
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2, 2, 0),      # [128, 32, 32]

            nn.Conv2d(128, 512, 3, 1, 1), # [512, 8, 8]
            nn.BatchNorm2d(512),
            nn.ReLU(),
            nn.MaxPool2d(2, 2, 0),       # [512, 4, 4]
        )
        self.fc = nn.Sequential(
            nn.Linear(512*4*4, 1024),
            nn.ReLU(),
            nn.Linear(1024,32),
            nn.ReLU(),
            nn.Linear(32, 11)
        )

    def forward(self, x):
        out = self.cnn(x)
        out = out.view(out.size()[0], -1)
        return self.fc(out)
```

这段代码就展示了一个典型的神经网络架构，其中，前半段为卷积部分，每一层先使用 `nn.Conv2d` 提取特征，这也是最核心的部分，接下来用 `nn.BatchNorm2d` `nn.ReLU` `nn.MaxPool2d` 这三个分别进行归一化，激活和池化，对数据进行了一些简单的处理以加速运算，优化结果，增加模型的稳定性。后段为全连接层，在展平卷积层的输出之后通过全连接层，得到最后的输出结果向量。
在类中同样定义的 `forward` 函数则是在训练模型时的前向传播路径，即先通过卷积层，展平，再通过全连接层。

### 开练！

#### Dataloader

我们通过dataset从外部的数据集中载入了数据，接下来我们可以用Dataloader类来将dataset的数据划分batch，打乱，进行预处理等

```python
loader=DataLoader(data,batch_size=size,shuffle=True)
```

当然，我们Dataloader也包含数据预处理的功能，具体也与所定义的 `getitem` 函数有关。

#### Optimizer

注意我们之前提到过我们梯度下降法求偏导的对象是一个损失函数，这个损失函数也有pytorch现成的，以最简单的SGD为例

```python
optimizer = torch.optim.SGD(model.parameters(), lr=0.001)
```

此处的lr，即learning rate，则可以简单地理解为你在这一点计算出梯度之后要向这个梯度方向走多远。

#### train

定义好上面的这一对之后就可以开始训练了，一次简单的训练-测试的流程如下。

```python
model.train()

for data, target in train_loader:
    optimizer.zero_grad()  # 清除梯度
    output = model(data)   # 前向传播
    loss = loss_function(output, target)  # 计算损失
    loss.backward()  # 反向传播
    optimizer.step()  # 更新参数

model.eval()

with torch.no_grad():
    # 评估循环
    for data, target in eval_loader:
        output = model(data)  # 前向传播
        # 计算评估指标，如准确率
```

值得一提的是，此处的 `model.train()` 和 `model.eval()` 是两种训练模式，主要区别则在与前者的目的是优化，因此会丢弃部分不够好的数据结果，或者防止过拟合而临时修改网络结构，后者则是用于测试时诚实地反映结果。

> Reference
>
> [李宏毅机器学习](https://speech.ee.ntu.edu.tw/~hylee/ml/2022-spring.php)
