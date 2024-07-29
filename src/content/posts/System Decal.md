---
title: Sysadmin Decal Notes
categories: CSDIY
tags: [Linux]
date: 2024-03-07
---

## Bash

Bash is the language used in shell for Unix-like systems. It can be used through typing commands in a terminal or writing a script in a .sh format.

### Input, variables, output

- Blankspaces matter! i.e. `VAR=1` can assign 1 to a variable called `VAR`, while `VAR = 1` will cause an error, for it will see `VAR` as a command, which is not.
- `read` is the typical command to get an input.
  ```bash
  read <input_var> #this will read the input and assign it to input_var
  read -p "some sort of prompt" <input_var> #this will give show a prompt on the terminal and then accepts an input
  read -s <a_secret_input> #the input will not appear on the screen,used for sensitive inputs like password etc.
  ```
- To create a file, `touch` is often used, and `echo` can be used to show an output on the terminal or put them in a file.
  ```bash
  echo "output" #prints "output" on the terminal
  echo "output" > afile.txt #this will wipe out all the existing contents in afile.txt then write "output"
  echo "output" >> afile.txt #this will add "output" to the tail of the file, not changing the contents already there.
  ```
- In bash, you can't get the value of a variable just by calling its name, such action will only return the name itself. An extra "\$" is needed to get the value of the variable. For example:
  ```bash
  VAR=1
  echo VAR #prints "VAR"
  echo $VAR #prints 1
  ```
- Bash perform commands, not expressions, so an `expr` is used when it's doing expressions
  ```bash
  FOO=1
  $FOO + 1 #error!
  expr $FOO + 1 # 2
  ```
- Pipe `|` is a cool feature in Unix-like command, it can pass the result of the command before to the one after the pipe
  ```bash
  cat file.txt | wc -l
  #cat can output the contents of file.txt
  #pipe pass the contents to "wc -l", which counts the line of the input
  ```
- A lot of commands can be used to manipulate files, here are some of them
  ```bash
  grep "<a word you want to find>" file.txt
  #this will search the file.txt for the word you want to find and output the lines that has it
  sed -i '/pattern/d'
  #this is used to delete all the lines with <pattern>
  sed -i 's/old/new'
  #this is used to change every <old> to <new>
  ```

### Conditions and controls

- Just like other languages, bash also has `if` `while` and so on, but in bash **0 is true and 1 is false**.
- A simple example of `if`
  ```bash
  if <condition>; then
      <code that run when condition is true>
  elif <another condition>; then
      <code>
  else
      <code>
  fi
  ```
- A not-so-simple example of `case`
  ```bash
  case $condition in
      <condition1>)
          <code>;;
      <condition2>)
          <code>;;
      *) #default
          <code>;;
  esac #case reversed that is
  #a real example
  read -p "type 1 or 2" input_var
  case $input_var in
      1)
          echo "you typed 1";;
      2)
          echo "you typed 2";;
      *)
          echo "you typed neither";;
  esac
  ```
- You can use `test` or `[]` to judge whether the statement is true or false
  ```bash
  #$?means get the return value of the previous expression
  test 1 = 1; echo $? #0
  [1 = 0]; echo $? #!
  ```
- In bash,both "|| &&" and "-o -a" can be used to represent `and` and `or` , there are some really small differences
  ```bash
  test 1 = 1 && 2 = 2; echo $? #this line will trigger an error because "&&" connects "test 1 = 1" with "2 = 2", the second of which can not be understood
  test 1 = 1 -a 2 = 2; echo $? #0
  test 1 = 1 && test 2 = 2; echo $? #also 0
  test 1 = 1 -a 2 = 2; echo $? #0 as well!
  ```
- Like most language, `while` and `for` can be used to perform iteration

  ```bash
  while <condition>
  do
      <code>
  done

  for l in <list>
  do
      <code>
  done
  ```

### Writing scripts

- Bash can be used to write scripts with in `.sh` format. To run it, we usually need to add excution permission, then run it
  ```bash
  chmod +x script.sh
  bash script.sh #or ./script.sh
  ```
- Bash also has functions, which can make scripts simpler and more efficient.
  ```bash
  function functionname(){
      <code>
  }
  #or just
  functoinname(){
      <code>
  }
  ```
- Usually the computer don't know how to excute a bash script, we need a special comment at the top of our scirpt, called "shebang", to tell the computer use the bash interpreter to excute the script, a typical shebang for bash looks like
  ```bash
  #!/bin/bash
  ```
  this tells the system to excute the script using the bash shell in /bin/bash.Scripts written in other languages, like python, also need similar comments.

## Package

### Using packages

When we use softwares on linux, most of the time we are using the packages of the software. typically it is made up of binaries, libraries and dependencies etc. In debian and systems derived from it(like ubuntu which is the system I am using now) packages are in .deb format.

#### Package managers

We ususally perform actions on a package through a package manager, in debian `apt` and `dpkg` are the most common used package manager, `apk` is used under general circumstances while `dpkg` is used for insepect, fix, or performing local installs.
some common commands:

