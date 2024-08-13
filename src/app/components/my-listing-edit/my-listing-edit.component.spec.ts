import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListingEditComponent } from './my-listing-edit.component';

describe('MyListingEditComponent', () => {
  let component: MyListingEditComponent;
  let fixture: ComponentFixture<MyListingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyListingEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyListingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
