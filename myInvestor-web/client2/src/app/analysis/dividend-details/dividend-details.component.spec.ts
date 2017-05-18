import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendDetailsComponent } from './dividend-details.component';

describe('DividendDetailsComponent', () => {
  let component: DividendDetailsComponent;
  let fixture: ComponentFixture<DividendDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DividendDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DividendDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
