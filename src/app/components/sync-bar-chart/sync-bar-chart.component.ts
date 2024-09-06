import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartAllModule, ChartModule } from '@syncfusion/ej2-angular-charts'; // Import the Syncfusion chart module
import { CategoryService, LegendService, TooltipService, DataLabelService } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-sync-bar-chart',
  standalone: true, // Ensure standalone: true is used
  imports: [ChartModule, CommonModule, ChartAllModule], // Add ChartModule to the imports
  providers: [CategoryService, LegendService, TooltipService, DataLabelService], // Add necessary services
  template: `
    <ejs-chart [primaryXAxis]="primaryXAxis" [primaryYAxis]="primaryYAxis" [title]="'Likes per Listing'">
      <e-series-collection>
        <e-series [dataSource]="chartData" type="Column" xName="name" yName="likes" name="Likes" [marker]="marker">
        </e-series>
      </e-series-collection>
    </ejs-chart>
  `,
  styleUrls: ['./sync-bar-chart.component.css'],
})
export class SyncBarChartComponent implements OnChanges {
  @Input() listings: { name: string; likes: number }[] = [];

  // Properties for Syncfusion chart configuration
  public primaryXAxis: object = { valueType: 'Category' };
  public primaryYAxis: object = { labelFormat: '{value} Likes' };

  // Corrected marker and dataLabel configuration
  public marker: object = { visible: true, dataLabel: { visible: true } };

  // Chart data
  public chartData: { name: string; likes: number }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listings']) {
      this.updateChart();
    }
  }

  updateChart() {
    this.chartData = this.listings.map((listing) => ({
      name: listing.name.length > 20 ? listing.name.substring(0, 20) + '...' : listing.name,
      likes: listing.likes,
    }));
  }
}
