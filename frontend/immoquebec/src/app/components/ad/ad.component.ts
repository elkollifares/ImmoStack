import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AdTile } from '../../models/ad-tile.model';
import { AdDetails } from '../../models/ad-details.model';
import { AdService } from '../../services/ad-service.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';
import { isPlatformBrowser } from '@angular/common';


import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.css']
})
export class AdComponent implements OnInit {
  adTile: AdTile = new AdTile();
  adDetails: AdDetails = new AdDetails();
  images: string[] = [];
  currentImage!: string;
  FULL_HEART_CSS = 'fas fa-heart';
  EMPTY_HEART_CSS = 'far fa-heart';
  ADD_TEXT = 'Add to favorites';
  REMOVE_TEXT = 'Remove from favorites';
  heart = new BehaviorSubject<string>(this.EMPTY_HEART_CSS);
  favText = new BehaviorSubject<string>(this.ADD_TEXT);
  counter = 0;

  constructor(
    private adService: AdService,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    private router: Router,
    private chatService: ChatService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const adId = params.get('id');
      if (adId) {
        this.handleAdDetails(+adId);
      } else {
        alert('Invalid ad ID.');
        this.router.navigate(['/']);
      }
    });

    this.heart.subscribe();
    this.favText.subscribe();
  }

  handleAdDetails(adId: number): void {
    this.adService.getAd(adId).subscribe(
      data => {
        this.adTile = data;
        this.images = this.adTile.adImages.map(img => img.imageUrl);
        this.currentImage = this.images[0];
      },
      error => {
        console.error('Failed to load ad:', error);
        alert('Error loading ad.');
      }
    );

    this.adService.getAdDetails(adId).then(
      data => {
        this.adDetails = data;
        if (isPlatformBrowser(this.platformId)) {  // Ensure Leaflet is initialized only client-side
          import('leaflet').then(L => {
            this.initializeMap(L, [this.adDetails.latitude, this.adDetails.longitude]);
          });
        }
        this.checkFavorites(adId);
      },
      error => {
        console.error('Failed to load ad details:', error);
        alert('Error loading ad details.');
      }
    );
  }
  handler(val: string): void {
    if (val === this.FULL_HEART_CSS) {
      this.removeFromFavorites();
    } else {
      this.addToFavourites();
    }
  }
  checkFavorites(adId: number): void {
    const userId = this.authService.currentUserValue?.id;
    if (userId) {
      this.adService.getFavoritesId(userId).subscribe(
        val => {
          if (val.includes(adId)) {
            this.heart.next(this.FULL_HEART_CSS);
            this.favText.next(this.REMOVE_TEXT);
          }
        },
        error => {
          console.error('Error checking favorites:', error);
        }
      );
    }
  }

  addToFavourites(): void {
    const adId = this.route.snapshot.paramMap.get('id');
    if (adId) {
      this.adService.addToFavorites(+adId).subscribe(
        () => {
          alert('Offer added successfully!');
          this.heart.next(this.FULL_HEART_CSS);
          this.favText.next(this.REMOVE_TEXT);
        },
        error => {
          alert('Failed to add to favorites!');
          console.error('Add to favorites error:', error);
        }
      );
    }
  }

  removeFromFavorites(): void {
    const adId = this.route.snapshot.paramMap.get('id');
    if (adId && confirm('Do you want to remove this offer from favorites?')) {
      this.adService.removeFromFavorites(+adId).subscribe(
        () => {
          this.heart.next(this.EMPTY_HEART_CSS);
          this.favText.next(this.ADD_TEXT);
          alert('Offer removed from favorites!');
        },
        error => {
          alert('Failed to remove from favorites!');
          console.error('Remove from favorites error:', error);
        }
      );
    }
  }

  deleteAd(): void {
    const userId = this.authService.currentUserValue?.id;
    if (userId && this.adDetails.userId === userId) {
      if (confirm('Are you sure?')) {
        const adId:any = this.route.snapshot.paramMap.get('id');
        this.adService.deleteAd(+adId).subscribe(
          () => {
            alert('Ad successfully deleted.');
            this.router.navigateByUrl('/');
          },
          error => {
            alert('Failed to delete ad.');
            console.error('Delete ad error:', error);
          }
        );
      }
    } else {
      alert('This is not your offer.');
    }
  }

  initializeMap(L: any, coordinates: number[]): void {
    if (coordinates.length !== 2) {
      console.error('Invalid coordinates array:', coordinates);
      return;
    }

    const mapContainer = document.getElementById('mapid');
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    const mymap = L.map(mapContainer).setView(coordinates as [number, number], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(mymap);

    L.circle(coordinates as [number, number], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(mymap);
  }



  mySlide(event: any): void {
    const max = this.images.length;
    this.counter = (this.counter < max - 1) ? (this.counter + 1) : 0;
    this.currentImage = this.images[this.counter];
  }

  editAd(): void {
    const userId = this.authService.currentUserValue?.id;
    if (userId && this.adDetails.userId === userId) {
      this.router.navigateByUrl(`/edit/${this.adDetails.id}`);
    } else {
      alert('This is not your offer.');
    }
  }

  messageUser(): void {
    if (this.adDetails.userId) {
      this.chatService.createConversation(this.adDetails.userId).subscribe(
        () => {
          this.router.navigateByUrl('/messenger');
        },
        error => {
          alert('Error starting a conversation.');
          console.error('Error in starting conversation:', error);
        }
      );
    }
  }
}
