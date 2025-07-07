package com.example.immoquebec.service;

import com.example.immoquebec.dto.ConversationDto;
import com.example.immoquebec.dto.MessageListDto;

import com.example.immoquebec.entity.ChatConversation;
import com.example.immoquebec.entity.ChatMessage;
import com.example.immoquebec.mapper.ChatConversationMapper;
import com.example.immoquebec.repository.ChatConversationRepository;
import com.example.immoquebec.repository.ChatMessageRepository;
import com.example.immoquebec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;

@Service
public class ChatConversationService {
    private final ChatConversationRepository chatConversationRepository;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatConversationMapper chatConversationMapper;

    @Autowired
    public ChatConversationService(ChatConversationRepository chatConversationRepository,
                                   UserRepository userRepository,
                                   ChatMessageRepository chatMessageRepository,
                                   ChatConversationMapper chatConversationMapper) {
        this.chatConversationRepository = chatConversationRepository;
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.chatConversationMapper = chatConversationMapper;
    }


    public List<MessageListDto> getConversationByUserId(Long id) {
        return chatConversationRepository.findChatConversationByUserId(id);
    }

    public ConversationDto getConversationById(Long id) {
        return chatConversationMapper.toDto(chatConversationRepository.findById(id).orElseThrow(EntityNotFoundException::new));
    }

    public Long createChat(Long user1Id, Long user2Id) {
        if (!chatConversationRepository.existsByUsersId(user1Id, user2Id)) {
            ChatConversation conversation = new ChatConversation();
            conversation.setDateCreated(new Date());
            conversation.setDateUpdated(new Date());
            conversation.setUser1(userRepository.findUserById(user1Id));
            conversation.setUser2(userRepository.findUserById(user2Id));

            return chatConversationRepository.save(conversation).getId();
        } else {
            return chatConversationRepository
                    .findConversationByUsersId(user1Id, user2Id)
                    .get().getId();
        }
    }

    public void sendMessage(Long conversationId, Long senderId, String content) {
        ChatMessage message = new ChatMessage();
        message.setConversation(chatConversationRepository.findById(conversationId)
                .orElseThrow(EntityNotFoundException::new));
        message.setContent(content);
        message.setDateCreated(new Date());
        message.setSender(userRepository.findUserById(senderId));
        message.getConversation().setDateUpdated(new Date());
        chatMessageRepository.save(message);

    }
}
