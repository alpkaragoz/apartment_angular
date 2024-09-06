import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncPieChartComponent } from './sync-pie-chart.component';

describe('SyncPieChartComponent', () => {
  let component: SyncPieChartComponent;
  let fixture: ComponentFixture<SyncPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncPieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
