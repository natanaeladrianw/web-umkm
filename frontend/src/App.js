import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [umkmData, setUmkmData] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const sectionRefs = useRef([]);
  const productsGridRef = useRef(null);
  const servicesGridRef = useRef(null);
  const testimonialsGridRef = useRef(null);

  // Data default jika API tidak merespon
  const defaultData = {
    name: "Toko Kerajinan Tangan Adrian",
    since: 2018,
    description: "UMKM yang bergerak di bidang kerajinan tangan tradisional dengan sentuhan modern. Kami memproduksi berbagai macam produk kerajinan seperti tas, dompet, aksesoris, dan hiasan rumah yang terbuat dari bahan-bahan alami dan ramah lingkungan.",
    products: [
      {
        id: 1,
        name: "Tas Rajut Modern",
        price: 150000,
        description: "Tas rajut dengan desain modern dan warna-warna cerah",
        image: "/images/tas-rajut.jpg"
      },
      {
        id: 2,
        name: "Dompet Kulit Sintetis",
        price: 75000,
        description: "Dompet elegan dari kulit sintetis berkualitas",
        image: "/images/dompet-kulit.jpg"
      },
      {
        id: 3,
        name: "Gelang Manik-manik",
        price: 25000,
        description: "Gelang handmade dengan manik-manik warna-warni",
        image: "/images/gelang-manik.jpg"
      }
    ],
    services: [
      "Custom desain produk sesuai permintaan",
      "Pengiriman cepat ke seluruh Indonesia",
      "Pembelian grosir dengan harga khusus",
      "Konsultasi desain gratis",
      "Garansi kualitas 100%"
    ],
    testimonials: [
      {
        name: "Rina Wijaya",
        comment: "Produknya bagus banget dan kualitasnya terjamin! Pengiriman juga cepat.",
        rating: 5
      },
      {
        name: "Budi Santoso",
        comment: "Pelayanan sangat ramah dan profesional. Recommended banget!",
        rating: 5
      },
      {
        name: "Sari Dewi",
        comment: "Barangnya original dan packingnya rapi. Puas belanja di sini!",
        rating: 5
      }
    ],
    contact: {
      address: "Jl. Merdeka No. 123, Jakarta Pusat",
      phone: "+62 812-3456-7890",
      email: "info@tokoadrian.com",
      instagram: "@tokoadrian_craft",
      whatsapp: "+6281234567890"
    }
  };

  useEffect(() => {
    fetchUmkmData();
    setupIntersectionObserver();
  }, []);

  const fetchUmkmData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/umkm', {
        timeout: 5000 // Timeout 5 detik
      });
      
      // Gabungkan data dari API dengan default data
      const mergedData = {
        ...defaultData,
        ...response.data.umkm,
        products: response.data.umkm?.products || defaultData.products,
        services: response.data.umkm?.services || defaultData.services,
        testimonials: response.data.umkm?.testimonials || defaultData.testimonials,
        contact: {
          ...defaultData.contact,
          ...response.data.umkm?.contact
        }
      };
      
      setUmkmData(mergedData);
      
      setTimeout(() => setIsLoading(false), 1000);
    } catch (error) {
      console.error('Error fetching data, using default data:', error);
      // Gunakan data default jika API error
      setUmkmData(defaultData);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const setupIntersectionObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 500);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/contact', contactForm);
      setSubmitStatus(response.data.message);
      setContactForm({ name: '', email: '', message: '' });
      
      const submitBtn = e.target.querySelector('button');
      submitBtn.classList.add('submit-animate');
      setTimeout(() => submitBtn.classList.remove('submit-animate'), 1000);
      
      setTimeout(() => setSubmitStatus(''), 3000);
    } catch (error) {
      setSubmitStatus('Pesan berhasil dikirim (simulasi)! Kami akan menghubungi Anda segera.');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200/667eea/white?text=Produk+UMKM';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath; // served from frontend/public
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200/667eea/white?text=Gambar+Produk';
  };

  const scrollProducts = (direction) => {
    const grid = productsGridRef.current;
    if (!grid) return;
    const firstCard = grid.querySelector('.product-card');
    const gap = parseFloat(getComputedStyle(grid).gap || '0');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + gap : grid.clientWidth * 0.9;
    grid.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  const scrollServices = (direction) => {
    const grid = servicesGridRef.current;
    if (!grid) return;
    const firstCard = grid.querySelector('.service-card');
    const gap = parseFloat(getComputedStyle(grid).gap || '0');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + gap : grid.clientWidth * 0.9;
    grid.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  const scrollTestimonials = (direction) => {
    const grid = testimonialsGridRef.current;
    if (!grid) return;
    const firstCard = grid.querySelector('.testimonial-card');
    const gap = parseFloat(getComputedStyle(grid).gap || '0');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + gap : grid.clientWidth * 0.9;
    grid.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Memuat data UMKM...</p>
        </div>
      </div>
    );
  }

  if (!umkmData) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>⚠️ Gagal Memuat Data</h2>
          <p>Silakan refresh halaman atau coba lagi nanti.</p>
          <button onClick={fetchUmkmData} className="retry-btn">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora aurora-1"></div>
        <div className="aurora aurora-2"></div>
        <div className="aurora aurora-3"></div>
        <div className="aurora aurora-4"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="header-title">
              {umkmData.name}
            </h1>
            <p className="header-subtitle">
              Kerajinan Tangan Berkualitas Sejak {umkmData.since}
            </p>
            <div className="header-buttons">
              <button className="cta-button primary">
                Jelajahi Produk
                <span className="arrow">→</span>
              </button>
              <button className="cta-button secondary">
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
        {/* Animated Craft Decor */}
        <div className="header-decor" aria-hidden="true">
          <span className="floating-icon large">🧵</span>
          <span className="floating-icon">✂️</span>
          <span className="floating-icon medium">🧶</span>
          <span className="floating-icon">👜</span>
          <span className="floating-icon">🪡</span>
          <span className="floating-icon small">🧷</span>
          <span className="floating-icon">🪢</span>
          <span className="floating-icon small">🧵</span>
          <span className="floating-icon medium">🧶</span>
          <span className="floating-icon">✂️</span>
          <span className="floating-icon small">🪡</span>
          <span className="floating-icon">👜</span>
        </div>
        <div className="header-wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={el => sectionRefs.current[0] = el} className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h2 className="hero-title">
                Selamat Datang di <span className="text-gradient">{umkmData.name}</span>
              </h2>
              <p className="hero-description">
                {umkmData.description}
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Produk Terjual</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Pelanggan Puas</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Tahun Pengalaman</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section ref={el => sectionRefs.current[1] = el} className="products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🛍️</span>
              Produk Unggulan Kami
            </h2>
            <p className="section-subtitle">Temukan koleksi kerajinan tangan terbaik kami</p>
          </div>
          <div className="products-slider">
            <button className="slider-btn prev" onClick={() => scrollProducts(-1)} aria-label="Sebelumnya">‹</button>
            <div className="products-grid" ref={productsGridRef}>
            {umkmData.products.map((product, index) => (
              <div 
                key={product.id} 
                className="product-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="product-image-container">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name}
                    onError={handleImageError}
                    className="product-image"
                  />
                  <div className="product-badge">Bestseller</div>
                  <div className="product-overlay">
                    <button className="quick-view-btn">📦 Lihat Detail</button>
                  </div>
                </div>
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="price">Rp {product.price.toLocaleString('id-ID')}</span>
                    <button className="add-to-cart-btn">
                      <span className="cart-icon">+</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
            <button className="slider-btn next" onClick={() => scrollProducts(1)} aria-label="Berikutnya">›</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={el => sectionRefs.current[2] = el} className="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⭐</span>
              Layanan Profesional Kami
            </h2>
            <p className="section-subtitle">Kami memberikan yang terbaik untuk Anda</p>
          </div>
          <div className="products-slider">
            <button className="slider-btn prev" onClick={() => scrollServices(-1)} aria-label="Sebelumnya">‹</button>
            <div className="products-grid" ref={servicesGridRef}>
              {umkmData.services.map((service, index) => (
                <div 
                  key={index} 
                  className="service-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="service-icon">🎯</div>
                  <h4 className="service-title">{service}</h4>
                  <p className="service-description">Layanan profesional dengan standar kualitas tertinggi</p>
                </div>
              ))}
            </div>
            <button className="slider-btn next" onClick={() => scrollServices(1)} aria-label="Berikutnya">›</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={el => sectionRefs.current[3] = el} className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">❤️</span>
              Kata Pelanggan Kami
            </h2>
            <p className="section-subtitle">Apa kata mereka yang sudah berbelanja di toko kami</p>
          </div>
          <div className="products-slider">
            <button className="slider-btn prev" onClick={() => scrollTestimonials(-1)} aria-label="Sebelumnya">‹</button>
            <div className="products-grid" ref={testimonialsGridRef}>
              {umkmData.testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="testimonial-card"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="testimonial-info">
                      <h4 className="testimonial-name">{testimonial.name}</h4>
                      <div className="rating">
                        {'⭐'.repeat(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="testimonial-comment">"{testimonial.comment}"</p>
                </div>
              ))}
            </div>
            <button className="slider-btn next" onClick={() => scrollTestimonials(1)} aria-label="Berikutnya">›</button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={el => sectionRefs.current[4] = el} className="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📞</span>
              Hubungi Kami
            </h2>
            <p className="section-subtitle">Kami siap membantu kebutuhan kerajinan tangan Anda</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div>
                  <h4>Alamat Workshop</h4>
                  <p>{umkmData.contact.address}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">📞</div>
                <div>
                  <h4>Telepon/WhatsApp</h4>
                  <p>{umkmData.contact.phone}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>{umkmData.contact.email}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">📷</div>
                <div>
                  <h4>Instagram</h4>
                  <p>{umkmData.contact.instagram}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="contact-form">
              <h3 className="form-title">📩 Kirim Pesan</h3>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Alamat Email Anda"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <textarea
                  placeholder="Tulis pesan Anda di sini..."
                  rows="5"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="submit-btn">
                <span className="btn-text">Kirim Pesan Sekarang</span>
                <span className="btn-icon">🚀</span>
              </button>

              {submitStatus && (
                <div className={`status-message ${submitStatus.includes('Error') ? 'error' : 'success'}`}>
                  {submitStatus}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{umkmData.name}</h3>
              <p>Menghasilkan kerajinan tangan berkualitas sejak {umkmData.since}</p>
              <div className="social-links">
                <a href="#" className="social-link">📷 Instagram</a>
                <a href="#" className="social-link">📘 Facebook</a>
                <a href="#" className="social-link">📧 Email</a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#products">Produk</a>
              <a href="#services">Layanan</a>
              <a href="#testimonials">Testimonial</a>
              <a href="#contact">Kontak</a>
            </div>
            <div className="footer-section">
              <h4>Jam Operasional</h4>
              <p>Senin - Jumat: 08:00 - 17:00</p>
              <p>Sabtu: 08:00 - 15:00</p>
              <p>Minggu: Libur</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 {umkmData.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;