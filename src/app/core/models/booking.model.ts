import { DepartureDate } from './circuit.model';

export interface BookingCreateRequest {
  departureDateId: string;
  participants: ParticipantRequest[];
  options?: string[];
  promoCode?: string;
  specialRequests?: string;
}

export interface ParticipantRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  dietaryRestrictions?: string;
  roomPreference?: string;
}

export interface BookingSummary {
  id: string;
  bookingReference: string;
  status: string;
  totalPrice: number;
  depositAmount: number;
  remainingAmount: number;
  circuitTitle: string;
  departureDate: string;
  participantsCount: number;
  createdAt: string;
}

export interface BookingDetail extends Omit<BookingSummary, 'departureDate'> {
  departureDate: DepartureDate;
  participants: ParticipantRequest[];
  payments: PaymentSummary[];
  options: string[];
  expiresAt?: string;
  confirmedAt?: string;
}

export interface PaymentSummary {
  type: string;
  status: string;
  amount: number;
  paidAt?: string;
}
