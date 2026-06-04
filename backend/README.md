# MyCafe Backend

## 1) 환경 변수
`backend/.env.example`를 복사해 `backend/.env`를 만들고 값을 채웁니다.

## 2) 의존성 설치
```bash
cd backend
npm install
```

## 3) 데이터베이스 준비
PostgreSQL에서 `DB_NAME`에 해당하는 데이터베이스를 먼저 생성합니다.

예시:
```sql
CREATE DATABASE mycafe;
```

## 4) 스키마/초기데이터 적용
```bash
npm run db:init
```

## 5) 서버 실행
```bash
npm run dev
```

기본 주소: `http://localhost:4000`

## 6) API
- `GET /api/health`
- `GET /api/menus`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

### 주문 생성 예시
```json
{
  "items": [
    {
      "menuId": 1,
      "quantity": 2,
      "optionIds": [1]
    }
  ]
}
```
