import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoomType {
  id: number;
  typeName: string;
  pricePerHour: number;
}

@Injectable({
  providedIn: 'root' // This line is crucial
})
export class RoomTypeService {
  private apiUrl = 'https://localhost:7060/api/Rooms/types';

  constructor(private http: HttpClient) { }

  getRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(this.apiUrl);
  }
}