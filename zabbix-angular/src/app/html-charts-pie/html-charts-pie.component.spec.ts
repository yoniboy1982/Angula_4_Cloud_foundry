import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlChartsPieComponent } from './html-charts-pie.component';

describe('HtmlChartsPieComponent', () => {
  let component: HtmlChartsPieComponent;
  let fixture: ComponentFixture<HtmlChartsPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlChartsPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlChartsPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
