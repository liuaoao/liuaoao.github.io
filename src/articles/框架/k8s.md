# k8s

# Helm包管理

## helm

Helm 可以帮助我们管理 Kubernetes 应用程序 - Helm Charts 可以定义、安装和升级复杂的 Kubernetes 应用程序，Charts 包很容易创建、版本管理、分享和分布。Helm 对于 Kubernetes 来说就相当于 yum 对于 Centos 来说

一旦 Helm 客户端准备成功后，我们就可以添加一个 chart 仓库，当然最常用的就是官方的 Helm stable charts 仓库，但是由于官方的 charts 仓库地址需要科学上网，我们可以使用微软的 charts 仓库代替：

```bash
# 添加charts仓库
$ helm repo add stable http://mirror.azure.cn/kubernetes/charts/

# 查看仓库列表
$ helm repo list
NAME            URL
stable          http://mirror.azure.cn/kubernetes/charts/

# 搜索仓库中stable字段的chart
$ helm search repo stable

# 更新repo
$ helm repo update

# 安装一个应用mysql，并指定随机名称。我们将安装成功的这个应用叫做一个 release
$ helm install stable/mysql --generate-name
NAME: mysql-1575619811
LAST DEPLOYED: Fri Dec  6 16:10:14 2019
NAMESPACE: default
STATUS: deployed
REVISION: 1                  

# 我们将安装成功的这个应用叫做一个 release
$ kubectl get all -l release=mysql-1575619811
NAME                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/mysql-1575619811-8479b5b796   1         1         0       27m

# 查看chart的一些特性
$ helm show chart stable/mysql

# 查看chart的全部特性
$ helm show all stable/mysql

# 同样我们也可以用 Helm 很容易查看到已经安装的 release：
$ helm ls
NAME                NAMESPACE   REVISION    UPDATED                                 STATUS      CHART       APP VERSION
mysql-1575619811    default     1           2019-12-06 16:10:14.682302 +0800 CST    deployed    mysql-1.5.0 5.7.27

# 删除release使用uninstall
 $ helm uninstall mysql-1575619811
release "mysql-1575619811" uninstalled
$ kubectl get all -l release=mysql-1575619811
No resources found.
$ helm status mysql-1575619811
Error: release: not found
$ helm ls -a
```

定制chart包

```jsx
# 使用 helm show values 命令来查看一个 chart 包的所有可配置的参数选项
$ helm show values stable/mysql
## mysql image version
## ref: https://hub.docker.com/r/library/mysql/tags/
##
image: "mysql"
imageTag: "5.7.14"

busybox:
  image: "busybox"
  tag: "1.29.3"

testFramework:
  enabled: true
  image: "dduportal/bats"
  tag: "0.4.0"
.......
# 上面我们看到的所有参数都是可以用自己的数据来覆盖的，
# 可以在安装的时候通过 YAML 格式的文件来传递这些参数：
$ cat config.yaml
mysqlUser:
  user0
mysqlPassword: user0pwd
mysqlDatabase: user0db
persistence:
  enabled: false
$ helm install -f config.yaml stable/mysql
helm install -f config.yaml mysql stable/mysql
NAME: mysql
LAST DEPLOYED: Fri Dec  6 17:46:56 2019
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
MySQL can be accessed via port 3306 on the following DNS name from within your cluster:
mysql.default.svc.cluster.local
......
# 我们可以使用 helm get values 来查看新设置是否生效：
$ helm get values mysql
USER-SUPPLIED VALUES:
mysqlDatabase: user0db
mysqlPassword: user0pwd
mysqlRootPassword: passw0rd
mysqlUser: user0
persistence:
  enabled: false
```

`helm install` 命令可以从多个源进行安装：

- chart 仓库（类似于上面我们提到的）
- 本地 chart 压缩包（helm install foo-0.1.1.tgz）
- 本地解压缩的 chart 目录（helm install foo path/to/foo）
- 在线的 URL（helm install fool https://example.com/charts/foo-1.2.3.tgz）

## charts

Helm 使用一种名为 charts 的包格式，一个 chart 是描述一组相关的 Kubernetes 资源的文件集合，单个 chart 可能用于部署简单的应用，比如 memcached pod，或者复杂的应用，比如一个带有 HTTP 服务、数据库、缓存等等功能的完整 web 应用程序。

文件结构：

```jsx
wordpress/
  Chart.yaml          # 包含当前 chart 信息的 YAML 文件
  LICENSE             # 可选：包含 chart 的 license 的文本文件
  README.md           # 可选：一个可读性高的 README 文件
  values.yaml         # 当前 chart 的默认配置 values
  values.schema.json  # 可选: 一个作用在 values.yaml 文件上的 JSON 模式
  charts/             # 包含该 chart 依赖的所有 chart 的目录
  crds/               # Custom Resource Definitions
  templates/          # 模板目录，与 values 结合使用时，将渲染生成 Kubernetes 资源清单文件
  templates/NOTES.txt # 可选: 包含简短使用使用的文本文件
```

Chart.yaml

```jsx
apiVersion: chart API 版本 (必须)
name: chart 名 (必须)
version: SemVer 2版本 (必须)
kubeVersion: 兼容的 Kubernetes 版本 (可选)
description: 一句话描述 (可选)
type: chart 类型 (可选)
keywords:
  - 当前项目关键字集合 (可选)
home: 当前项目的 URL (可选)
sources:
  - 当前项目源码 URL (可选)
dependencies: # chart 依赖列表 (可选)
  - name: chart 名称 (nginx)
    version: chart 版本 ("1.2.3")
    repository: 仓库地址 ("https://example.com/charts")
maintainers: # (可选)
  - name: 维护者名字 (对每个 maintainer 是必须的)
    email: 维护者的 email (可选)
    url: 维护者 URL (可选)
icon: chart 的 SVG 或者 PNG 图标 URL (可选).
appVersion: 包含的应用程序版本 (可选). 不需要 SemVer 版本
deprecated: chart 是否已被弃用 (可选, boolean)
```