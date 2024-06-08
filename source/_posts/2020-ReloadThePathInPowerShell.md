
---
title: "PowerShell - 如何重新 load 環境變數"
date: 2020-09-24
tags: 
  - 'Windows'
---

最近在寫 powershell 來安裝一些哩哩摳摳的東西然後使用，所以遇到了需要不在重新開啟 powershell 的時候 re-load 環境變數的狀況

今天就紀錄一下在不關閉 powershell 的情況下，用指令重新 load 環境變數的方式

首先要知道如何看到得到目前的 環境變數，在 powershell 裡面用這個指令就可以得到環境變數

    $env:Path
    

這次用 powershell 安裝 python 為示範

![](/img/2020-ReloadThePathInPowerShell/1600957666.jpg)

可以看到安裝完 python 之後，使用 python --version 沒辦法找到 python，因為需要 reload 環境變數

這時候就需要用到以下指令

    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")+ ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    

下完指令就可以成功使用 python 的指令了

![](/img/2020-ReloadThePathInPowerShell/1600957696.jpg)

source: [https://stackoverflow.com/questions/17794507/reload-the-path-in-powershell/31845512](https://stackoverflow.com/questions/17794507/reload-the-path-in-powershell/31845512)