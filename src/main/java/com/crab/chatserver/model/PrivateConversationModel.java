package com.crab.chatserver.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.io.Serializable;

/*
* drop table t_private_conversation;
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
* */

@Data
@NoArgsConstructor
@TableName(value = "t_private_conversation")
public class PrivateConversationModel implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @TableField(value = "sessionid")
    private String sessionid;

    @TableField(value = "ts")
    private Long ts;

    @TableField(value = "content")
    private String content;

    @TableField(value = "type")
    private Integer type;

    @TableField(value = "sender")
    private String sender;

    @TableField(value = "receiver")
    private String receiver;
}