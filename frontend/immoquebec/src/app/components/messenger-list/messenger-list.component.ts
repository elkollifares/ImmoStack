import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConversationList } from '../../models/conversation-list.model';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-messenger-list',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './messenger-list.component.html',
  styleUrls: ['./messenger-list.component.css']
})
export class MessengerListComponent implements OnInit {

  conversations: ConversationList[] = [];
  @Output() clickedConversation = new EventEmitter<number>();
  @Output() clickedName = new EventEmitter<string>();

  constructor(public chatService: ChatService, public authService: AuthenticationService) {}

  ngOnInit(): void {
    this.chatService.getList().subscribe((val) => {
      this.conversations = val;
    });
  }

  emitValue(id: number): void {
    console.log('Conversation ID emitted:', id); // Log added
    this.clickedConversation.emit(id);
    this.conversations.forEach(conv => {
      if (conv.id === id) {
        if (conv.user1Id !== this.authService.currentUserValue!.id) {
          this.clickedName.emit(conv.user1Name);
        } else {
          this.clickedName.emit(conv.user2Name);
        }
      }
    });
  }
}
