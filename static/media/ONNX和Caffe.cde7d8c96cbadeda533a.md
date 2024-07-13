# ONNX和Caffe

# ONNX

## **什么是ONNX？**

简单描述一下官方介绍，开放神经网络交换（Open Neural Network Exchange）简称ONNX是微软和Facebook提出用来表示深度学习模型的**开放**格式。所谓开放就是ONNX定义了一组和环境，平台均无关的标准格式，来增强各种AI模型的可交互性。

换句话说，无论你使用何种训练框架训练模型（比如TensorFlow/Pytorch/OneFlow/Paddle），在训练完毕后你都可以将这些框架的模型统一转换为ONNX这种统一的格式进行存储。注意ONNX文件不仅仅存储了神经网络模型的权重，同时也存储了模型的结构信息以及网络中每一层的输入输出和一些其它的辅助信息。我们直接从onnx的官方模型仓库拉一个yolov3-tiny的onnx模型（地址为：`https://github.com/onnx/models/tree/master/vision/object_detection_segmentation/tiny-yolov3/model`）用Netron可视化一下看看ONNX模型长什么样子。

这里我们可以看到ONNX的版本信息，这个ONNX模型是由Keras导出来的，以及模型的输入输出等信息，如果你对模型的输入输出有疑问可以直接看：`https://github.com/onnx/models/blob/master/vision/object_detection_segmentation/tiny-yolov3/README.md`。

在获得ONNX模型之后，模型部署人员自然就可以将这个模型部署到兼容ONNX的运行环境中去。这里一般还会设计到额外的模型转换工作，典型的比如在Android端利用NCNN部署ONNX格式模型，那么就需要将ONNX利用NCNN的转换工具转换到NCNN所支持的`bin`和`param`格式。

但在实际使用ONNX的过程中，大多数人对ONNX了解得并不多，仅仅认为它只是一个完成模型转换和部署工具人而已，我们可以利用它完成模型转换和部署。正是因为对ONNX的不了解，在模型转换过程中出现的各种不兼容或者不支持让很多人浪费了大量时间。这篇文章将从理论和实践2个方面谈一谈ONNX。

## **ProtoBuf简介**

在分析ONNX组织格式前我们需要了解Protobuf, 如果你比较了解Protobuf可以略过此节。 ONNX作为一个文件格式，我们自然需要一定的规则去读取我们想要的信息或者是写入我们需要保存信息。ONNX使用的是Protobuf这个序列化数据结构去存储神经网络的权重信息。熟悉Caffe或者Caffe2的同学应该知道，它们的模型存储数据结构协议也是Protobuf。这个从安装ONNX包的时候也可以看到：安装onnx时依赖了protobuf

Protobuf是一种轻便高效的结构化数据存储格式，可以用于结构化数据串行化，或者说序列化。它很适合做数据存储或数据交换格式。可用于通讯协议、数据存储等领域的语言无关、平台无关、可扩展的序列化结构数据格式。目前提供了 C++、Java、Python 三种语言的 API（摘自官方介绍）。

Protobuf协议是一个以`*.proto`后缀文件为基础的，这个文件描述了用户自定义的数据结构。如果需要了解更多细节请参考0x7节的资料3，这里只是想表达ONNX是基于Protobuf来做数据存储和传输，那么自然`onnx.proto`就是ONNX格式文件了，接下来我们就分析一下ONNX格式。

## **ONNX格式分析**

这一节我们来分析一下ONNX的组织格式，上面提到ONNX中最核心的部分就是`onnx.proto`（`https://github.com/onnx/onnx/blob/master/onnx/onnx.proto`）这个文件了，它定义了ONNX这个数据协议的规则和一些其它信息。现在是2021年1月，这个文件有700多行，我们没有必要把这个文件里面的每一行都贴出来，我们只要搞清楚里面的核心部分即可。在这个文件里面以`message`关键字开头的对象是我们需要关心的。我们列一下最核心的几个对象并解释一下它们之间的关系。

- `ModelProto`
- `GraphProto`
- `NodeProto`
- `ValueInfoProto`
- `TensorProto`
- `AttributeProto`

