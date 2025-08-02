# 📅 Alpata Meetings App

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

### Veritabanı
- **SQL Server**: İlişkisel veritabanı
- **Entity Framework Migrations**: Veritabanı şema yönetimi

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

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Geliştirici**: [Adınız]
- **Email**: [email@example.com]
- **Proje Linki**: [https://github.com/username/alpata-meetings-app]

## 🙏 Teşekkürler

- Angular ekibine modern web framework için
- .NET ekibine güçlü backend framework için
- Tüm açık kaynak topluluğuna katkıları için

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 