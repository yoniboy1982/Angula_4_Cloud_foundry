import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIsnewComponent } from './view-isnew.component';

describe('ViewIsnewComponent', () => {
  let component: ViewIsnewComponent;
  let fixture: ComponentFixture<ViewIsnewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewIsnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIsnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