当我们加载了一个ONNX之后，我们获得的就是一个`ModelProto`，它包含了一些版本信息，生产者信息和一个`GraphProto`。在`GraphProto`里面又包含了四个`repeated`数组，它们分别是`node`(`NodeProto`类型)，`input`(`ValueInfoProto`类型)，`output`(`ValueInfoProto`类型)和`initializer`(`TensorProto`类型)，其中`node`中存放了模型中所有的计算节点，`input`存放了模型的输入节点，`output`存放了模型中所有的输出节点，`initializer`存放了模型的所有权重参数。

我们知道要完整的表达一个神经网络，不仅仅要知道网络的各个节点信息，还要知道它们的拓扑关系。这个拓扑关系在ONNX中是如何表示的呢？ONNX的每个计算节点都会有`input`和`output`两个数组，这两个数组是string类型，通过`input`和`output`的指向关系，我们就可以利用上述信息快速构建出一个深度学习模型的拓扑图。这里要注意一下，`GraphProto`中的`input`数组不仅包含我们一般理解中的图片输入的那个节点，还包含了模型中所有的权重。例如，`Conv`层里面的`W`权重实体是保存在`initializer`中的，那么相应的会有一个同名的输入在`input`中，其背后的逻辑应该是把权重也看成模型的输入，并通过`initializer`中的权重实体来对这个输入做初始化，即一个赋值的过程。

最后，每个计算节点中还包含了一个`AttributeProto`数组，用来描述该节点的属性，比如`Conv`节点或者说卷积层的属性包含`group`，`pad`，`strides`等等，每一个计算节点的属性，输入输出信息都详细记录在`https://github.com/onnx/onnx/blob/master/docs/Operators.md`。

## **onnx.helper**

现在我们知道ONNX是把一个网络的每一层或者说一个算子当成节点`node`，使用这些`Node`去构建一个`Graph`，即一个网络。最后将`Graph`和其它的生产者信息，版本信息等合并在一起生成一个`Model`，也即是最终的ONNX模型文件。 在构建ONNX模型的时候，`https://github.com/onnx/onnx/blob/master/onnx/helper.py`这个文件非常重要，我们可以利用它提供的`make_node`，`make_graph`，`make_tensor`等等接口完成一个ONNX模型的构建，一个示例如下：

`import onnx
from onnx import helper
from onnx import AttributeProto, TensorProto, GraphProto

# The protobuf definition can be found here:
# https://github.com/onnx/onnx/blob/master/onnx/onnx.proto

# Create one input (ValueInfoProto)
X = helper.make_tensor_value_info('X', TensorProto.FLOAT, [3, 2])
pads = helper.make_tensor_value_info('pads', TensorProto.FLOAT, [1, 4])

value = helper.make_tensor_value_info('value', AttributeProto.FLOAT, [1])

# Create one output (ValueInfoProto)
Y = helper.make_tensor_value_info('Y', TensorProto.FLOAT, [3, 4])

# Create a node (NodeProto) - This is based on Pad-11
node_def = helper.make_node(
    'Pad', # node name
    ['X', 'pads', 'value'], # inputs
    ['Y'], # outputs
    mode='constant', # attributes
)

# Create the graph (GraphProto)
graph_def = helper.make_graph(
    [node_def],
    'test-model',
    [X, pads, value],
    [Y],
)

# Create the model (ModelProto)
model_def = helper.make_model(graph_def, producer_name='onnx-example')

print('The model is:\n{}'.format(model_def))
onnx.checker.check_model(model_def)
print('The model is checked!')`

这个官方示例为我们演示了如何使用`onnx.helper`的`make_tensor`，`make_tensor_value_info`，`make_attribute`，`make_node`，`make_graph`，`make_node`等方法来完整构建了一个ONNX模型。需要注意的是在上面的例子中，输入数据是一个一维Tensor，初始维度为`[2]`，这也是为什么经过维度为`[1,4]`的Pad操作之后获得的输出Tensor维度为`[3,4]`。另外由于Pad操作是没有带任何权重信息的，所以当你打印ONNX模型时，`ModelProto`的`GraphProto`是没有`initializer`这个属性的。

## **onnx-simplifier**

