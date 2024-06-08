
---
title: "筆記 - Locust 安裝 與 HelloWorld"
date: 2020-03-29
tags: 
  - 'w3HexSchool'
  - 'locust'
  - 'loadTesting'
  - '壓力測試'
---

今天要筆記的是 Locust，可以網站的壓力測試的工具。

Week3 - [六角學院的鼠年全馬鐵人挑戰](https://www.hexschool.com/2019/11/14/2019-11-14-w3Hexschool-2020-challenge/)

Locust，翻譯成中文是蝗蟲的意思，就是想要模擬像是蝗蟲一般的蜂擁而至某個網站的概念。

Locust 是以 Python 來撰寫完成的一個工具，其 Script File 也是用Python來撰寫，有 Web UI的簡單界面，因為 Locust 本身是很輕量化的，所以他是一個易於擴展的工具。

官網連結: [https://locust.io/](https://locust.io/) 

Installation
------------

locust 在  [PyPI](https://pypi.org/project/locustio/) 上面可以取得，所以你可以透過 pip 來安裝 locust

    python3 -m pip install locustio
    

安裝完成之後使用下列指令確認是否安裝成功

    locust --help
    

詳細可參照官方文件：[https://docs.locust.io/en/stable/installation.html](https://docs.locust.io/en/stable/installation.html)

寫個簡單的 HelloWorld
----------------

先撰寫一個簡單的 locust file

引入 locust 中的 HttpLocust, TaskSet, task

    from locust import TaskSet, task
    

定義 Locust 要執行的 Task functions

沒有加入 @task 這個 decorator 將不會在壓力測試執行的過程中被執行

    class HelloLocust(TaskSet):
        @task  # 要在壓力測試中被執行的 function 加入 @task 這個 decorator
        def say(self):
            print("Hello Locust")
    
        def will_not_execute_by_locust(self):  # 沒有加入 @task 就不會在執行壓力測試時被執行到
            print("will not executed")
    

定義 Locust 的 User Setting

在這裡要做的是指定要被 Locust 執行的 Task Set, wait time...等 (這裡沒有指定等待時間，預設為1000ms)

    class User(Locust):
        task_set = HelloLocust
    

檔名：[locustfile.py](http://locustfile.py) 完整程式碼如下

    from locust import Locust, TaskSet, task
    
    
    class HelloLocust(TaskSet):
        @task  # 要在壓力測試中被執行的 function 加入 @task 這個 decorator
        def say(self):
            print("Hello Locust")
    
        def will_not_execute_by_locust(self):  # 沒有加入 @task 就不會在執行壓力測試時被執行到
            print("will not executed")
    
    
    class User(Locust):
        task_set = HelloLocust
    

執行 Command:

    locust
    

執行結果：

![](/img/2020-locust-helloworld/1585492589.png)

即可在 瀏覽器連線到 localhost:8089

![](/img/2020-locust-helloworld/1585492601.png)

Number of users to simulate: 模擬的人數

Hatch rate: 每秒產生的 User 數量 （最大值為模擬人數）

Start swarming: 開始進行壓力測試

按下 Start swarming 之後，就可以看到 terminal 一直出現 Hello Locust （模擬人數為 1, Hatch Rate 為 1）

![](/img/2020-locust-helloworld/1585492612.png)