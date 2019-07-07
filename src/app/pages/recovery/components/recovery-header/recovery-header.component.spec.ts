import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryHeaderComponent } from './recovery-header.component';

describe('RecoveryHeaderComponent', () => {
  let component: RecoveryHeaderComponent;
  let fixture: ComponentFixture<RecoveryHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
