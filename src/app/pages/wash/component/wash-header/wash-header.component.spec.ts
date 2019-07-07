import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashHeaderComponent } from './wash-header.component';

describe('WashHeaderComponent', () => {
  let component: WashHeaderComponent;
  let fixture: ComponentFixture<WashHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