原本这里是要总结一些使用ONNX进行模型部署经常碰到一些因为版本兼容性，或者各种框架OP没有对齐等原因导致的各种BUG。但是这样会显得文章很长，所以这里以一个经典的Pytorch转ONNX的reshape问题为例子，来尝试讲解一下大老师的onnx-simplifier是怎么处理的，个人认为这个问题是基于ONNX进行模型部署最经典的问题。希望在解决这个问题的过程中大家能有所收获。

综上，**我们在导出ONNX模型的一般流程就是，去掉后处理，尽量不引入自定义OP，然后导出ONNX模型，并过一遍大老师的`https://github.com/daquexian/onnx-simplifier`，这样就可以获得一个精简的易于部署的ONNX模型**。从ONNX官方仓库提供的模型来看，似乎微软真的想用ONNX来统一所有框架的所有操作。但理想很丰满，现实很骨干，各种训练框架的数据排布，OP实现不一致，人为后处理不一致，各种推理框架支持度不一致，推理芯片SDK的OP支持度不一致都让这个ONNX（万能格式）遭遇了困难，所以在基于ONNX做一些部署业务的时候，也要有清晰的判断并选取风险最小的方法。

## **ONNX or Caffe？**

这个问题其实源于之前做模型转换和基于TensorRT部署一些模型时候的思考。我们还是以Pytorch为例，要把Pytorch模型通过TensorRT部署到GPU上，一般就是Pytorch->Caffe->TensorRT以及Pytorch->ONNX->TensorRT（当然Pytorch也是支持直接转换到TensorRT，这里不关心）。那么这里就有一个问题，**我们选择哪一条路比较好**？

其实，我想说的应该是**Caffe是过去，而ONNX是将来**。为什么要这样说？

首先很多国产推理芯片比如海思NNIE，高通SNPE它们首先支持的都是Caffe这种模型格式，这可能是因为年代的原因，也有可能是因为这些推理SDK实现的时候OP（operation，算子）都非常**粗粒度**。比如它对卷积做定制的优化，有NC4HW4，有Im2Col+gemm，有Winograd等等非常多方法，后面还考虑到量化，半精度等等，然后通过给它喂Caffe模型它就知道要对这个网络里面对应的卷积层进行硬件加速了。所以这些芯片支持的网络是有限的，比如我们要在Hisi35xx中部署一个含有upsample层的Pytorch模型是比较麻烦的，可能不太聪明的工程说我们要把这个模型回退给训练人员改成支持的上采样方式进行训练，而聪明的工程师可能说直接把upsample的参数填到反卷积层的参数就可以了。无论是哪种方式都是比较麻烦的，所以Caffe的缺点就是灵活度太差。其实基于Caffe进行部署的方式仍然在工业界发力，ONNX是趋势，但是ONNX现在还没有完全取代Caffe。

接下来，我们要再提一下上面那个`if`的事情了，假设现在有一个新的SOTA模型被提出，这个模型有一个自定义的OP，作者是用Pytorch的Aten操作拼的，逻辑大概是这样：

```bash
result = check()
if result == 0:
 result = algorithm1(result)
else:
 result = algorithm2(result)
return result
```

然后考虑将这个模型导出ONNX或者转换为Caffe，如果是Caffe的话我们需要去实现这个自定义的OP，并将其注册到Caffe的OP管理文件中，虽然这里比较繁琐，但是我们可以将`if`操作隐藏在这个大的OP内部，这个`if`操作可以保留下来。而如果我们通过导出ONNX模型的方式`if`子图只能保留一部分，要么保留algorithm1，要么保留algorithm2对应的子图，这种情况ONNX似乎就没办法处理了。这个时候要么保存两个ONNX模型，要么修改算法逻辑绕过这个问题。从这里引申一下，如果我们碰到**有递归关系的网络，基于ONNX应当怎么部署**？ONNX还有一个缺点就是OP的细粒度太细，执行效率低，不过ONNX已经推出了多种化方法可以将OP的细粒度变粗，提高模型执行效率。目前在众多经典算法上，ONNX已经支持得非常好了。

