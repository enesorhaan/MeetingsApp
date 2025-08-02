# 📅 Meetings App

Modern ve kullanıcı dostu bir toplantı yönetim uygulaması. Angular 17 ile geliştirilmiş, .NET Core API backend'i ile entegre edilmiş tam özellikli bir web uygulaması.

## 🚀 Özellikler

### 👤 Kullanıcı Yönetimi
- **Kayıt Olma**: Profil fotoğrafı ile birlikte kullanıcı kaydı
- **Giriş Yapma**: JWT token tabanlı kimlik doğrulama
- **Profil Yönetimi**: Kullanıcı bilgileri ve fotoğraf yönetimi

### 📋 Toplantı Yönetimi
- **Toplantı Oluşturma**: Başlık, açıklama, tarih/saat, süre ve dosya ekleme
- **Toplantı Listeleme**: Dashboard'da tüm toplantıları görüntüleme
- **Toplantı Detayları**: Detaylı toplantı bilgileri ve dosya indirme
- **Toplantı İptal Etme**: Organizatör tarafından toplantı iptali
- **Durum Takibi**: Yaklaşan, devam eden, tamamlanan ve iptal edilen toplantılar

### 📧 Davet Sistemi
- **Email Daveti**: Toplantı katılımcılarına email daveti gönderme
- **Toplu Davet**: Birden fazla email adresine aynı anda davet
- **Davet Takibi**: Gönderilen davetlerin durumu

### 🎯 Toplantıya Katılma
- **Link ile Katılma**: Toplantı linki ile misafir katılımı
- **Kimlik Doğrulama**: Giriş yapmış kullanıcılar için otomatik katılım
- **Misafir Katılımı**: Ad/soyad ile misafir olarak katılım

### 📁 Dosya Yönetimi
- **Dosya Yükleme**: Toplantı ile ilgili dosya ekleme
- **Dosya İndirme**: Toplantı katılımcıları için dosya indirme
- **Güvenli Erişim**: Yetkilendirme kontrollü dosya erişimi

### 🧩 Veritabanı Özellikleri
- **MSSQL Trigger**: Toplantı silme işlemlerinde otomatik log kaydı
- **Background Worker**: İptal edilen toplantıların otomatik temizlenmesi
- **Serilog Entegrasyonu**: Günlük uygulama logları

## 🛠️ Teknolojiler

### Frontend
- **Angular 17**: Modern web framework
- **TypeScript**: Tip güvenli JavaScript
- **SCSS**: Gelişmiş CSS preprocessor
- **Angular Reactive Forms**: Form yönetimi
- **Angular Router**: Sayfa yönlendirme
- **Angular HTTP Client**: API iletişimi

### Backend
- **.NET Core**: Modern web API framework
- **Entity Framework**: Veritabanı ORM
- **JWT Authentication**: Güvenli kimlik doğrulama
- **File Storage**: Dosya yönetimi sistemi
- **Background Services**: Arka plan işlemleri
- **Serilog**: Yapılandırılmış loglama

### Veritabanı
- **SQL Server**: İlişkisel veritabanı
- **Entity Framework Migrations**: Veritabanı şema yönetimi
- **MSSQL Triggers**: Otomatik veri işlemleri

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- Angular CLI 17+
- .NET Core 8.0+
- SQL Server

### Frontend Kurulumu
```bash
# Proje dizinine git
cd meetings-app

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
ng serve

# Uygulama http://localhost:4200 adresinde çalışacak
```

### Backend Kurulumu
```bash
# API projesine git
cd ../MeetingsApp.API

# Bağımlılıkları yükle
dotnet restore

# Veritabanı migration'larını çalıştır
dotnet ef database update

# API sunucusunu başlat
dotnet run

# API http://localhost:5016 adresinde çalışacak
```

## 🔧 Konfigürasyon

