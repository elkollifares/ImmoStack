import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdDetails } from '../models/ad-details.model';
import { AdTile } from '../models/ad-tile.model';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private baseUrl = 'http://localhost:8080/api/ad';
  authService: any;

  constructor(private httpClient: HttpClient) {}

  // Get paginated list of ads
  getAdsPaginate(thePage: number, thePageSize: number): Observable<GetResponseAdTiles> {
    const searchUrl = `${this.baseUrl}?page=${thePage}&size=${thePageSize}`;
    return this.getAdTiles(searchUrl);
  }

  // Get paginated list of ads for rent
  getAdsForRentPaginate(thePage: number, thePageSize: number): Observable<GetResponseAdTiles> {
    const searchUrl = `${this.baseUrl}/rent?page=${thePage}&size=${thePageSize}`;
    return this.getAdTiles(searchUrl);
  }

  // Get paginated list of ads for sale
  getAdsForSalePaginate(thePage: number, thePageSize: number): Observable<GetResponseAdTiles> {
    const searchUrl = `${this.baseUrl}/sale?page=${thePage}&size=${thePageSize}`;
    return this.getAdTiles(searchUrl);
  }

  // Get paginated list of low income ads
  getLowIncomeAdsPaginate(thePage: number, thePageSize: number): Observable<GetResponseAdTiles> {
    const searchUrl = `${this.baseUrl}/low-income?page=${thePage}&size=${thePageSize}`;
    return this.getAdTiles(searchUrl);
  }

  // Get user's favorite ads paginated
  getUserFavoritesPaginate(thePage: number, thePageSize: number, userId: number): Observable<GetResponseAdTiles> {
    const searchUrl = `${this.baseUrl}/favorites/${userId}?page=${thePage}&size=${thePageSize}`;
    return this.getAdTiles(searchUrl);
  }

  // Get favorites by user ID
  getFavoritesId(userId: number): Observable<number[]> {
    const searchUrl = `${this.baseUrl}/favlist/${userId}`;
    return this.httpClient.get<number[]>(searchUrl);
  }

  // Get detailed information about a specific ad
  async getAdDetails(theAdId: number): Promise<AdDetails> {
    const adUrl = `${this.baseUrl}/details/${theAdId}`;
    try {
      const response = await this.httpClient.get<AdDetails>(adUrl).toPromise();
      if (!response) {
        throw new Error('AdDetails not found');
      }
      return response;
    } catch (error) {
      console.error('Failed to fetch ad details:', error);
      throw error;
    }
  }

  // Get a single ad
  getAd(theAdId: number): Observable<AdTile> {
    const adUrl = `${this.baseUrl}/${theAdId}`;
    return this.httpClient.get<AdTile>(adUrl);
  }

  // Get user's ads paginated
  getUserAds(thePage: number, thePageSize: number, userId: number): Observable<GetResponseAdTiles> {
    const searchUrl = `${this.baseUrl}/user/${userId}?page=${thePage}&size=${thePageSize}`;
    return this.getAdTiles(searchUrl);
  }

  // Get permitted ads by user ID
  getPermittedAds(userId: number): Observable<AdTile[]> {
    const searchUrl = `${this.baseUrl}/permitted/${userId}`;
    return this.httpClient.get<AdTile[]>(searchUrl);
  }

  // Search ads by keyword
  searchAds(thePage: number, thePageSize: number, keyword: string): Observable<GetResponseAdTiles> {
    const searchUrl = `${this.baseUrl}/search/${keyword}?page=${thePage}&size=${thePageSize}`;
    return this.getAdTiles(searchUrl);
  }

  // Get ad for editing
  getAdForEdit(adId: number): Observable<any> {
    const url = `${this.baseUrl}/edit/${adId}`;
    return this.httpClient.get<any>(url);
  }

  // Generic method to fetch ad tiles using a URL
  private getAdTiles(searchUrl: string): Observable<GetResponseAdTiles> {
    return this.httpClient.get<GetResponseAdTiles>(searchUrl);
  }

  // Generate PDF for an ad
  getPdf(adId: number): Observable<any> {
    const url = `${this.baseUrl}/generate-pdf/${adId}`;
    const options = { responseType: 'arraybuffer' as 'json' };
    return this.httpClient.get(url, options);
  }

  // Add to user's favorites
  addToFavorites(adId: number): Observable<any> {
    const userId = this.authService.currentUserValue.id;  // Make sure authService.currentUserValue is always defined
    const url = `${this.baseUrl}/favorites/${adId}/${userId}`;
    return this.httpClient.post(url, null);
  }

  // Give permission for an ad
  givePermission(userId: number, adId: number): Observable<any> {
    const url = `${this.baseUrl}/permit-pdf/${adId}/${userId}`;
    return this.httpClient.post(url, null);
  }

  // Remove from favorites
  removeFromFavorites(adId: number): Observable<any> {
    const userId = this.authService.currentUserValue.id;
    const url = `${this.baseUrl}/favorites/${adId}/${userId}`;
    return this.httpClient.put(url, null);
  }

  // Delete an ad
  deleteAd(adId: number): Observable<any> {
    const url = `${this.baseUrl}/${adId}`;
    return this.httpClient.delete(url);
  }
}

// Interface to handle paginated ad tile responses
interface GetResponseAdTiles {
  content: AdTile[];
  pageable: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
}
