import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyDirctComponent } from './apply-dirct.component';

describe('ApplyDirctComponent', () => {
  let component: ApplyDirctComponent;
  let fixture: ComponentFixture<ApplyDirctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyDirctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyDirctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
