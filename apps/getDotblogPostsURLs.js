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
            console.log('https://dotblogs.com.tw/' + titleUrl);
        });
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
    }
}

// 迭代變數 1 到 8
for (let i = 1; i <= 8; i++) {
    fetchArticleTitles(i);
}
