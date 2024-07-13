# kubectl

# 常用kubectl命令

2021年6月28日

15:33

1、指定config文件：

Kubectl --kubeconfig config-203 xxxxxxxxxx

2、查看pod：

kubectl --kubeconfig config-203 describe pod spe-150-300-1625733555-1-n autolink

3、下载日志：

Kubectl logs spe-150-300-1625733555-1 -cspe-150-300-1625733555-n autolink >spe-150-300-1625733555-1.log

（-c指定容器，-n指定命令空间）

4、删掉al开头正在Running的pod：

kubectl get pod -n parrots-spe| grep Running | grep "al-" | awk '{print $1}' | xargs kubectl delete pod -n parrots-spe

——grep正则匹配进行搜索，awk就是把文件逐行的读入，以空格为默认分隔符将每行切片，切开的部分再进行各种分析处理。

xargs 用作替换工具，读取输入数据重新格式化后输出。

——xargs命令通俗来讲就是将标准输入转成各种格式化的参数，所以命令[command 1] | xargs [command 2]就是将command 1的标准输出结果，通过管道|变成xargs的标准输入，然后xargs再将此标准输入变成参数，传给[command 2]。这样一来，通过xargs命令，我们便可以在管道后面使用那些不接收标准输入的命令了。例如[command 1]|xargs ls

5、查看正在跑的任务

kubectl --kubeconfig config-203 get pod -n autolink | grep Pending

6、获取pending状态mpi：kubectl get mpi -n autolink | grep Pending

7、统计pending状态mpi：kubectl get mpi -n autolink | grep Pending | wc -l

8、批量删除mpi：cat mpi.txt | awk '{print $1}' | xargs kubectl delete mpi -n autolink

9、kubeconfig不同环境：kubectl --kubeconfig config-203 -n autolink logs spe-209-418-1625748271-1 spe-209-418-1625748271 > spe-209-418-1625748271-1.log

10、查看集群资源：kubectl-admin --kubeconfig .kube/config-203 resource gpu -d

# kubernets架构

Kubernetes 最初源于谷歌内部的 Borg，提供了面向应用的容器集群部署和管理系统。Kubernetes 的目标旨在消除编排物理 / 虚拟计算，网络和存储基础设施的负担，并使应用程序运营商和开发人员完全将重点放在以容器为中心的原语上进行自助运营。Kubernetes 也提供稳定、兼容的基础（平台），用于构建定制化的 workflows 和更高级的自动化任务。 Kubernetes 具备完善的集群管理能力，包括多层次的安全防护和准入机制、多租户应用支撑能力、透明的服务注册和服务发现机制、内建负载均衡器、故障发现和自我修复能力、服务滚动升级和在线扩容、可扩展的资源自动调度机制、多粒度的资源配额管理能力。Kubernetes 还提供完善的管理工具，涵盖开发、部署测试、运维监控等各个环节。

## **Borg 简介**

Borg 是谷歌内部的大规模集群管理系统，负责对谷歌内部很多核心服务的调度和管理。Borg 的目的是让用户能够不必操心资源管理的问题，让他们专注于自己的核心业务，并且做到跨多个数据中心的资源利用率最大化。

Borg 主要由 BorgMaster、Borglet、borgcfg 和 Scheduler 组成，如下图所示

*图 4.1.1：Borg 架构*

