---
title: 【翻譯】5 件與測試有關的難搞事
date: 2024-06-10 22:18:05
tags:
  - 翻譯系列
  - 測試相關
---

![](../img/2024-five-tricky-things-with-testing/image.jpg)

這是一篇翻譯文，文末才會有一些個人的心得與見解
原文連結:
[Five Tricky Things With Testing - Rikard Edgren](https://thetesteye.com/blog/2016/09/five-tricky-things-with-testing/)

## 內文翻譯
今天我去了哥德堡的 SAST Väst，進行了一個可以翻譯為 *5 件與測試有關的難搞事* 的[演講](https://thetesteye.com/presentations/Edgren_SASTVAST2016_FemBesvarligaSakerMedTestning.pdf)。
這是一個非常愉快的日子，我見到了舊友和新朋友。這也是我好久以來第一次寫 Blogs 的機會，下面是非常簡潔的版本：

1. **人們不懂測試**，但都有自己的見解。
他們認為測試是一種成本，沒有考慮到它的價值。
解決方法：討論資訊需求以及測試可以幫助人們了解的重要事項。

2. **心理上的困難**
你找到的問題越多，完成的時間就會越長。
解決方法：強調長期利益，對自己和他人都一樣。

3. **你永遠不會完成**
總有更多的東西需要測試，但你必須停止。
解決方法：多與同事交流，進行更豐富的測試。

4. **隱性知識。**
極少數情況下，你能寫下如何測試，然後進行良好的測試。
解決方法：更多的深層的討論

5. **有需求，但薪水低。**
解決方法：用正確的詞語談論測試的價值，並用小的努力而不僅僅是找到漏洞來提供價值。

總結：確保你的測試能提供價值，這也有助於測試社群。

演講中有一些好問題，其中一個特別困難：
**如何確保訊息傳達到應該接收的人？**

回答：對於離你近的人，這並不困難；從一開始就討論要報告哪些訊息以及如何報告。
我不喜歡模板，所以我通常為每個項目製作一個新模板，並詢問是否包含了正確的訊息。

但我猜你的意思是對於那些離你較遠的人，尤其是階層較高的人，這可能非常困難。這可能是一些你「不能」直接交談的人，你也不被邀請參加他們的會議。
我嘗試過的一個技巧是以一種容易傳播的格式報告，這樣很容易複製和貼上精華部分，使你的話語能夠傳達到你無法直接交談的參與者。

更好的答案需要你在自己的情境中找到。

作者: Rikard Edgren
日期: September 27, 2016

---

## 心得

到了 2024 年，測試的工作仍然會遇到上面這些難搞事
測試相關的工作者永遠必須抱持的態度就是「持續溝通」
並且不斷地談論「測試價值」這件事

### 關於第一點的個人看法

> *解決方法：討論資訊需求以及測試可以幫助人們了解的重要事項。*

這部分我個人認位作者想要表達的是測試人員應該不斷的與相關利益者或者團隊成員討論他們對於「測試結果」的需求，以及「測試」可以幫助他們瞭解的重要事項

這樣的討論就可以幫助到大家更好地理解測試的價值，而不單單只是將「測試」視為一種成本

### 關於第四點的個人看法

> *「極少數情況下，你能寫下如何測試，然後進行良好的測試。」*

我認為非常的貼切，因為大部分的 bug，發生在你意料之外的地方，而不是你預想的地方
這一句話所代表的是，開發者在大多數的情況下，會依照功能的描述進行開發
測試者則必須同時保證功能描述與開發者的實作成果一致之外，還得探索功能以外的可能性
以確保功能在完成時給予客戶的是驚訝，而不是驚嚇


Photo by [Icons8 Team](https://unsplash.com/@icons8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/man-teaching-woman-while-pointing-on-gray-laptop-yTwXpLO5HAA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)</a>
  