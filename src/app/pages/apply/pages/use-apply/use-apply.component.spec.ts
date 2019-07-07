import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseApplyComponent } from './use-apply.component';

describe('UseApplyComponent', () => {
  let component: UseApplyComponent;
  let fixture: ComponentFixture<UseApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
