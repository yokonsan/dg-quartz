---
{"publish":true,"title":"Elasticsearch 的倒排索引","created":"2025-08-27T16:07:46.329+08:00","modified":"2026-01-06T18:01:46.967+08:00","tags":["工具/Elasticsearch"],"cssclasses":""}
---


> Elasticsearch 是一个支持全文搜索的数据库。

## 为什么叫“倒排”

- 正排：传统数据库（如 [[MySQL]]）默认的方式是正排。**结构是：文档 ID →→ 文档内容**
- 倒排：结构是 **关键词 →→文档 ID 列表**

## 构建倒排索引（Inverted Index）

1. 先对需要搜索的字段进行分词
2. 然后按照单词，给需搜索字段做索引

ES 的物理存储结构和 MySQL 的 InnoDB 的索引是差不多的，都是一颗查找树。

## 示例

两条 ES 数据：
![[Extras/Media/Pasted image 20230815175705.png]]

倒排索引后：
![[Extras/Media/Pasted image 20230815175726.png]]

搜索关键词“苹果手机”，ES 会对关键词做相同的分词，然后在倒排索引中搜索输入的每个分词：
![[Extras/Media/Pasted image 20230815175901.png]]

根据匹配度排序返回命中的结果。

> 苹果 Apple iPhone XS Max (A2104) 256GB 金色 移动联通电信 4G 手机双卡双待
> 
> 烟台红富士苹果 5kg 一级铂金大果 单果 230g 以上 新鲜水果

#工具/Elasticsearch
