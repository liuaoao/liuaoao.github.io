# openapi-diff

# 参考：

[https://github.com/OpenAPITools/openapi-diff](https://github.com/OpenAPITools/openapi-diff)

[https://hub.docker.com/r/openapitools/openapi-diff/](https://hub.docker.com/r/openapitools/openapi-diff/)

# 背景

SPE项目中接口众多，每个版本接口都有变化，对接口自动化带来很大挑战，每次更新版本都要人工比对每个接口有什么变化，工作量大效率低。为此调研之后可以使用openapi-diff工具比较两个版本接口之间的变化。可以之间安装openapi-diff工具也可以使用官方提供的openapi-diff docker镜像，本文使用的是docker镜像。

# 具体步骤

1、拉取镜像

`docker pull openapitools/openapi-diff`

2、在服务器上创建存放接口文档的目录

![Untitled](openapi-diff%20e8858922575c4e40a437e7303c4d4138/Untitled.png)

创建接口文档目录/home/sensetime/zhangqinfu/openapi

old.json：旧版本接口文档

new.json：新版本接口文档

3、执行命令输出比较结果

- shell result
    
    ```bash
    sensetime@host-192-168-10-79:~/zhangqinfu/openapi$ docker run --rm -t -v /home/sensetime/zhangqinfu/openapi:/specs openapitools/openapi-diff:latest /specs/old.json /specs/new.json --html /specs/result.html
    ==========================================================================
    ==                            API CHANGE LOG                            ==
    ==========================================================================
    null
    --------------------------------------------------------------------------
    --                              What's New                              --
    --------------------------------------------------------------------------
    - POST   /api/v1/inner/deep_learning
    - POST   /api/v1/training/tasks/training/automl
     
    --------------------------------------------------------------------------
    --                            What's Deleted                            --
    --------------------------------------------------------------------------
    - POST   /api/v1/inner/deepLearning
    - GET    /api/v1/inner/deepLearning/:threshold
    - POST   /api/v1/task/id:{id}/_enable_model
    - POST   /api/v1/training_debug/debugs
    - POST   /api/v1/training_debug/debugs/_currentdoing
    - GET    /api/v1/training_debug/debugs/id:{training_debug_id}
    - PUT    /api/v1/training_debug/debugs/id:{training_debug_id}
    - POST   /api/v1/training_debug/debugs/id:{training_debug_id}/_download
    - POST   /api/v1/training_debug/debugs/id:{training_debug_id}/_reset
    - PUT    /api/v1/training_debug/debugs/id:{training_debug_id}/step/id:{step}
    - GET    /api/v1/training_debug/debugs/id:{training_debug_id}/steps/id:{training_debug_policy_step}
    - GET    /api/v1/training_debug/policies
    - GET    /api/v1/training_debug/policies/id:{policy_id}/steps
    - GET    /api/v1/training_debug/policies/id:{policy_id}/steps/id:{policy_step}
     
    --------------------------------------------------------------------------
    --                            What's Changed                            --
    --------------------------------------------------------------------------
    - POST   /api/v1/inner/component/_upload
      Request:
            - Changed application/json
              Schema: Broken compatibility
              Changed property type: wanna_replace_component_id (array -> string)
    - POST   /api/v1/training/tasks
      Request:
            - Changed application/json
              Schema: Backward compatible
    - POST   /api/v1/training/tasks/_filter
      Return Type:
        - Changed 200 OK
          Media types:
            - Changed application/json
              Schema: Broken compatibility
              Missing property: duration (integer)
    - POST   /api/v1/training/tasks/trainingid:{training_id}/versions/versionid:{training_version_id}/_rerun
      Request:
            - Changed application/json
              Schema: Backward compatible
    --------------------------------------------------------------------------
    --                                Result                                --
    --------------------------------------------------------------------------
                     API changes broke backward compatibility                
    --------------------------------------------------------------------------
    ```
    

命令：docker run --rm -t -v /home/sensetime/zhangqinfu/[openapi:/specs openapitools/openapi-diff:latest](http://openapi/specs%20openapitools/openapi-diff:latest) /specs/old.json /specs/new.json --html /specs/result.html

/home/sensetime/zhangqinfu/[openapi](http://openapi/specs%20openapitools/openapi-diff:latest)：为宿主机上api接口文档的目录

[/specs](http://openapi/specs%20openapitools/openapi-diff:latest)：容器中接口文档的目录（可以随意指定）

[openapitools/openapi-diff:latest](http://openapi/specs%20openapitools/openapi-diff:latest)  openapi-diff的镜像

/specs/old.json：旧版本接口文档

/specs/new.json：新版本接口文档

/specs/result.html：比较的结果生成的文件（注意这是容器里面的文件，因为启动容器使用-v把宿主机的/home/sensetime/zhangqinfu/[openapi](http://openapi/specs%20openapitools/openapi-diff:latest)目录映射到容器的/specs目录了，所以可以在宿主机的/home/sensetime/zhangqinfu/[openapi](http://openapi/specs%20openapitools/openapi-diff:latest)目录下看到生成的result.html）

# attenttion

1. 需要符合openapi格式的json文件，yapi的话，需要导出swaggerjson格式的