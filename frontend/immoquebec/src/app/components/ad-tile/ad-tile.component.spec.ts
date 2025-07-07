import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdTileComponent } from './ad-tile.component';

describe('AdTileComponent', () => {
  let component: AdTileComponent;
  let fixture: ComponentFixture<AdTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
