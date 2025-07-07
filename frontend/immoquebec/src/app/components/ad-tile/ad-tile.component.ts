import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AdTile } from '../../models/ad-tile.model';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ad-tile',
  standalone: true,
  imports: [CommonModule,  RouterModule],
  templateUrl: './ad-tile.component.html',
  styleUrl: './ad-tile.component.css'
})
export class AdTileComponent implements OnInit {
  @Input() state: any;
  @Input() adTile!: AdTile;
  @Input() favList!: number[];
  @Input() showDeleteButton = false; // Add this input
  @Output() deleteAd = new EventEmitter<number>();

  FULL_HEART = 'fas fa-heart';
  EMPTY_HEART = 'far fa-heart';
  heart = new BehaviorSubject<string>(this.EMPTY_HEART);

  constructor() {
  }

  ngOnInit(): void {
    this.heart.subscribe();
    if (this.favList.includes(this.adTile.id)) {
      this.heart.next(this.FULL_HEART);
    }
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation(); // Stop the click event from bubbling up
    const confirmation = confirm("Are you sure you want to delete this ad?");
    if (confirmation) {
      this.deleteAd.emit(this.adTile.id); // Emit event to parent component
    }
  }

}
