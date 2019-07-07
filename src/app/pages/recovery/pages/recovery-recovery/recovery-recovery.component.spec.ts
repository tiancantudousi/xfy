import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryRecoveryComponent } from './recovery-recovery.component';

describe('RecoveryRecoveryComponent', () => {
  let component: RecoveryRecoveryComponent;
  let fixture: ComponentFixture<RecoveryRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
