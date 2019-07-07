import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyContentComponent } from './apply-content.component';

describe('ApplyContentComponent', () => {
  let component: ApplyContentComponent;
  let fixture: ComponentFixture<ApplyContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
