---
title: 好爽喔，原來可以在瀏覽器 Console 操作 Pinia 狀態
date: 2025-10-08 22:26:30
tags: 
  - Vue.js
  - Pinia
---

![alt text](../img/2025-how-to-control-pinia-in-browser-console/image.png)

今天在測試 Vue 專案時，我臨時需要切換某個使用者狀態，這招從 AI 偷學來的😜
結果發現透過瀏覽器的 console 就能直接操作 Pinia 的 state，像這樣

```js
const pinia = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia
pinia.state.value.user.isWarningMessageDismissed = false
```

執行後畫面立刻更新，完全不需要重新登入或透過後端修改資料，太爽辣~
但爽歸爽還是得注意一下相關的風險

這篇就來簡單介紹一下 Pinia，並說明為什麼這種做法 **不建議** 用在較複雜的測試或正式驗證流程中
以及該如何用更穩健的方式處理


## 🧩 什麼是 Pinia？

Pinia 是 **Vue.js** 官方推薦的狀態管理工具，用來集中管理應用的共用資料
它的概念類似 React 的 Redux 或 Zustand
...
蝦？什麼？你說講人話？
好，簡單來說
可以把它想成整個網站的「中央資料中心」
不論是哪一個頁面或按鈕，只要要用到同樣的資料
都能從這個中心取得或更新，讓資料保持一致


舉例來說，一個簡單的 `user` store：

```
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isWarningMessageDismissed: true
  }),
  actions: {
    toggleConsent() {
      this.isWarningMessageDismissed = !this.isWarningMessageDismissed
    }
  }
})
```

在任何元件裡都可以用：

```
import { useUserStore } from '@/stores/user'

const user = useUserStore()
console.log(user.isWarningMessageDismissed)
```

## ⚡測試時的快速修改：直接改 Pinia state

當你在瀏覽器中開啟 Vue 應用（假設掛在 #app 上）時，
Vue 會把整個應用程式的實例存在 DOM 元素中，因此你可以這樣取得：

```
document.querySelector('#app').__vue_app__
```

這個物件底下有一個 config.globalProperties.$pinia，
就是整個應用的 Pinia 實例


於是我們可以：
```
const pinia = document.querySelector('#app').__vue_app__.config.globalProperties.$pinia
pinia.state.value.user.isWarningMessageDismissed = false
```

這樣就能直接修改狀態，而不必打開 DevTools 或修改程式碼
在開發或 debug 階段確實非常方便 😜


## ⚠️但這個方法比較適合簡單的測試情境

雖然這個技巧很炫炮，但它其實有幾個問題

1. 繞過應用邏輯
你直接修改 state，沒有經過 actions 或 getters，可能導致邏輯流程與實際應用不一致

2. 缺乏狀態追蹤
直接改值的操作不會出現在 Pinia DevTools 的 mutation log 中，測試結果難以重現，也不容易讓其他人理解狀態是怎麼變的

3. 在多 store 或非同步行為中容易出錯
當應用內有多個 store、或 state 與 API 綁定時，直接操作可能讓某些資料失去同步，導致測試結果不穩定


## ✅ 較佳的解法

如果只是為了方便測試，可以採用以下幾種更好的方式

### 1️⃣ 在 store 中建立「測試模式」的 action
```
export const useUserStore = defineStore('user', {
  state: () => ({
    isWarningMessageDismissed: true
  }),
  actions: {
    setConsentForTest(value) {
      if (import.meta.env.MODE === 'development') {
        this.isWarningMessageDismissed = value
      }
    }
  }
})
```

然後在 console 中：

```
const user = useUserStore()
user.setConsentForTest(false)
```

好處是：
> 狀態變化仍透過 action 流程，可被追蹤、受控，且不會污染正式驗證邏輯

### 2️⃣ 使用 Vue.js DevTools

在 Vue DevTools 開啟 Pinia 模組，可直接修改 state、呼叫 action
有視覺化界面，也能記錄 mutation log


## 🧠 結語

在開發階段用 Console 快速改 Pinia 狀態沒啥大問題
但在需要模擬多層邏輯、非同步請求或狀態流的測試中
這種方式就不夠穩定、也不容易重現結果
如果要走比較正規一點的方式個人會比較偏好使用 Vue.js DevTools，但就需要請 RD 把那個開關打開
重新佈署到 dev 或其他測試環境上

最後，因為照片不知道用什麼，所以...
就隨便用散步路上隨手拍的好了😜