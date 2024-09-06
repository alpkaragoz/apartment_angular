import { Component, OnInit } from '@angular/core';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { CommonModule } from '@angular/common';
import { ListingWithLikesDto } from '../../dto/listing-with-likes-dto';
import { ApiService } from '../../service/api.service';
import { SyncBarChartComponent } from '../../components/sync-bar-chart/sync-bar-chart.component';
import { PieChartComponent } from '../../components/sync-pie-chart/sync-pie-chart.component';

@Component({
  selector: 'app-data-panel',
  standalone: true,
  imports: [CommonModule, BarChartComponent, SyncBarChartComponent, PieChartComponent],
  template: `
    <div id="background">
      <div class="chartjs-container">
        <h2>Chart.js</h2>
        <app-bar-chart [listings]="listingsData"></app-bar-chart>
      </div>
      <div class="sync-container">
        <h2>Syncfusion</h2>
        <app-sync-bar-chart [listings]="listingsData"></app-sync-bar-chart>
        <app-sync-pie-chart [listings]="listingsData"></app-sync-pie-chart>
      </div>
    </div>
  `,
  styleUrl: './data-panel.component.css',
})
export class DataPanelComponent implements OnInit {
  listingsData: { name: string; likes: number }[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchListingsWithLikes();
  }

  fetchListingsWithLikes() {
    this.apiService.getListingsWithLikes().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body != null) {
          this.listingsData = response.body.map((item: ListingWithLikesDto) => ({
            name: item.listing.listingName,
            likes: item.likes,
          }));
        }
      },
      error: () => {
        // Handle error //TODO
      },
    });
  }
}
