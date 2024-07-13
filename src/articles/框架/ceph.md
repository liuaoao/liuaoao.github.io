# ceph

Ceph

2021年4月23日

10:39

START

### 存储发展史

企业中使用存储按照其功能，使用场景，一直在持续发展和迭代，大体上可以分为四个阶段：

DAS：Direct Attached Storage，即直连存储，第一代存储系统，通过SCSI总线扩展至一个外部的存储，磁带整列，作为服务器扩展的一部分；

NAS：Network Attached Storage，即网络附加存储，通过网络协议如NFS远程获取后端文件服务器共享的存储空间，将文件存储单独分离出来；

SAN：Storage Area Network，即存储区域网络，分为IP-SAN和FC-SAN，即通过TCP/IP协议和FC(Fiber Channel)光纤协议连接到存储服务器；

Object Storage：即对象存储，随着大数据的发展，越来越多的图片，视频，音频静态文件存储需求，动仄PB以上的存储空间，需无限扩展。

存储的发展，根据不同的阶段诞生了不同的存储解决方案，每一种存储都有它当时的历史诞生的环境以及应用场景，解决的问题和优缺点。

区别如下：

DAS 直连存储服务器使用 SCSI 或 FC 协议连接到存储阵列、通过 SCSI 总线和 FC 光纤协议类型进行数据传输；例如一块有空间大小的裸磁盘：/dev/sdb。DAS存储虽然组网简单、成本低廉但是可扩展性有限、无法多主机实现共享、目前已经很少使用了。

NAS网络存储服务器使用TCP网络协议连接至文件共享存储、常见的有NFS、CIFS协议等；通过网络的方式映射存储中的一个目录到目标主机，如/data。NAS网络存储使用简单，通过IP协议实现互相访问，多台主机可以同时共享同一个存储。但是NAS网络存储的性能有限，可靠性不是很高。

SAN存储区域网络服务器使用一个存储区域网络IP或FC连接到存储阵列、常见的SAN协议类型有IP-SAN和FC-SAN。SAN存储区域网络的性能非常好、可扩展性强；但是成本特别高、尤其是FC存储网络：因为需要用到HBA卡、FC交换机和支持FC接口的存储。

Object Storage对象存储通过网络使用API访问一个无限扩展的分布式存储系统、兼容于S3风格、原生PUT/GET等协议类型。表现形式就是可以无限使用存储空间，通过PUT/GET无限上传和下载。可扩展性极强、使用简单，但是只使用于静态不可编辑文件，无法为服务器提供块级别存储。

综上、企业中不同场景使用的存储，使用表现形式无非是这三种：磁盘（块存储设备），挂载至目录像本地文件一样使用（文件共享存储），通过API向存储系统中上传PUT和下载GET文件（对象存储）

# Ceph

能够提供企业中三种常见的存储需求：块存储、文件存储和对象存储，正如Ceph官方所定义的一样“Ceph uniquely delivers object, block, and file storage in one unified system.”，Ceph在一个统一的存储系统中同时提供了对象存储、块存储和文件存储，即Ceph是一个统一存储，能够将企业企业中的三种存储需求统一汇总到一个存储系统中，并提供分布式、横向扩展，高度可靠性的存储系统，Ceph存储提供的三大存储接口：

CEPH 简介

不管你是想为云平台提供Ceph 对象存储和/或 Ceph 块设备，还是想部署一个 Ceph 文件系统或者把 Ceph 作为他用，所有 Ceph 存储集群的部署都始于部署一个个 Ceph 节点、网络和 Ceph 存储集群。 Ceph 存储集群至少需要一个 Ceph Monitor 和两个 OSD 守护进程。而运行 Ceph 文件系统客户端时，则必须要有元数据服务器（ Metadata Server ）。

Ceph OSDs: Ceph OSD 守护进程（ Ceph OSD ）的功能是存储数据，处理数据的复制、恢复、回填、再均衡，并通过检查其他OSD 守护进程的心跳来向 Ceph Monitors 提供一些监控信息。当 Ceph 存储集群设定为有2个副本时，至少需要2个 OSD 守护进程，集群才能达到 active+clean 状态（ Ceph 默认有3个副本，但你可以调整副本数）。

Monitors: Ceph Monitor维护着展示集群状态的各种图表，包括监视器图、 OSD 图、归置组（ PG ）图、和 CRUSH 图。 Ceph 保存着发生在Monitors 、 OSD 和 PG上的每一次状态变更的历史信息（称为 epoch ）。

MDSs: Ceph 元数据服务器（ MDS ）为 Ceph 文件系统存储元数据（也就是说，Ceph 块设备和 Ceph 对象存储不使用MDS ）。元数据服务器使得 POSIX 文件系统的用户们，可以在不对 Ceph 存储集群造成负担的前提下，执行诸如 ls、find 等基本命令。

Ceph 把客户端数据保存为存储池内的对象。通过使用 CRUSH 算法， Ceph 可以计算出哪个归置组（PG）应该持有指定的对象(Object)，然后进一步计算出哪个 OSD 守护进程持有该归置组。 CRUSH 算法使得 Ceph 存储集群能够动态地伸缩、再均衡和修复。

体系结构：

![Untitled](ceph%2010ab23f1f75a462eb74c923080c0d816/Untitled.png)

工具

Teuthology — ceph的持续集成（Continuous integration，简称CI）工具

radosbench ---- ceph的命令行性能测试工具

cosbench ---- ceph的web性能测试工具，基于java

常用命令

systemctl | grep 查看机器安装了哪些ceph服务，相关服务软件文件路径

systemctl | grep ceph

比如这个命令的输出，可以发现 ceph-osd@10.service的文件路径在/var/lib/ceph/osd/ceph-10 下面

systemctl status查看相关服务状态，存在多个服务的状态下可能具体每个服务会有自己的id（尤其是osd），可以用*查看

systemctl status ceph-osd@*

systemctl status ceph-mgr@*

systemctl status ceph-mon@*

systemctl status ceph-radosgw@*

systemctl start/restart/stop 开启/重启/停止服务 参考上一条

ceph-volume lvm activate --all 一条命令重启激活所有osd服务（通常用于osd节点重启或者关机过）

ceph 管理命令

说明

参考 [http://docs.ceph.org.cn/man/8/ceph/](http://docs.ceph.org.cn/man/8/ceph/)

ceph 是个控制工具，可用于手动部署和维护 Ceph 集群。它提供的多种工具可用于部署监视器、 OSD 、归置组、 MDS 和维护、管理整个集群。

执行方法（二选一）

（1）在相关角色服务正常的ceph 存储服务器执行 ceph (+参数）

或者

（2）客户端执行，需要满足以下条件

（2.1） ceph 管理命令rpm已安装，且与ceph服务器网络互通

（2.2）把存储服务器的 配置文件/etc/ceph/ceph.conf 和 密钥文件 /etc/ceph/ceph.client.admin.keyring 拷贝到客户端

（2.3）客户端执行命令 ceph -c 【ceph.conf 文件拷贝的路径】 -k 【ceph.client.admin.keyring 拷贝的路径】 (+参数）

END