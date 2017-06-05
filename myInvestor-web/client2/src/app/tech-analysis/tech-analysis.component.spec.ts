import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechAnalysisComponent } from './tech-analysis.component';

describe('TechAnalysisComponent', () => {
  let component: TechAnalysisComponent;
  let fixture: ComponentFixture<TechAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
