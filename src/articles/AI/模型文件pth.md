# 模型文件pth

## 一、.pth 文件详解

在pytorch进行模型保存的时候，一般有两种保存方式，一种是保存整个模型，另一种是只保存模型的参数。

torch.save(model.state_dict(), "my_model.pth") # 只保存模型的参数

torch.save(model, "my_model.pth") # 保存整个模型

保存的模型参数实际上一个字典类型，通过key-value的形式来存储模型的所有参数，本文以自己在实践过程中使用的一个.pth文件为例来说明，使用的是整个模型。