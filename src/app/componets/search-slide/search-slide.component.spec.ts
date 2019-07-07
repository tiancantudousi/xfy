import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSlideComponent } from './search-slide.component';

describe('SearchSlideComponent', () => {
  let component: SearchSlideComponent;
  let fixture: ComponentFixture<SearchSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
