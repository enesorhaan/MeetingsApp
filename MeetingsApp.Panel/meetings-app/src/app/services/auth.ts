import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5016/api';
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
    console.log('AuthService - Login isteği gönderiliyor:', loginRequest);
    
    // Property isimlerini PascalCase yapıyoruz
    const apiRequest = {
      Email: loginRequest.email,
      Password: loginRequest.password
    };
    
    console.log('AuthService - Login API Request (PascalCase):', apiRequest);
    
    return this.http.post<any>(`${this.apiUrl}/auth/login`, apiRequest)
      .pipe(
        tap((response: any) => {
          console.log('AuthService - Login başarılı:', response);
          
          // API'den dönen response'da property'ler PascalCase olabilir
          const fullName = response.fullName || response.FullName || '';
          const email = response.email || response.Email || '';
          const token = response.token || response.Token || '';
          const photoPath = response.photoPath || response.PhotoPath || '';
          const userId = response.userId || response.UserId || null; // Kullanıcı ID'si
          
          localStorage.setItem('token', token);
          
          // Login sonrası kullanıcı bilgilerini oluşturalım
          const user: User = {
            id: userId, // Kullanıcı ID'sini kaydet
            firstName: fullName.split(' ')[0] || '',
            lastName: fullName.split(' ').slice(1).join(' ') || '',
            email: email,
            phone: '',
            profileImagePath: photoPath
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    console.log('AuthService - Register isteği gönderiliyor:', registerRequest);
    console.log('AuthService - API URL:', `${this.apiUrl}/auth/register`);
    
    // Property isimlerini PascalCase yapıyoruz
    const apiRequest = {
      FirstName: registerRequest.firstName,
      LastName: registerRequest.lastName,
      Email: registerRequest.email,
      Password: registerRequest.password,
      Phone: registerRequest.phone,
      PhotoPath: registerRequest.profileImagePath
    };
    
    console.log('AuthService - API Request (PascalCase):', apiRequest);
    
    return this.http.post(`${this.apiUrl}/auth/register`, apiRequest, { responseType: 'text' })
      .pipe(
        map((response: string) => {
          console.log('AuthService - Register response (raw):', response);
          
          // API'den dönen response'u parse etmeye çalış
          let parsedResponse: AuthResponse;
          try {
            parsedResponse = JSON.parse(response);
          } catch (e) {
            console.error('JSON parse hatası:', e);
            console.log('Raw response:', response);
            
            // API'den dönen text response'dan token'ı çıkarmaya çalış
            let token = 'temp-token';
            if (response.includes('Token:')) {
              const tokenMatch = response.match(/Token:\s*([^\s]+)/);
              if (tokenMatch && tokenMatch[1]) {
                token = tokenMatch[1];
                console.log('Token extracted from response:', token);
              }
            }
            
            // Eğer JSON parse edilemezse, manuel olarak oluştur
            parsedResponse = {
              fullName: `${registerRequest.firstName} ${registerRequest.lastName}`,
              email: registerRequest.email,
              token: token
            };
          }
          
          console.log('AuthService - Register başarılı:', parsedResponse);
          // Register sonrası localStorage'a kaydetmiyoruz çünkü kullanıcı henüz login olmamış
          // localStorage.setItem('token', parsedResponse.token);
          // const user: User = {
          //   firstName: registerRequest.firstName,
          //   lastName: registerRequest.lastName,
          //   email: registerRequest.email,
          //   phone: registerRequest.phone,
          //   profileImagePath: registerRequest.profileImagePath
          // };
          // localStorage.setItem('currentUser', JSON.stringify(user));
          // this.currentUserSubject.next(user);
          
          return parsedResponse;
        })
      );
  }

  logout(): void {
    console.log('AuthService logout başladı');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('AuthService logout tamamlandı - token ve user temizlendi');
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