最后，越来越多的厂商推出的端侧推理芯片开始支持ONNX，比如地平线的BPU，华为的Ascend310相关的工具链都开始接入ONNX，所以个人认为ONNX是推理框架模型转换的**未来**，不过仍需时间考验，毕竟谁也不希望因为框架OP对齐的原因导出一个超级复杂的ONNX模型，还是简化不了的那种，导致部署难度很大。

## **ONNXRuntime介绍及用法**

ONNXRuntime是微软推出的一个推理框架，似乎最新版都支持训练功能了，用户可以非常方便的运行ONNX模型。ONNXRuntime支持多种运行后端包括CPU，GPU，TensorRT，DML等。ONNXRuntime是专为ONNX打造的框架，虽然我们大多数人把ONNX只是当成工具人，但微软可不这样想，ONNX统一所有框架的IR表示应该是终极理想吧。从使用者的角度我们简单分析一下ONNXRuntime即可。

`import numpy as np
import onnx
import onnxruntime as ort

image = cv2.imread("image.jpg")
image = np.expand_dims(image, axis=0)

onnx_model = onnx.load_model("resnet18.onnx")
sess = ort.InferenceSession(onnx_model.SerializeToString())
sess.set_providers(['CPUExecutionProvider'])
input_name = sess.get_inputs()[0].name
output_name = sess.get_outputs()[0].name

output = sess.run([output_name], {input_name : image_data})
prob = np.squeeze(output[0])
print("predicting label:", np.argmax(prob))`

这里展示了一个使用ONNXRuntime推理ResNet18网络模型的例子，可以看到ONNXRuntime在推理一个ONNX模型时大概分为Session构造，模型加载与初始化和运行阶段（和静态图框架类似）。ONNXRuntime框架是使用C++开发，同时使用Wapper技术封装了Python接口易于用户使用。

从使用者的角度来说，知道怎么用就可以了，如果要了解框架内部的知识请移步源码（`https://github.com/microsoft/onnxruntime`）和参考资料6。

> 作者：BBuf
链接：https://zhuanlan.zhihu.com/p/350833729
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
> 

# caffe

Caffe的全称应该是Convolutional Architecture for Fast Feature Embedding，它是一个清晰、高效的深度学习框架，它是开源的，核心语言是C++，它支持命令行、Python和Matlab接口，它既可以在CPU上运行也可以在GPU上运行。它的license是BSD 2-Clause。

Deep Learning比较流行的一个原因，主要是因为它能够自主地从数据上学到有用的feature。特别是对于一些不知道如何设计feature的场合，比如说图像和speech。

Caffe的设计：基本上，Caffe follow了神经网络的一个简单假设----所有的计算都是以layer的形式表示的，layer做的事情就是take一些数据，然后输出一些计算以后的结果，比如说卷积，就是输入一个图像，然后和这一层的参数（filter）做卷积，然后输出卷积的结果。每一个layer需要做两个计算：forward是从输入计算输出，然后backward是从上面给的gradient来计算相对于输入的gradient，只要这两个函数实现了以后，我们就可以把很多层连接成一个网络，这个网络做的事情就是输入我们的数据（图像或者语音或者whatever），然后来计算我们需要的输出（比如说识别的label），在training的时候，我们可以根据已有的label来计算loss和gradient，然后用gradient来update网络的参数，这个就是Caffe的一个基本流程。

基本上，最简单地用Caffe上手的方法就是先把数据写成Caffe的格式，然后设计一个网络，然后用Caffe提供的solver来做优化看效果如何，如果你的数据是图像的话，可以从现有的网络，比如说alexnet或者googlenet开始，然后做fine tuning，如果你的数据稍有不同，比如说是直接的float vector，你可能需要做一些custom的configuration，Caffe的logistic regression example兴许会很有帮助。

Fine tune方法：fine tuning的想法就是说，在imagenet那么大的数据集上train好一个很牛的网络了，那别的task上肯定也不错，所以我们可以把pretrain的网络拿过来，然后只重新train最后几层，重新train的意思是说，比如我以前需要classify imagenet的一千类，现在我只想识别是狗还是猫，或者是不是车牌，于是我就可以把最后一层softmax从一个4096*1000的分类器变成一个4096*2的分类器，这个strategy在应用中非常好使，所以我们经常会先在imagenet上pretrain一个网络，因为我们知道imagenet上training的大概过程会怎么样。