```bash
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade
sudo apt remove
sudo apt install
sudo dpkg -i #install locally
sudo dpkg --remove
sudo dpkg --configure -a #to reconfigure packages so it can be installed and run successfully
# the commands below usually don't need to add a sudo command because they won't change the system most of the time.
dpkg -I
apt policy #listing all the versions of the package that can be downloaded
apt show #listing the basic information of the package including name, size, maintainers, depends etc.
```

there are some small differences between `upgrade` and `dist-upgrade`:
For most of the time `upgrade` can do the work, `upgrade` can find a "smart " approach to upgrade a package without changing current installs, but this might fail under some circumstances, while `dist-upgrade` can change the current package in order to make the upgrade successful.
generally, dist-upgrade is more powerful and effective than upgrade, but also a little more dangerous to the system.

### Making packages

Suppose we have written a piece of code and we want it to actually run as a program, we need to make a package, one way to done this is through `gcc` and `fpm`
gcc is a compiler to compile c/cpp .etc code it's used like

```bash
gcc file.c -o file
```

which will turn a piece of source code to an executable, but it's not a package yet, some more steps must be made.

A compiled binary file itself is executable, a package will contain the file, but will also contain more (e.g. dependencies) to make it can easily be downloaded and then run on user's computer. To make a package completely on oneself is quite painful, but there are tools, like the `fpm`

First we create a directory to store the package, say `mkdir -p packageoffile/usr/bin/` , in Debian including Ubuntu systems, we usually put user-level packages in `/usr/bin/` , then we move the compiled file to there by `mv file /packageoffile/user/bin/` then we create the package using `fpm` with the following commands

```bash
fpm -s dir -t deb -n file -v 1.0 -C packageoffile
```

the breakdown of the command above is like the system takes a directory called packageoffile, convert it into a .deb format package with the name "file" and the version is 1.0
Now this is a package which you can use dpkg to download it like

```bash
sudo dpkg -i ./file_1.0_amd64.deb
```

and we can run it just by

```bash
hellopenguin
```

cool! just like a real package!
The package can then be used on all linux systems, while in windows the basic logic is the same but the tools used to compile and making packages are slightly different.

## Service and process

### Service

Services are usually programs that run for a long time to provide support. Often service starts automatically and are usually controlled by systems, normally users won't interact with services.

Services usually have a file to list all the configerations they need to use, common configs like `ListenAddress` `Port` `LogFile` etc.

Most of the time it's not wise to run similar services at the same time, for example, there are two services called `nginx` and `httpd` , both are some sort of webserver, and both listened to port 80, which will confuse the system.

Though users typically don't mess up with services, but surely they can,one of the easiest way is to use `systemctl` commands

```bash
systemctl stop <service>
systemctl start <service>
systemctl restart <service>
systemctl reload <service>
systemctl enable <service>
systemctl disable <service>
systemctl #shows all the services and their status
```

If you reload a service ,it will just reload the configs, but the service itself won't stop, but if you restart a service, the service will stop first, then it will restart with new configs, not all services support `reload` , and if you reload a service that can't be reloaded, it will automatically restart instead.

### Process

