import { Routes } from '@angular/router';

import { BookingListComponent } from './features/booking-list/booking-list';
import { BookingFormComponent } from './features/booking-form/booking-form';

export const routes: Routes = [
    // Default route, redirects to the home component
    { path: '', redirectTo: '/bookings', pathMatch: 'full' },

    // Route to display the list of all bookings
    { path: 'bookings', component: BookingListComponent },

    // Route to display the form for creating a new booking
    { path: 'bookings/new', component: BookingFormComponent },

    // Route to display the form for editing an existing booking, using a route parameter 'id'
    { path: 'bookings/edit/:id', component: BookingFormComponent }
];