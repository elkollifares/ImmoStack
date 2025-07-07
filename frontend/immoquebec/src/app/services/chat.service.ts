import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { Conversation } from '../models/conversation.model';
import { ConversationList } from '../models/conversation-list.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:8080/api/conversation';

  constructor(private httpClient: HttpClient, private authService: AuthenticationService) {}

  getConversationById(id: number): Observable<Conversation> {
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.get<Conversation>(url).pipe(
      catchError(this.handleError)
    );
  }

  getList(): Observable<ConversationList[]> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      return throwError(new Error('User is not logged in.'));
    }
    const url = `${this.baseUrl}/user/${userId}`;
    return this.httpClient.get<ConversationList[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  createConversation(userId: number): Observable<any> {
    const initiatorId = this.authService.currentUserValue?.id;
    if (!initiatorId) {
      return throwError(new Error('User is not logged in.'));
    }
    const url = `${this.baseUrl}/user/${initiatorId}/${userId}`;
    return this.httpClient.post(url, null).pipe(
      catchError(this.handleError)
    );
  }

  sendMessage(convId: number, content: string): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      return throwError(new Error('User is not logged in.'));
    }
    const url = `${this.baseUrl}/message/${convId}/${userId}`;
    const contentMap = { content }; // Correctly initialized object
    return this.httpClient.post(url, contentMap).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
