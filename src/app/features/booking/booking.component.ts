import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DevisService, DevisData, Circuit } from '../../shared/services/devis.service';
import { CircuitService } from '../../core/services/circuit.service';
import { BookingService } from '../../core/services/booking.service';
import { CircuitDetail, DepartureDate } from '../../core/models/circuit.model';
import { BookingCreateRequest, ParticipantRequest } from '../../core/models/booking.model';

declare var WOW: any;
declare var jarallax: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit, AfterViewInit {
  private readonly devisService = inject(DevisService);
  private readonly circuitService = inject(CircuitService);
  private readonly bookingService = inject(BookingService);
  private readonly route = inject(ActivatedRoute);

  // ─── Devis mode (existing — intact) ──────────────────────────────
  readonly circuits = this.devisService.circuits;

  formData: DevisData = {
    nom: '',
    email: '',
    telephone: '',
    circuitId: '',
    dateDepart: '',
    adultes: 1,
    enfants: 0,
    transport: false,
    guideAnglophone: false,
    hebergementPremium: false,
    message: '',
  };

  isGenerating = false;
  isSuccess = false;
  submitted = false;

  get selectedCircuit(): Circuit | undefined {
    return this.devisService.getCircuit(this.formData.circuitId);
  }

  get totalPrice(): number {
    return this.devisService.calcTotal(this.formData);
  }

  get totalEur(): number {
    return Math.round(this.totalPrice / 655.957);
  }

  get isCustom(): boolean {
    return this.formData.circuitId === 'custom';
  }

  get nightCount(): number {
    const c = this.selectedCircuit;
    if (!c) return 1;
    return parseInt(c.duree.match(/(\d+) nuit/)?.[1] ?? '1');
  }

  get optionTotal(): number {
    if (!this.selectedCircuit) return 0;
    const pax = this.formData.adultes + this.formData.enfants;
    return (this.formData.transport ? pax * 15000 : 0)
      + (this.formData.guideAnglophone ? 20000 : 0)
      + (this.formData.hebergementPremium ? 35000 * this.nightCount : 0);
  }

  get baseTotal(): number {
    const c = this.selectedCircuit;
    if (!c) return 0;
    return this.formData.adultes * c.priceAdult + this.formData.enfants * c.priceChild;
  }

  formatFCFA(n: number): string {
    return n.toLocaleString('fr-FR') + ' FCFA';
  }

  minDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (!this.formData.nom || !this.formData.email || !this.formData.circuitId) return;

    this.isGenerating = true;
    await new Promise(r => setTimeout(r, 600));
    this.devisService.generateDevis(this.formData);
    this.isGenerating = false;
    this.isSuccess = true;
  }

  resetForm(): void {
    this.isSuccess = false;
    this.submitted = false;
    this.formData = {
      nom: '', email: '', telephone: '', circuitId: '',
      dateDepart: '', adultes: 1, enfants: 0,
      transport: false, guideAnglophone: false, hebergementPremium: false,
      message: '',
    };
  }

  // ─── API Booking mode (new) ───────────────────────────────────────
  mode: 'devis' | 'booking' = 'devis';
  apiCircuit: CircuitDetail | null = null;
  departureDates: DepartureDate[] = [];
  selectedDate: DepartureDate | null = null;
  participants: ParticipantRequest[] = [this.emptyParticipant()];
  isBookingLoading = false;
  bookingSuccess = '';
  bookingError = '';

  ngOnInit(): void {
    const slug = this.route.snapshot.queryParams['circuit'];
    if (slug) {
      this.mode = 'booking';
      this.circuitService.getBySlug(slug).subscribe({
        next: (circuit) => {
          this.apiCircuit = circuit;
          this.circuitService.getDepartureDates(circuit.id).subscribe({
            next: (dates) => this.departureDates = dates.filter(d => d.status === 'OPEN')
          });
        }
      });
    }
  }

  addParticipant(): void {
    this.participants.push(this.emptyParticipant());
  }

  removeParticipant(index: number): void {
    if (this.participants.length > 1) this.participants.splice(index, 1);
  }

  private emptyParticipant(): ParticipantRequest {
    return { firstName: '', lastName: '' };
  }

  onSubmitBooking(): void {
    if (!this.selectedDate || this.participants.length === 0) return;
    this.isBookingLoading = true;
    this.bookingError = '';

    const request: BookingCreateRequest = {
      departureDateId: this.selectedDate.id,
      participants: this.participants,
    };

    this.bookingService.create(request).subscribe({
      next: (booking) => {
        this.isBookingLoading = false;
        this.bookingSuccess = `Réservation ${booking.bookingReference} créée ! Retrouvez-la dans votre espace client.`;
      },
      error: (err) => {
        this.isBookingLoading = false;
        this.bookingError = err.error?.message || 'Erreur lors de la réservation. Veuillez réessayer.';
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof WOW !== 'undefined') new WOW().init();
    if (typeof jarallax !== 'undefined') jarallax(document.querySelectorAll('.jarallax'), { speed: 0.2 });
  }
}
