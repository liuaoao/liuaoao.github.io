# HTSM

**启发式测试策略模型是由测试专家James Bach设计总结的，简称HTSM。**
The Heuristic Test Strategy Model（HTSM）
HTSM是设计测试策略的模型；可以指导我们选取测试策略，进行测试用例设计，确定测试范围，了解项目背景。
在测试人员进行测试用例设计时，通过HTSM可以随时提醒你该如何思考，该考虑哪些方面。
另外也可以帮助我们查漏补缺，也可以帮助我们总结自己的测试经验，让每一位测试人员都可以借鉴，都可以参考。

HTSM包括项目环境、产品元素、测试技术、质量标准四个方面。

**项目环境就是让我们了解为什么要测试？**

**产品元素是让我们分析我们需要测试什么？**

**测试技术指导我们我们该怎么测？**

**质量标准是推荐我们通过哪些指标进行质量验证。**

**项目环境：**

就是指项目的背景，可利用的资源，限制我们的条件等所有可以帮助我们或者限制我们的因素。

在介入测试的阶段或进行测试分析、测试计划阶段非常有帮助。

- 使命（Mission）
- 项目信息（Information）
- 与开发的关系（Developer Relations）
- 测试团队（Test Team）
- 设备和工具（Equipment & Tools）
- 进度安排（Schedule）
- 测试模块（Test Items）
- 交付物（Deliverables）

**产品元素：**

产品元素就是我们计划要测试的东西；测试人员必须保证覆盖所有的产品元素，而且不仅仅是我们所看到的部分。

在分析测试范围及测试对象时，可以帮助我们进行补充。

- Structure结构
- Function功能
- Data数据
- Interfaces接口
- Platform平台
- Operations操作
- Time时间

**测试技术：**

测试技术就是进行测试的策略，常用的测试技术有下面九种。

- Function Testing功能测试
- Claims Testing需求测试
- Flow Testing 流程测试
- Domain Testing领域测试
- Scenario Testing场景测试
- Stress Testing压力测试
- Automatic Checking自动化测试
- Risk Testing安全测试
- User Testing用户测试

**质量标准：**

质量标准就是测试人员判断一个系统是否测试通过的规则。在测试过程中或测试完成可以通过这些标准验证我们的系统是否符合质量要求。

- Installability可安装性
- Performance性能
- Compatibility兼容性
- Scalability伸缩性
- Security安全性
- Charisma吸引力
- Usability易用性
- Reliability可靠性
- Capability功能性