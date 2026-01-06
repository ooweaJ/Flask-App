from redis.sentinel import Sentinel
import os

# 환경 변수로 관리하면 k8s ConfigMap에서 바꾸기 편합니다.
REDIS_SENTINEL_HOST = os.getenv("REDIS_SENTINEL_HOST", "redis-sentinel-service")
REDIS_SENTINEL_PORT = int(os.getenv("REDIS_SENTINEL_PORT", 26379))
REDIS_MASTER_NAME = os.getenv("REDIS_MASTER_NAME", "mymaster")

# 센티넬 연결 (리스트 형태여야 함)
sentinel = Sentinel([(REDIS_SENTINEL_HOST, REDIS_SENTINEL_PORT)], socket_timeout=0.5)

def get_redis_master():
    # 실시간으로 대장이 누구인지 물어보고 연결 객체 반환
    return sentinel.master_for(REDIS_MASTER_NAME, socket_timeout=0.5)