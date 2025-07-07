import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../../models/user-info.model';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatMenuModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  public imageUrl = 'img.png';
  private userInfo!: UserInfo;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getImage.subscribe(img => this.imageUrl = img);

    if (this.authService.isLoggedIn() && this.authService.currentUserValue) {
      this.userService.getUserInfo(this.authService.currentUserValue.id).subscribe(
        response => {
          this.userInfo = response;
          this.userService.getImage.next(this.userInfo.imageUrl);
        },
        error => {
          console.error('Failed to retrieve user info:', error);
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