### Environment Variables
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5016/api'
};
```

### API Endpoints
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `GET /api/meeting/my-meetings` - Kullanıcının toplantıları
- `POST /api/meeting` - Yeni toplantı oluşturma
- `POST /api/meeting/invite` - Davet gönderme
- `GET /api/meeting/join/{guid}` - Toplantıya katılma

## 📱 Kullanım

### Kullanıcı Kaydı ve Giriş
1. Ana sayfada "Kayıt Ol" butonuna tıklayın
2. Gerekli bilgileri doldurun ve profil fotoğrafı ekleyin
3. Kayıt tamamlandıktan sonra giriş yapın

### Toplantı Oluşturma
1. Dashboard'da "Yeni Toplantı Oluştur" butonuna tıklayın
2. Toplantı bilgilerini doldurun (başlık, açıklama, tarih, süre)
3. İsteğe bağlı olarak dosya ekleyin
4. "Oluştur" butonuna tıklayın

### Davet Gönderme
1. Toplantı detaylarını açın
2. "📧 Davet Gönder" butonuna tıklayın
3. Email adreslerini girin
4. "Gönder" butonuna tıklayın

### Toplantıya Katılma
1. Dashboard'da "🔗 Toplantıya Katıl" butonuna tıklayın
2. Toplantı linkini yapıştırın
3. Giriş yapmış kullanıcılar otomatik katılır
4. Misafirler ad/soyad bilgilerini girer

## 🏗️ Proje Yapısı

### Frontend (Angular)
```
meetings-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/          # Ana dashboard
│   │   │   ├── login/              # Giriş sayfası
│   │   │   ├── register/           # Kayıt sayfası
│   │   │   ├── meeting-form/       # Toplantı oluşturma
│   │   │   ├── meeting-detail-modal/ # Toplantı detayları
│   │   │   ├── invite-modal/       # Davet gönderme
│   │   │   ├── join-meeting/       # Toplantıya katılma
│   │   │   └── join-link-modal/    # Link ile katılma
│   │   ├── services/
│   │   │   ├── auth.ts             # Kimlik doğrulama servisi
│   │   │   └── meeting.ts          # Toplantı servisi
│   │   ├── models/
│   │   │   ├── user.model.ts       # Kullanıcı modelleri
│   │   │   └── meeting.model.ts    # Toplantı modelleri
│   │   └── guards/
│   │       └── auth-guard.ts       # Kimlik doğrulama guard'ı
│   └── styles.scss                 # Global stiller
└── package.json
```

### Backend (.NET Core)
```
MeetingsApp/
├── Meetings.Api/                   # Ana API projesi
│   ├── Controllers/                # API Controller'ları
│   ├── Helpers/                    # Yardımcı sınıflar
│   ├── Middleware/                 # Middleware'ler
│   └── Services/                   # Business logic servisleri
├── Meetings.Data/                  # Veri erişim katmanı
│   ├── Context/                    # DbContext sınıfları
│   └── Migrations/                 # EF Core migrations
└── Meetings.Model/                 # Model katmanı
    ├── Dtos/                       # Data Transfer Objects
    ├── Entities/                   # Veritabanı entity'leri
    └── Enums/                      # Enumeration'lar
```

## 🧩 Veritabanı Özellikleri

### MSSQL Trigger
Meetings tablosundan bir kayıt silindiğinde otomatik olarak MeetingLogs tablosuna log kaydı düşülür.

```sql
CREATE TRIGGER trg_AfterDeleteMeeting
ON Meetings
AFTER DELETE
AS
BEGIN
    INSERT INTO MeetingLogs (MeetingId, DeletedAt)
    SELECT Id, GETDATE() FROM DELETED
END
```

### Background Worker
`CanceledMeetingCleanupWorker` sınıfı, arka planda çalışan bir servis olarak yapılandırılmıştır.

- **Çalışma Zamanı**: Her gün gece 03:00
- **İşlev**: `IsCanceled = true` olan toplantı kayıtlarını tamamen siler
- **Log Tutma**: Silinen kayıtların geçmişi MeetingLogs tablosunda tutulur
- **Uygulama Logları**: Günlük olarak `logs/` klasörüne Serilog ile kaydedilir

## 📁 Git Takibi Dışı Bırakılan Klasörler

Aşağıdaki klasörler `.gitignore` içerisine alınmıştır ve versiyon kontrolüne dahil edilmez:

- `MeetingsApp.Api/logs/` – Günlük log kayıtları
- `MeetingsApp.Api/Upload/` – Kullanıcı tarafından yüklenen dosyalar

## 🔌 Postman API Dokümantasyonu

Projede kullanılan tüm API uç noktalarını kolayca test edebilmeniz için Postman üzerinde hazırlanmış interaktif dokümantasyona aşağıdaki bağlantıdan ulaşabilirsiniz:

🔗 **Postman API Documentation** 
https://documenter.getpostman.com/view/29567242/2sB3BALsDr

Giriş yapma, toplantı oluşturma, davet gönderme gibi işlemleri örnek verilerle test edebilirsiniz.

## 🔒 Güvenlik

- **JWT Token**: Güvenli kimlik doğrulama
- **Route Guards**: Yetkilendirme kontrollü sayfa erişimi
- **Input Validation**: Form doğrulama
- **File Upload Security**: Güvenli dosya yükleme
- **CORS Configuration**: Cross-origin resource sharing

## 🚀 Production Deployment

### Build
```bash
# Production build
ng build --configuration production

# Build dosyaları dist/ klasöründe oluşacak
```

### Deployment
- Frontend: Herhangi bir static hosting servisi (Netlify, Vercel, AWS S3)
- Backend: Azure App Service, AWS EC2, Docker container
- Database: Azure SQL, AWS RDS, SQL Server

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun
## 📞 İletişim

- **Geliştirici**: Enes ORHAN
- **Email**: enesorhan_1366@hotmail.com_
- **Proje Linki**: https://github.com/enesorhaan/MeetingsApp

## 🙏 Teşekkürler

- Angular ekibine modern web framework için
- .NET ekibine güçlü backend framework için
- Tüm açık kaynak topluluğuna katkıları için

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 
