import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { ApiResponse } from '../../core/models/api-response.model';
import { UserSummary } from '../../core/models/auth.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: UserSummary | null = null;
  profileForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private storage: StorageService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user;
    this.profileForm = this.fb.group({
      firstName: [this.user?.firstName || '', Validators.required],
      lastName:  [this.user?.lastName  || '', Validators.required],
      phone:     [this.user?.phone     || ''],
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.put<ApiResponse<UserSummary>>(
      `${environment.apiUrl}/profile`,
      this.profileForm.value
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Profil mis à jour avec succès.';
        if (res.data) {
          this.storage.setUser(res.data);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour. Veuillez réessayer.';
      }
    });
  }

  getInitials(): string {
    const u = this.user;
    if (!u) return '?';
    return (u.firstName?.[0] || '') + (u.lastName?.[0] || '');
  }
}
