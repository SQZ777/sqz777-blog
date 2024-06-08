
---
title: "筆記 - 透過 Node.js 建置 Discord BOT"
date: 2020-11-21
tags: 
  - 'bot'
  - 'discord'
  - 'discord.js'
  - 'Node.js'
---

筆記一下如何透過 Node.js 建置 Discord 機器人

什麼是 Discord
-----------

Discord 是一個聊天通訊軟體，pc/mobile 都可以使用，跟以前的 RC、TS 的軟體蠻像的

大部分的使用者都是遊戲玩家居多

他跟 Line 一樣也有提供相關的 API 可以使用!

本文範例程式碼：[https://github.com/SQZ777/discord\_bot\_for\_blog](https://github.com/SQZ777/discord_bot_for_blog)

環境&前置
-----

*   [Node.js](https://nodejs.org/zh-tw/download/)
*   [discord.js](https://discord.js.org/#/)
*   [Discord account](https://discord.com/)

建立 Discord Application
----------------------

進到 discord 管理 application 的頁面 [https://discord.com/developers/applications](https://discord.com/developers/applications)

![](/img/2020-DiscordSetupHelloWorld/1605944300.png)

可以看到自己已經建立的機器人，你的畫面應該是還沒有，所有要點擊右上角 **New Application**，之後命名一下自己的機器人名稱

![](/img/2020-DiscordSetupHelloWorld/1605944370.png)

建立完成之後可以看到自己的機器人相關的 token 等等的東西

![](/img/2020-DiscordSetupHelloWorld/1605949979.png)

再來左邊的欄位選 bot 之後按下 Add Bot 

![](/img/2020-DiscordSetupHelloWorld/1605949763.png)選 Yes, do it!

![](/img/2020-DiscordSetupHelloWorld/1605949840.png)

把 token 先存起來，等等要利用 nodejs 開發機器人的功能時會用到這個 token

![](/img/2020-DiscordSetupHelloWorld/1605949915.png)

把機器人加入自己的伺服器
------------

按下左邊欄位 OAuth2 之後 scopes 選擇 bot, 因為目前只有傳送訊息 所以 bot permissions 選擇 Send Messages，箭頭處的部分就是邀請 bot 加入伺服器的連結，把它複製起來。

![](/img/2020-DiscordSetupHelloWorld/1605950673.png)

把剛才那個邀請連接用瀏覽器連結過去之後就會詢問你要將機器人放進哪個伺服器，選好之後按下繼續即可

![](/img/2020-DiscordSetupHelloWorld/1605950830.png)

然後會問你是否需要授權，按下授權即可

![](/img/2020-DiscordSetupHelloWorld/1605950878.png)

在伺服器就會看到機器人加入的訊息

![](/img/2020-DiscordSetupHelloWorld/1605950936.png)

開始透過 Node.js 建置機器人
------------------

先使用 npm init 建立 package.json，再透過 npm 安裝 [discord.js](https://discord.js.org/#/)

    npm i discord.js

建立一個檔案 app.js，範例原始碼來自於 [discord.js](https://discord.js.org/#/) 

    const Discord = require('discord.js');
    const client = new Discord.Client();
    
    client.on('ready', () => /{
      console.log(`Logged in as $/{client.user.tag/}!`);
    /});
    
    client.on('message', msg => /{
      if (msg.content === 'ping') /{
        msg.reply('Pong!');
      /}
    /});
    
    client.login('token');

以上程式碼將最下方 client.login('token') 的 'token' 取代成剛才複製起來的 token 就可以了，忘記在哪這邊圖片附上複製位置

![](/img/2020-DiscordSetupHelloWorld/1605949915.png)

將機器人加入伺服器之後會發現機器人都是離線狀態(如圖)，是因為機器人目前沒有登入，我們需要執行我們的程式碼讓機器人登入

![](/img/2020-DiscordSetupHelloWorld/1605951075.png)

執行 npm start，就會發現機器人登入了

![](/img/2020-DiscordSetupHelloWorld/1605951375.png)

這時候就可以透過自己傳送 訊息 "ping" 來讓機器人回應你 "pong"，這樣就成功完成了一個機器人的 Hello World 囉!

![](/img/2020-DiscordSetupHelloWorld/1605951410.png)

Reference
---------

[Discord 官方文件](https://discord.com/developers/docs/intro)