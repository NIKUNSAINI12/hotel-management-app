import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- INTERFACES ---
export interface RoomType {
  id: number;
  typeName: string;
  pricePerHour: number;
}

export interface Room {
  id: number;
  roomNumber: string;
  roomTypeId: number;
  roomType: RoomType;
}

export interface Booking {
  id: number;
  userEmail: string;
  startTime: Date;
  endTime: Date;
  totalCost: number;
  roomId: number;
  room: Room;
}

// Interface for the filter form data
export interface BookingFilter {
  roomId?: number;
  roomTypeId?: number;
  startDate?: Date;
  endDate?: Date;
}


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://webapplication120250904232050-b8fteqhvgfdbbde8.canadacentral-01.azurewebsites.net/api/Bookings'; // Hardcoded URL

  constructor(private http: HttpClient) { }

  getBookings(filters?: BookingFilter): Observable<Booking[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.roomId) {
        params = params.append('roomId', filters.roomId.toString());
      }
      if (filters.roomTypeId) {
        params = params.append('roomTypeId', filters.roomTypeId.toString());
      }
      if (filters.startDate) {
        params = params.append('startDate', new Date(filters.startDate).toISOString());
      }
      if (filters.endDate) {
        params = params.append('endDate', new Date(filters.endDate).toISOString());
      }
    }
    return this.http.get<Booking[]>(this.apiUrl, { params });
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  createBooking(booking: any): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  updateBooking(id: number, booking: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, booking);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}