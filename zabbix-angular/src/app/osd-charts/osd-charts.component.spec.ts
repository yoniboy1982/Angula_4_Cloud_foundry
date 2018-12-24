import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsdChartsComponent } from './osd-charts.component';

describe('OsdChartsComponent', () => {
  let component: OsdChartsComponent;
  let fixture: ComponentFixture<OsdChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsdChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsdChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
