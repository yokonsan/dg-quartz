---
{"publish":true,"aliases":"","title":"RPC","created":"2025-08-27T16:07:46.335+08:00","modified":"2026-01-06T10:05:09.679+08:00","tags":["网络协议/rpc"],"cssclasses":""}
---


远程过程调用协议（Remote Procedure Call Protocol），允许像调用本地服务一样调用远程服务或者函数，而无需关心底层网络通信细节。

多用于内网容器通信。外网使用时，需投入更多安全成本，且**性能优势会因TLS握手、网络延迟而减弱**。

## 核心思想

让分布式系统通信**像本地函数调用一样简单**。

-   本地调用：`result = add(1, 2)`
-   RPC 调用：`result = remote_add(1, 2)` （看起来像本地调用，实际通过网络执行）

## 工作流程

```text
┌─────────────┐              ┌─────────────┐
│  客户端      │              │  服务端      │
├─────────────┤              ├─────────────┤
│ 1.调用本地Stub│  ────────►  │             │
│   (代理函数) │   网络传输    │             │
│ 2.序列化参数  │             │ 3.反序列化参数│
│             │             │ 4.执行实际函数│
│ 6.反序列化结果│ ◀────────   │ 5.序列化结果  │
│             │    网络传输   │             │
└─────────────┘              └─────────────┘
```

## 核心组成

| 组件                 | 作用                           |
| -------------------- | ------------------------------ |
| **Stub（存根）**     | 客户端代理，隐藏网络通信细节   |
| **Skeleton（骨架）** | 服务端代理，接收请求并分发     |
| **序列化层**         | 对象 ↔ 二进制/文本格式转换     |
| **传输层**           | 网络通信（TCP、HTTP/2 等）     |
| **协议层**           | 定义消息格式（如 Header+Body） |
| **服务注册中心**     | 服务发现（如 ZooKeeper、etcd） |

**序列化协议：**

-   **文本型**：JSON、XML（可读性好，体积大）
-   **二进制**：Protobuf（gRPC）、Thrift、Hessian（体积小，速度快）

**传输协议：**

-   **TCP**：性能好，需要处理[[Sources/Skill/00 互联网/12 Web 开发/00 网络协议/TCP 协议/粘包问题]]
-   **HTTP/1.1**：通用，但性能较低
-   **HTTP/2**：支持多路复用、头部压缩、流式传输

## 为什么快？

和一次 HTTP 请求调用相比，为什么 RPC 协议更快？

### 1.序列化成本差距

```js
// HTTP/REST - JSON文本序列化
POST /remote-add
{"x":1,"y":2}  // 18字节，还要序列化字符串Key

// gRPC/Protobuf - 二进制序列化
080112 // 仅3字节！数字Tag+变长编码
```

**差异点**：

-   **JSON**：文本解析，需要扫描字符串、处理引号、冒号、逗号，CPU 负载高
-   **Protobuf**：二进制，直接读取字节，用数字编号代替字段名，速度**快 3-5 倍**
-   **体积**：Protobuf 通常小**3-10 倍**，网络传输更快

**实测数据**：同样的数据结构，Protobuf 序列化速度是 JSON 的**4 倍**，体积小**6 倍**

### 2.HTTP 协议开销巨大

#### HTTP/1.1 REST 的问题：

```http
POST /remote-add HTTP/1.1      // 每次都要传
Host: api.example.com
User-Agent: Mozilla/5.0…
Accept: */*
Content-Type: application/json
Cookie: session=xxx…        // 可能几百字节的Header
Authorization: Bearer token… // 又几百字节
Content-Length: 18

{"x":1,"y":2}
```

**问题：**

-   **Header 冗余**：每次请求重复传输**500-1000 字节**无用头信息
-   **连接未复用**：默认每次 [[TCP]]三次握手 + [[Sources/Skill/00 互联网/12 Web 开发/00 网络协议/TLS]]四次握手 = **几百毫秒延迟**
-   **文本协议**：HTTP 是文本协议，解析慢

#### gRPC over [[Sources/Skill/00 互联网/12 Web 开发/00 网络协议/HTTP 2]] 的优化：

```http
// 第一次请求
HEADERS frame (压缩): :method=POST, :path=/Calculator/add
DATA frame: <二进制protobuf数据>

// 后续请求
HEADERS frame: 只传变化的header（用HPACK压缩到几个字节）
DATA frame: <二进制数据>
```

-   **Header 压缩**：[[Cards/永久笔记/HPACK算法]]，重复 Header 只传**2-3 字节**
-   **连接复用**：单个 TCP 连接[[Cards/永久笔记/多路复用 IO]]，**无重复握手**
-   **二进制协议**：HTTP/2 是二进制分帧，解析更快

### 3.连接管理策略

- **TCP握手延迟**：每次HTTP新建连接需要**30-50ms**（TLS更久）
- **RPC长连接**：复用连接，延迟降到**1-2ms**


#网络协议/rpc
