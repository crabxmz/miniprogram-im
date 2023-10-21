package com.crab.chatserver.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import com.crab.chatserver.mapper.PrivateConversationMapper;
import com.crab.chatserver.model.PrivateConversationModel;
import com.crab.chatserver.service.PrivateConversationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrivateConversationServiceImpl implements PrivateConversationService {
    @Autowired
    private PrivateConversationMapper privateConversationMapper;

    @Override
    public void save(PrivateConversationModel model) {
        privateConversationMapper.insert(model);
    }

    @Override
    public List<PrivateConversationModel> list(LambdaQueryWrapper<PrivateConversationModel> q) {
        return privateConversationMapper.selectList(q);
    }


    @Override
    public void delete(LambdaQueryWrapper<PrivateConversationModel> q) {
          privateConversationMapper.delete(q);
    }
}
