package com.example.immoquebec.mapper;


import com.example.immoquebec.dto.MessageListDto;
import com.example.immoquebec.entity.ChatConversation;
import org.springframework.stereotype.Component;

@Component
public class MessageListMapper {

    public MessageListDto toDto(ChatConversation conversation) {
        return new MessageListDto(
                conversation.getId(),
                conversation.getUser1().getId(),
                conversation.getUser2().getId(),
                conversation.getUser1().getUserDetails().getName(),
                conversation.getUser2().getUserDetails().getName(),
                conversation.getUser1().getUserDetails().getImageUrl(),
                conversation.getUser2().getUserDetails().getImageUrl(),
                conversation.getDateCreated()
        );
    }
}
