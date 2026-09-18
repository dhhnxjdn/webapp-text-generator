# 大鲤传媒 AI 工作流平台

一个前端承载多个 Dify 工作流的平台。运营人员可以在管理后台新增、编辑、停用或删除工作流；新增后首页会立即出现对应入口，不需要修改代码或重新部署。

## 页面与接口

- `/`：工作流广场，只显示已启用的工作流。
- `/w/[slug]`：动态读取 Dify 参数并渲染表单，通过 SSE 展示运行结果。
- `/admin`：工作流注册表管理，口令登录。
- `/api/workflows`：公开工作流列表，不包含 API Key、API 地址或 App ID。
- `/api/w/[slug]/*`：服务端读取对应工作流密钥并代理 Dify 请求。

API Key 只以 AES-GCM 密文存入 Redis，浏览器不会收到密钥。请勿把任何密钥放入 `NEXT_PUBLIC_*` 环境变量。

## 本地开发

要求 Node.js 18+。安装依赖并创建环境变量文件：

```bash
npm install
copy .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。开发环境未配置 Redis 时会使用进程内存注册表，重启开发服务后数据会清空。

## 生产环境变量

| 变量 | 是否必填 | 用途 |
| --- | --- | --- |
| `DIFY_API_URL` | 否 | 默认 Dify API 地址，默认 `https://api.dify.ai/v1` |
| `UPSTASH_REDIS_REST_URL` | 是 | Upstash Redis REST 地址 |
| `UPSTASH_REDIS_REST_TOKEN` | 是 | Upstash Redis REST Token |
| `ADMIN_PASSWORD` | 是 | 管理后台登录口令 |
| `ADMIN_SESSION_SECRET` | 是 | 管理会话签名密钥，建议至少 32 个随机字符 |
| `REGISTRY_ENCRYPTION_KEY` | 是 | 工作流 API Key 加密密钥，建议至少 32 个随机字符 |
| `NEXT_PUBLIC_APP_BASE_URL_PATH` | 否 | 部署在子路径时设置 |
| `NEXT_PUBLIC_API_PREFIX` | 否 | API 子路径前缀 |

`ADMIN_SESSION_SECRET` 和 `REGISTRY_ENCRYPTION_KEY` 应使用不同的随机值并妥善备份。丢失注册表加密密钥后，已保存的 Dify API Key 将无法解密。

## 接入新工作流

1. 在 Dify 创建并发布 Workflow 或文本生成应用。
2. 在 Dify 的“API 访问”页面创建 API Key。
3. 登录本平台 `/admin`，点击“新增工作流”。
4. 填写名称、slug、Dify API 地址、API Key、应用类型和结果展示模式。
5. 点击“验证并保存”。平台会先调用 Dify 参数接口校验连接。
6. 返回首页，新卡片会立即出现并可运行。

编辑工作流时 API Key 留空，会保留当前密钥。停用工作流会从公开列表和运行页隐藏，但不会删除注册表记录。

## 质量检查

```bash
npm run typecheck
npm run lint
npm run build
```

生产部署必须使用可持久化的 Redis 配置；内存注册表只在开发环境启用。
