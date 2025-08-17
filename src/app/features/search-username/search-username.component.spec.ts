import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUsernameComponent } from './search-username.component';

describe('SearchUsernameComponent', () => {
  let component: SearchUsernameComponent;
  let fixture: ComponentFixture<SearchUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUsernameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
