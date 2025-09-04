import { Component, signal } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './shared/notification/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HttpClientModule,CommonModule,RouterLink,RouterModule,NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hotel-ms-app');
}
