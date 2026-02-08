import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallaxComponent } from './parallax-component';

describe('ParallaxComponent', () => {
  let component: ParallaxComponent;
  let fixture: ComponentFixture<ParallaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParallaxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParallaxComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
