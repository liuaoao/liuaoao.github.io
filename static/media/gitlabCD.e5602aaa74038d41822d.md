# gitlab CD

CI，Continuous Integration，为持续集成。即在代码构建过程中持续地进行代码的集成、构建、以及自动化测试等；有了 CI 工具，我们可以在代码提交的过程中通过单元测试等尽早地发现引入的错误；

CD，Continuous Deployment，为持续交付。在代码构建完毕后，可以方便地将新版本部署上线，这样有利于快速迭代并交付产品。

来自 <[https://blog.stdioa.com/2018/06/gitlab-cicd-fundmental/](https://blog.stdioa.com/2018/06/gitlab-cicd-fundmental/)>

下面针对 Gitlab CI 平台的一些基本概念做一个简单介绍：

Job

Job 为任务，是 GitLab CI 系统中可以独立控制并运行的最小单位。

在提交代码后，开发者可以针对特定的 commit 完成一个或多个 job，从而进行 CI/CD 操作。

Pipeline

Pipeline 即流水线，可以像流水线一样执行多个 Job.

在代码提交或 MR 被合并时，GitLab 可以在最新生成的 commit 上建立一个 pipeline，在同一个 pipeline 上产生的多个任务中，所用到的代码版本是一致的。

Stage

一般的流水线通常会分为几段；在 pipeline 中，可以将多个任务划分在多个阶段中，只有当前一阶段的所有任务都执行成功后，下一阶段的任务才可被执行。

注：如果某一阶段的任务均被设定为“允许失败”，那这个阶段的任务执行情况，不会影响到下一阶段的执行。