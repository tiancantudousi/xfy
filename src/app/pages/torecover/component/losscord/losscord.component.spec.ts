import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosscordComponent } from './losscord.component';

describe('LosscordComponent', () => {
  let component: LosscordComponent;
  let fixture: ComponentFixture<LosscordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosscordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosscordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
