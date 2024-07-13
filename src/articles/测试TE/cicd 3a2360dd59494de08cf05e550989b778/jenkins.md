# jenkins

### 在Jenkins中配置邮件发送allure报告

```
$PROJECT_NAME - BUILD #$BUILD_NUMBER - $BUILD_STATUS
${SCRIPT, template="allure-report-liangshinan-details.template"}

```

![Untitled](jenkins%203d75ecb4fbe74568afadd43deee9d024/Untitled.png)

### 在Jenkins上配置模板（template）

jenkins邮件模板： 10.121.2.173 root/JyHXdCngWGFO5#!t 
/data/docker/volumes/jenkins_home/_data/email-templates

### jenkins， SPE_trainingTest的build代码

```
#!/bin/bash
repo="git@gitlab.bj.sensetime.com:platform/PlatformTest/SPE.git"
repo_path=${WORKSPACE}/SPE
branch="liuhongzheng"

# clear last building
rm -rf ${WORKSPACE}/*
git clone ${repo} -b ${branch}
mkdir ${repo_path}/logs
pip install -r ${repo_path}/requirements.txt

export PATH=/home/sensetime/.local/bin/:$PATH
python -V
pip install allure-pytest

pytest -v -s -m 'training and not ldap and not unready' --alluredir=${repo_path}/allure_reports ${repo_path}/testcases | tee test.log

results=$(tail -n -1 test.log)

if [[ $results =~ "failed" || $results =~ "skipped" ]]
then
  # 有失败用例，判断是失败还是unstable
    failed_num=$(echo $results |grep -o "[0-9]*\sfailed" | awk '{print $1}')
    passed_num=$(echo $results |grep -o "[0-9]*\spassed" | awk '{print $1}')
    skipped_num=$(echo $results |grep -o "[0-9]*\sskipped" | awk '{print $1}')
    pass_rate=$(python -c "print float($passed_num)/(float($passed_num)+float($failed_num)+float($skipped_num))")

    if [[ $(expr $pass_rate \> $thred) == 0 ]]
    then
      # 成功率小于阈值，判断为失败
      exit 1
    else
        # 成功率大于阈值，判断为unstable
      exit 2
    fi
else
  # 无失败用例
  if [[ $results =~ "no tests ran" || $results =~ "error" ]]
    then
      # 如果没有用例运行，判断失败
      exit 1
    else
      # 有用例运行并且没有失败，判断成功，exit 0
    exit 0
    fi
fi

```

### jenkins邮件内容

1. 自定义邮件中输出txt文件的内容。写在

```
<html>
<pre>
${FILE, path="${WORKSPACE}/SPE/reports/perfweekly/perf_result.txt"}
</pre>
</html>

```