---
{"publish":true,"title":"TLS 连接建立原理","created":"2025-08-28T09:06:08.290+08:00","modified":"2026-01-06T10:05:30.637+08:00","tags":["网络协议/tls"],"cssclasses":""}
---

TLS通过[[Cards/永久笔记/非对称加密]]技术来保证握手过程中的可靠性（公钥加密，私钥解密），再通过[[Cards/永久笔记/对称加密]]技术来保证数据传输过程中的可靠性的。

```mermaid1
sequenceDiagram
    participant Clinet
    participant Server

	Clinet->>Server: 随机数A、支持的加密方法集
	Server-->>Clinet: 随机数B、选定的加密方法
    Server-->>Clinet: 包含公钥的证书
    Clinet->>Clinet: 验证证书，生产随机数C，A+B+C->会话密钥
    Clinet->>Server: 公钥加密的随机数C、加密方法变更通知、快速验证的加密串
    Server->>Server: 私钥解密得到随机数C，A+B+C->会话密钥
    Server-->>Clinet: 加密方法变更通知、快速验证的加密串

    Clinet->>Server: 握手完成，开始对称加密通信
```

#网络协议/tls