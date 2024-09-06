import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas id="MyChart"></canvas>
    </div>
  `,
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit, OnChanges {
  // Input properties to pass data from parent
  @Input() listings: { name: string; likes: number }[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chart: any;

  ngOnInit(): void {
    this.chart.destroy();
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listings']) {
      this.updateChart(); // Call updateChart when listings input changes
    }
  }

  updateChart() {
    if (this.chart) {
      this.chart.destroy(); // Destroy the previous chart instance
    }
    this.createChart(); // Re-create the chart with new data
  }

  createChart() {
    const labels = this.listings.map((listing) =>
      listing.name.length > 20 ? listing.name.substring(0, 20) + '...' : listing.name
    ); // Truncate to 20 characters and add "..."
    const data = this.listings.map((listing) => listing.likes);

    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Likes per Listing',
            data: data,
            backgroundColor: 'blue',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
