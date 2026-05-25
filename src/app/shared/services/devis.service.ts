import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

export interface DevisData {
  nom: string;
  email: string;
  telephone: string;
  circuitId: string;
  dateDepart: string;
  adultes: number;
  enfants: number;
  transport: boolean;
  guideAnglophone: boolean;
  hebergementPremium: boolean;
  message: string;
}

export interface Circuit {
  id: string;
  nom: string;
  duree: string;
  lieu: string;
  priceAdult: number;
  priceChild: number;
  description: string;
  inclusions: string[];
}

@Injectable({ providedIn: 'root' })
export class DevisService {

  readonly circuits: Circuit[] = [
    {
      id: 'mont-cameroun',
      nom: 'Trekking Mont Cameroun',
      duree: '3 jours / 2 nuits',
      lieu: 'Buéa, Région Sud-Ouest',
      priceAdult: 180000,
      priceChild: 120000,
      description: "Ascension du toit de l'Afrique Centrale (4 095 m). Trek en forêt tropicale, zones alpines et découverte des cratères volcaniques en activité.",
      inclusions: ['Guide montagne certifié', 'Équipement de trekking complet', 'Pension complète sur le parcours', 'Hébergement en refuge', "Porteurs jusqu'au camp de base", 'Transferts aller-retour Buéa'],
    },
    {
      id: 'kribi',
      nom: 'Kribi & Chutes de la Lobé',
      duree: '2 jours / 1 nuit',
      lieu: 'Kribi, Région du Sud',
      priceAdult: 120000,
      priceChild: 80000,
      description: "Les seules chutes d'eau qui se jettent directement dans l'Atlantique. Plages idylliques, village de pêcheurs Bassa et gastronomie locale.",
      inclusions: ['Transport Yaoundé — Kribi A/R', 'Hébergement en lodge bord de mer', 'Pension complète', 'Excursion chutes de la Lobé', 'Guide local francophone', 'Sortie en pirogue'],
    },
    {
      id: 'waza',
      nom: 'Safari Parc National de Waza',
      duree: '4 jours / 3 nuits',
      lieu: 'Waza, Extrême-Nord',
      priceAdult: 250000,
      priceChild: 175000,
      description: "L'une des plus importantes réserves de faune d'Afrique Centrale. Éléphants, lions, girafes, autruches dans leur habitat naturel.",
      inclusions: ['Vols intérieurs Yaoundé — Maroua A/R', 'Hébergement safari lodge', 'Pension complète', '2 safaris quotidiens (aube & crépuscule)', 'Ranger expert faune', "Droits d'entrée parc"],
    },
    {
      id: 'bafut',
      nom: 'Circuit Royal Bafut & Bamoun',
      duree: '3 jours / 2 nuits',
      lieu: 'Bafoussam, Région Ouest',
      priceAdult: 145000,
      priceChild: 100000,
      description: 'Immersion dans les royaumes traditionnels du Cameroun. Palais royal Bafut, Sultanat de Foumban, artisanat bamoun et hauts plateaux verdoyants.',
      inclusions: ['Transport Yaoundé A/R', 'Hébergement hôtel 3 étoiles', 'Petit-déjeuner inclus', 'Visites guidées palais et musées', 'Guide culturel bilingue', 'Atelier poterie bamoun'],
    },
    {
      id: 'custom',
      nom: 'Circuit sur mesure',
      duree: 'À définir selon votre projet',
      lieu: 'Cameroun — destinations au choix',
      priceAdult: 0,
      priceChild: 0,
      description: 'Un voyage entièrement conçu selon vos envies, votre budget et vos dates. Notre équipe élabore l\'itinéraire parfait rien que pour vous.',
      inclusions: ['Consultation personnalisée offerte', 'Itinéraire sur mesure', 'Sélection des hébergements', 'Coordination des transports', 'Accompagnement 24h/24', 'Devis détaillé sous 24h'],
    },
  ];

  getCircuit(id: string): Circuit | undefined {
    return this.circuits.find(c => c.id === id);
  }

  calcTotal(data: DevisData): number {
    const circuit = this.getCircuit(data.circuitId);
    if (!circuit || circuit.id === 'custom') return 0;

    const opts = { transport: 15000, guideAnglophone: 20000, hebergementPremium: 35000 };
    const nights = parseInt(circuit.duree.match(/(\d+) nuit/)?.[1] ?? '1');
    const pax = data.adultes + data.enfants;

    return (data.adultes * circuit.priceAdult)
      + (data.enfants * circuit.priceChild)
      + (data.transport ? pax * opts.transport : 0)
      + (data.guideAnglophone ? opts.guideAnglophone : 0)
      + (data.hebergementPremium ? opts.hebergementPremium * nights : 0);
  }

