package com.example.immoquebec.repository;


import com.example.immoquebec.dto.MessageListDto;
import com.example.immoquebec.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {

    @Query("select new" +
            " com.example.immoquebec.dto.MessageListDto (a.id, a.user1.id, a.user2.id," +
            " a.user1.userDetails.name, a.user2.userDetails.name,a.user1.userDetails.imageUrl, a.user2.userDetails.imageUrl, a.dateCreated) from ChatConversation a" +
            " where a.user1.id = ?1 or a.user2.id = ?1 order by a.dateUpdated desc ")
    List<MessageListDto> findChatConversationByUserId(Long id);

    Optional<ChatConversation> findById(Long id);

    @Query("select case when count(a) > 0 then true else false end from ChatConversation a " +
            "where (a.user1.id = ?1 and a.user2.id = ?2) or (a.user1.id = ?2 and a.user2.id = ?1) ")
    boolean existsByUsersId(Long user1, Long user2);

    @Query("select c from ChatConversation c where" +
            " (c.user1.id = ?1 and c.user2.id = ?2) or (c.user1.id = ?2 and c.user2.id = ?1)")
    Optional<ChatConversation> findConversationByUsersId(Long user1, Long user2);


}
