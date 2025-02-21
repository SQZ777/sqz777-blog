---
title: 我的 macbook 系統資料好大RRRRRRR
date: 2025-02-21 16:44:21
tags: 
  - macOS
---
## 緣起

最近安裝 xcode 新的 simulator 時，我的 mac 出現了一個錯誤訊息是 `您的啟動硬碟將滿`
於是我確認了一下整個硬碟空間的佔比，發現我的系統資料真的好大，竟然佔了一半(247.9GB)

![system-data](img/2025-mac-system-data-clean-up/image1.png)

：你的系統資料有多大？
：三、四層樓那麼大(X)

![alt text](/img/2025-mac-system-data-clean-up/gif1.gif)

嘗試找呂布（Reboot）救援之後意外的少了 30GB

![system-data-after-reboot](img/2025-mac-system-data-clean-up/image2.png)

找 google 求救之後發現有很多工具和軟體可以使用，有些要付費有些則不需要，但本人我就比較奇葩，不喜歡裝一堆有的沒的，所以決定找看看有沒有不安裝軟體的解決方式

於是找到了這一篇 [reddit](https://www.reddit.com/r/mac/comments/ynv4d0/system_data_taking_up_all_my_storage_how_do_i_fix/)

## 解法

簡單來說就是使用 `du` 和 `df` 指令來確認磁碟空間中使用最多的地方，然後再針對那些資料夾進行手動清理

df 指令如下，這行的目的是讓你了解目前硬碟空間的使用狀況，並且僅顯示 size 為 GB 層級的資訊
```
df -h | grep Gi
```

du 指令如下，這行指令會先用 du -h 計算 /System/Volumes/Data 內所有檔案和資料夾的磁碟使用量（並以 KB、MB、GB 等易讀單位顯示）。接著 grep "G\t" 只篩選出顯示為 GB 的結果，再用 sort 進行排序，讓你能快速找出哪些資料夾或檔案最佔空間
```
du -h /System/Volumes/Data | grep "G\t" | sort
```

找到那些最佔空間的檔案之後就可以用 finder 手動找到他再自行判斷是否刪除
這一次我找到很多垃圾 image，還有一些不知道為什麼垃圾桶沒清空的內容
最後我總共刪了 100GB 左右的資料，真是清清爽爽

![](img/2025-mac-system-data-clean-up/image3.png)

![](img/2025-mac-system-data-clean-up/image4.png)