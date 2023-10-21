package com.crab.chatserver.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.Assert;

import java.io.Serializable;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WxLoginDTO implements Serializable {
    String code;
    String encryptedData;
    String iv;
    String signature;
    String rawData;

    public void assertNull() {
        Assert.notNull(this, "缺失参数");
        Assert.notNull(code, "缺失code");
    }
}