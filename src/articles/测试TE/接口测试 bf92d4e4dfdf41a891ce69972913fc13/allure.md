# allure

# allure html report详悉

epic: 定义项目

feature: 定义模块

story: 定义用例

1、data/behaviors.csv：汇总epic, feature, story的用例passed, failed, broken的情况

- 2、data/suites.csv、data/suites.json：查看各个用例的执行信息，
    1. csv表头："Status","Start Time","Stop Time","Duration in ms","Parent Suite","Suite","Sub Suite","Test Class","Test Method","Name","Description”
    2. json文件： 每层堆叠，第一层是suite（每次运行应该只有一个suites），第二层是python文件作为一个模块，第三次是class类下的模块，第四层就是用例了。每一个用例会有一个uid
    
    ```json
    json:
    
    {
    	"uid": xxx,
    	"name": "suites",
    	"childden": [
    		{
    			"name": "xxx", # python file name
    			"uid": "xxx",
    			"children": [
    				"name": "xxx", # class name
    				"uid": "xxx",
    				"children": {
    					"name": "xxx", # title name # 用例名称
    					"uid": "xxx",
    					"parentUid": "xx",
    					"status" : "passed",
    					"time" : {
    	          "start" : 1673603227827,
    	          "stop" : 1673603227828,
    	          "duration" : 1
    	        },
    	        "flaky" : false,
    	        "newFailed" : false,
    	        "parameters" : [ ]
    				}
    			]
    		}
    	}
    }
    ```
    

3、data/timieline.json：查看时间线上各用例的执行情况

- 4、data/test-cases/下的每个用例详情文件：在data/suites.json下每条用例会有一个uid，每个uid用例会在test-cases生成一个用例的json
    
    ```json
    {
      "uid" : "2d9799bfab005458",
      "name" : "test title 2",
      "fullName" : "test_cli.TestCliDemo#test_cli_ase2",
      "historyId" : "bd145f224560093c5109a29521807fa3",
      "time" : {
        "start" : 1673603227835,
        "stop" : 1673603227835,
        "duration" : 0
      },
      "status" : "passed",
      "flaky" : false,
      "newFailed" : false,
      "beforeStages" : [ {
        "name" : "_session_faker",
        "time" : {
          "start" : 1673603227786,
          "stop" : 1673603227824,
          "duration" : 38
        },
        "status" : "passed",
        "steps" : [ ],
        "attachments" : [ ],
        "parameters" : [ ],
        "stepsCount" : 0,
        "attachmentsCount" : 0,
        "shouldDisplayMessage" : false,
        "hasContent" : false
      } ],
      "afterStages" : [ ],
      "labels" : [ {
        "name" : "story",
        "value" : "test story 2"
      }, {
        "name" : "feature",
        "value" : "test feature 1"
      }, {
        "name" : "suite",
        "value" : "test_cli"
      }, {
        "name" : "subSuite",
        "value" : "TestCliDemo"
      }, {
        "name" : "host",
        "value" : "host-192-168-10-44"
      }, {
        "name" : "thread",
        "value" : "6149-MainThread"
      }, {
        "name" : "framework",
        "value" : "pytest"
      }, {
        "name" : "language",
        "value" : "cpython3"
      }, {
        "name" : "package",
        "value" : "test_cli"
      }, {
        "name" : "resultFormat",
        "value" : "allure2"
      } ],
      "parameters" : [ ],
      "links" : [ ],
      "hidden" : false,
      "retry" : false,
      "extra" : {
        "severity" : "normal",
        "retries" : [ ],
        "categories" : [ ],
        "tags" : [ ]
      },
      "source" : "2d9799bfab005458.json",
      "parameterValues" : [ ]
    }
    ```
    

5、data/attachments用例附件：data/test-cases/下的用例json中的”attachments”: []指定了attachment的文件名称（好像是以uid命名）