---
title: 使用 ChatGPT 進行部落格文章搬遷的我會被 AI 取代嗎?
date: 2024-06-08 22:46:45
tags:
---


![](/img/2024-migrate-blog-by-chatgpt/image0.png)
圖是使用[梗圖產生器](https://memes.tw/)產生的，AI 真的可以取代我們嗎? 讓我們繼續看下去

最近自己使用了 ChatGPT 進行部落格文章的搬遷
搬站的原因很膚淺，想知道的話再去[關於我](https://sqz777.com/about/)看，就不多做贅述 🤣
原本這篇只是單純想記錄搬遷的過程，但剛好最近社團討論很熱烈就把文章的撰寫方式稍微改變一下
讓這篇可以更符合社團最近討論度很高的主題： 
> 因為 AI 的出現，工程師會不會失業?

### 本文使用的 ChatGPT 模型是 GPT-4o
---

## 正文開始，我的第一步是拆分需求

需求很簡單
- 提供 URL 將部落格的文章內容轉成 markdown
- 取得舊部落格的所有文章 URL
- 讓第一個需求可以批次處理

這種一次性的 script，就不考慮維護性了
所以基本上所有 code 都讓 ChatGPT 產生再做細節的調整就好

## 第二步，描述需求讓 ChatGPT 產生程式碼
直接讓 ChatGPT 幫我產生一段關於文章內容轉成 markdown 的 Node.js Code

![](/img/2024-migrate-blog-by-chatgpt/image1.png)

以下是 ChatGPT 產生的 Node.js Code

```
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://dotblogs.azurewebsites.net/Im_sqz777/2022/10/06/223559';

axios.get(URL)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    // 假設文章內容在 class 為 'post-content' 的元素中
    const postContent = $('.post-content').html();

    if (!postContent) {
      throw new Error('未能找到文章內容，請檢查選擇器是否正確');
    }

    // 將 HTML 轉換為 Markdown 格式
    const markdownContent = convertToMarkdown(postContent);

    // 將 Markdown 內容寫入文件
    fs.writeFileSync('article.md', markdownContent);
    console.log('文章已成功轉換為 Markdown 格式並儲存至 article.md');
  })
  .catch(error => {
    console.error('發生錯誤:', error);
  });

function convertToMarkdown(html) {
  // 這裡使用 turndown 庫來轉換 HTML 為 Markdown
  const TurndownService = require('turndown');
  const turndownService = new TurndownService();

  return turndownService.turndown(html);
}
```

## 第三步，修正 ChatGPT 的程式碼
我發現了 ChatGPT 提供的 code 中有一個「假設」
```
// 假設文章內容在 class 為 'post-content' 的元素中
const postContent = $('.post-content').html();
```

這一個假設讓我需要回到文章的頁面中找到文章內容的 class 為 `article__content`，如圖

![](/img/2024-migrate-blog-by-chatgpt/image2.png)

將 `.post-content` 取代為 `.article__content` 了之後執行程式碼
> 記得在`article__content`前面加上點: `.`

驗證產生出來的 markdown 有幾個小問題

1. 舊文章日期/標籤/標題，沒有被寫進我預期的格式中
2. 檔案名稱是寫死的，舊文章產生的檔案名稱應該依照文章年份及對應名稱

## 第四步，修正小問題，讓 ChatGPT 重新產生程式碼

依照小問題 1，我需要道舊文章中找到文章對應的標題/標籤/日期的 html，然後產生 prompt 讓 GPT 幫我改 code
prompt 如下圖

![](/img/2024-migrate-blog-by-chatgpt/image3.png)

避免文章太長，就不貼 GPT 產生的 code 了
接著再解小問題 2
這個問題很簡單，直接讓 GPT 修正並且改掉先前提到的文章內容 class 的問題

![](/img/2024-migrate-blog-by-chatgpt/image4.png)

小問題解完之後，執行了 script，確認 markdown 可以被 hexo 解析就可以進到下一步了

## 第四步，讓 URL 可以批次輸入
為了讓舊站的連結可以透過 git 記錄，所以決定透過檔案的方式來進行批次處理
這樣一來我有紀錄的同時又可以透過檔案來進行文章的轉換，prompt 如下

![](/img/2024-migrate-blog-by-chatgpt/image5.png)

在檔案中隨便貼上兩個舊站的文章測試一下，確認沒問題之後就往下一步

## 第五步，取得舊站所有文章的 URL

在舊站首頁中可以觀測到 title 的 class 為 `article__title`
然後可以在 URL 觀測到頁面會因為尾數不同而換頁，URL 如下
> https://dotblogs.com.tw/Im_sqz777/1 << 這個 1 就是頁數

我們就可依照這個狀況產生對應的 prompt:

![](/img/2024-migrate-blog-by-chatgpt/image6.png)

產生的程式碼如下
```
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchArticleTitles(variable) {
    const url = `https://dotblogs.com.tw/Im_sqz777/${variable}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // 選擇所有 class 為 article__title 的元素
        $('.article__title a').each((index, element) => {
            const titleUrl = $(element).attr('href');
            console.log(titleUrl);
        });
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
    }
}