Caffe可以应用在视觉、语音识别、机器人、神经科学和天文学。

Caffe提供了一个完整的工具包，用来训练、测试、微调和部署模型。

Caffe的亮点：

(1)、模块化：Caffe从一开始就设计得尽可能模块化，允许对新数据格式、网络层和损失函数进行扩展。

(2)、表示和实现分离：Caffe的模型(model)定义是用Protocol Buffer语言写进配置文件的。以任意有向无环图的形式，Caffe支持网络架构。Caffe会根据网络的需要来正确占用内存。通过一个函数调用，实现CPU和GPU之间的切换。

(3)、测试覆盖：在Caffe中，每一个单一的模块都对应一个测试。

(4)、python和Matlab接口：同时提供Python和Matlab接口。

(5)、预训练参考模型：针对视觉项目，Caffe提供了一些参考模型，这些模型仅应用在学术和非商业领域，它们的license不是BSD。

Caffe架构：

(1)、数据存储：Caffe通过”blobs”即以4维数组的方式存储和传递数据。Blobs提供了一个统一的内存接口，用于批量图像（或其它数据）的操作，参数或参数更新。Models是以Google Protocol Buffers的方式存储在磁盘上。大型数据存储在LevelDB数据库中。

(2)、层：一个Caffe层(Layer)是一个神经网络层的本质，它采用一个或多个blobs作为输入，并产生一个或多个blobs作为输出。网络作为一个整体的操作，层有两个关键职责：前向传播，需要输入并产生输出；反向传播，取梯度作为输出，通过参数和输入计算梯度。Caffe提供了一套完整的层类型。

(3)、网络和运行方式：Caffe保留所有的有向无环层图，确保正确的进行前向传播和反向传播。Caffe模型是终端到终端的机器学习系统。一个典型的网络开始于数据层，结束于loss层。通过一个单一的开关，使其网络运行在CPU或GPU上。在CPU或GPU上，层会产生相同的结果。

(4)、训练一个网络：Caffe训练一个模型(Model)靠快速、标准的随机梯度下降算法。

在Caffe中，微调(Fine tuning)，是一个标准的方法，它适应于存在的模型、新的架构或数据。对于新任务，Caffe 微调旧的模型权重并按照需要初始化新的权重。

Blobs,Layers,and Nets：深度网络的组成模式表示为数据块工作的内部连接层的集合。以它自己的model模式，Caffe定义了层层(layer-by-layer)网络。Caffe网络定义了从低端到顶层整个model，从输入数据到loss层。随着数据通过网络的前向传播和反向传播，Caffe存储、通信、信息操作作为Blobs。Blob是标准阵列和统一内存接口框架。Blob用来存储数据、参数以及loss。随之而来的layer作为model和计算的基础，它是网络的基本单元。net作为layer的连接和集合，网络的搭建。blob详细描述了layer与layer或net是怎样进行信息存储和通信的。Solver是Net的求解。

Blob 存储和传输：一个blob是对要处理的实际数据的封装，它通过Caffe传递。在CPU和GPU之间，blob也提供同步能力。在数学上，blob是存储连续的N维数组阵列。

Caffe通过blobs存储和传输数据。blobs提供统一的内存接口保存数据，例如，批量图像，model参数，导数的优化。

Blobs隐藏了计算和混合CPU/GPU的操作根据需要从主机CPU到设备GPU进行同步的开销。主机和设备的内存是按需分配。

对于批量图像数据，blob常规容量是图像数N*通道数K*图像高H*图像宽W。在布局上，Blob存储以行为主，因此最后/最右边的维度改变最快。例如，在一个4D blob中，索引(n, k, h, w)的值物理位置索引是((n * K + k) * H + h) * W + w。对于非图像应用，用blobs也是有效的，如用2D blobs。

参数blob尺寸根据当前层的类型和配置而变化。

一个blob存储两块内存，data和diff，前者是前向传播的正常数据，后者是通过网络计算的梯度。

