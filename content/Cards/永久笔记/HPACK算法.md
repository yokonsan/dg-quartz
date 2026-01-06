---
{"publish":true,"created":"2026-01-06T10:06:14.258+08:00","modified":"2026-01-06T10:07:07.239+08:00","cssclasses":""}
---


解决 HTTP/1.x 协议 header 会很庞大以及重复发送的问题。为了减少数据传输的大小，使用`Huffman` 进行编码

HPACK 提供一个静态和动态的 table：

- 静态 table 定义了通用的 HTTP header fields，如 method、path 等，发送请求时，只需知道 field 咋 table 里的索引即可
- 动态 table，初始化为空，两边交互后，发现新的 field，就添加到动态 table 上，后面的请求和静态 table 一样