Processes are instances of programs. Each process has its own memory, thread, and a bunch of IDs (like its own process ID, its parent's PID, the users ID etc.)

A very special process is the `init` , which is the process start at boot with the PID 1, all other processes are its children or the children of children etc.

To create a new process, we can use `fork` , which creates a new child process from a parent process, the child process has a new PID, while the parent's PID remains the same.`fork` also has a return value, in child process it return 0 and in parent process it return the PID.

To end a process, `exit()` `wait()` are often used. For a process to call `exit(n)` , then it will terminate and return n as the exit code to its parent process, n ranges for 0~255, usually 0 is success and the rest are may indicate that some situations have happened, and the parent process can use `wait()` receive the exit code for a child process, if the parent process calls `wait()` but no child processes are over yet , then the parent process will literally wait for a process to end, you can use `waitpid()` if you don't want the wait to happen.

Without proper use of `exit()` and `wait()` some bad things will happen, if a process has exited but the parent process don't `wait()` for it, then the exit code and other data is remained to be collected, making it a zombie process, if there are too much of them, it might be resource leakage or else.On the other hand, if the parent process is in a hurry, exiting itself before all its children exit, then the remaining children will become orphan processes, and will be re-parented to the init process, then the init process will automatically reap them if they become orphans and zombies.

Besides the process can exit themselves, there are signals sent from the kernal of the system, common signals include:

- `SIGKILL` just kill a process immediately, before the process do anything else
- `SIGTERM` let the process terminate, but the process is allowed to do some saving work before if finish ifself
- `SIGINT` interrupt the process, often triggered by the user using Ctrl+C
- `SIGHUP` happens when the user closes the terminal, the process running in there won'y br killed but hang up.
- `SIGSTOP` `SIGCON` to stop and resume

#### Controlling processes

There are several ways to list and manipulate the processes in the system,one way is through `ps`, which will show the process that is active. But it's worth notice that normally `ps` only shows the processes active in its terminal, for example if you create a process, say `sleep 1000 &` , this creates a sleep process that sleeps for 1000 seconds, with the `&` , no other processes will be effected, then you type ps, and will show the `sleep` process. But if you open a new terminal and run `ps` on it you won't actually find the `sleep` process. If you want to find all the processes not just in a certain terminal but for the whole user, `ps -u` is what you need.

In the section before we mentioned signals, which can also be manually tirggered by command `kill` details are as follows

```bash
kill (-15) PID #the default kill is actually SIGTERM not SIGKILL, this means send a SIGTERM to the process with the PID
kill -9 PID #send a SIGKILL to the process with the PID
kill -STOP/-17 PID #SIGSTOP
kill -CONT/-19 PID #SIGCONT
```

# Bandit Level 0~15

Sysadmin Decal是一门很棒的课程，但部分作业需要远程服务器，不对外开放。我参考csdiy的建议，完成了bandit前15个level，作为熟练相关指令的补充练习

- level 0
  很简单，但我一直没打明白，不是端口号打成2200就是用户名漏打了个0就是地址labs打成了lab了，有点消愁了

```bash
ssh -p 2220 bandit0@bandit.labs.overthewire.org
```

- level 1
  使用 `ls` 即可发现一个readme文档，使用 `cat` 打开即可得到密码

- level 2
  本关即是让你打开一个文件名为“-”的文档，直接输入会被当做参数标志，可以使用相对路径打开
  ```bash
  cat ./- #此处.即为当前directory
  ```
- level 3
  本关让你打开一个文档名中有空格的文档，直接输入可能只会读入文档的第一个单词，需要使用引号把整个文档名括在一起
  ```bash
  cat "spaces in this filename"
  ```
- level 4
  本关需要打开一个不能被ls找出的文件（实现方式是将文件名用.开头即可），我是用的find找到了隐藏的文件

  ```bash
  find -type f
  # ./.hidden
  cat .hidden
  ```

  当然用`ls -a`也可以找到对应的文件

- level 5
  inhere中有多个文件，需要找到由ASCII编码的那个，可以使用file做到

  ```bash
  file ./-file00 #知识点复习，用相对路径找带-的文件
  #data
  ...
  file ./-file07
  #ASCII, that's it!
  ```

  也可以使用 `file ./*` 一次性看完

- level 6
  只需要第二个条件就可以找到唯一满足的文件了
  `bash
find . -size 1033c
`

- level 7
  find 同样支持按user和group查找
  `bash
find / -user bandit6 -group bandit7 -size 33c
`
  他会有一大长串搜索结果，要肉眼遍历找到其中一个叫“password”的文件

- level 8
  简单的grep函数应用

  ```bash
  grep "millionth" data.txt
  ```

- level 9
  sort可以按一定顺序排序（一般默认就可以），uniq可以检查某行和它上下相邻的行是否相同，若相同则删除重复行，此处可以加入额外参数 -u，使只输出在初始时便只有一行的数据。

  ```bash
  sort data.txt | uniq -u
  ```

- level 10
  strings可以从二进制文件中提取可打印的字符，然后用grep"======"来筛选出密码（但我看这文件也不长，人工识别找密码也不是不行×）

  ```bash
  strings data.txt | grep "====="
  ```

- level 11
  知道base64基本解码指令即可

  ```bash
  base64 -d data.txt
  ```

- level 12
  此处需要介绍tr， tr可以接收两个字母表，将识别输入中每个字母在第一个字母表中的位置，并转化为第二个字母表中对应位置的字母
  ```bash
  cat data.txt | tr 'a-zA-Z' 'n-za-mN-ZA-M'
  ```
- level 13
  真是一场酣畅淋漓的赤石啊，你们有这样的压缩吗，真是压压又缩缩啊
  本题先有一个16进制文件，用xxd解析之后就开始用bzip，gzip，tar反复解压

  ```bash
  # 只列出部分所需代码
  xxd -r data data.output #将原16进制解析成新的data.out文档
  file data #确定当前格式，决定下次解压所需指令
  mv data data.gz
  gzip -d data.gz #gzip解压，之后再用list可看见新的文档data将data.gz替代，然后重复解压步骤
  mv data data.bz2
  bunzip2 -d data.bz2 #bunzip2解压
  mv data data.tar
  tar -xdv data.tar #tar解压
  ```

  反复解压多次偶得到一ASCII文件，即可得到密码

  > wbWdlBxEir4CaE8LaPhauuOo6pwRmrDw

- level 14
  本题介绍了使用私钥文件而非密码进行连接的方法

  ```bash
  ssh -i ./sshkey.private bandit14@localhost -p2220
  #此处“-i ./sshkey.private”即代表通过私钥的方式登入位于localhost的2220端口处的bandit14用户
  ```

  > fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq

- level 15
  本题需要将密码发送至30000端口，比较简单的方法是使用nc
  ```bash
  nc localhost 30000
  ```
