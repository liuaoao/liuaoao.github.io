# CV算法简述

场景：二分类、多分类、目标检测、实例分割、语义分割、OCR、检测分类组合

语义分割：就是把图像中每个像素赋予一个类别标签（比如汽车、建筑、地面、天空等），比如下图就把图像分为了草地（浅绿）、人（红色）、树木（深绿）、天空（蓝色）等标签，用不同的颜色来表示。语义分割只能判断类别，无法区分个体。

实例分割：方式有点类似于物体检测，不过物体检测一般输出的是bounding box，实例分割输出的是一个mask。

检测分类组合：在样本图片中识别出某一个物体的粗略属性及位置，并进一步给出详细分类属性

![Untitled](CV%E7%AE%97%E6%B3%95%E7%AE%80%E8%BF%B0%20ad01f3bb44194237a8178f7f1503dd7a/Untitled.png)