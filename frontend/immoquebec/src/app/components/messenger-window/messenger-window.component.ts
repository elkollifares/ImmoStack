import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Conversation } from '../../models/conversation.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-messenger-window',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './messenger-window.component.html',
  styleUrl: './messenger-window.component.css'
})
export class MessengerWindowComponent implements OnInit {

  @Input() conversation!: Conversation;
  @Input() userId!: number;
  @Input() username!: string;

  @Output() goBack = new EventEmitter<boolean>(false);

  constructor() {
  }

  ngOnInit(): void {
    this.toBottom();
  }

  toBottom(): void {
    let el = document.getElementById('test');
    el!.scrollIntoView();
  }

  emitGoBack(): void {
    this.goBack.emit(true);
  }
}