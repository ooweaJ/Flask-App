USER_NAME="dev-user"

sudo apt update

curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable-1.30.txt)/bin/linux/amd64/kubectl"

chmod +x ./kubectl

sudo mv ./kubectl /usr/local/bin/kubectl

kubectl version --client

#Client Version: v1.30.x (최신 안정 버전이 표시됩니다)

tar -xzf ${USER_NAME}-files.tar.gz

## 밑 부분부터 수동으로 작업해야 하는 부분입니다.

# ca.crt 파일을 /etc/kubernetes/pki/ca.crt 위치에서 복사해도 됩니다.
# cp ca.crt /etc/kubernetes/pki/ca.crt
# <> 부분을 실제 API 서버의 IP 주소와 DNS 이름으로 변경합니다.
# ${USER_NAME} 부분은 위에서 정의한 사용자 이름으로 변경합니다.

# sudo vi /etc/hosts
# <cluster-api-server-ip> <k8s-api-server-dns-name>

# mkdir -p $HOME/.kube
# mv ${USER_NAME}.key ${USER_NAME}.crt ca.crt $HOME/.kube/

# kubectl config set-cluster <cluster-name> \
#  --server=https://<k8s-api-server-dns-name>:6443 \
#  --certificate-authority=/home/kosa/.kube/ca.crt \
#  --embed-certs=true

# kubectl config set-credentials ${USER_NAME} \
#  --client-certificate=/home/kosa/.kube/${USER_NAME}.crt \
#  --client-key=/home/kosa/.kube/${USER_NAME}.key \
#  --embed-certs=true

# kubectl config set-context ${USER_NAME}-context \
#  --cluster=<cluster-name> \
#  --user=${USER_NAME} \
#  --namespace=default

# kubectl config use-context ${USER_NAME}-context
# kubectl cluster-info
# kubectl get pods
# kubectl get nodes
# kubectl get svc
# kubectl get deployment

# kubectl auth can-i list pods --namespace development
# kubectl auth can-i create deployment --namespace development
# kubectl auth can-i delete svc --namespace development