docker build -t hyunhojang/auth_server:v2.0 ./auth_server
docker build -t hyunhojang/employee_server:v2.0 ./employee_server
docker build -t hyunhojang/gateway:v2.0 ./gateway
docker build -t hyunhojang/photo_service:v2.0 ./photo_service
docker build -t hyunhojang/frontend:v2.0 ./frontend
docker push hyunhojang/auth_server:v2.0
docker push hyunhojang/employee_server:v2.0
docker push hyunhojang/gateway:v2.0
docker push hyunhojang/photo_service:v2.0
docker push hyunhojang/frontend:v2.0