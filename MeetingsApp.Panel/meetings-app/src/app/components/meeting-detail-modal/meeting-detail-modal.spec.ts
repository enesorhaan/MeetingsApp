import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingDetailModal } from './meeting-detail-modal';

describe('MeetingDetailModal', () => {
  let component: MeetingDetailModal;
  let fixture: ComponentFixture<MeetingDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingDetailModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingDetailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
