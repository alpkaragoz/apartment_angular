import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingBoxComponent } from './listing-box.component';

describe('ListingBoxComponent', () => {
  let component: ListingBoxComponent;
  let fixture: ComponentFixture<ListingBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
