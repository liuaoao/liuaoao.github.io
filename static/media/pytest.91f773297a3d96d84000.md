# pytest

## 一、简介

### 1、pytest是一个非常成熟的全功能的Python测试框架

主要有以下几个特点：

简单灵活，容易上手

支持参数化

能够支持简单的单元测试和复杂的功能测试，还可以用来做selenium/appnium等自动化测试、接口自动化测试（pytest+requests）

pytest具有很多第三方插件，并且可以自定义扩展，比较好用的如pytest-selenium（集成selenium）、pytest-html（完美html测试报告生成）、pytest-rerunfailures（失败case重复执行）、pytest-xdist（多CPU分发）等

测试用例的skip和xfail处理

可以很好的和jenkins集成

report框架----allure也支持了pytest

### 2、官方文档：

[https://docs.pytest.org/en/latest/contents.html](https://links.jianshu.com/go?to=https%3A%2F%2Fdocs.pytest.org%2Fen%2Flatest%2Fcontents.html)

### 3、在pytest框架中，有如下约束：

所有的单测文件名都需要满足test_*.py格式或*_test.py格式。

在单测文件中，测试类以Test开头，并且不能带有init方法(注意：定义class时，需要以T开头，不然pytest是不会去运行该class的)

在单测类中，可以包含一个或多个test_开头的函数。

此时，在执行pytest命令时，会自动从当前目录及子目录中寻找符合上述约束的测试函数来执行。

### 4、运行方式

（1）测试类主函数模式

（2）命令行模式

pytest文件路径／测试文件名

例如：pytest ./test_abc.py

### 5、pytest exit code含义：

Exit code 0所有用例执行完毕，全部通过

Exit code 1所有用例执行完毕，存在Failed的测试用例

Exit code 2用户中断了测试的执行

Exit code 3测试执行过程发生了内部错误

Exit code 4 pytest命令行使用错误

Exit code 5未采集到可用测试用例文件

### 6、pytest的一些信息获取：

pytest --version

pytest --fixture显示可用的内置函数参数

pytest --help

### 7、控制测试用例执行

pytest -x #第01次失败，就停止测试

pytest --maxfail=2 #出现2个失败就终止测试

pytest testing/ #测试指定目录

pytest -k "MyClass and not method" #通过关键字表达式过滤执行

pytest -m slow #这条命令会执行被装饰器@pytest.mark.slow装饰的所有测试用例

#运行某一function

**ifname**==**'main'**:

pytest.main([**'-s'**,**"D:/SPE/testcases/data/test_pressure.py::TestPressure::test_create_dataset"**])

### 8、多进程运行用例

安装pytest-rerunfailures：

pip install -U pytest-rerunfailures

运行模式：

pytest test_se.py --reruns NUM

NUM填写重试的次数。

### 10、 显示print内容

在运行测试脚本时，为了调试或打印一些内容，我们会在代码中加一些print内容，但是在运行pytest时，这些内容不会显示出来。如果带上-s，就可以显示了。

运行模式：

pytest test_se.py -s

另外，pytest的多种运行模式是可以叠加执行的，比如说，你想同时运行4个进程，又想打印出print的内容。可以用：

pytest test_se.py -s -n 4

## 二、setup()和teardown()函数

pytest插件：[https://plugincompat.herokuapp.com/](https://plugincompat.herokuapp.com/)

## 三、pytest测试报告

1. 用pytest-HTML这个插件，使用方法： 命令行格式：pytest --html=用户路径/report.html
2. 使用pytest-allure插件：

pytest [test.py](http://test.py/) --alluredir=../result/report/1

// -s是把print的内容打印出来

pytest.main(["testcases/trainingPerformance/test_training_performance.py", "-s", "--alluredir=%s" %allure_path])

## 四、pytest-ordering

用例方法上添加装饰器@pytest.mark.run(order=2)，用例执行顺序会以order值大小升序去调用执行，

会先执行order值较小的。

## 五、分布式执行

1、安装pytest-xdist包

2、命令

pytest -n=？（cpu数目）

pytest testcases/training/test_training_success.py -n auto（自动获取cpu数目，这样子资源占用会非常打）

## 六、fixture

教程~

[https://learning-pytest.readthedocs.io/zh/latest/index.html](https://learning-pytest.readthedocs.io/zh/latest/index.html)

fixture修饰器是来标记固定的工厂函数，在其他函数，模块，类或整个工程调用它时会被激活并优先执行,通常会被用于完成预置处理和重复操作。

固件（Fixture）是一些函数，pytest 会在执行测试函数之前（或之后）加载运行它们。

我们可以利用固件做任何事情，其中最常见的可能就是数据库的初始连接和最后关闭操作。

Pytest 使用 pytest.fixture() 定义固件，下面是最简单的固件，只返回北京邮编：

# test_postcode.py

@pytest.fixture()

def postcode():

return '010'

def test_postcode(postcode):

assert postcode == '010'

固件可以直接定义在各测试脚本中，就像上面的例子。更多时候，我们希望一个固件可以在更大程度上复用，这就需要对固件进行集中管理。Pytest 使用文件 [conftest.py](http://conftest.py/) 集中管理固件。

在复杂的项目中，可以在不同的目录层级定义 [conftest.py](http://conftest.py/)，其作用域为其所在的目录和子目录。

不要自己显式调用 [conftest.py](http://conftest.py/)，pytest 会自动调用，可以把 conftest 当做插件来理解。

参数化

当对一个测试函数进行测试时，通常会给函数传递多组参数。比如测试账号登陆，我们需要模拟各种千奇百怪的账号密码。

当然，我们可以把这些参数写在测试函数内部进行遍历。不过虽然参数众多，但仍然是一个测试，当某组参数导致断言失败，测试也就终止了。

通过异常捕获，我们可以保证程所有参数完整执行，但要分析测试结果就需要做不少额外的工作。

在 pytest 中，我们有更好的解决方法，就是参数化测试，即每组参数都独立执行一次测试。使用的工具就是 pytest.mark.parametrize(argnames, argvalues)。

这里是一个密码长度的测试函数，其中参数名为 passwd，其可选列表包含三个值：

# test_parametrize.py

@pytest.mark.parametrize('passwd',

['123456',

'abcdefdfs',

'as52345fasdf4'])

def test_passwd_length(passwd):

assert len(passwd) >= 8

预处理和后处理

很多时候需要在测试前进行预处理（如新建数据库连接），并在测试完成进行清理（关闭数据库连接）。

当有大量重复的这类操作，最佳实践是使用固件来自动化所有预处理和后处理。

Pytest 使用 yield 关键词将固件分为两部分，yield 之前的代码属于预处理，会在测试前执行；yield 之后的代码属于后处理，将在测试完成后执行。

以下测试模拟数据库查询，使用固件来模拟数据库的连接关闭：

# test_db.py

@pytest.fixture()

def db():

print('Connection successful')

yield

print('Connection closed')

def search_user(user_id):

d = {

'001': 'xiaoming'

}

return d[user_id]

def test_search(db):

assert search_user('001') == 'xiaoming'

作用域

固件的作用是为了抽离出重复的工作和方便复用，为了更精细化控制固件（比如只想对数据库访问测试脚本使用自动连接关闭的固件），pytest 使用作用域来进行指定固件的使用范围。

在定义固件时，通过 scope 参数声明作用域，可选项有：

function: 函数级，每个测试函数都会执行一次固件；

class: 类级别，每个测试类执行一次，所有方法都可以使用；

module: 模块级，每个模块执行一次，就是整个.py模块中只执行一次，模块内函数和方法都可使用；

session: 会话级，一次测试只执行一次，所有被找到的函数和方法都可用。

默认的作用域为 function。

因为固件也是函数，我们同样可以对固件进行参数化。在什么情况下需要对固件参数化？

假设现在有一批 API 需要测试对不同数据库的支持情况（对所有数据库进行相同操作），最简单的方法就是针对每个数据库编写一个测试用例，但这包含大量重复代码，如数据库的连接、关闭，查询等。

进一步，可以使用固件抽离出数据库的通用操作，每个 API 都能复用这些数据库固件，同时可维护性也得到提升。

更进一步，可以继续将这些固件合并为一个，而通过参数控制连接到不同的数据库。这就需要使用固件参数化来实现。固件参数化需要使用 pytest 内置的固件 request，并通过 request.param 获取参数。

@pytest.fixture(params=[

('redis', '6379'),

('elasticsearch', '9200')

])

def param(request):

return request.param

@pytest.fixture(autouse=True)

def db(param):

print('\nSucceed to connect %s:%s' % param)

yield

print('\nSucceed to close %s:%s' % param)

def test_api():

assert 1 == 1

执行结果：

$ pytest -s tests/fixture/test_parametrize.py

============================= test session starts =============================

platform win32 -- Python 3.6.4, pytest-3.6.1, py-1.5.2, pluggy-0.6.0

rootdir: F:\self-repo\learning-pytest, inifile:

collected 2 items

tests\fixture\test_parametrize.py

Succeed to connect redis:6379

.

Succeed to close redis:6379

Succeed to connect elasticsearch:9200

Succeed to close elasticsearch:9200

========================== 2 passed in 0.10 seconds ===========================

与函数参数化使用 @pytest.mark.parametrize 不同，固件在定义时使用 params 参数进行参数化。

固件参数化依赖于内置固件 request 及其属性 param。

内置固件

tmpdir & tmpdir_factory

用于临时文件和目录管理，默认会在测试结束时删除。

pytestconfig

使用 pytestconfig，可以很方便的读取命令行参数和配置文件。

capsys

capsys 用于捕获 stdout 和 stderr 的内容，并临时关闭系统输出。

monkeypatch

monkeypath 用于运行时动态修改类或模块。

recwarn

recwarn 用于捕获程序中 warnings 产生的警告。

fixture之间的互动：

[https://www.cnblogs.com/yoyoketang/p/9762191.html](https://www.cnblogs.com/yoyoketang/p/9762191.html)

## 七、fixture作为参数运行

@pytest.mark.parametrize("title, test_status, create_delete_training", cancel_training_data(), indirect=["create_delete_training"])

indirect意思是，里面的参数是是函数

已使用 OneNote 创建。

# 八、class级别的数据驱动

**pytest.mark.parametrize 实现数据驱动**

注意：是function级别的，结合fixture用的话，每个function都会setup、teartown一次这个fixture。
pytest.mark.parametrize 是 pytest 的内置装饰器，它允许你在 function 或者 class 上定义多组参数和 fixture 来实现数据驱动。

@pytest.mark.parametrize() 装饰器接收两个参数：
第一个参数以字符串的形式存在，它代表能被被测试函数所能接受的参数，如果被测试函数有多个参数，则以逗号分隔；
第二个参数用于保存测试数据。如果只有一组数据，以列表的形式存在，如果有多组数据，以列表嵌套元组的形式存在（例如：[1,1]或者[(1,1), (2,2)]）。

```
import pytest
import allure

@pytest.fixture(scope='class')
def input(request):
    p = request.param
    return 'fixture_' + str(p)

@pytest.mark.parametrize('title, input', [('q', 1), ('w', 2), ('e', 3)], indirect=['input'])
class Test_wfff():

    @allure.title('test_1'+'_'+'{title}')
    def test_1(self, title, input):
        print('test_1' + '-----' + input)

    @allure.title('test_2'+'_'+'{title}')
    def test_2(self, title, input):
        print('test_2' + '-----' + input)

    @allure.title('test_3'+'_'+'{title}')
    def test_3(self, title, input):
        print('test_3' + '-----' + input)

# output
PASSED                                 [ 11%]test_1-----fixture_1
PASSED                                 [ 22%]test_2-----fixture_1
PASSED                                 [ 33%]test_2-----fixture_1
PASSED                                 [ 44%]test_1-----fixture_2
PASSED                                 [ 55%]test_2-----fixture_2
PASSED                                 [ 66%]test_3-----fixture_3
PASSED                                 [ 77%]test_1-----fixture_3
PASSED                                 [ 88%]test_2-----fixture_3
PASSED                                 [100%]test_3-----fixture_3

```

**用pytest.fixture中的param字段进行数据驱动——**

pytest.fixture(scope="class", param=[(1,2), (2,3)]

这样子的话，每跑一个class的param数据，只会setup、teartown一次。

```
import allure
import pytest

@pytest.fixture(scope='class', params=[('title1', 1), ('title2', 2), ('title3', 3)])
def input(request):
    p = request.param
    yield {'title': p[0], 'param': p[1]}
    print('deleting...')

# @pytest.mark.parametrize('title, input', indirect=['input'])
class Test_wfff():

    @allure.title('test_1'+'_'+'{input[0]}')
    def test_1(self, input):
        i = input
        print('test_1' + '-----' + str(input))

    @allure.title('test_2'+'_'+'{input[0]}')
    def test_2(self, input):
        print('test_2' + '-----' + str(input))

    @allure.title('test_3'+'_'+'{input[0]}')
    def test_3(self, input):
        print('test_2' + '-----' + str(input))

# ouput
collected 9 items

testcases\training\test_run.py test_1-----{'title': 'q', 'param': 1}
.test_2-----{'title': 'q', 'param': 1}
.test_2-----{'title': 'q', 'param': 1}
.deleting...
test_1-----{'title': 'w', 'param': 2}
.test_2-----{'title': 'w', 'param': 2}
.test_2-----{'title': 'w', 'param': 2}
.deleting...
test_1-----{'title': 'e', 'param': 3}
.test_2-----{'title': 'e', 'param': 3}
.test_2-----{'title': 'e', 'param': 3}
.deleting...

```