import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryItemModel } from '../models/history-item.model';
import {AdOffer} from "../models/ad-offer.model";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private baseUrl = 'http://localhost:8080/api/history';

  authService: any;

  constructor(private httpClient: HttpClient) {}

  getHistoryItemsPaginate(thePage: number, thePageSize: number): Observable<GetResponseHistoryItems> {
    const searchUrl = `${this.baseUrl}?page=${thePage}&size=${thePageSize}`;
    return this.getHistoryItems(searchUrl);
  }

  getUserFavoritesPaginate(thePage: number, thePageSize: number, userId: number): Observable<GetResponseHistoryItems> {
    const searchUrl = `${this.baseUrl}/favorites/${userId}?page=${thePage}&size=${thePageSize}`;
    return this.getHistoryItems(searchUrl);
  }

  getFavoritesId(userId: number): Observable<number[]> {
    const searchUrl = `${this.baseUrl}/favlist/${userId}`;
    return this.httpClient.get<number[]>(searchUrl);
  }

  // searchHistoryItems(thePage: number, thePageSize: number, keyword: string): Observable<GetResponseHistoryItems> {
  //   const searchUrl = `${this.baseUrl}/search/${keyword}?page=${thePage}&size=${thePageSize}`;
  //   return this.getHistoryItems(searchUrl);
  // }

  searchHistoryItems(
    thePage: number,
    thePageSize: number,
    streetName: string,
    streetNumber: number,
    postalCode: string,
    cityName: string,
    countryName: string
  ): Observable<GetResponseHistoryItems> {
    const searchUrl = `${this.baseUrl}/search?streetName=${streetName}&streetNumber=${streetNumber}&postalCode=${postalCode}&cityName=${cityName}&countryName=${countryName}&page=${thePage}&size=${thePageSize}`;
    return this.getHistoryItems(searchUrl);
  }

  private getHistoryItems(searchUrl: string): Observable<GetResponseHistoryItems> {
    return this.httpClient.get<GetResponseHistoryItems>(searchUrl);
  }

  addToFavorites(historyItemId: number): Observable<any> {
    const userId = this.authService.currentUserValue.id;  // Make sure authService.currentUserValue is always defined
    const url = `${this.baseUrl}/favorites/${historyItemId}/${userId}`;
    return this.httpClient.post(url, null);
  }

  removeFromFavorites(historyItemId: number): Observable<any> {
    const userId = this.authService.currentUserValue.id;
    const url = `${this.baseUrl}/favorites/${historyItemId}/${userId}`;
    return this.httpClient.put(url, null);
  }

  deleteHistoryItem(historyItemId: number): Observable<any> {
    const url = `${this.baseUrl}/${historyItemId}`;
    return this.httpClient.delete(url);
  }

  addHistoryItem(historyItem: HistoryItemModel): Observable<any> {
    return this.httpClient.post<HistoryItemModel>(this.baseUrl, historyItem);
  }
}

interface GetResponseHistoryItems {
  content: HistoryItemModel[];
  pageable: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
}