  generateDevis(data: DevisData): void {
    const circuit = this.getCircuit(data.circuitId);
    if (!circuit) return;

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;

    const ref = `CA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const validity = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    let y = 0;

    // ── HEADER BAND ────────────────────────────────────────────────
    doc.setFillColor(33, 159, 255);
    doc.rect(0, 0, W, 44, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CAMEROUN AVENTURE', 14, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("Votre agence de voyage au coeur de l'Afrique Centrale", 14, 24);

    doc.setFontSize(8);
    doc.text('contact@cameroun-aventure.com  |  +237 699 000 000  |  cameroun-aventure.com', 14, 31);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text('DEVIS', W - 14, 18, { align: 'right' });
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref. ${ref}`, W - 14, 27, { align: 'right' });
    doc.text(`Emis le ${today}`, W - 14, 33, { align: 'right' });
    doc.text(`Valable jusqu'au ${validity}`, W - 14, 39, { align: 'right' });

    y = 54;

    // ── CLIENT / AGENCE BLOCKS ─────────────────────────────────────
    // Client
    doc.setFillColor(33, 159, 255);
    doc.rect(14, y, 86, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('COORDONNEES CLIENT', 18, y + 5.5);

    doc.setFillColor(248, 249, 250);
    doc.rect(14, y + 8, 86, 30, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(14, y, 86, 38, 'S');

    doc.setTextColor(3, 6, 16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(data.nom, 18, y + 17);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(108, 117, 125);
    doc.text(data.email, 18, y + 25);
    doc.text(data.telephone, 18, y + 32);

    // Agence
    doc.setFillColor(3, 6, 16);
    doc.rect(112, y, 84, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('CAMEROUN AVENTURE', 116, y + 5.5);

    doc.setFillColor(248, 249, 250);
    doc.rect(112, y + 8, 84, 30, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(112, y, 84, 38, 'S');

    doc.setTextColor(108, 117, 125);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Avenue Kennedy, Yaounde — Cameroun', 116, y + 17);
    doc.text('contact@cameroun-aventure.com', 116, y + 25);
    doc.text('+237 699 000 000', 116, y + 32);

    y += 48;

    // ── CIRCUIT HEADER ─────────────────────────────────────────────
    doc.setFillColor(3, 6, 16);
    doc.rect(14, y, 182, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`CIRCUIT : ${circuit.nom.toUpperCase()}`, 18, y + 7);

    y += 16;

    // Description
    doc.setTextColor(3, 6, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(circuit.description, 178);
    doc.text(descLines, 14, y);
    y += (descLines.length * 5) + 6;

    // Details row (4 cells)
    const detailItems = [
      { label: 'DUREE', value: circuit.duree },
      { label: 'DESTINATION', value: circuit.lieu },
      { label: 'DEPART SOUHAITE', value: data.dateDepart ? new Date(data.dateDepart).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'A definir' },
      { label: 'VOYAGEURS', value: `${data.adultes} adulte${data.adultes > 1 ? 's' : ''}${data.enfants > 0 ? ` + ${data.enfants} enf.` : ''}` },
    ];
    const colW = 182 / 4;
    detailItems.forEach((d, i) => {
      const x = 14 + i * colW;
      doc.setFillColor(240, 248, 255);
      doc.setDrawColor(33, 159, 255);
      doc.rect(x, y, colW - 2, 16, 'FD');
      doc.setTextColor(108, 117, 125);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(d.label, x + 3, y + 5.5);
      doc.setTextColor(3, 6, 16);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text(d.value, x + 3, y + 13);
    });

    y += 24;

    // ── PRICING TABLE ──────────────────────────────────────────────
    doc.setFillColor(3, 6, 16);
    doc.rect(14, y, 182, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('DESIGNATION', 18, y + 6);
    doc.text('QTE', 112, y + 6, { align: 'right' });
    doc.text('PRIX UNITAIRE (FCFA)', 155, y + 6, { align: 'right' });
    doc.text('TOTAL (FCFA)', 196, y + 6, { align: 'right' });

    y += 9;

    const opts = { transport: 15000, guideAnglophone: 20000, hebergementPremium: 35000 };
    const nights = parseInt(circuit.duree.match(/(\d+) nuit/)?.[1] ?? '1');
    const fmt = (n: number): string => n === 0 ? '—' : n.toLocaleString('fr-FR');

    type PriceRow = { label: string; qty: string; pu: number; total: number };
    const rows: PriceRow[] = [];
    let grandTotal = 0;

    if (circuit.priceAdult > 0) {
      const t = data.adultes * circuit.priceAdult;
      rows.push({ label: `Adulte${data.adultes > 1 ? 's' : ''} — ${circuit.nom}`, qty: String(data.adultes), pu: circuit.priceAdult, total: t });
      grandTotal += t;
    }
    if (data.enfants > 0 && circuit.priceChild > 0) {
      const t = data.enfants * circuit.priceChild;
      rows.push({ label: `Enfant${data.enfants > 1 ? 's' : ''}`, qty: String(data.enfants), pu: circuit.priceChild, total: t });
      grandTotal += t;
    }
    if (data.transport) {
      const pax = data.adultes + data.enfants;
      const t = pax * opts.transport;
      rows.push({ label: 'Option : Transport aeroport A/R', qty: String(pax), pu: opts.transport, total: t });
      grandTotal += t;
    }
    if (data.guideAnglophone) {
      rows.push({ label: 'Option : Guide anglophone', qty: '1', pu: opts.guideAnglophone, total: opts.guideAnglophone });
      grandTotal += opts.guideAnglophone;
    }
    if (data.hebergementPremium) {
      const t = opts.hebergementPremium * nights;
      rows.push({ label: `Option : Hebergement premium (${nights} nuit${nights > 1 ? 's' : ''})`, qty: String(nights), pu: opts.hebergementPremium, total: t });
      grandTotal += t;
    }
    if (circuit.id === 'custom') {
      rows.push({ label: 'Devis sur mesure — tarif a etablir apres consultation', qty: '—', pu: 0, total: 0 });
    }

    rows.forEach((row, i) => {
      const even = i % 2 === 0;
      doc.setFillColor(even ? 255 : 248, even ? 255 : 249, even ? 255 : 250);
      doc.rect(14, y, 182, 9, 'F');
      doc.setTextColor(3, 6, 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(row.label, 18, y + 6);
      doc.setTextColor(108, 117, 125);
      doc.text(row.qty, 112, y + 6, { align: 'right' });
      doc.text(row.pu === 0 ? '—' : fmt(row.pu), 155, y + 6, { align: 'right' });
      doc.setTextColor(3, 6, 16);
      doc.setFont('helvetica', 'bold');
      doc.text(fmt(row.total), 196, y + 6, { align: 'right' });
      y += 9;
    });

    // Total row
    doc.setFillColor(255, 107, 53);
    doc.rect(14, y, 182, 13, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL ESTIME', 18, y + 8.5);
    if (circuit.id !== 'custom' && grandTotal > 0) {
      doc.text(`${fmt(grandTotal)} FCFA`, 196, y + 8.5, { align: 'right' });
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`(environ ${fmt(Math.round(grandTotal / 655.957))} EUR)`, 196, y + 13, { align: 'right' });
    } else {
      doc.text('Sur devis personnalise', 196, y + 8.5, { align: 'right' });
    }

    y += 22;

    // ── INCLUSIONS ─────────────────────────────────────────────────
    doc.setFillColor(240, 248, 255);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(33, 159, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('PRESTATIONS INCLUSES', 18, y + 5);
    y += 11;

    const half = Math.ceil(circuit.inclusions.length / 2);
    circuit.inclusions.forEach((inc, i) => {
      const col = i < half ? 0 : 1;
      const row = i < half ? i : i - half;
      const x = 14 + col * 94;
      const iy = y + row * 7;
      doc.setFillColor(33, 159, 255);
      doc.rect(x, iy - 2.5, 2.5, 2.5, 'F');
      doc.setTextColor(3, 6, 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(inc, x + 6, iy);
    });

    y += half * 7 + 6;

    // ── MESSAGE ────────────────────────────────────────────────────
    if (data.message && y < 240) {
      doc.setFillColor(255, 248, 240);
      doc.setDrawColor(255, 107, 53);
      const msgLines = doc.splitTextToSize(data.message, 172);
      const msgH = 14 + msgLines.length * 5;
      doc.rect(14, y, 182, msgH, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 107, 53);
      doc.text('NOTES & DEMANDES SPECIALES', 18, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(3, 6, 16);
      doc.text(msgLines, 18, y + 13);
      y += msgH + 6;
    }

    // ── FOOTER BAND ────────────────────────────────────────────────
    doc.setFillColor(33, 159, 255);
    doc.rect(0, 272, W, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text("Ce devis est valable 15 jours. Acompte de 30 % a la reservation. Prix en Francs CFA (XAF).", W / 2, 279, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Avenue Kennedy, Yaounde, Cameroun  |  contact@cameroun-aventure.com  |  +237 699 000 000', W / 2, 286, { align: 'center' });
    doc.text(`www.cameroun-aventure.com  |  Ref. ${ref}`, W / 2, 292, { align: 'center' });

    doc.save(`Devis_CamerounAventure_${data.nom.replace(/\s+/g, '_')}_${ref}.pdf`);
  }
}
