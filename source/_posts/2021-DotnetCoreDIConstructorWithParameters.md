
---
title: "C# - Dotnet core 的 DI 如何在註冊時帶給建構子未註冊進 DI 的服務"
date: 2021-03-18
tags: 
  - '.NetCore'
  - 'Constructor'
  - 'DI'
---

因為要用 AWS lambda function 的緣故，所以有時候會需要在註冊服務時代入還沒註冊好的實體

註冊已經註冊進 DI 的實體
--------------

程式碼準備
-----

準備 interface IAction 跟 class Action

    public interface IAction
    /{
        void ShakeHands();
    /}
    
    public class Action : IAction
    /{
        public void Dance()
        /{
            Console.WriteLine("Dancing!");
        /}
    /}

準備一個 dog 的 interface 跟 他的 class，並且需要透過建構子注入 IAction 這個服務

    public interface IDog
    /{
        void DogDance();
    /}
    
    public class Dog : IDog
    /{
        IAction _action;
        public Dog(IAction action)
        /{
            _action = action;
        /}
        public void DogDance()
        /{
            Console.WriteLine("Dog is");
            _action.Dance();
        /}
    /}
    
    

蛤? 你說狗不會跳舞怎麼可以繼承 IAction 然後 Dance?

這不是在跳了嗎(誤

主程式碼 長這個樣子

    static void Main(string[] args)
    /{
        var serviceCollection = new ServiceCollection();
    
        serviceCollection.AddScoped<IAction, Action>();
        serviceCollection.AddScoped<IDog, Dog>();
    
        var serviceProvider = serviceCollection.BuildServiceProvider();
        var dog = serviceProvider.GetService<IDog>();
    
        dog.DogDance();
    /}

就可以看到執行結果

    Dog is
    Dancing!

如果是已經註冊進 DI 的服務，服務在啟動時會自動幫忙注入已經註冊的實體，所以只要`serviceCollection.AddScoped<IDog, Dog>();`即可

註冊時，代入未註冊進 DI 的實體
-----------------

這時就需要將原本的 Dog 多新增一點需要依賴的服務啦，最近 Cyberpunk 2077 很紅，那就讓它變成機器狗吧

![Dogenator | Cyberpunk, Cyberpunk 2077, Dog communication](/img/2021-DotnetCoreDIConstructorWithParameters/4137968e6d4fab392ba7db14017ec100.jpg)

所以就先定義一個 Machine 的 class 吧!

    public class Machine
    /{
        public void Glow()
        /{
            Console.WriteLine("Glowing!");
        /}
    /}
    

機器人的特色就是會發光 所以就讓他可以 Glow!

接下來將狗的 Constructor 變成需要多依賴 Machine 這個 class 吧!

    public interface IDog
    /{
        void DogDance();
        void DogGlow();
    /}
    
    public class Dog : IDog
    /{
        IAction _action;
        Machine _machine;
        public Dog(IAction action, Machine machine)
        /{
            _action = action;
            _machine = machine;
        /}
        public void DogDance()
        /{
            Console.WriteLine("Dog is");
            _action.Dance();
        /}
    
        public void DogGlow()
        /{
            Console.WriteLine("Dog is");
            _machine.Glow();
        /}
    /}
    

主程式碼修改成這樣

    static void Main(string[] args)
    /{
        var serviceCollection = new ServiceCollection();
    
        serviceCollection.AddScoped<IAction, Action>();
        serviceCollection.AddScoped<IDog>(svc => new Dog(svc.GetService<IAction>(), new Machine()));
    
        var serviceProvider = serviceCollection.BuildServiceProvider();
        var dog = serviceProvider.GetService<IDog>();
    
        dog.DogDance();
        dog.DogGlow();
    /}
    

關鍵在於這一行，

    serviceCollection.AddScoped<IDog>(svc => new Dog(svc.GetService<IAction>(), new Machine()));

`svc` 的類別是 `IServiceProvider`  
`new Dog` 的意思可以理解為 將 Dog 註冊至 IDog 中  
而`svc.GetService<IAction>(), new Machine()`這部分可以理解為取得已經註冊的實體並注入進 new Dog 的這個 constructor 中

就可以看到執行結果

    Dog is
    Dancing!
    Dog is
    Glowing!

以上為今天的筆記  
感謝收看!

本篇的 github 連結:  
[SQZ777/DotnetCoreDIWithParamter (github.com)](https://github.com/SQZ777/DotnetCoreDIWithParamter)  
Refrence:  
[筆記 - 不可不知的 ASP.NET Core 依賴注入-黑暗執行緒 (darkthread.net)](https://blog.darkthread.net/blog/aspnet-core-di-notes/)  
[ServiceCollectionServiceExtensions.AddScoped 方法 (Microsoft.Extensions.DependencyInjection) | Microsoft Docs](https://docs.microsoft.com/zh-tw/dotnet/api/microsoft.extensions.dependencyinjection.servicecollectionserviceextensions.addscoped?view=dotnet-plat-ext-5.0&WT.mc_id=DOP-MVP-37580#Microsoft_Extensions_DependencyInjection_ServiceCollectionServiceExtensions_AddScoped__1_Microsoft_Extensions_DependencyInjection_IServiceCollection_System_Func_System_IServiceProvider___0__)