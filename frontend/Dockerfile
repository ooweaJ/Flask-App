# Nginx 베이스 이미지 사용
FROM nginx:latest

# 내 로컬의 frontend 파일들을 컨테이너 안으로 복사
COPY . /var/www/frontend/

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]