package com.crab.chatserver.controller;

import cn.hutool.http.HttpUtil;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.crab.chatserver.base.RestResponse;
import com.crab.chatserver.dto.WxLoginDTO;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@RestController(value = "wxLoginController")
@RequestMapping("/wx")
public class WxLoginController {

    @Value("${spring.wx.appid}")
    String appId;

    @Value("${spring.wx.appsecret}")
    String appSecret;

    @PostMapping("/auth")
    public RestResponse wxAuth(@RequestBody WxLoginDTO dto) {
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appId
                + "&secret=" + appSecret
                + "&js_code=" + dto.getCode()
                + "&grant_type=authorization_code";
        String result = HttpUtil.get(url);
        JSONObject ret = new JSONObject();
        if (StringUtils.isNotBlank(result)) {
            ret = new JSONObject(result);
        }
        System.out.println(result);

        return RestResponse.success(ret);
    }
}
