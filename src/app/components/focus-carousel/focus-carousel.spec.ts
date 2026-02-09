import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusCarousel } from './focus-carousel';

describe('FocusCarousel', () => {
  let component: FocusCarousel;
  let fixture: ComponentFixture<FocusCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
