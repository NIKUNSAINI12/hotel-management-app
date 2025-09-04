import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'https://localhost:7060/api/Rooms'; // Hardcoded URL

  constructor(private http: HttpClient) { }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }
}