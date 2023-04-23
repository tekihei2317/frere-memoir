# frere-memoir

[花束問題](https://www.benkyoenkai.org/contents/Bouquet1-2)というデータモデリングの問題をテーマにした、在庫管理アプリケーションです。

アプリケーションについては、次の記事で解説しています。

[TypeScriptで業務アプリを試作してみた（tRPC+Prisma）](https://zenn.dev/tekihei2317/articles/1d0b4a04c6bf99)

## アプリケーションの概要

> フラワーショップ「フレール・メモワール」は店舗売りとは切り離してWEBショップ事業を立ち上げた。WEBで注文を受け付けて、指定された日付に指定場所に花束を届けるという形態。

> 当初は受注も少なく手作業で管理出来ていたが、受注が増えるにつれシステム化の必要性が出てきた。「新鮮な花を大切な記念日に」を売り文句にしていることもあって、廃棄される在庫が多く、受注の増加にともなって利益が伸びていないため。

フラワーショップ「フレール・メモワール」のための、花束の注文・在庫管理のシステムです。

![](https://i.gyazo.com/784e07ef289f6fb3c05bf039eef7b2e3.jpg)

このシステムのサーバー側は、次の5つのモジュールに分割されて作成されています。

| コンテキスト                              | 説明                                             |
| ----------------------------------------- | ------------------------------------------------ |
| [メンテナンス](./server/src/context-auth) | 花束や花などのデータを管理する                   |
| [仕入れ](./server/src/context-purchase)   | 花の仕入れを行う                                 |
| [在庫](./server/src/context-inventory)    | 現在の在庫や在庫推移を確認したり、花の破棄を行う |
| [認証](./server/src/context-auth)         | ユーザーが、ユーザー登録やログインをする         |
| [注文](./server/src/context-order)        | ユーザーが、花束の注文を行う                     |

## データベース設計

[schema.prisma](./server/prisma/schema.prisma)

## 技術スタック

- [tRPC](https://trpc.io/)
- [Prisma](https://www.prisma.io/)
- [Next.js](https://nextjs.org/)
- [Mantine](https://mantine.dev/)

## 環境構築

```bash
yarn install

cd server
cp .env.example .env
docker compose up -d

cd ../web
yarn run dev
```