// 迭代變數 1 到 8
for (let i = 1; i <= 8; i++) {
    fetchArticleTitles(i);
}
```

接著執行產生的程式碼會發現他並沒有符合我們的需求，如下圖

![](/img/2024-migrate-blog-by-chatgpt/image7.png)

我們的需求是需要讓 text file 中描述 URL，所以只需要在第 14 行加入 `'https://dotblogs.com.tw/' + ` 就可以了
執行結果如下

![](/img/2024-migrate-blog-by-chatgpt/image8.png)

## 第六步，修復 hexo 解析的問題

接著就會發現 hexo 解析的 2 個錯誤
1. title 格式的問題
![](/img/2024-migrate-blog-by-chatgpt/image9.png)
2. 舊文中出現大括弧 `{}` 時的解析問題

title 的格式問題很簡單，在原程式碼中的 title 中加入單引號即可，如下
```
---
title: '${title}'
date: ${date}
tags: 
${tags.map(tag => `  - ${tag}`).join('\n')}
---
```

第 2 個問題直接讓 ChatGPT 解決

![](/img/2024-migrate-blog-by-chatgpt/image10.png)
但是 ChatGPT 提供的程式碼有問題，關鍵程式碼如下

```
  // 替換文章內容中的 { 和 } 字符
  markdownContent = markdownContent.replace(/({|})/g, '\\$1');
```

我預期和描述的 prompt 斜線是 `/`，但 ChatGPT 睜眼說瞎話的寫成了 `\`，改掉之後確認解析沒問題後

還剩下一個細節的需求，是一開始需求分析時沒有寫到的:
- 圖片應該要下載下來，並且在 markdown 中顯示

但這一段 ChatGPT 完美的解決了我的問題，所以就不記錄了，想要看最後的程式碼的話可以到 Github 上看
連結附上
- [DotBlogs 文章轉 markdown](https://github.com/SQZ777/sqz777-blog/blob/main/apps/dotblogTurnMarkdown.js)
- [取得 DotBlogs 的文章 URLs](https://github.com/SQZ777/sqz777-blog/blob/main/apps/getDotblogPostsURLs.js)

## 總結

總結一下透過 ChatGPT 搬遷 blogs 文章會需要的技能
1. 知道網站相關的知識
    - 知道在程式碼中描述 class 前面要加上 `.`
    - 知道 URL 中哪個值是對應頁數
2. 知道如何使用 Chrome 的開發者工具
3. 知道 regex 的組成
4. 知道錯誤訊息怎麼看
    - 如何快速定位哪一篇是發生錯誤的文章
5. 知道 hexo 解析錯誤的原因
    - 在 {} 前要加上 `/` 而非 `\\`
    - 在標題中出現 `'` 要在 script 中針對標題兩側加上 `'`
6. ...之後想到再補充

以上程式碼的內容，要我自己寫是完全沒問題，有 AI 之後
原本可能要花 1 小時左右的時間，最後壓縮成 20 分鐘內甚至更短就解決了
依照今天這樣子的搬遷紀錄來看，我應該還不至於被「純粹的 AI 工具」或是「無基礎但使用 AI 工具的人」取代

不過要注意的是那些努力且能夠善用 AI 工具的人，這些人的生產力可能會是 AI 出現前的好幾倍

不說了，我要睡了，明早再修這個 blog theme 程式碼會置中的問題了 🙈🙈🙈
感謝大家收看 <(_ _)>
