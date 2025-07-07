import { Component, OnInit, ViewChild } from '@angular/core';
import { AdTile } from '../../models/ad-tile.model';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AdService } from '../../services/ad-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdTileComponent } from "../ad-tile/ad-tile.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ads-list',
    standalone: true,
    templateUrl: './ads-list.component.html',
    styleUrl: './ads-list.component.css',
    imports: [RouterModule, MatPaginatorModule, MatMenuModule, AdTileComponent,CommonModule]
})


export class AdsListComponent implements OnInit {

  ads!: AdTile[];
  favIdList!: number[];
  // new properties for pagination
  thePageNumber = 0;
  thePageSize = 6;
  theTotalElements = 0;
  pageTitle = 'All properties';
  searchMode = false;

  userId!: number;

  previousKeyword!: string  ;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private adService: AdService, private route: ActivatedRoute, private router: Router,
              private authService: AuthenticationService) {
  }

  ngOnInit(): void {

    if (this.router.url === '/for-rent') {
      this.pageTitle = 'Propriétés résidentielles à louer';

      this.route.paramMap.subscribe(() => {
        this.listAdsForRent();
      });
    } else if (this.router.url === '/for-sale') {
      this.pageTitle = 'Propriétés résidentielles à vendre';
      this.route.paramMap.subscribe(() => {
        this.listAdsForSale();
      });
    } else if (this.router.url === '/low-income') {
      this.pageTitle = 'Propriétés à faible revenu';
      this.route.paramMap.subscribe(() => {
        this.listLowIncomeAds();
      });
    } else if (this.router.url === '/favorites') {
      this.pageTitle = 'Vos favories';
      this.route.paramMap.subscribe(() => {
        this.listUserFavorites();
      });
    } else {
      this.pageTitle = 'Toutes les Propriétés';
      this.route.paramMap.subscribe(() => {
        this.listAllAds();
      });

    }
    this.adService.getFavoritesId(this.authService.currentUserValue!.id).subscribe((val) => {
      this.favIdList = val;
    })
  }

  sortByPrice(val: boolean): void {

    this.ads = this.ads.sort((a, b) => {
      return val ? a.price - b.price : b.price - a.price;
    });
  }


  listAllAds(): void {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    this.searchMode ? this.searchAds() : this.adService.getAdsPaginate(this.thePageNumber, this.thePageSize)
      .subscribe(this.processResult());
  }

  listAdsForRent(): void {
    this.adService.getAdsForRentPaginate(this.thePageNumber, this.thePageSize)
      .subscribe(this.processResult());
  }

  listAdsForSale(): void {
    this.adService.getAdsForSalePaginate(this.thePageNumber, this.thePageSize)
      .subscribe(this.processResult());
  }

  listLowIncomeAds(): void {
    this.adService.getAdsPaginate(this.thePageNumber, this.thePageSize)
      .subscribe(this.processResult(true));
  }

  listUserFavorites(): void {
    this.userId = this.authService.currentUserValue!.id;
    this.adService.getUserFavoritesPaginate(this.thePageNumber, this.thePageSize, this.userId)
      .subscribe(this.processResult());
  }

  processResult(isLowIncome: boolean = false) {
    return (data: any) => {
      // Filter ads based on the `isLowIncome` flag
      this.ads = data.content.filter((ad: AdTile) => isLowIncome ? ad.lowIncomeBuilding : true);
      this.thePageNumber = data.number;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElements;
    };
  }

  OnPageChange(event?: PageEvent): void {

    this.thePageSize = event!.pageSize;
    this.thePageNumber = event!.pageIndex;
    if (this.router.url === '/offers') {
      this.listAllAds();
    } else if (this.router.url === '/for-sale') {
      this.listAdsForSale();
    } else {
      this.listAdsForRent();
    }

  }

  searchAds(): void {
    this.pageTitle = 'Search results';
    const keyword:any = this.route.snapshot.paramMap.get('keyword');
    if (this.previousKeyword !== keyword) {
      this.thePageNumber = 0;
    }
    this.previousKeyword = keyword;
    this.adService.searchAds(this.thePageNumber, this.thePageSize, keyword)
      .subscribe(this.processResult());
  }

  doSearch(value: string): void {
    if (value) {
      this.router.navigateByUrl(`/search/${value}`);
    } else {
      this.router.navigateByUrl(`/offers`);
    }
  }
}
