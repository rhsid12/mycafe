# MyCafe Server (Express)

프론트엔드와 분리된 백엔드 서버입니다.

## 개발 환경 설정

### 1. 환경 변수

`server/.env.example`을 복사해 `server/.env`를 만듭니다.  
(`.env`는 Git에 올리지 않습니다. `server/.gitignore`에 등록되어 있습니다.)

```bash
copy .env.example .env
```

PostgreSQL 접속 정보를 실제 환경에 맞게 수정합니다.

### 2. 의존성 설치

```bash
cd server
npm install
```

### 3. 데이터베이스 생성 (최초 1회)

PostgreSQL에서 데이터베이스를 만듭니다.

```sql
CREATE DATABASE mycafe;
```

### 4. 데이터베이스 생성 + 스키마/시드 적용

```bash
npm run db:setup
```

연결만 확인할 때:

```bash
npm run db:check
```

### 5. 개발 서버 실행

```bash
npm run dev
```

기본 주소: `http://localhost:4000`

## API (기본)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| GET | `/api/menus` | 메뉴 목록 |
| PATCH | `/api/menus/:id/stock` | 재고 증감 (`{ "delta": 1 }`) |
| POST | `/api/orders` | 주문 생성 |
| GET | `/api/orders` | 주문 목록 |
| GET | `/api/orders/:id` | 주문 상세 |
| PATCH | `/api/orders/:id/status` | 주문 상태 변경 |

## 루트에서 실행

프로젝트 최상위에서:

```bash
npm run server:dev
npm run server:init-db
```
