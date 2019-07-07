import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SterilContentComponent } from './steril-content.component';

describe('SterilContentComponent', () => {
  let component: SterilContentComponent;
  let fixture: ComponentFixture<SterilContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SterilContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SterilContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
