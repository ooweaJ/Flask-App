docker build -t jaewoozzang/auth_server:v1.0 -f auth_server/Dockerfile .
docker build -t jaewoozzang/employee_server:v1.0 -f employee_server/Dockerfile .
docker build -t jaewoozzang/gateway:v1.0 ./gateway
docker build -t jaewoozzang/photo_service:v1.0 ./photo_service
docker build -t jaewoozzang/frontend:v1.0 ./frontend
docker push jaewoozzang/auth_server:v1.0
docker push jaewoozzang/employee_server:v1.0
docker push jaewoozzang/gateway:v1.0
docker push jaewoozzang/photo_service:v1.0
docker push jaewoozzang/frontend:v1.0
