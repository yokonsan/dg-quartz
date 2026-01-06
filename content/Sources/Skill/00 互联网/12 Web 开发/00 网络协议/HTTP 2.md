---
{"publish":true,"created":"2025-08-27T16:07:46.891+08:00","modified":"2026-01-06T10:07:46.557+08:00","cssclasses":""}
---


> 二进制协议，可读性为0。利用如Wireshark等工具解析。

## 术语

- `Stream` ：一个双向流，一条连接可以有多个streams
- `Message` ：逻辑上的request，response
- `Frame` ：数据传输的最小单位。每个 Frame 都属于一个特定的 stream 或者整个连接。一个 message 可能由多个 frame 组成。

## Frame Format

- Frame 定义：
	![[Extras/Media/Pasted image 20230315151141.png]]
	
	- Length：Frame的长度，默认最大长度是16KB，可显式设置
	- Type：Frame的类型，如Data、HEADERS、PRIORITY等
	- Flags、R：保留位
	- Stream Identifier：标识所属的stream，如为0，则表示该frame属于整条连接
	- Frame Payload：根据不同Type有不同格式

## Multiplexing

- HTTP/2 通过 stream 支持了连接的多路复用，提高了连接的利用率。
- Stream 有很多重要特性：
	- 一条连接可以包含多个 streams，多个 streams 发送的数据互相不影响。
	- Stream 可以被 client 和 server 单方面或者共享使用。
	- Stream 可以被任意一段关闭。
	- Stream 会确定好发送 frame 的顺序，另一端会按照接收到的顺序来处理。
	- Stream 用一个唯一 ID 来标识。
- Stream ID
	- client创建的stream，ID为奇数
	- server创建的stream，ID为偶数
	- ID `0x00` 和 `0x01` 都有特定的使用场景，不会用到
	- 不可能被重复使用，如一条连接上的ID分配完了：
		- client会新建一条连接
		- server则会给client发送一个GOAWAY frame强制让client新建一条连接
- 调大`SETTINGS_MAX_CONCURRENT_STREAMS` 配置，提高一条连接上的stream并发
- 一条连接能跑多streams，但通常只有一个线程在处理，无法利用多核优势，换成多条连接更好

## Priority

- 一条连接允许多个streams在上面发送frame，支持设置stream的优先级。

## Flow Control

- 支持流控
	如sender端发送数据太快，receiver端压力太大，或者只想给特定stream分配资源。
	
- Flow control 有如下特性：
	- Flow control 是单向的。Receiver 可以选择给 stream 或者整个连接设置 window size。
	- Flow control 是基于信任的。Receiver 只是会给 sender 建议它的初始连接和 stream 的 flow control window size。
	- Flow control 不可能被禁止掉。当 HTTP/2 连接建立起来之后，client 和 server 会交换 SETTINGS frames，用来设置 flow control window size。
	- Flow control 是 hop-by-hop，并不是 end-to-end 的，也就是我们可以用一个中间人来进行 flow control。
	- HTTP/2 默认的 window size 是 64 KB

## [[Cards/永久笔记/HPACK算法]]

- 解决HTTP/1.x协议header会很庞大以及重复发送的问题
- HPACK提供一个静态和动态的table：
	- 静态table定义了通用的HTTP header fields，如method、path等，发送请求时，只需知道field咋table里的索引即可
	- 动态table，初始化为空，两边交互后，发现新的field，就添加到动态table上，后面的请求和静态table一样
- 为了减少数据传输的大小，使用`Huffman` 进行编码
