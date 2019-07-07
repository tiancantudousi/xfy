import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SterilResultComponent } from './steril-result.component';

describe('SterilResultComponent', () => {
  let component: SterilResultComponent;
  let fixture: ComponentFixture<SterilResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SterilResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SterilResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
