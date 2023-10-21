package com.crab.chatserver.ws;

import jakarta.websocket.Session;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WebSocketManager {
    private static final Map<String, Session> user2sessionMap = new ConcurrentHashMap<>();
    private static final Map<String, String> session2userMap = new ConcurrentHashMap<>();

    public static void addSession(String userid, Session session) {
        user2sessionMap.put(userid, session);
        session2userMap.put(session.getId(), userid);
    }

    public static Session getSession(String userid) {
        return user2sessionMap.get(userid);
    }

    public static void removeSession(String sessionId) {
        String userid = session2userMap.remove(sessionId);
        user2sessionMap.remove(userid);
    }

    public static String generate1to1Key(String id1, String id2) {
        boolean isStr1GreaterThanStr2 = id1.compareTo(id2) > 0; // isStr1GreaterThanStr2 will be false
        if (isStr1GreaterThanStr2) {
            return id2 + "_____" + id1;
        } else {
            return id1 + "_____" + id2;
        }
    }
}