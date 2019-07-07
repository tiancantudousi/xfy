import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverySiderComponent } from './recovery-sider.component';

describe('RecoverySiderComponent', () => {
  let component: RecoverySiderComponent;
  let fixture: ComponentFixture<RecoverySiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoverySiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverySiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
