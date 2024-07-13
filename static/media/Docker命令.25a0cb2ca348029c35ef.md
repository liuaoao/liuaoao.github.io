# Docker命令

[基本操作 - K8S训练营](https://www.qikqiak.com/k8strain/docker/basic/)

# 基本操作

1. docker ps 查看运行的容器
2. docker image 查看镜像列表
3. 删除镜像：docker rmi -f cherishpf/python3-java8:1.0
4. 导出镜像：docker save nginx >/tmp/nginx.tar.gz
5. 后台运行docker：docker run -d {docker}:{tag} —name {指定的docker名称}
6. 启动：docker start
7. 停止：docker stop
8. 获取容器的ip地址：docker inspect webserver |grep IPAddress
9. 绑定port：
    
    $ docker rm -f webserver
    $ docker run --name webserver -d -p 80:80 nginx
    
    `-p 8080:80`，这个参数的意思是将宿主机的 8080 端口和容器的 80 端口进行绑定，这样我们就可以通过宿主机的 8080 端口来访问容器服务了。
    
10. 进入容器内部：docker exec -it docker_bri /bin/sh
11. 网络：
    1. 创建一个自定义网络：$ docker network create -d bridge my-net
    2. 使用自定义的网络运行容器：$ docker run -it --rm --name busybox1 --network my-net busybox sh（再创建一个容器的话，这两个容器都在一个自定义网络、就可以实现互联）
    3. host模型：运行容器的时候指定—net=host即可
    4. container模型：指定—net=container:目标容器名即可。k8s里的pod中容器之间就是通过container模式链接到pause容器上面的
12. 数据共享与持久化：
    1. 创建数据卷：$ docker volume create my-vol
    2. 查看数据卷：$ docker volume ls
    3. 查看数据卷信息：$ docker volume inspect my-vol
    4. 启动一个挂载数据卷的容器：在用`docker run`命令的时候，使用`--mount`或者`-v`标记来将`数据卷`挂载到容器里。$ docker run -d -p 8080:80 --name web -v my-vol:/usr/share/nginx/html nginx。运行后可以查看到数据卷目录下存在文件：$ ls /data/docker/volumes/my-vol/_data/

1. example：
    1. 启动测试容器：docker run -d --name zqftest [registry.sensetime.com/parrots-os/deployrunner:T4_v0.1.0](http://registry.sensetime.com/parrots-os/deployrunner:T4_v0.1.0)
    2. 启动测试容器，并把整个目录数据拷贝进去：docker run -d --name zqftest -v /home/yangyutian:/home/zqf [registry.sensetime.com/parrots-os/deployrunner:T4_v0.1.0](http://registry.sensetime.com/parrots-os/deployrunner:T4_v0.1.0)
    3. 进入容器：docker exec -it zqftest /bin/bash 
    4. docker cp ./detect_small_v8.zip zqftest:/home 从宿主机上拷贝文件到容器
    5. docker rm -f [name]删除
    6. exit退出容器
    
    守护态运行，需要加参数-d，例如 docker run -d -p 8080:8080 kochetkovma/allure-server:latest
    
    守护态运行的STDOUT需要用docker logs [container_id]来查看
    

# Dockerfile

1. `RUN` 指令是用来执行命令行命令的。由于命令行的强大能力，所以 `RUN` 指令是定制镜像时是最常用的指令之一。其格式有两种：
    1. shell 格式：`RUN <命令>`，
    2. exec 格式：`RUN ["可执行文件", "参数1", "参数2"]`
2.