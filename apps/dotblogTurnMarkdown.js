const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { once } = require('events');
const turndownService = new (require('turndown'))();

const inputFilePath = 'articles.txt';

async function processArticles() {
  const fileStream = fs.createReadStream(inputFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  rl.on('line', async (url) => {
    try {
      await processArticle(url);
    } catch (error) {
      console.error(`處理文章 ${url} 時發生錯誤:`, error);
    }
  });

  await once(rl, 'close');
  console.log('所有文章處理完畢');
}

async function processArticle(url) {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  // 抓取標題
  const title = $('h3.article__title').text().trim();

  // 抓取日期
  const date = $('.article__date span').text().trim();

  // 抓取標籤
  const tags = [];
  $('.article__tags ul li a').each((i, el) => {
    tags.push($(el).text().trim());
  });

  // 抓取文章內容
  let postContent = $('.article__content').html();

  if (!postContent) {
    throw new Error('未能找到文章內容，請檢查選擇器是否正確');
  }

  // 解析 URL 以取得年份和文章名稱
  const urlParts = url.split('/');
  const year = urlParts[4];
  const articleName = urlParts[7];
  const folderName = `${year}-${articleName}`;
  const fileName = `${folderName}.md`;

  // 創建資料夾以存儲圖片
  if (!fs.existsSync(folderName)){
    fs.mkdirSync(folderName);
  }

  // 處理圖片下載
  const imgUrls = [];
  $('img').each((i, el) => {
    const imgUrl = $(el).attr('src');
    if (imgUrl) {
      imgUrls.push(imgUrl);
    }
  });

  for (const imgUrl of imgUrls) {
    const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    const imgName = path.basename(imgUrl);
    const imgPath = path.join(folderName, imgName);
    fs.writeFileSync(imgPath, imgResponse.data);
    console.log(imgName);

    // 更新文章內容中的圖片路徑
    postContent = postContent.replace(new RegExp(imgUrl, 'g'), `/img/${folderName}/${imgName}`);
  }

  // 將 HTML 轉換為 Markdown 格式
  let markdownContent = convertToMarkdown(postContent);

  // 替換文章內容中的 { 和 } 字符
  markdownContent = markdownContent.replace(/({|})/g, '\/$1');

  // 組織 Markdown 前置資料
  const frontMatter = `
---
title: "${title}"
date: ${date}
tags: 
${tags.map(tag => `  - '${tag}'`).join('\n')}
---

`;

  // 將 Markdown 內容寫入文件
  fs.writeFileSync(fileName, frontMatter + markdownContent);
  console.log(`文章已成功轉換為 Markdown 格式並儲存至 ${fileName}`);
}

function convertToMarkdown(html) {
  return turndownService.turndown(html);
}

processArticles();
