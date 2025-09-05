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
  private apiUrl = 'https://webapplication120250904232050-b8fteqhvgfdbbde8.canadacentral-01.azurewebsites.net/api/Rooms/types';

  constructor(private http: HttpClient) { }

  getRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(this.apiUrl);
  }
}