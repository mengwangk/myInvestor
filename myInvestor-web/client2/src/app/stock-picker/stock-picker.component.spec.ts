import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPickerComponent } from './stock-picker.component';

describe('AnalysisComponent', () => {
  let component: StockPickerComponent;
  let fixture: ComponentFixture<StockPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
