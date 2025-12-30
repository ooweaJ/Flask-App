docker build -t jaewoozzang/auth_server:v0.7 ./auth_server
docker build -t jaewoozzang/employee_server:v0.7 ./employee_server
docker build -t jaewoozzang/gateway:v1.6 ./gateway
docker build -t jaewoozzang/photo_service:v0.9 ./photo_service
docker build -t jaewoozzang/frontend:v0.8 ./frontend
docker push jaewoozzang/auth_server:v0.7
docker push jaewoozzang/employee_server:v0.7
docker push jaewoozzang/gateway:v1.6
docker push jaewoozzang/photo_service:v0.9
docker push jaewoozzang/frontend:v0.8