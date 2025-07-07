import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHistoriqueComponent } from './add-historique.component';

describe('AddHistoriqueComponent', () => {
  let component: AddHistoriqueComponent;
  let fixture: ComponentFixture<AddHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHistoriqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
