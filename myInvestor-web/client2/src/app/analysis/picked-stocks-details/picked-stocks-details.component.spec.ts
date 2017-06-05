import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickedStocksDetailsComponent } from './picked-stocks-details.component';

describe('PickedStocksDetailsComponent', () => {
  let component: PickedStocksDetailsComponent;
  let fixture: ComponentFixture<PickedStocksDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickedStocksDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickedStocksDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
