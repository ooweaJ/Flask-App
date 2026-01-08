import jwt
import datetime
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext

# 우리가 만든 db.py와 models.py에서 필요한 것들을 가져옵니다.
from common.database import get_user_by_username, add_user
from common.models import User

# 1. 비밀번호 암호화 도구 설정 (bcrypt 알고리즘 사용)
#pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = 'dev-jwt-secret'

# --- 데이터 모델 정의 ---
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    full_name: str = None
    email: str = None

# --- [API 1] 회원가입 (Register) ---
@app.post('/auth/register')
async def register(req: RegisterRequest):
    # 1. 중복 체크 (DB에 이미 이 아이디가 있는지 확인)
    existing_user = get_user_by_username(req.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")

    # 2. 비밀번호 해싱 (C++의 암호화 함수 호출과 같습니다)
    # 사용자가 친 '1234'를 '$2b$12$...' 형태의 암호문으로 바꿉니다.
    #hashed_password = pwd_context.hash(req.password)

    # 3. DB 객체 생성 및 저장
    new_user_data = User(
        username=req.username,
        password=req.password,
        full_name=req.full_name,
        email=req.email
    )
    
    saved_user = add_user(new_user_data)
    
    return {"message": "회원가입 성공!", "id": saved_user.id}

# --- [API 2] 로그인 (Login) ---
@app.post('/auth/login')
async def login(req: LoginRequest):
    # 1. DB에서 유저 찾기
    user = get_user_by_username(req.username)
    
    if not user:
        raise HTTPException(status_code=401, detail="아이디가 존재하지 않습니다.")

    # 2. 비밀번호 대조 (입력한 비번 vs DB의 암호화된 비번)
    if req.password != user.password:
        raise HTTPException(status_code=401, detail="비밀번호가 틀렸습니다.")

 # 3. JWT 토큰 발행 (핵심!)
    # payload에 'id'를 넣어야 employee_server에서 owner_id로 사용합니다.
    payload = {
        'user': user.username,
        'id': user.id,  # DB에서 자동 생성된 유저의 PK ID
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1) # 1시간은 짧을 수 있어 24시간으로 늘렸습니다.
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return {'token': token}