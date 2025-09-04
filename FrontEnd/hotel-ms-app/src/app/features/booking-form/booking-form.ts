import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookingService } from '../../core/services/booking';
import { Room, RoomService } from '../../core/services/room';
import { RoomType, RoomTypeService } from '../../core/services/room-type';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.scss']
})
export class BookingFormComponent implements OnInit, OnDestroy {
  bookingForm: FormGroup;
  allRooms: Room[] = [];
  filteredRooms: Room[] = [];
  roomTypes: RoomType[] = [];
  minDate: string;
  isEditMode = false;
  bookingId: number | null = null;
  calculatedPrice: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.minDate = this.formatDateForInput(new Date());

    this.bookingForm = this.fb.group({
      id: [null],
      roomTypeId: [null],
      userEmail: ['', [Validators.required, Validators.email]],
      roomId: [{ value: '', disabled: true }, Validators.required],
      startTime: ['', [Validators.required, this.startDateValidator.bind(this)]],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscribeToFormChanges();
    this.bookingId = Number(this.route.snapshot.paramMap.get('id'));

    // ** THE FIX: Load all data before patching the form **
    const rooms$ = this.roomService.getRooms();
    const roomTypes$ = this.roomTypeService.getRoomTypes();

    forkJoin([rooms$, roomTypes$]).subscribe(([rooms, roomTypes]) => {
      this.allRooms = rooms;
      this.roomTypes = roomTypes;

      // Now that we have the dropdown data, check if we are in edit mode
      if (this.bookingId) {
        this.isEditMode = true;
        this.setupEditMode();
      }
    });
  }

  setupEditMode(): void {
    this.bookingForm.get('startTime')?.clearValidators();
    this.bookingForm.get('startTime')?.setValidators([Validators.required]);
    this.bookingForm.get('startTime')?.updateValueAndValidity();

    this.bookingService.getBookingById(this.bookingId!).subscribe(booking => {
      this.filteredRooms = this.allRooms.filter(r => r.roomTypeId === booking.room.roomTypeId);

      const formattedStartTime = this.formatDateForInput(booking.startTime);
      const formattedEndTime = this.formatDateForInput(booking.endTime);

      this.bookingForm.patchValue({
        ...booking,
        roomTypeId: booking.room.roomTypeId,
        startTime: formattedStartTime,
        endTime: formattedEndTime
      });

      this.bookingForm.get('roomId')?.enable();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ... (rest of the file is the same as before) ...
  startDateValidator(control: AbstractControl): ValidationErrors | null {
    if (this.isEditMode) return null;
    const selectedDate = new Date(control.value);
    const now = new Date();
    now.setSeconds(0, 0);
    if (selectedDate < now) return { pastDate: true };
    return null;
  }

  subscribeToFormChanges(): void {
    this.bookingForm.get('roomTypeId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(roomTypeId => {
      const roomControl = this.bookingForm.get('roomId');
      if (!this.bookingForm.get('roomTypeId')?.pristine || !this.isEditMode) {
        roomControl?.reset();
      }
      if (roomTypeId) {
        this.filteredRooms = this.allRooms.filter(room => room.roomTypeId === Number(roomTypeId));
        roomControl?.enable();
      } else {
        this.filteredRooms = [];
        roomControl?.disable();
      }
    });

    this.bookingForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {
      const { roomId, startTime, endTime } = values;
      if (roomId && startTime && endTime) {
        const selectedRoom = this.allRooms.find(r => r.id === Number(roomId));
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        if (selectedRoom && startDate < endDate) {
          const durationInMs = endDate.getTime() - startDate.getTime();
          const durationInHours = durationInMs / (1000 * 60 * 60);
          this.calculatedPrice = durationInHours * selectedRoom.roomType.pricePerHour;
        } else {
          this.calculatedPrice = null;
        }
      } else {
        this.calculatedPrice = null;
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.notificationService.show('Please fill out the form correctly.', 'error');
      return;
    }
    const apiCall = this.isEditMode ? this.getUpdateCall() : this.getCreateCall();
    apiCall.subscribe({
        next: () => {
            const successMessage = this.isEditMode ? 'Booking updated successfully!' : 'Booking created successfully!';
            this.notificationService.show(successMessage, 'success');
            this.router.navigate(['/bookings']);
        },
        error: (err) => {
          let message = 'An unexpected error occurred.';
          if(err.error === -1) {
            message = 'Cannot create a booking in the past.';
          }
          else if (err.error?.errors) {
            const validationErrors = err.error.errors;
            message = Object.keys(validationErrors)
              .map(key => `${key}: ${validationErrors[key].join(', ')}`)
              .join('\n');
          } else if (typeof err.error === 'string') {
            message = err.error;
          }
          this.notificationService.show(message, 'error');
        }
    });
  }

  private getCreateCall() {
    const { userEmail, roomId, startTime, endTime } = this.bookingForm.value;
    const payload = {
        userEmail,
        roomId: Number(roomId),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString()
    };
    return this.bookingService.createBooking(payload);
  }

  private getUpdateCall() {
    const { id, userEmail, roomId, startTime, endTime } = this.bookingForm.value;
    const payload = {
        id,
        userEmail,
        roomId: Number(roomId),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString()
    };
    return this.bookingService.updateBooking(this.bookingId!, payload);
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
}