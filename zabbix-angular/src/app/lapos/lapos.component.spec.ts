import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaposComponent } from './lapos.component';

describe('LaposComponent', () => {
  let component: LaposComponent;
  let fixture: ComponentFixture<LaposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
