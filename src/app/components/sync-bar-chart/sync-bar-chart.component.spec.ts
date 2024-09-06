import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncBarChartComponent } from './sync-bar-chart.component';

describe('SyncBarChartComponent', () => {
  let component: SyncBarChartComponent;
  let fixture: ComponentFixture<SyncBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncBarChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
