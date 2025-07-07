package com.example.immoquebec.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Date;
import java.util.List;

@Getter
@AllArgsConstructor
public class ConversationDto {

    private final Long id;
    private final Long user1Id;
    private final Long user2Id;
    private final Date dateCreated;
    private final List<MessageDto> messages;
}
