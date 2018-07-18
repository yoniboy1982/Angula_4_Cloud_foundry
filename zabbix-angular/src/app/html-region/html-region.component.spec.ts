import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlRegionComponent } from './html-region.component';

describe('HtmlRegionComponent', () => {
  let component: HtmlRegionComponent;
  let fixture: ComponentFixture<HtmlRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