一个blob使用SyncedMem类同步CPU和GPU之间的值，为了隐藏同步的详细信息和尽量最小的数据传输。

Layer计算和连接：Layer是模型(model)的本质和计算的基本单元。Layer卷积滤波、pool、取内积、应用非线性、sigmoid和其它元素转换、归一化、载入数据，计算losses.

每一个layer类型定义了三个至关重要的计算：设置、前向和反向。（1）、设置：初始化这个layer及在model初始化时连接一次；（2）、前向：从底部对于给定的输入数据计算输出并传送到顶端；（3）、反向：对于给定的梯度，顶端输出计算这个梯度到输入并传送到低端。

有两个前向(forward)和反向(backward)函数执行，一个用于CPU，一个用于GPU。

Caffe layer的定义由两部分组成，层属性和层参数。

每个layer有输入一些’bottom’blobs，输出一些’top’ blobs.

Net定义和操作：net由组成和分化共同定义了一个函数和它的梯度。每一层输出计算函数来完成给定的任务，每一层反向从学习任务中通过loss计算梯度.Caffe model是终端到终端的机器学习引擎。

Net是layers组成的有向无环图(DAG)。一个典型的net开始于数据层，此layer从磁盘加载数据，终止于loss层，此layer计算目标任务，如分类和重建。

Model初始化通过Net::Init()进行处理。初始化主要做了两件事：通过创建blobs和layers来构建整个DAG，调用layers的SetUp()函数。它也做了一系列的其它bookkeeping（簿记）的事情，比如验证整个网络架构的正确性。

Model格式：The models are defined in plaintext protocol buffer schema(prototxt) while the learned models are serialized as binary protocol buffer(binaryproto) .caffemodel files. The model format is defined by the protobufschema in caffe.proto.

Forward and Backward：Forward inference, Backward learning.

Solver优化一个model通过首先调用forward得到输出和loss，然后调用backward生成model的梯度，接着合并梯度到权值(weight)更新尽量减少loss.Solver, Net和Layer之间的分工，使Caffe保持模块化和开放式发展。

Loss:在Caffe中，作为大多数机器学习，学习(learning)是通过loss函数(error, cost, or objective函数)来驱动。一个loss函数指定了学习的目标通过映射参数设置（例如，当前的网络权值）到一个标量值。因此，学习的目标是找到最小化loss函数权值的设置。

在Caffe中，loss是由网络的forward计算。每一个layer采用一组输入blobs(bottom,表示输入)，并产生一组输出blobs(top，表示输出)。一些layer的输出可能会用在loss函数中。对于分类任务，一个典型的loss函数选择是SoftmaxWithLoss函数。

Loss weights：net通过许多个layers产生一个loss,loss weights能被用于指定它们的相对重要性。

按照惯例，带有”loss”后缀的Caffe layer类型应用于loss函数，但其它layers是被假定为纯碎用于中间计算。然而，任一个layer都能被用于loss，通过添加一个”loss_weight”字段到一个layer定义。

在Caffe中，最后的loss是被计算通过所有的weighted loss加和通过网络。

Solver：Solver通过协调网络的前向推理和后向梯度形成参数更新试图改善loss达到model优化。Learning的职责是被划分为Solver监督优化和产生参数更新，Net产生loss和梯度。

Caffe solver方法：随机梯度下降(Stochastic Gradient Descent, type:”SGD”)；AdaDelta(type:”AdaDelta”)；自适应梯度(Adaptive Gradient,type:”AdaGrad”)；Adam(type:”Adam”)；Nesterov’s Accelerated Gradient(type:”Nesterov”)；RMSprop(type:”RMSProp”).

Solver作用：Solver是Net的求解.(1)、优化bookkeeping、创建learning训练网络、对网络进行评估；(2)、调用forward/backward迭代优化和更新参数；(3)、定期评估测试网络；(4)、整个优化快照model和solver状态。

Solver的每一次迭代执行：(1)、调用网络forward计算输出和loss；(2)、调用网络backward计算梯度；(3)、按照solver方法，采用渐变进行参数更新；(4)、按照学习率、历史和方法更新solver状态。通过以上执行来获得所有的weights从初始化到learned model.

