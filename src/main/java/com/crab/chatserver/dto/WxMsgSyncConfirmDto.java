package com.crab.chatserver.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.Assert;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WxMsgSyncConfirmDto {
    String sender;
    String receiver;

    Long ts;

    public void assertNull() {
        Assert.notNull(this, "缺失参数");
        Assert.notNull(sender, "缺失sender");
        Assert.notNull(receiver, "缺失receiver");
        Assert.notNull(ts, "缺失ts");
    }
}
