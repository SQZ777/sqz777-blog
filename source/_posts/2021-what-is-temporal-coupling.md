
---
title: "筆記－什麼是時序耦合（Temporal Coupling）？"
date: 2021-04-18
tags: 
  - 'CodeSmell'
  - 'DI'
  - '筆記'
---

最近在看 [依賴注入：原理、實作與設計模式](https://www.tenlong.com.tw/products/9789864344987?list_name=i-r-zh_tw)  
其中第四章提到了時序耦合（Temporal Coupling）  
覺得是一個值得寫下來筆記的東西，所以就產出了這篇。

第一次看到時序耦合這個詞的時候還以為是…Dio?

![](/img/2021-what-is-temporal-coupling/1618680807.png)

結果並不是，讓我太失望了（並沒有失望）

正文開始
----

**耦合是指程式中模組及模組之間資訊或參數依賴的程度。**  
**其相對的一個概念的詞叫做聚合性，也就是說低耦合性代表高內聚性。**

時序耦合是多種耦合分類中的其中一種　[耦合性 (電腦科學) - 維基百科，自由的百科全書 (wikipedia.org)](https://zh.wikipedia.org/wiki/%E8%80%A6%E5%90%88%E6%80%A7_\(%E8%A8%88%E7%AE%97%E6%A9%9F%E7%A7%91%E5%AD%B8\))

時序耦合指的是這個 Class 中含有的 Functions 有隱性的「先後順序」的耦合性，這是一個「Design Smell」  
舉參考資料的程式碼為例

    public class FileLogger
    /{
      private readonly string _fileName;
      public void Initialize(string fileName)
      /{
        _fileName = fileName;
      /}
    
      public void Write(string message)
      /{
        // dependency with _fileName code
      /} 
    /}

使用這個程式碼，會是這樣

    var fileName = "C:\test.txt";
    var fileLogger = new FileLogger();
    fileLogger.Initialize(fileName);
    fileLogger.Write("Log message.");

假設這個 fileLogger 沒有在呼叫 Write 這個 Function 之前先呼叫 Initialize 就會造成 fileLogger 在 Write 訊息的時候造成無法找到檔案名稱的錯誤  
而這樣子的程式碼所造成的結果就稱之為時序耦合。

如何避免時序耦合?
---------

### 透過 Constructor Injection 的方式

在這個案例中，可以透過 Constructor Injection 的方式進行注入 fileName 即可  
範例程式碼

    public class FileLogger
    /{
      private readonly string _fileName;
      public FileLoger(string fileName)
      /{
        if(string.IsNullOrEmpty(fileName))
        /{
          throw new ArgumentNullException("fileName");
        /}
        _fileName = fileName;
      /}
    
      public void Write(string message)
      /{
        // dependency with _fileName code
      /} 
    /}
    

這樣的方式除了可以避免時序耦合之外，也能夠減少外部呼叫的次數（不需要再呼叫 Initialize）。  
另外也能夠透過建構子的方式觀察到這個 FileLogger 本身所依賴的事情有哪些。

參考資料：  
[How to avoid temporal coupling in C# | InfoWorld](https://www.infoworld.com/article/3239347/how-to-avoid-temporal-coupling-in-c-sharp.html)  
[依賴注入：原理、實作與設計模式 (Dependency Injection: Principles, Practices, Patterns, 2/e)](https://www.tenlong.com.tw/products/9789864344987?list_name=i-r-zh_tw)  
[耦合性 (電腦科學) - 維基百科，自由的百科全書 (wikipedia.org)](https://zh.wikipedia.org/wiki/%E8%80%A6%E5%90%88%E6%80%A7_\(%E8%A8%88%E7%AE%97%E6%A9%9F%E7%A7%91%E5%AD%B8\))

備註：[How to avoid temporal coupling in C# | InfoWorld](https://www.infoworld.com/article/3239347/how-to-avoid-temporal-coupling-in-c-sharp.html)  
這篇當中有提到另一個避免時序耦合的方式（抽象工廠 **abstract factory**），但如果沒有特殊限制的話，我會比較偏好使用本篇所記錄的 constructor injection 的方式來避免時序耦合。