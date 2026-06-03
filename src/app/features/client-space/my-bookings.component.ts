import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { BookingSummary } from '../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingSummary[] = [];
  isLoading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (page) => { this.bookings = page.content; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'PENDING':     'text-yellow-700 bg-yellow-50 border-yellow-200',
      'CONFIRMED':   'text-blue-700 bg-blue-50 border-blue-200',
      'IN_PROGRESS': 'text-teal-700 bg-teal-50 border-teal-200',
      'COMPLETED':   'text-green-700 bg-green-50 border-green-200',
      'CANCELLED':   'text-gray-500 bg-gray-50 border-gray-200',
      'EXPIRED':     'text-red-600 bg-red-50 border-red-200',
    };
    return map[status] || 'text-dark-3 bg-gray-50 border-gray-200';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING':     'En attente',
      'CONFIRMED':   'Confirmée',
      'IN_PROGRESS': 'En cours',
      'COMPLETED':   'Terminée',
      'CANCELLED':   'Annulée',
      'EXPIRED':     'Expirée',
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      'PENDING':     'bi-clock',
      'CONFIRMED':   'bi-check-circle-fill',
      'IN_PROGRESS': 'bi-airplane-fill',
      'COMPLETED':   'bi-patch-check-fill',
      'CANCELLED':   'bi-x-circle-fill',
      'EXPIRED':     'bi-exclamation-circle-fill',
    };
    return icons[status] || 'bi-circle';
  }
}
