# TrustKAI V1

**TrustKAI** adalah _Zero Trust Access Engine_ berbasis API yang
menerapkan prinsip **Never Trust, Always Verify** pada setiap request.

Produk ini dirancang sebagai **backend security engine** untuk
melindungi aplikasi, dashboard admin, dan API dari akses berisiko.

---

## Fitur Utama (V1 - MVP)

- Risk-based access decision
- Rule-based risk scoring
- Decision engine: `ALLOW / CHALLENGE / BLOCK`
- Zero Trust request validation
- Fastify-based high performance API
- Tanpa frontend (backend-first)

---

## Konsep Zero Trust

TrustKAI **tidak langsung percaya** meskipun user sudah login.
Setiap request akan dianalisis berdasarkan:

- Role user
- Status device
- Waktu akses
- Konteks request

Keputusan akses dibuat **setiap request**, bukan hanya saat login.

---

## Tech Stack

- **Node.js**
- **Fastify**
- JavaScript (CommonJS)
- dotenv

---

## 📁 Struktur Project

````text
TrustKAI-v1/
├─ src/
│  ├─ server.js
│  ├─ app.js
│  ├─ routes/
│  │  └─ verifyAccess.js
│  ├─ engine/
│  │  ├─ riskEngine.js
│  │  └─ decisionEngine.js
│  ├─ schemas/
│  │  └─ verifySchema.js
│  └─ utils/
│     └─ logger.js
├─ .env
├─ package.json
└─ README.md

API Endpoint
POST /v1/verify-access
Request Body
json
Copy code
{
  "role": "admin",
  "is_new_device": true,
  "outside_office_hour": true
}

Response json
{
  "decision": "BLOCK",
  "risk_score": 65,
  "reasons": [
    "NEW_DEVICE",
    "OUTSIDE_OFFICE_HOUR",
    "ADMIN_ROLE"
  ]
}
Instalasi & Menjalankan
Install Dependency
bash
## Environment Setup

Copy `.env.example` menjadi `.env` lalu sesuaikan konfigurasi.

```bash
cp .env.example .env
npm install
Jalankan Server
bash
Copy code
node src/server.js
Server akan berjalan di:

http://localhost:3000
Tujuan V1
Membuktikan Zero Trust engine berjalan

Menjadi dasar untuk pengembangan V2

Digunakan sebagai MVP / prototype

Roadmap Selanjutnya
V2: API Key, Redis cache, device fingerprint lanjutan

V3: Risk engine berbasis Go untuk high-performance scale

Catatan Penting
TrustKAI V1 bukan produk compliance resmi

Tidak menggantikan sistem keamanan enterprise

Fokus pada risk mitigation dan access decision

Author
Ahmad Haikal Rizal
Zero Trust Security Engine
````

## Versioning

- **v1.0.0** — Zero Trust Access Engine (MVP)
- **v2.0.0 (In Progress)** — API Key, Redis device memory, rate limiting

## 🚧 TrustKAI V2 (Planned Features)

- API Key authentication
- Device memory with Redis
- Rate limiting
- Automated testing
