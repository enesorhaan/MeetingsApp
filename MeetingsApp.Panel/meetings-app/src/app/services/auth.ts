import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    const apiRequest = {
      Email: loginRequest.email,
      Password: loginRequest.password
    };
    
    return this.http.post<any>(`${this.apiUrl}/auth/login`, apiRequest)
      .pipe(
        map((response: any) => {
          // API'den dönen response'da property'ler PascalCase olabilir
          const fullName = response.fullName || response.FullName || '';
          const email = response.email || response.Email || '';
          const token = response.token || response.Token || '';
          const photoPath = response.photoPath || response.PhotoPath || '';
          const userId = response.userId || response.UserId || null;
          
          localStorage.setItem('token', token);
          
          // Login sonrası kullanıcı bilgilerini oluşturalım
          const user: User = {
            id: userId, // userId'yi id olarak set et
            firstName: fullName.split(' ')[0] || '',
            lastName: fullName.split(' ').slice(1).join(' ') || '',
            email: email,
            phone: '',
            profileImagePath: photoPath
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          
          return {
            fullName: fullName,
            email: email,
            token: token
          };
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    const apiRequest = {
      FirstName: registerRequest.firstName,
      LastName: registerRequest.lastName,
      Email: registerRequest.email,
      Password: registerRequest.password,
      Phone: registerRequest.phone,
      PhotoPath: registerRequest.profileImagePath
    };
    
    return this.http.post(`${this.apiUrl}/auth/register`, apiRequest, { responseType: 'text' })
      .pipe(
        map((response: string) => {
          // API'den plain text döndüğü için response'u string olarak alıyoruz
          // Başarılı kayıt durumunda kullanıcı bilgilerini oluşturalım
          const fullName = `${registerRequest.firstName} ${registerRequest.lastName}`;
          const email = registerRequest.email;
          const token = 'temp-token'; // Register sonrası login gerekebilir
          
          return {
            fullName: fullName,
            email: email,
            token: token
          };
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // HTTP Headers için token'ı ekleyen method
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Sadece Authorization header'ı için (dosya upload gibi durumlar için)
  getAuthHeadersOnly(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Fotoğraf upload metodu
  uploadPhoto(file: File): Observable<{ path: string }> {
    const formData = new FormData();
    formData.append('File', file); // .NET API'deki FileUploadRequest.File ile eşleşiyor
    
    // Upload işlemlerinde token gerekmez (kullanıcı henüz kayıt olmamış olabilir)
    return this.http.post<{ path: string }>(`${this.apiUrl}/filestorage/photo-upload`, formData);
  }
}
