
---
title: "筆記 - 將自己做好的 Discord bot 放在 Heroku 上"
date: 2020-11-24
tags: 
  - 'discord'
  - 'heroku'
  - 'nodejs'
---

Heroku 是一個雲端服務平台，你可以把程式碼放上去，他可以依照你寫好的步驟建置成你想要的樣子

這一篇以 Discord bot 為示範

首先你需要有一個 Heroku 的帳號，創完登入之後會看到這個畫面

![](/img/2020-putDiscordBotToHeroku/1605972847.png)

點選 Create new app，命名自己的 app

![](/img/2020-putDiscordBotToHeroku/1605972936.png)

新增完畢之後就可以看到這個畫面，接著點選 GitHub

![](/img/2020-putDiscordBotToHeroku/1605973124.png)

這邊要輸入自己要建置的 bot repo name然後按下 Search 之後再按下旁邊那個 Connect 的按鈕  
[如何建置 Discord bot 點這裡](https://dotblogs.com.tw/Im_sqz777/2020/11/21/DiscordSetupHelloWorld)

![](/img/2020-putDiscordBotToHeroku/1605973433.png)

連結完畢之後會看到這個畫面，下面那個 Deploy Branch 按下去就是把機器人建置起來了  
**但是先等一下!!!**

![](/img/2020-putDiscordBotToHeroku/1605973597.png)

這邊需要先設定環境變數，我的機器人範例程式碼是這樣寫的，可以看到我需要環境變數 **DISCORD\_TOKEN**

![](/img/2020-putDiscordBotToHeroku/1605973739.png)

所以我需要在 Heroku 上面設定 **DISCORD\_TOKEN** 這個環境變數，在上面那排欄位中找到 Settings 進來之後點選 Reveal Config Vars

![](/img/2020-putDiscordBotToHeroku/1605973843.png)

點完之後，輸入變數名稱跟變數的值按下 Add 就可以成功新增環境變數

![](/img/2020-putDiscordBotToHeroku/1605974007.png)

在按下 Deploy 前請先確定自己的 package.json 中，有沒有設定好 npm start 要建置的 js file，如下

Heroku 在 Node.js 的專案中會執行 npm start 來執行專案

![](/img/2020-putDiscordBotToHeroku/1605974115.png)

確認完畢之後就可以回到這個頁面按下 Deploy Branch 囉!

![](/img/2020-putDiscordBotToHeroku/1605974271.png)

回到 Discord 就可以看到自己的機器人上線啦!!

![](/img/2020-putDiscordBotToHeroku/1605974342.png)

澳門首家線上賭場上線啦
-----------

以上是今天的筆記 感謝大家。