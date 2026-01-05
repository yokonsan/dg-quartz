---
{"publish":true,"created":"2025-08-27T16:07:46.329+08:00","modified":"2026-01-05T16:37:56.208+08:00","cssclasses":""}
---


## 核心目标

实现**点对点（ [[Cards/永久笔记/P2P]] ）** 的音视频或数据传输，即尽量让两个用户直接连接，不经过中间服务器中转，以降低延迟和成本。

## 介绍

但在现实网络中，由于 **[[Cards/永久笔记/NAT]]（防火墙/路由器）** 的存在，两台电脑往往不知道对方的公网 IP，直接连通很困难。

WebRTC (Web Real-Time Communication) 通过一套名为 **[[Cards/永久笔记/ICE]]** 的机制，利用 **[[Cards/永久笔记/STUN]]** 和 **[[Cards/永久笔记/TURN]]** 服务器来“打洞”穿越防火墙，找到彼此的地址（**[[Cards/永久笔记/Candidate]]**），并通过**信令服务器**交换“名片”（**[[Cards/永久笔记/SDP]]**），最终选出一条最佳路径建立连接的全过程。

## 信令服务器 (Signaling Server)

在 WebRTC 建立连接之前，用于交换 SDP 和 Candidate 的服务器。WebRTC 并不规定它的实现，通常用 WebSocket。
