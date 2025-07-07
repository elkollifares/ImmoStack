import { Component, OnInit } from '@angular/core';
import { AdTile } from '../../models/ad-tile.model';
import { AdService } from '../../services/ad-service.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatMenuModule,MatDialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnInit {
  adsList!: AdTile[];
  permitted!: AdTile[];

  constructor(private adService: AdService, private auth: AuthenticationService) {

  }

  ngOnInit(): void {
    this.adService.getUserAds(0, 100, this.auth.currentUserValue!.id).subscribe(cal => {
        this.adsList = cal.content;
      }
    );
    this.adService.getPermittedAds(this.auth.currentUserValue!.id).subscribe(val => {
      this.permitted = val;
    });

  }

}

