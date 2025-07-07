import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { HistoryItemModel } from '../../models/history-item.model';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HistoryService } from '../../services/history.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-history-list',
  standalone: true,
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css'],
  imports: [RouterModule, MatPaginatorModule, MatMenuModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class HistoryListComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  adFormGroup!: FormGroup;
  historyItems!: HistoryItemModel[];
  addedHist: HistoryItemModel = new HistoryItemModel();
  favIdList!: number[];
  thePageNumber = 0;
  thePageSize = 6;
  theTotalElements = 0;
  pageTitle = 'Historique des beaux';
  searchMode = false;
  userId!: number;
  previousKeyword!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageEvent!: PageEvent;

  private autocomplete: GeocoderAutocomplete | null = null;
  private routeSubscription!: Subscription;

  private readonly autocompleteConfig = {
    apiKey: '067d039a00d245019a1a8e4be86031f8',
    config: {
      skipIcons: true,
      placeholder: 'Enter address for autocomplete fields and choose the correct one'
    }
  };

  constructor(private historyService: HistoryService, private route: ActivatedRoute, private router: Router,
              private authService: AuthenticationService, private formBuilder: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.adFormGroup = this.formBuilder.group({
      country: ['', Validators.required],
      city: ['', Validators.required],
      streetName: ['', Validators.required],
      streetNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      postalCode: ['', Validators.required]
    });

    this.routeSubscription = this.route.paramMap.subscribe(() => {
      this.listAllHistoryItems();
    });

    this.historyService.getFavoritesId(this.authService.currentUserValue!.id).subscribe((val) => {
      this.favIdList = val;
    });
  }

  ngAfterViewInit(): void {
    this.initializeAutocomplete();
  }

  ngAfterViewChecked(): void {
    if (!this.autocomplete && document.getElementById('autocomplete')) {
      this.initializeAutocomplete();
    }
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

  initializeAutocomplete(): void {
    const element = document.getElementById('autocomplete');
    if (element) {
      this.autocomplete = new GeocoderAutocomplete(
        element,
        this.autocompleteConfig.apiKey,
        this.autocompleteConfig.config
      );
      this.autocomplete.addFilterByCountry(['ca']);

      this.autocomplete.on('select', (location) => {
        if (location) {
          this.addedHist.address.streetName = location.properties.street || '';
          this.addedHist.address.streetNumber = location.properties.housenumber || '';
          this.addedHist.address.postalCode = location.properties.postcode || '';
          this.addedHist.address.city = location.properties.city || '';
          this.addedHist.address.country = location.properties.country || '';
          this.addedHist.address.latitude = location.properties.lat;
          this.addedHist.address.longitude = location.properties.lon;
          this.changeVal();
        }
      });

      this.autocomplete.on('suggestions', (suggestions) => {});
    }
  }

  listAllHistoryItems(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    this.searchMode ? this.searchHistoryItems() : this.historyService.getHistoryItemsPaginate(this.thePageNumber, this.thePageSize)
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.historyItems = data.content.map((item: any) => {
        const historyItem = new HistoryItemModel();
        historyItem.id = item.id;
        historyItem.address.streetName = item.streetName;
        historyItem.address.streetNumber = item.streetNumber;
        historyItem.address.postalCode = item.postalCode;
        historyItem.address.city = item.city;
        historyItem.address.country = item.country;
        historyItem.montantBail = item.montantBail;
        historyItem.dateEntree = new Date(item.dateEntree);
        historyItem.dateSortie = new Date(item.dateSortie);
        historyItem.dateCreated = new Date(item.dateCreated);
        return historyItem;
      });
      this.thePageNumber = data.number;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElements;
    };
  }

  get city() {
    return this.adFormGroup.get('city');
  }

  changeVal() {
    this.adFormGroup.patchValue({
      streetName: this.addedHist.address.streetName,
      streetNumber: this.addedHist.address.streetNumber,
      postalCode: this.addedHist.address.postalCode,
      city: this.addedHist.address.city,
      country: this.addedHist.address.country
    });
  }

  searchHistoryItems(): void {
    this.pageTitle = 'Search results';
    const keyword: any = this.route.snapshot.paramMap.get('keyword');
    if (this.previousKeyword !== keyword) {
      this.thePageNumber = 0;
    }
    this.previousKeyword = keyword;
    // this.historyService.searchHistoryItems(this.thePageNumber, this.thePageSize, keyword)
    //   .subscribe(this.processResult());
  }
  navigateToAddHistory(): void {
    this.router.navigate(['/add-history']);
  }

  onSubmit(): void {
    if (this.adFormGroup.valid) {
      const formValues = this.adFormGroup.value;
      this.historyService.searchHistoryItems(
        this.thePageNumber,
        this.thePageSize,
        formValues.streetName,
        formValues.streetNumber,
        formValues.postalCode,
        formValues.city,
        formValues.country
      ).subscribe(
        (response) => {
          this.historyItems = response.content.map((item: any) => {
            const historyItem = new HistoryItemModel();
            historyItem.id = item.id;
            historyItem.address.streetName = item.streetName;
            historyItem.address.streetNumber = item.streetNumber;
            historyItem.address.postalCode = item.postalCode;
            historyItem.address.city.name = item.city;
            historyItem.address.country.name = item.country;
            historyItem.montantBail = item.montantBail;
            historyItem.dateEntree = new Date(item.dateEntree);
            historyItem.dateSortie = new Date(item.dateSortie);
            historyItem.dateCreated = new Date(item.dateCreated);
            return historyItem;
          });
          // this.historyItems = response.content; // Update results
          this.thePageNumber = response.pageable.number;
          this.thePageSize = response.pageable.size;
          this.theTotalElements = response.pageable.totalElements;
          console.log('Historique search results:', response);
        },
        (error) => {
          console.error('Error searching historique:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
