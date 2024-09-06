import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  AccumulationChartModule,
  AccumulationLegendService,
  AccumulationDataLabelService,
  AccumulationTooltipService,
} from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-sync-pie-chart',
  standalone: true,
  imports: [AccumulationChartModule],
  template: `
    <ejs-accumulationchart [title]="'Likes Distribution'">
      <e-accumulation-series-collection>
        <e-accumulation-series
          [dataSource]="chartData"
          xName="name"
          yName="likes"
          type="Pie"
          [dataLabel]="dataLabel"
        ></e-accumulation-series>
      </e-accumulation-series-collection>
    </ejs-accumulationchart>
  `,
  providers: [AccumulationLegendService, AccumulationDataLabelService, AccumulationTooltipService],
})
export class PieChartComponent implements OnChanges {
  @Input() listings: { name: string; likes: number }[] = [];
  public chartData: { name: string; likes: number }[] = [];

  // Data label for displaying percentages in the pie chart
  public dataLabel: object = {
    visible: true,
    name: 'name',
    position: 'Outside',
    font: {
      fontWeight: '600',
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listings']) {
      this.updateChart();
    }
  }
  updateChart() {
    // Filter out listings where likes are 0
    this.chartData = this.listings
      .filter((listing) => listing.likes > 0) // Exclude entries with 0 likes
      .map((listing) => ({
        name: listing.name.length > 20 ? listing.name.substring(0, 20) + '...' : listing.name,
        likes: listing.likes,
      }));
  }
}
