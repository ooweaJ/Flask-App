kubectl delete -f k8s/db.yaml
kubectl delete -f k8s/pv.yaml
kubectl delete -f k8s/auth.yaml
kubectl delete -f k8s/employee.yaml
kubectl delete -f k8s/photo.yaml
kubectl delete -f k8s/gateway.yaml
kubectl delete -f k8s/nginx.yaml
sudo rm -rf /mnt/data/mysql/*