package com.example.immoquebec.mapper;


import com.example.immoquebec.dto.MessageDto;
import com.example.immoquebec.entity.ChatMessage;

public class ChatMessageMapper {
    public static MessageDto toDto(ChatMessage message) {
        return new MessageDto(
                message.getSender().getId(),
                message.getSender().getUserDetails().getName(),
                message.getContent(),
                message.getDateCreated()
        );
    }
}
