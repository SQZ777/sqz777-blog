---
title: 更改 Chrome 時區的方法
date: 2024-06-06 22:29:10
tags:
  - Chrome
  - 時區
---

![checkTimeZone](/img/2024-how-to-change-time-zone-in-chrome/image.png)

最近測試時遇到驗證不同時區狀況的需求

直覺上認為開啟 VPN 或是更改電腦的設定是不合理的
所以嘗試找看看 Chrome 有沒有辦法更改 Chrome 自身的時區設定
然後就讓我找到了 [Chrome 的文件](https://developer.chrome.com/docs/devtools/settings/locations?hl=zh-tw) !

## 設定前確認時區

更改之前，透過 F12 的 Console 來確認當前的時區

![checkTimeZone](/img/2024-how-to-change-time-zone-in-chrome/image1.png)

## 設定

於右上角三個點 > More tools > Sensors

![settingLocation](/img/2024-how-to-change-time-zone-in-chrome/image2.png)

接著在下方的 Sensors tab 就可以找到複寫 Location 的設定，我們這裡選擇 Tokyo

![settingLocation](/img/2024-how-to-change-time-zone-in-chrome/image3.png)

## 確認結果

在 Console 中確認時區是否已被覆寫

![settingLocation](/img/2024-how-to-change-time-zone-in-chrome/image4.png)

這樣就可以完成時區的修改啦!
當前端會根據 Chrome 本身設定的時區進行時區顯示上的修改時，就會需要用到這一個 Chrome 的覆寫時區功能了