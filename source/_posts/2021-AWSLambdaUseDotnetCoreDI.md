
---
title: "C# - 如何在 AWS lambda 裡面使用 dotnet core 的 DI"
date: 2021-03-14
tags: 
  - '.NET CORE'
  - 'aws'
  - 'aws lambda'
  - 'dependency injection'
---

dotnet core 的 DI 很好用

所以筆記一下如何在 AWS Lambda 裡面也使用 dotnet core 的 DI

首先先建立一個 interface, 就叫 ITalkService 好了~

    namespace AWSLambdaAndDI
    /{
        public interface ITalkService
        /{
            string SayHello(string name);
        /}
    /}

再寫一個他的實體 TalkService

    namespace AWSLambdaAndDI
    /{
        public class TalkService : ITalkService
        /{
            public string SayHello(string name)
            /{
                return name + ": hello!";
            /}
        /}
    /}

這樣一來我們已經有了 interface 也有實作他的 class，接下來就來看一下如何在一般的 function 使用 dotnet core 的 DI 吧

首先需要使用 dotnet core CLI 來新增 package

    dotnet add package Microsoft.Extensions.DependencyInjection

裝完之後就可以看到相依性裡面的套件出現 Microsoft.Extensions.DependencyInjection

![](/img/2021-AWSLambdaUseDotnetCoreDI/1615732181.png)

我使用了 Visual Studio 來建立了一個 AWS Lambda 的專案，初始的程式碼會長這樣，並將這個 lambda 的 function 相依於前面已經實作好的 interface

    using Amazon.Lambda.Core;
    
    // Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
    [assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]
    
    namespace AWSLambdaAndDI
    /{
        private readonly ITalkService _talkService;
    
        public class Function
        /{
            
            /// <summary>
            /// A simple function that takes a string and does a ToUpper
            /// </summary>
            /// <param name="input"></param>
            /// <param name="context"></param>
            /// <returns></returns>
            public string FunctionHandler(string input, ILambdaContext context)
            /{
                return input?.ToUpper();
            /}
        /}
    /}
    

如果要加入 DI ，需要在 constructor 中將需要用的 instance 跟對應到的 interface 進行註冊

constructor 的 code 會長這個樣子

    public Function()
    /{
      // 建立 DI
      var serviceCollection = new ServiceCollection();
      // 將 TalkService 註冊進 DI
      serviceCollection.AddTransient<ITalkService, TalkService>();
      var serviceProvider = serviceCollection.BuildServiceProvider();
      // 將註冊進 DI 的 talkService 注入 _talkService 這個 interface
      this._talkService = serviceProvider.GetService<ITalkService>();
    /}

確定好 talkService 註冊並且注入進 this.\_talkService 之後，就將 talkService 放進 FunctionHandler 中吧!  
目前的 Lambda Function code 就會長這個樣子

    using Amazon.Lambda.Core;
    using Microsoft.Extensions.DependencyInjection;
    
    // Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
    [assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]
    
    namespace AWSLambdaAndDI
    /{
        public class Function
        /{
            private readonly ITalkService _talkService;
            public Function()
            /{
                // 建立 DI
                var serviceCollection = new ServiceCollection();
                // 將 TalkService 註冊進 DI
                serviceCollection.AddTransient<ITalkService, TalkService>();
                var serviceProvider = serviceCollection.BuildServiceProvider();
                // 將註冊進 DI 的 talkService 注入 _talkService 這個 interface
                this._talkService = serviceProvider.GetService<ITalkService>();
            /}
    
            // 如果需要 unit test 可以利用這個 constructor 來進行 mock talkService
            public Function(ITalkService talkService)
            /{
                this._talkService = talkService;
            /}
    
    
            /// <summary>
            /// A simple function that takes a string and does a ToUpper
            /// </summary>
            /// <param name="input"></param>
            /// <param name="context"></param>
            /// <returns></returns>
            public string FunctionHandler(string input, ILambdaContext context)
            /{
                return this._talkService.SayHello(input);
            /}
        /}
    /}
    

接著來使用 Mock Lambda Test Tool 來執行看看吧

![](/img/2021-AWSLambdaUseDotnetCoreDI/1615734335.png)

以上就可以看到結果囉 "SQZ777: hello!"

如果以上訊息有任何錯誤麻煩告知 感謝各位大大 <(\_ \_)>