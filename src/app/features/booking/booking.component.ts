import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DevisService, DevisData, Circuit } from '../../shared/services/devis.service';

declare var WOW: any;
declare var jarallax: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.component.html',
})
export class BookingComponent implements AfterViewInit {
  private readonly devisService = inject(DevisService);

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

  ngAfterViewInit(): void {
    if (typeof WOW !== 'undefined') new WOW().init();
    if (typeof jarallax !== 'undefined') jarallax(document.querySelectorAll('.jarallax'), { speed: 0.2 });
  }
}
