import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Booking, BookingService } from '../../core/services/booking';
import { Room, RoomService } from '../../core/services/room';
import { RoomType, RoomTypeService } from '../../core/services/room-type';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './booking-list.html',
  styleUrls: ['./booking-list.scss']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  rooms: Room[] = [];
  roomTypes: RoomType[] = [];
  filterForm: FormGroup;

  constructor(
    private bookingService: BookingService,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      roomId: [null],
      roomTypeId: [null],
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.applyFilters();
    });
  }

  loadInitialData(): void {
    this.applyFilters();
    this.roomService.getRooms().subscribe(data => this.rooms = data);
    this.roomTypeService.getRoomTypes().subscribe(data => this.roomTypes = data);
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    this.bookingService.getBookings(filters).subscribe(data => {
      this.bookings = data;
    });
  }

  clearFilters(): void {
    this.filterForm.reset({
      roomId: null,
      roomTypeId: null,
      startDate: null,
      endDate: null
    });
  }

  cancelBooking(id: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.deleteBooking(id).subscribe({
        next: (response: any) => {
          // ** THE FIX: Replace the dollar sign with a rupee symbol **
          const successMessage = response.message.replace('$', '₹');

          this.notificationService.show(successMessage, 'success');
          this.applyFilters(); // Refresh the list
        },
        error: (err) => {
          this.notificationService.show('Failed to cancel booking.', 'error');
        }
      });
    }
  }
}