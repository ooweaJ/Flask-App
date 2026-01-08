docker build -t hyunhojang/auth_server:v2.02 ./auth_server
docker build -t hyunhojang/employee_server:v2.02 ./employee_server
docker build -t hyunhojang/gateway:v2.02 ./gateway
docker build -t hyunhojang/photo_service:v2.02 ./photo_service
docker build -t hyunhojang/frontend:v2.02 ./frontend
docker push hyunhojang/auth_server:v2.02
docker push hyunhojang/employee_server:v2.02
docker push hyunhojang/gateway:v2.02
docker push hyunhojang/photo_service:v2.02
docker push hyunhojang/frontend:v2.02