像Caffe models，Caffe solvers也可以在CPU或GPU模式下运行。

solver方法处理最小化loss的总体优化问题。

实际的weight更新是由solver产生，然后应用到net参数。

Layer Catalogue：为了创建一个Caffe model，你需要定义model架构在一个prototxt文件(protocol buffer definition file)中。Caffe layers和它们的参数是被定义在protocol buffer definitions文件中，对于Caffe工程是caffe.proto.

Vision Layers：Vision layers通常以图像作为输入，并产生其它图像作为输出:

(1)、Convolution(Convolution)：卷积层通过将输入图像与一系列可学习的滤波进行卷积，在输出图像中，每一个产生一个特征图；(2)、Pooling(Pooling)；(3)、Local Response Normalization(LRN)；(4)、im2col。

Loss Layers：Loss驱动学习通过比较一个输出对应一个目标和分配成本到最小化。Loss本身是被计算通过前向传输，梯度到loss是被计算通过后向传输:

(1)、Softmax(SoftmaxWithLoss)；(2)、Sum-of-Squares/Euclidean(EuclideanLoss)；(3)、Hinge/Margin(HingeLoss)；(4)、SigmoidCross-Entropy(SigmoidCrossEntropyLoss)；(5)、Infogain(InfogainLoss)；(6)、Accuracy andTop-k。

Activation/NeuronLayers：一般Activation/Neuron Layers是逐元素操作，输入一个bottom blob，产生一个同样大小的top blob：

(1)、ReLU/Rectified-Linearand Leaky-ReLU(ReLU)；(2)、Sigmoid(Sigmoid)；(3)、TanH/Hyperbolic Tangent(TanH)；(4)、Absolute Value(AbsVal)；(5)、Power(Power)；(6)、BNLL(BNLL)。

Data Layers：数据输入Caffe通过Data Layers，它们在网络的低端。数据可以来自于：高效的数据库(LevelDB或LMDB)、直接来自内存、在不注重效率的情况下，也可以来自文件，磁盘上HDF5数据格式或普通的图像格式：

(1)、Database(Data)；(2)、In-Memory(MemoryData)；(3)、HDF5Input(HDF5Data)；(4)、HDF5 Output(HDF5Output)；(5)、Images(ImageData)；(6)、Windows(WindowData)；(7)、Dummy(DummyData).

Common Layers：(1)、InnerProduct(InnerProduct)；(2)、Splitting(Split)；(3)、Flattening(Flatten)；(4)、Reshape(Reshape)；(5)、Concatenation(Concat)；(6)、Slicing(Slice)；(7)、Elementwise Operations(Eltwise)；(8)、Argmax(ArgMax)；(9)、Softmax(Softmax)；(10)、Mean-VarianceNormalization(MVN)。

Data：在Caffe中，数据存储在Blobs中。Data Layers加载输入和保存输出通过转换从blob到其它格式。普通的转换像mean-subtraction和feature-scaling是通过配置data layer来完成。新的输入类型需要开发一个新的data layer来支持。

> ————————————————
版权声明：本文为CSDN博主「Cche1」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：[https://blog.csdn.net/qq_27923041/article/details/77431833](https://blog.csdn.net/qq_27923041/article/details/77431833)
> 

# 各类机器学习框架保存的模型格式

ONNX (.onnx, .pb, .pbtxt)
Keras (.h5, .keras)
Core ML (.mlmodel)
Caffe2 (predict_net.pb, predict_net.pbtxt)
MXNet (.model, -symbol.json)
TensorFlow Lite (.tflite).
Caffe (.caffemodel, .prototxt)
PyTorch (.pt, .pth)
TorchScript (.pt, .pth)
Torch (.t7), CNTK (.model, .cntk)
PaddlePaddle (**model**)
Darknet (.cfg)
NCNN (.param)
scikit-learn (.pkl)
TensorFlow.js (model.json, .pb)
TensorFlow (.pb, .meta, .pbtxt)
————————————————
版权声明：本文为CSDN博主「汀桦坞」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：[https://blog.csdn.net/wiborgite/article/details/95724742](https://blog.csdn.net/wiborgite/article/details/95724742)