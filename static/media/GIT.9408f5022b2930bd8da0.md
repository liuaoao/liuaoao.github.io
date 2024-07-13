# GIT

![Untitled](GIT%20aa03bc4a77d742de8333f22900ca9ef5/Untitled.png)

# GIT操作

git clone [https://blablabla](https://blablabla/)

cd

ls

git status

将当前所有文件加入到暂存区

git add -A .

看有啥更新的

git status

提交到本地仓库

git commit -m " add training"

推送到远程仓库

git push origin master

更新

git pull

#假如我们现在在liuhognzheng分支上，可以用下面命令查看当前分支

git branch

刚开发完项目，执行了下列命令

git  add .

git  commit -m 'dev'

git push -u origin dev

#然后我们要把dev分支的代码合并到master分支上 该如何？

#首先切换到master分支上

git checkout master

#如果是多人开发的话 需要把远程master上的代码pull下来

#git pull origin master

#如果是自己一个开发就没有必要了，为了保险期间还是pull

#然后我们把dev分支的代码合并到master上

git  merge dev

#然后查看状态

git status

On branch master

Your branch is ahead of 'origin/master' by 12 commits.

(use "git push" to publish your local commits)

nothing to commit, working tree clean

上面的意思就是你有12个commit，需要push到远程master上

执行下面命令即可

git push origin master

git pull的时候发生冲突的解决方法之“error: Your local changes to the following files would be overwritten by merge”

方法一、stash

1 git stash

2 git commit

3 git stash pop

接下来diff一下此文件看看自动合并的情况，并作出相应修改。

git stash: 备份当前的工作区的内容，从最近的一次提交中读取相关内容，让工作区保证和上次提交的内容一致。同时，将当前的工作区内容保存到Git栈中。

git stash pop: 从Git栈中读取最近一次保存的内容，恢复工作区的相关内容。由于可能存在多个Stash的内容，所以用栈来管理，pop会从最近的一个stash中读取内容并恢复。

git stash list: 显示Git栈内的所有备份，可以利用这个列表来决定从那个地方恢复。

git stash clear: 清空Git栈。此时使用gitg等图形化工具会发现，原来stash的哪些节点都消失了。

方法二、放弃本地修改，直接覆盖

1 git reset --hard

2 git pull

在使用Git的过程中，有些时候我们只想要git服务器中的最新版本的项目，对于本地的项目中修改不做任何理会，就需要用到Git pull的强制覆盖，具体代码如下：

$ git fetch --all  $ git reset --hard origin/master   $ git pull

Git pull的强制覆盖本地文件在自动化部署项目中很有作用，比如用SaltStack部署web项目，强制覆盖可以保持与服务器内容一致。上面的操作有点复杂，直接用git checkout 就ok了

# GIT提交代码流程

单个分支：先commit，再pull，（可能需要解决冲突），再push

首先在自己的分支上检查未提交的文件

git status

选择所有未提交文件

git add .

添加注释

git commit -m '注释'

提交到自己的分支

git push origin 自己分支名

切换分支到主分支

git checkout main

合并分支

git merge 自己分支名

拉取代码

git pull

这一步骤没有问题的话直接跳过以下两步，在主分支提交代码，git push origin main。

运行上面这两步可能会遇到冲突，若遇到

![Untitled](GIT%20aa03bc4a77d742de8333f22900ca9ef5/Untitled%201.png)

的时候，根据提示找到冲突的文件并改正。

解决完冲突后执行以下命令，把修改后的文件上传到主分支

（此步骤适用于某某某在主分支上写项目的同志，请先提交代码，不要妄想换到你自己的分支，你换不回去的😈😈😈）

git add .

git commit -m '注释'

git push origin main

上传后，若是在git merge 自己的分支后发生的冲突，则需要git pull拉取代码，否则会报错

继续执行以下命令

若git pull后没有错误或冲突，切换到自己分支

git checkout 自己分支名

最后一步，合并分支

git merge main

若遇到在切换分支时报错，要检查是否需要提交文件：git status，如果有，则需要先提交文件到此分支（不管是主分支还是自己的分支）。提交之后即可以正常切换分支。

若遇到窗口仿佛被锁住一样，不能进行任何操作的那东西，按下Esc键，再输入:wq 回车解决

来自 <[https://segmentfault.com/a/1190000037453178](https://segmentfault.com/a/1190000037453178)>

---

1.本地算一个clone体。

2.是得,如果远程有一个分支 dev，那么pull origin dev，本地就会有一个dev分支。

3.仓库是整个项目，分支算其中一个生产线。就和阿里巴巴集团不是只有一个淘宝一样

4.push会进行分析，当然不是所有，你可以自己测试，弄一些大文件，第一次新建项目的push会很慢，如果你加一个几k的文本，那这次传输很快

5.commit是防止远程直接覆盖你本地，只要有修改都会让你commit，提示你pull原因是因为你远程当中有最新的东西和你本地不一致，git知道，远程分支的东西不能丢掉，所以让你pull下来存到本地，让本地变成最新的最后push上去，难么同理的方式你本地就是最新，便会去修改远程的。

来自 <[https://segmentfault.com/q/1010000009549291](https://segmentfault.com/q/1010000009549291)>

---

git branch -d <branch> 删除一个分支

git checkout -b <branch> 新建分支并checkout到新分支上