# MERN (MongoDB Express React Node.js) 架構開發書店網站(Back_end)

網站連結：[bookShop](https://bookshop-8u9l.onrender.com)

## 描述

運用 Express 框架開發後端 API ，使用 middleware 驗證身份(JWT)，並區分使用者角色(Admin, Editor, customer)限制 API 呼叫，資料庫使用 MongoDB，使用 Mongoose 庫控制。

## API

-   /users (Access：Admin only)
    -   管理使用者 CRUD
-   /books
    -   get: 取得所有書籍 (Access：Public)
    -   post: 新增書籍 (Access：Editor, Admin)
    -   patch: 修改書籍資訊 (Access：Editor, Admin)
    -   delete: 刪除書籍 (Access：Editor, Admin)
-   /client
    -   post /register: 註冊 (Access：Public)
    -   post /login: 登入 (Access：Public)
    -   post /logout: 登出 (Access：Public)
    -   post /refresh: 刷新 JWT (Access：Public)
-   /cart (Access：Private)
    -   get: 取得登入 user 的購物車
    -   patch: 更新購物車
-   /order (Access：Private)
    -   get: 取得登入 user 的訂單
    -   post: 建立新訂單
    -   patch: 修該訂單資訊 (Access：Editor, Admin)
