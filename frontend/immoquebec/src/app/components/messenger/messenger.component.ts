import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConversationList } from '../../models/conversation-list.model';
import { Conversation } from '../../models/conversation.model';
import { AdService } from '../../services/ad-service.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';
import { MatDialog } from '@angular/material/dialog'; 
import { BreakpointObserver } from '@angular/cdk/layout'; 
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MessengerListComponent } from '../messenger-list/messenger-list.component';
import { MessengerWindowComponent } from '../messenger-window/messenger-window.component';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatPaginatorModule, MatMenuModule, MessengerListComponent, MessengerWindowComponent, RouterModule],
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
  conversations!: ConversationList[];
  conversation: Conversation = new Conversation();
  username!: string;
  userId!: number;
  conversationId!: number;
  messageForm!: FormGroup;
  messageContent!: string;
  showList = true;
  showMessage = false;
  isGoingBack = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthenticationService,
    private adService: AdService,
    private formBuilder: FormBuilder,
    private breakpoint: BreakpointObserver,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue!.id;
    this.messageForm = this.formBuilder.group({
      content: new FormControl('', [Validators.required])
    });

    this.breakpoint.observe(['(max-width: 768px)']).subscribe((result: any) => {
      if (result.matches) {
        this.showMessage = false;
      } else {
        this.showMessage = true;
        this.showList = true;
      }
    });
  }

  get f() {
    return this.messageForm.controls;
  }

  onSubmit(): void {
    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }

    this.messageContent = this.messageForm.get('content')!.value;
    console.log('Message content:', this.messageContent);
    console.log('Conversation ID:', this.conversationId);
    if (this.messageContent && this.conversationId !== undefined) {
      this.chatService.sendMessage(this.conversationId, this.messageContent).subscribe({
        next: () => {
          this.handleConversationId(this.conversationId);
          this.messageForm.reset();
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      });
    }
  }

  handleConversationId(id: number): void {
    console.log('Handling conversation ID:', id); // Log added
    this.conversationId = id;
    this.chatService.getConversationById(id).subscribe((val) => {
      this.conversation = val;
    });
  }

  handleName(name: string): void {
    this.username = name;
  }

  handleBack(val: boolean): void {
    this.isGoingBack = val;
    if (this.isGoingBack) {
      this.showListFun();
    }
  }

  showListFun(): void {
    this.showList = !this.showList;
    this.showMessage = false;
  }

  showMessages(): void {
    if (this.breakpoint.isMatched('(max-width: 768px)')) {
      this.showList = false;
      this.showMessage = true;
    }
  }

  sendPdf(id: number): void {
    this.adService.getPdf(id).subscribe(response => {
      const pdf = new Blob([response], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdf);
      const anchor = document.createElement('a');
      anchor.download = id.toString();
      anchor.href = url;
      anchor.click();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent);
    let userId;
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (!isNaN(result)) {
          this.sendPdf(result);
          userId = this.conversation.user1Id === this.authService.currentUserValue!.id
            ? this.conversation.user2Id : this.conversation.user1Id;
          if (userId !== undefined) {
            this.adService.givePermission(userId, result).subscribe();
          }
        } else {
          this.sendPdf(result.id);
        }
      }
    });
  }
}
