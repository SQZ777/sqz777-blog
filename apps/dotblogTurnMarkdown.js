const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://dotblogs.azurewebsites.net/Im_sqz777/2022/10/06/223559';

axios.get(url)
  .then(response => {
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
    const postContent = $('.article__content').html();

    if (!postContent) {
      throw new Error('未能找到文章內容，請檢查選擇器是否正確');
    }

    // 將 HTML 轉換為 Markdown 格式
    const markdownContent = convertToMarkdown(postContent);

    // 組織 Markdown 前置資料
    const frontMatter = `
---
title: ${title}
date: ${date}
tags: 
${tags.map(tag => `  - ${tag}`).join('\n')}
---

`;

    // 解析 URL 以取得年份和文章名稱
    const urlParts = url.split('/');
    const year = urlParts[4];
    const articleName = urlParts[7];
    const fileName = `${year}-${articleName}.md`;

    // 將 Markdown 內容寫入文件
    fs.writeFileSync(fileName, frontMatter + markdownContent);
    console.log(`文章已成功轉換為 Markdown 格式並儲存至 ${fileName}`);
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
