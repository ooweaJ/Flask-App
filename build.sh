docker build -t hyunhojang/auth_server:v2.01 ./auth_server
docker build -t hyunhojang/employee_server:v2.01 ./employee_server
docker build -t hyunhojang/gateway:v2.01 ./gateway
docker build -t hyunhojang/photo_service:v2.01 ./photo_service
docker build -t hyunhojang/frontend:v2.01 ./frontend
docker push hyunhojang/auth_server:v2.01
docker push hyunhojang/employee_server:v2.01
docker push hyunhojang/gateway:v2.01
docker push hyunhojang/photo_service:v2.01
docker push hyunhojang/frontend:v2.01