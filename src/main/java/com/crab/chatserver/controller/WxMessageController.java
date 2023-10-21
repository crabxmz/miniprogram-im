package com.crab.chatserver.controller;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.crab.chatserver.base.RestResponse;
import com.crab.chatserver.dto.WxMsgSyncConfirmDto;
import com.crab.chatserver.dto.WxMsgSyncDto;
import com.crab.chatserver.dto.WxPrivateMsgDto;
import com.crab.chatserver.model.PrivateConversationModel;
import com.crab.chatserver.service.PrivateConversationService;
import com.crab.chatserver.ws.WebSocketManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

import static com.crab.chatserver.base.RestResponse.error;
import static com.crab.chatserver.base.RestResponse.success;

@Slf4j
@RestController(value = "wxMessageController")
@RequestMapping("/wx/msg")
public class WxMessageController {
    @Autowired
    private PrivateConversationService privateConversationService;

    @PostMapping("/send")
    public RestResponse sendHandler(@RequestBody WxPrivateMsgDto dto) throws IOException {
        if (WebSocketManager.getSession(dto.getSender()) == null) {
            return error("websocket not connect");
        }

        // send to peer
        Session session = WebSocketManager.getSession(dto.getReceiver());
        Long cts = System.currentTimeMillis();
        PrivateConversationModel privateConversationModel = new PrivateConversationModel();
        privateConversationModel.setSessionid(WebSocketManager.generate1to1Key(dto.getSender(), dto.getReceiver()));
        privateConversationModel.setTs(cts);
        privateConversationModel.setType(0);
        privateConversationModel.setContent(dto.getContent());
        privateConversationModel.setSender(dto.getSender());
        privateConversationModel.setReceiver(dto.getReceiver());
        if (session != null && session.isOpen()) { // receiver online
            session.getBasicRemote().sendText(new ObjectMapper().writeValueAsString(privateConversationModel));
        } else { // receiver offline, save to db
            privateConversationService.save(privateConversationModel);
        }
        JSONObject res = new JSONObject();
        res.set("ts", cts);
        return success(res);
    }

    @PostMapping("/pull")
    public RestResponse pullHandler(@RequestBody WxMsgSyncDto dto) {
        if (WebSocketManager.getSession(dto.getReceiver()) == null) { //receiver must connect
            return error("websocket not connect");
        }
        LambdaQueryWrapper<PrivateConversationModel> w = Wrappers.lambdaQuery();
        String sender = dto.getSender();
        String receiver = dto.getReceiver();
        if (sender.compareTo("*") != 0) {
            w.eq(PrivateConversationModel::getSessionid, WebSocketManager.generate1to1Key(sender, receiver));
            w.eq(PrivateConversationModel::getSender, sender);
        }
        w.eq(PrivateConversationModel::getReceiver, receiver);
        w.orderByDesc(PrivateConversationModel::getTs);

        JSONObject res = new JSONObject();
        res.set("oldmsgs", privateConversationService.list(w));
        return success(res);
    }

    @PostMapping("/pullConfirm")
    public RestResponse pullConfirmHandler(@RequestBody WxMsgSyncConfirmDto dto) {
        if (WebSocketManager.getSession(dto.getReceiver()) == null) {//receiver must connect
            return error("websocket not connect");
        }
        LambdaQueryWrapper<PrivateConversationModel> w = Wrappers.lambdaQuery();
        String sender = dto.getSender();
        String receiver = dto.getReceiver();
        if (sender.compareTo("*") != 0) {
            w.eq(PrivateConversationModel::getSessionid, WebSocketManager.generate1to1Key(sender, receiver));
            w.eq(PrivateConversationModel::getSender, sender);
        }
        w.eq(PrivateConversationModel::getReceiver, receiver);
        w.le(PrivateConversationModel::getTs, dto.getTs());

        privateConversationService.delete(w);
        return success("msg before " + dto.getTs() + " sync done");
    }

    @PostMapping("/endConversation")
    public RestResponse removeHandler() {
        return success("remove done");
    }
}
