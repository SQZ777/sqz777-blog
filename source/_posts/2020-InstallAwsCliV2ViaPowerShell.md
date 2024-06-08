
---
title: "筆記 - 使用 PowerShell 安裝 aws cli"
date: 2020-09-24
tags: 
  - 'aws'
  - 'aws cli'
  - 'install'
  - 'powershell'
  - '安裝'
---

最近蠻常用到 AWS 的服務，而且需要在建機器的時候透過 powershell 來安裝 aws cli，所以就記錄一下這篇

本篇記錄時間為 2020/09/24，aws cli 的版本會隨著時間更新，今天示範的版本是 aws cli v2  
請注意以下 $dlurl 的檔案位置是否已被 AWS 官方變更!

    #https://docs.aws.amazon.com/zh_tw/cli/latest/userguide/install-cliv2-windows.html
    $dlurl = "https://awscli.amazonaws.com/AWSCLIV2.msi"
    $installerPath = Join-Path $env:TEMP (Split-Path $dlurl -Leaf)
    Invoke-WebRequest $dlurl -OutFile $installerPath
    Start-Process -FilePath msiexec -Args "/i $installerPath /passive" -Verb RunAs -Wait
    Remove-Item $installerPath

執行結果如下

![](/img/2020-InstallAwsCliV2ViaPowerShell/1600961818.png)

會發現透過 aws --version 來確認是否安裝完成時，會出現錯誤，這時候如過不想要重開 powershell 就執行[上一篇記錄](https://dotblogs.com.tw/Im_sqz777/2020/09/24/ReloadThePathInPowerShell)的程式碼

    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")+ ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

執行之後再執行一次 aws --version 就可以成功執行囉~

![](/img/2020-InstallAwsCliV2ViaPowerShell/1600962069.png)

source: [https://gist.github.com/dansmith65/79275f15fe25550e65ccd4d6bf1448cf](https://gist.github.com/dansmith65/79275f15fe25550e65ccd4d6bf1448cf)