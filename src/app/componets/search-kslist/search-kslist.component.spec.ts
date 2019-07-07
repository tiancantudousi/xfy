import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchKslistComponent } from './search-kslist.component';

describe('SearchKslistComponent', () => {
  let component: SearchKslistComponent;
  let fixture: ComponentFixture<SearchKslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchKslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchKslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
