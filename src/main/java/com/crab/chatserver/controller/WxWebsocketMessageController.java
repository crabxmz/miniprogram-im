package com.crab.chatserver.controller;

import com.crab.chatserver.ws.WebSocketManager;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@ServerEndpoint("/rtwowx/chat/{openid}")
@Slf4j
public class WxWebsocketMessageController {
    @OnOpen
    public void onOpen(@PathParam("openid") String openid, Session session) {
        WebSocketManager.addSession(openid, session);
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("Message received: " + message);
        try {
            session.getBasicRemote().sendText("Echo: " + message);
        } catch (IOException e) {
            log.error("websocket onMessage() exception:", e);
        }
    }

    @OnClose
    public void onClose(Session session) {
//        System.out.println("WebSocket closed: " + session.getId());
        WebSocketManager.removeSession(session.getId());
    }

    @OnError
    public void onError(Throwable t) {
        log.error("websocket onError():", t);
    }
}