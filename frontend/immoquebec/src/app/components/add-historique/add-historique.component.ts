import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import { Subscription } from 'rxjs';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { HistoryService } from '../../services/history.service';
import { HistoryItemModel } from '../../models/history-item.model';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatMenuModule} from "@angular/material/menu";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-add-history',
  standalone: true,
  templateUrl: './add-historique.component.html',
  styleUrls: ['./add-historique.component.css'],
  imports: [RouterModule, MatPaginatorModule, MatMenuModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddHistoriqueComponent implements OnInit, OnDestroy {
  historyFormGroup!: FormGroup;
  addedHist: HistoryItemModel = new HistoryItemModel();
  private autocomplete: GeocoderAutocomplete | null = null;
  private routeSubscription!: Subscription;

  private readonly autocompleteConfig = {
    apiKey: '067d039a00d245019a1a8e4be86031f8',
    config: {
      skipIcons: true,
      placeholder: 'Enter address for autocomplete fields and choose the correct one'
    }
  };

  constructor(private formBuilder: FormBuilder, private historyService: HistoryService, private router: Router) { }

  ngOnInit(): void {

    const element = document.getElementById('autocomplete-add-historique');
    if (element) {
      this.autocomplete = new GeocoderAutocomplete(
        element,
        '067d039a00d245019a1a8e4be86031f8',
        { skipIcons: true, placeholder: 'Enter address for autocomplete fields and choose the correct one' }
      );
      this.autocomplete.addFilterByCountry(['ca']);

      this.autocomplete.on('select', (location) => {
        if (location) {
          this.addedHist.address.postalCode = location.properties.postcode;
          this.addedHist.address.streetNumber = location.properties.housenumber;
          this.addedHist.address.country.name = location.properties.country;
          this.addedHist.address.streetName = location.properties.street;
          this.addedHist.address.latitude = location.properties.lat;
          this.addedHist.address.longitude = location.properties.lon;
          this.addedHist.address.city.name = location.properties.city;
          if (!this.addedHist.address.streetName) {
            this.addedHist.address.streetName = location.properties.name;
          }
          this.changeVal();
        }
      });

      this.autocomplete.on('suggestions', (suggestions) => {
      });
    }
    this.historyFormGroup = this.formBuilder.group({
      hist: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        streetName: new FormControl('', [Validators.required]),
        streetNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
        postalCode: new FormControl('', [Validators.required]),
        montantBail: new FormControl('', [Validators.required, Validators.pattern('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')]),
        dateEntree: new FormControl(null, [Validators.required]),
        dateSortie: new FormControl(null, [Validators.required])
      })
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.autocomplete) {
      this.autocomplete.off('select');
      this.autocomplete.off('suggestions');
      this.autocomplete = null;
    }
  }

  onSubmit(): void {
    if (this.historyFormGroup.invalid) {
      this.historyFormGroup.markAllAsTouched();
      return;
    }

    this.addedHist.montantBail = +this.historyFormGroup.get('hist.montantBail')!.value;
    this.addedHist.dateSortie = new Date(this.historyFormGroup.get('hist.dateSortie')!.value);
    this.addedHist.dateEntree = new Date(this.historyFormGroup.get('hist.dateEntree')!.value);
    this.addedHist.address.city.name = this.historyFormGroup.get('hist.city')!.value;
    this.addedHist.address.country.name = this.historyFormGroup.get('hist.country')!.value;
    this.addedHist.address.postalCode = this.historyFormGroup.get('hist.postalCode')!.value;
    this.addedHist.address.streetName = this.historyFormGroup.get('hist.streetName')!.value;
    this.addedHist.address.streetNumber = +this.historyFormGroup.get('hist.streetNumber')!.value;

    console.log(this.addedHist)
    this.historyService.addHistoryItem(this.addedHist).subscribe(() => {
      alert("You added an history");
      this.router.navigate(['/history']);
    });
  }

  changeVal() {
    this.historyFormGroup.patchValue({
      hist: {
        streetName: this.addedHist.address.streetName,
        streetNumber: this.addedHist.address.streetNumber,
        postalCode: this.addedHist.address.postalCode,
        city: this.addedHist.address.city.name,
        country: this.addedHist.address.country.name
      }
    });
  }
}
