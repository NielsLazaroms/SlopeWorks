import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoItem } from './info-item';

describe('InfoItem', () => {
  let component: InfoItem;
  let fixture: ComponentFixture<InfoItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
