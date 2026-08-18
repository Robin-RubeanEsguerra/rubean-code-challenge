import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersView } from './customers-view';

describe('CustomersView', () => {
  let component: CustomersView;
  let fixture: ComponentFixture<CustomersView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersView],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
