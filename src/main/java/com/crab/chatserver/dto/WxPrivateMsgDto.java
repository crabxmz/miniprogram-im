package com.crab.chatserver.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.Assert;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WxPrivateMsgDto {
    String sender;
    String receiver;
    String content;
    // 0:text 1:img
//    int msgType;

    public void assertNull() {
        Assert.notNull(this, "缺失参数");
        Assert.notNull(sender, "缺失sender");
        Assert.notNull(receiver, "缺失receiver");
        Assert.notNull(content, "缺失content");
//        Assert.notNull(msgType, "缺失msgType");
    }
}
