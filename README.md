# miniprogram-im
Wechat miniprogram IM system

# prepare mysql
```sql
CREATE TABLE t_private_conversation (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sessionid VARCHAR(127),
    ts BIGINT,
    content VARCHAR(511) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    type INT,
    sender VARCHAR(63),
    receiver VARCHAR(63),
    INDEX idx_ts (ts),
    INDEX idx_receiver (receiver),
    INDEX idx_sessionid (sessionid)
);
```

# backend build
cd miniprogram-im
mvn install
mvn build

# backend run
java -jar .\target\spring-boot-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

# miniprogram
use 微信开发者工具

# demo
https://raw.githubusercontent.com/crabxmz/miniprogram-im/main/demo.mp4
