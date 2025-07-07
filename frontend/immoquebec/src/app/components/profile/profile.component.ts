import { Component, OnInit } from '@angular/core';

import { AdTile } from '../../models/ad-tile.model';
import { UserInfo } from '../../models/user-info.model';
import { AdService } from '../../services/ad-service.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { AdTileComponent } from "../ad-tile/ad-tile.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [AdTileComponent,RouterModule,CommonModule]
})

export class ProfileComponent implements OnInit {
  ads!: AdTile[];
  thePageNumber = 0;
  thePageSize = 6;
  theTotalElements = 0;
  user: UserInfo = new UserInfo();
  favIdList!: number[];


  constructor(private userService: UserService, private adService: AdService,
              private router: Router, public authService: AuthenticationService) {
  }

  ngOnInit(): void {


    this.adService.getUserAds(this.thePageNumber, this.thePageSize, this.authService.currentUserValue!.id)
      .subscribe(this.processResult());

    this.userService.getUserInfo(this.authService.currentUserValue!.id).subscribe({
      next: response => {
        this.user = response;
      }
    });

    this.adService.getFavoritesId(this.authService.currentUserValue!.id).subscribe((val) => {
      this.favIdList = val;
    });
  }

  editData(): void {
    this.router.navigateByUrl('/update-info');
  }

  processResult() {
    return (data: any) => {
      this.ads = data.content;
      this.thePageNumber = data.number;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElements;
    };
  }

  removeAd(adId: number): void {
    this.ads = this.ads.filter(ad => ad.id !== adId);
    // Optionally, send a request to the backend to delete the ad from the server
    this.adService.deleteAd(adId).subscribe({
      next: response => {
        console.log(`Ad with ID ${adId} deleted successfully.`);
      },
      error: err => {
        console.error(`Failed to delete ad with ID ${adId}.`, err);
      }
    });
  }

}
