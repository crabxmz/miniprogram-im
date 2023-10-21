package com.crab.chatserver.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.crab.chatserver.model.PrivateConversationModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

public interface PrivateConversationService {
    void save(PrivateConversationModel model);

    List<PrivateConversationModel> list(LambdaQueryWrapper<PrivateConversationModel> q);

    void delete(LambdaQueryWrapper<PrivateConversationModel> q);
}
