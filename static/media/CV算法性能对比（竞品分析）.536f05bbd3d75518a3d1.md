# CV算法性能对比（竞品分析）

# BML单图单标签图像分类

1. 使用参数：
    1. 数据集：imagenet_2600，共2500张
    2. 网络：百度超大规模数据集 、ResNet50_vd
    3. 框架版本：PaddlePaddle 1.8.4
    4. GPU：TeslaGPU_P4_8G显存单卡_12核CPU_40G内存
    5. 节点数：4
    6. inputsize：640，640
    7. batchsize：8
    8. epochs：20
    9. lr：0.01
2. 测试结果：
    1. accuracy：4.3%
    2. F1-score：0.4%
    3. precision：0.2%
    4. recall：2.8%

# SPE图像多分类

1. 使用参数：
    1. 数据集：imagenet_2600，共2550张
    2. 网络：MULTI_CLS_ResNet-50_imagenet
    3. 框架版本：Parrots
    4. GPU：V100
    5. 节点数：8
    6. inputsize：？
    7. batchsize：8
    8. epochs：20
    9. lr：0.01
2. 测试结果：
    1. accuracy：95.29%
    2. F1-score：95.373%
    3. precision：95.497%
    4. recall：95.78%

# BML 目标检测

1. 使用参数
    1. 数据集：coco_5000，标签集65个，实际数据量4853个。
    2. 网络：（公开数据集）RetinaNet_R50_FPN
    3. 框架版本：PaddlePaddle 1.8.4
    4. InputSize：800，1333
    5. BatchSize：2
    6. Epochs：20
    7. BaseLearningRate：0.001
    8. 运行环境：GPU P4 TeslaGPU_P4_8G显存单卡_12核CPU_40G内存
    9. 计算节点数：4
2. 训练结果
    1. mAP：47.4%
    2. precision：72.1%
    3. recall：44.7%
    4. 建议阈值：0.6（F1-score：55%）
    5. 训练时长：2小时39分钟

# SPE 目标检测

1. 使用参数
    1. 数据集：coco_5000，实际4854个。
    2. 预训练模型：DET_RetinaNet_ResNet-50_coco
    3. inpusize：800，1333
    4. batchsize：2
    5. epochs：20
    6. lr：0.01
    7. GPU：V100
    8. 节点数：8
2. 训练结果：
    1. mAP_0.05：40.19%
    2. precision：4.12%
    3. recall：67.134%
    4. f1-score：7.656%
    5. 阈值：0.05
    6. 训练时长：51分

---

# BML 实例分割

1. **使用的参数：**
    1. 数据集：coco_5000，标签集65个，实际数据量4853个。
    2. 网络：（公开数据集）Mask_RCNN_R50_vd_FPN
    3. 框架版本：PaddlePaddle 1.8.4
    4. InputSize：800，1333
    5. BatchSize：2
    6. Epochs：20
    7. BaseLearningRate：0.001
    8. 运行环境：GPU P4，TeslaGPU_P4_8G显存单卡_12核CPU_40G内存
    9. 计算节点数：4
2. **训练结果：**
    1. mAP：50.9%
    2. precision：72.6%
    3. recall：49.1%
    4. 建议阈值：0.6（F1-score：59%）
    5. 训练时长：2小时11分钟

# SPE 实例分割

1. **使用的参数：**
    1. 数据集：coco_5000，实际数据量4854个。
    2. 网络：SEGM_Mask_R-CNN_ResNet-50_D8_coco
    3. 框架版本：Parrots
    4. InputSize：800，1333
    5. BatchSize：2
    6. Epochs：20
    7. BaseLearningRate：0.001
    8. 运行环境：V100
    9. 计算节点数：8
2. **训练结果：**
    1. bbox_mAP：39.98%
    2. mask_mAP：38.45%
    3. precision：11.487%
    4. recall：60.738%
    5. 阈值：0.05
    6. 训练时长：1小时23分钟