![https://jimmysong.io/kubernetes-handbook/images/borg.png](https://jimmysong.io/kubernetes-handbook/images/borg.png)

- BorgMaster 是整个集群的大脑，负责维护整个集群的状态，并将数据持久化到 Paxos 存储中；
- Scheduer 负责任务的调度，根据应用的特点将其调度到具体的机器上去；
- Borglet 负责真正运行任务（在容器中）；
- borgcfg 是 Borg 的命令行工具，用于跟 Borg 系统交互，一般通过一个配置文件来提交任务。

## **Kubernetes 架构**

Kubernetes 借鉴了 Borg 的设计理念，比如 Pod、Service、Label 和单 Pod 单 IP 等。Kubernetes 的整体架构跟 Borg 非常像，如下图所示。

*图 4.1.2：Kubernetes 架构*

![https://jimmysong.io/kubernetes-handbook/images/architecture.png](https://jimmysong.io/kubernetes-handbook/images/architecture.png)

Kubernetes 主要由以下几个核心组件组成：

- etcd 保存了整个集群的状态；
- apiserver 提供了资源操作的唯一入口，并提供认证、授权、访问控制、API 注册和发现等机制；
- controller manager 负责维护集群的状态，比如故障检测、自动扩展、滚动更新等；
- scheduler 负责资源的调度，按照预定的调度策略将 Pod 调度到相应的机器上；
- kubelet 负责维护容器的生命周期，同时也负责 Volume（CSI）和网络（CNI）的管理；
- Container runtime 负责镜像管理以及 Pod 和容器的真正运行（CRI）；
- kube-proxy 负责为 Service 提供 cluster 内部的服务发现和负载均衡；

除了核心组件，还有一些推荐的插件，其中有的已经成为 CNCF 中的托管项目：

- CoreDNS 负责为整个集群提供 DNS 服务
- Ingress Controller 为服务提供外网入口
- Prometheus 提供资源监控
- Dashboard 提供 GUI
- Federation 提供跨可用区的集群

## **Kubernetes 架构示意图**

### **整体架构**

下图清晰表明了 Kubernetes 的架构设计以及组件之间的通信协议。

*图 4.1.3：Kuberentes 架构（图片来自于网络）*

![https://jimmysong.io/kubernetes-handbook/images/kubernetes-high-level-component-archtecture.jpg](https://jimmysong.io/kubernetes-handbook/images/kubernetes-high-level-component-archtecture.jpg)

下面是更抽象的一个视图：

*图 4.1.4：kubernetes 整体架构示意图*

![https://jimmysong.io/kubernetes-handbook/images/kubernetes-whole-arch.png](https://jimmysong.io/kubernetes-handbook/images/kubernetes-whole-arch.png)

### **Master 架构**

*图 4.1.5：Kubernetes master 架构示意图*

![https://jimmysong.io/kubernetes-handbook/images/kubernetes-master-arch.png](https://jimmysong.io/kubernetes-handbook/images/kubernetes-master-arch.png)

### **Node 架构**

*图 4.1.6：kubernetes node 架构示意图*

![https://jimmysong.io/kubernetes-handbook/images/kubernetes-node-arch.png](https://jimmysong.io/kubernetes-handbook/images/kubernetes-node-arch.png)

### **分层架构**

Kubernetes 设计理念和功能其实就是一个类似 Linux 的分层架构，如下图所示。

*图 4.1.7：Kubernetes 分层架构示意图*

![https://jimmysong.io/kubernetes-handbook/images/kubernetes-layers-arch.png](https://jimmysong.io/kubernetes-handbook/images/kubernetes-layers-arch.png)

- 核心层：Kubernetes 最核心的功能，对外提供 API 构建高层的应用，对内提供插件式应用执行环境
- 应用层：部署（无状态应用、有状态应用、批处理任务、集群应用等）和路由（服务发现、DNS 解析等）、Service Mesh（部分位于应用层）
- 管理层：系统度量（如基础设施、容器和网络的度量），自动化（如自动扩展、动态 Provision 等）以及策略管理（RBAC、Quota、PSP、NetworkPolicy 等）、Service Mesh（部分位于管理层）
- 接口层：kubectl 命令行工具、客户端 SDK 以及集群联邦
- 生态系统：在接口层之上的庞大容器集群管理调度的生态系统，可以划分为两个范畴
    - Kubernetes 外部：日志、监控、配置管理、CI/CD、Workflow、FaaS、OTS 应用、ChatOps、GitOps、SecOps 等
    - Kubernetes 内部：[CRI](https://jimmysong.io/kubernetes-handbook/concepts/cri.html)、[CNI](https://jimmysong.io/kubernetes-handbook/concepts/cni.html)、[CSI](https://jimmysong.io/kubernetes-handbook/concepts/csi.html)、镜像仓库、Cloud Provider、集群自身的配置和管理等

> 关于分层架构，可以关注下 Kubernetes 社区正在推进的 Kubernetes architectual roadmap 和 slide。
> 

# kubectl命令大全

`kubectl` 命令是操作 Kubernetes 集群的最直接和最高效的途径，这个60多 MB 大小的二进制文件，到底有啥能耐呢？

## **Kubectl 自动补全**

```
$ source <(kubectl completionbash)# setup autocomplete in bash, bash-completion package should be installed first.
$ source <(kubectl completionzsh)# setup autocomplete in zsh
```

## **Kubectl 上下文和配置**

设置 `kubectl` 命令交互的 kubernetes 集群并修改配置信息。参阅 [使用 kubeconfig 文件进行跨集群验证](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters) 获取关于配置文件的详细信息。

```
$ kubectl config view# 显示合并后的 kubeconfig 配置# 同时使用多个 kubeconfig 文件并查看合并后的配置
$ KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 kubectl config view

# 获取 e2e 用户的密码
$ kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

$ kubectl config current-context# 显示当前的上下文
$ kubectl config use-context my-cluster-name# 设置默认上下文为 my-cluster-name# 向 kubeconf 中增加支持基本认证的新集群
$ kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# 使用指定的用户名和 namespace 设置上下文
$ kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce

```

## **创建对象**

Kubernetes 的清单文件可以使用 json 或 yaml 格式定义。可以以 `.yaml`、`.yml`、或者 `.json` 为扩展名。

```
$ kubectl create -f ./my-manifest.yaml# 创建资源
$ kubectl create -f ./my1.yaml -f ./my2.yaml# 使用多个文件创建资源
$ kubectl create -f ./dir# 使用目录下的所有清单文件来创建资源
$ kubectl create -f https://git.io/vPieo# 使用 url 来创建资源
$ kubectl run nginx --image=nginx# 启动一个 nginx 实例
$ kubectl explain pods,svc# 获取 pod 和 svc 的文档# 从 stdin 输入中创建多个 YAML 对象
$ cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# 创建包含几个 key 的 Secret
$ cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo "s33msi4" | base64)
  username: $(echo "jane" | base64)
EOF

```

## **显示和查找资源**

```
# Get commands with basic output
$ kubectl get services# 列出所有 namespace 中的所有 service
$ kubectl get pods --all-namespaces# 列出所有 namespace 中的所有 pod
$ kubectl get pods -o wide# 列出所有 pod 并显示详细信息
$ kubectl get deployment my-dep# 列出指定 deployment
$ kubectl get pods --include-uninitialized# 列出该 namespace 中的所有 pod 包括未初始化的# 使用详细输出来描述命令
$ kubectl describe nodes my-node
$ kubectl describe pods my-pod

$ kubectl get services --sort-by=.metadata.name# List Services Sorted by Name# 根据重启次数排序列出 pod
$ kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# 获取所有具有 app=cassandra 的 pod 中的 version 标签
$ kubectl get pods --selector=app=cassandra rc -o \
  jsonpath='{.items[*].metadata.labels.version}'

# 获取所有节点的 ExternalIP
$ kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# 列出属于某个 PC 的 Pod 的名字# “jq”命令用于转换复杂的 jsonpath，参考 https://stedolan.github.io/jq/
$ sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
$ echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})# 查看哪些节点已就绪
$ JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" |grep "Ready=True"

# 列出当前 Pod 中使用的 Secret
$ kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' |grep -v null |sort |uniq
```

## **更新资源**

```
$ kubectl rolling-update frontend-v1 -f frontend-v2.json# 滚动更新 pod frontend-v1
$ kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2# 更新资源名称并更新镜像
$ kubectl rolling-update frontend --image=image:v2# 更新 frontend pod 中的镜像
$ kubectl rolling-update frontend-v1 frontend-v2 --rollback# 退出已存在的进行中的滚动更新
$cat pod.json | kubectl replace -f -# 基于 stdin 输入的 JSON 替换 pod# 强制替换，删除后重新创建资源。会导致服务中断。
$ kubectl replace --force -f ./pod.json

# 为 nginx RC 创建服务，启用本地 80 端口连接到容器上的 8000 端口
$ kubectl expose rc nginx --port=80 --target-port=8000

# 更新单容器 pod 的镜像版本（tag）到 v4
$ kubectl get pod mypod -o yaml |sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

$ kubectl label pods my-pod new-label=awesome# 添加标签
$ kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq# 添加注解
$ kubectl autoscale deployment foo --min=2 --max=10# 自动扩展 deployment “foo”
```

## **修补资源**

使用策略合并补丁并修补资源。

```
$ kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'# 部分更新节点# 更新容器镜像； spec.containers[*].name 是必须的，因为这是合并的关键字
$ kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# 使用具有位置数组的 json 补丁更新容器镜像
$ kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# 使用具有位置数组的 json 补丁禁用 deployment 的 livenessProbe
$ kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

```

## **编辑资源**

在编辑器中编辑任何 API 资源。

```
$ kubectl edit svc/docker-registry# 编辑名为 docker-registry 的 service
$ KUBE_EDITOR="nano" kubectl edit svc/docker-registry# 使用其它编辑器
```

## **Scale 资源**

```
$ kubectl scale --replicas=3 rs/foo# Scale a replicaset named 'foo' to 3
$ kubectl scale --replicas=3 -f foo.yaml# Scale a resource specified in "foo.yaml" to 3
$ kubectl scale --current-replicas=2 --replicas=3 deployment/mysql# If the deployment named mysql's current size is 2, scale mysql to 3
$ kubectl scale --replicas=5 rc/foo rc/bar rc/baz# Scale multiple replication controllers
```

## **删除资源**

```
$ kubectl delete -f ./pod.json# 删除 pod.json 文件中定义的类型和名称的 pod
$ kubectl delete pod,service baz foo# 删除名为“baz”的 pod 和名为“foo”的 service
$ kubectl delete pods,services -l name=myLabel# 删除具有 name=myLabel 标签的 pod 和 serivce
$ kubectl delete pods,services -l name=myLabel --include-uninitialized# 删除具有 name=myLabel 标签的 pod 和 service，包括尚未初始化的
$ kubectl -n my-ns delete po,svc --all# 删除 my-ns namespace 下的所有 pod 和 serivce，包括尚未初始化的
```

## **与运行中的 Pod 交互**

```
$ kubectl logs my-pod# dump 输出 pod 的日志（stdout）
$ kubectl logs my-pod -c my-container# dump 输出 pod 中容器的日志（stdout，pod 中有多个容器的情况下使用）
$ kubectl logs -f my-pod# 流式输出 pod 的日志（stdout）
$ kubectl logs -f my-pod -c my-container# 流式输出 pod 中容器的日志（stdout，pod 中有多个容器的情况下使用）
$ kubectl run -i --tty busybox --image=busybox --sh# 交互式 shell 的方式运行 pod
$ kubectl attach my-pod -i# 连接到运行中的容器
$ kubectl port-forward my-pod 5000:6000# 转发 pod 中的 6000 端口到本地的 5000 端口
$ kubectl exec my-pod --ls /# 在已存在的容器中执行命令（只有一个容器的情况下）
$ kubectl exec my-pod -c my-container --ls /# 在已存在的容器中执行命令（pod 中有多个容器的情况下）
$ kubectltop pod POD_NAME --containers# 显示指定 pod 和容器的指标度量
```

## **与节点和集群交互**

```
$ kubectl cordon my-node# 标记 my-node 不可调度
$ kubectl drain my-node# 清空 my-node 以待维护
$ kubectl uncordon my-node# 标记 my-node 可调度
$ kubectltop node my-node# 显示 my-node 的指标度量
$ kubectl cluster-info# 显示 master 和服务的地址
$ kubectl cluster-info dump# 将当前集群状态输出到 stdout
$ kubectl cluster-info dump --output-directory=/path/to/cluster-state# 将当前集群状态输出到 /path/to/cluster-state# 如果该键和影响的污点（taint）已存在，则使用指定的值替换
$ kubectl taint nodes foo dedicated=special-user:NoSchedule

```

## **资源类型**

下表列出的是 kubernetes 中所有支持的类型和缩写的别名。

| 资源类型 | 缩写别名 |
| --- | --- |
| clusters |  |
| componentstatuses | cs |
| configmaps | cm |
| daemonsets | ds |
| deployments | deploy |
| endpoints | ep |
| event | ev |
| horizontalpodautoscalers | hpa |
| ingresses | ing |
| jobs |  |
| limitranges | limits |
| namespaces | ns |
| networkpolicies |  |
| nodes | no |
| statefulsets |  |
| persistentvolumeclaims | pvc |
| persistentvolumes | pv |
| pods | po |
| podsecuritypolicies | psp |
| podtemplates |  |
| replicasets | rs |
| replicationcontrollers | rc |
| resourcequotas | quota |
| cronjob |  |
| secrets |  |
| serviceaccount | sa |
| services | svc |
| storageclasses |  |
| thirdpartyresources |  |

### **格式化输出**

要以特定的格式向终端窗口输出详细信息，可以在 `kubectl` 命令中添加 `-o` 或者 `-output` 标志。

| 输出格式 | 描述 |
| --- | --- |
| -o=custom-columns=<spec> | 使用逗号分隔的自定义列列表打印表格 |
| -o=custom-columns-file=<filename> | 使用 文件中的自定义列模板打印表格 |
| -o=json | 输出 JSON 格式的 API 对象 |
| -o=jsonpath=<template> | 打印 https://kubernetes.io/docs/user-guide/jsonpath 表达式中定义的字段 |
| -o=jsonpath-file=<filename> | 打印由 文件中的 https://kubernetes.io/docs/user-guide/jsonpath 表达式定义的字段 |
| -o=name | 仅打印资源名称 |
| -o=wide | 以纯文本格式输出任何附加信息，对于 Pod ，包含节点名称 |
| -o=yaml | 输出 YAML 格式的 API 对象 |

### **Kubectl 详细输出和调试**

使用 `-v` 或 `--v` 标志跟着一个整数来指定日志级别。

| 详细等级 | 描述 |
| --- | --- |
| --v=0 | 总是对操作人员可见。 |
| --v=1 | 合理的默认日志级别，如果您不需要详细输出。 |
| --v=2 | 可能与系统的重大变化相关的，有关稳定状态的信息和重要的日志信息。这是对大多数系统推荐的日志级别。 |
| --v=3 | 有关更改的扩展信息。 |
| --v=4 | 调试级别详细输出。 |
| --v=6 | 显示请求的资源。 |
| --v=7 | 显示HTTP请求的header。 |
| --v=8 | 显示HTTP请求的内容。 |