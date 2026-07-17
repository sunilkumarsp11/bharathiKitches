import { useEffect, useState } from 'react';
import './App.css';

const ingredients = [
  {
    slug: 'ragi',
    icon: '🌾',
    title: 'Finger Millet (Ragi)',
    brief: 'The ultimate calcium champion for stronger bones and healthy growth.',
    details: [
      ['Key Nutrition', 'Calcium, Iron, Amino Acids (Lysine)'],
      ['Why in the Mix', 'Forms the core base and supports healthy skeletal development.'],
      ['Health Benefits', 'Strengthens bones, supports energy, and balances blood sugar.'],
    ],
  },
  {
    slug: 'kambu',
    icon: '🌱',
    title: 'Pearl Millet (Kambu)',
    brief: 'A cooling grain rich in iron and magnesium for focused energy.',
    details: [
      ['Key Nutrition', 'Iron, Magnesium, Phosphorus, Zinc'],
      ['Why in the Mix', 'Balances body temperature and supports steady oxygen flow.'],
      ['Health Benefits', 'Combats fatigue, strengthens immunity, and supports heart health.'],
    ],
  },
  {
    slug: 'thinai',
    icon: '🧠',
    title: 'Foxtail Millet (Thinai)',
    brief: 'Brain-friendly nourishment with B vitamins and essential amino acids.',
    details: [
      ['Key Nutrition', 'Vitamin B12, Thiamine, Protein, Niacin'],
      ['Why in the Mix', 'Nourishes the nervous system and adds a delicate nutty flavor.'],
      ['Health Benefits', 'Supports memory, digestion, and immunity.'],
    ],
  },
  {
    slug: 'varagu',
    icon: '💛',
    title: 'Kodo Millet (Varagu)',
    brief: 'Rich in B-vitamins and minerals for cellular recovery and calm energy.',
    details: [
      ['Key Nutrition', 'Lecithin, Riboflavin, Niacin, Minerals'],
      ['Why in the Mix', 'Aids recovery and supports the nervous system.'],
      ['Health Benefits', 'Helps with tissue repair and healthy circulation.'],
    ],
  },
  {
    slug: 'grains',
    icon: '🥣',
    title: 'Ancient Grains & Cereals',
    brief: 'Sprouted grains that provide slow-burning energy and gut comfort.',
    details: [
      ['Included Grains', 'Black Rice, Broken Wheat, Barley, Corn Seeds, Poha, Sabudana'],
      ['Why in the Mix', 'Delivers steady carbs, fiber, and minerals.'],
      ['Health Benefits', 'Supports digestion and balanced blood sugar.'],
    ],
  },
  {
    slug: 'nuts',
    icon: '🥜',
    title: 'Premium Nuts & Seeds',
    brief: 'Healthy fats and brain foods that enrich taste and texture.',
    details: [
      ['Included Nuts', 'Almond, Walnut, Cashew, Peanut, Makhana'],
      ['Why in the Mix', 'Adds creaminess and essential omega fatty acids.'],
      ['Health Benefits', 'Supports brain health, skin glow, and cell repair.'],
    ],
  },
];

const sizeOptions = [
  { label: '250g', value: 250, price: 140 },
  { label: '500g', value: 500, price: 250 },
  { label: '750g', value: 750, price: 360 },
  { label: '1kg', value: 1000, price: 450 },
];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  quantity: 1,
  paymentMethod: 'Cash on Delivery',
};

function App() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[1]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const header = document.getElementById('main-header');
    const onScroll = () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const total = quantity * selectedSize.price;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.min(10, Math.max(1, prev + delta)));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formValues.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }

    if (!/^[6-9]\d{9}$/.test(formValues.phone.trim())) {
      nextErrors.phone = 'Enter a valid 10-digit phone number.';
    }

    if (formValues.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!formValues.address.trim() || formValues.address.trim().length < 10) {
      nextErrors.address = 'Please provide a complete shipping address.';
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorKey = Object.keys(nextErrors)[0];
      const firstErrorField = document.getElementById(
        firstErrorKey === 'name' ? 'customer-name' : firstErrorKey === 'phone' ? 'customer-phone' : firstErrorKey === 'email' ? 'customer-email' : 'shipping-address'
      );
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const submitted = {
      name: formValues.name.trim(),
      quantity,
      size: selectedSize.label,
      total: quantity * selectedSize.price,
      paymentMethod: formValues.paymentMethod,
    };

    setSummary(submitted);
    setModalType('success');
    setShowModal(true);
    setFormValues(initialForm);
    setQuantity(1);
    setErrors({});
  };

  return (
    <div className="app-shell">
      <header className="main-header" id="main-header">
        <div className="container header-container">
          <a href="#hero" className="logo">
            <img src="/logo/logo.svg" alt="Bharathi's Kitchen logo" className="brand-logo" />
            <div className="logo-text">
              <h1>Bharathi&apos;s Kitchen</h1>
              <span className="tagline">Wholesome | Natural | Homemade</span>
            </div>
          </a>
          <nav className="nav-menu">
            <ul>
              <li><a href="#hero" className="nav-link active">Home</a></li>
              <li><a href="#about" className="nav-link">Our Story</a></li>
              <li><a href="#ingredients" className="nav-link">Millets & Benefits</a></li>
              <li><a href="#order" className="nav-link btn-order-nav">Order Now</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero" id="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="badge"><i className="fa-solid fa-star"></i> 100% Natural & Homemade</div>
            <h2 className="hero-title">Nourish Your Family With Ancient Grains</h2>
            <p className="hero-description">
              Bharathi&apos;s Kitchen brings you the ultimate <strong>Wholesome Multi-grain Health Drink Mix (Sathu Maavu)</strong>.
              Crafted with 24 naturally sourced ingredients, slow-roasted to perfection, and packed with vital nutrients for all age groups.
            </p>
            <div className="hero-features">
              <div className="feature-item"><i className="fa-solid fa-shield-halved"></i><span>No Preservatives</span></div>
              <div className="feature-item"><i className="fa-solid fa-seedling"></i><span>24 Natural Ingredients</span></div>
              <div className="feature-item"><i className="fa-solid fa-mortar-pestle"></i><span>Traditionally Roasted</span></div>
            </div>
            <div className="hero-actions">
              <a href="#order" className="btn btn-primary">Order Fresh Jar <i className="fa-solid fa-arrow-right"></i></a>
              <a href="#ingredients" className="btn btn-secondary">Explore Grains</a>
            </div>
          </div>
          <div className="hero-media">
            <div className="image-wrapper">
              <div className="product-card">
                <div className="product-badge">Freshly Roasted</div>
                <div className="product-jar">
                  <span className="jar-top"></span>
                  <span className="jar-body"></span>
                </div>
                <div className="product-details">
                  <h3>{selectedSize.label} Jar</h3>
                  <p>Multi-grain health mix</p>
                  <span>₹{selectedSize.price}</span>
                </div>
              </div>
              <div className="glass-tag ratings-tag"><i className="fa-solid fa-heart"></i><span>Loved by 500+ Families</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Purely Homemade</span>
            <h2 className="section-title">The Story of Bharathi&apos;s Kitchen</h2>
            <div className="title-underline"></div>
          </div>
          <div className="about-grid">
            <div className="about-text-content">
              <h3>Preserving Health Across Generations</h3>
              <p>
                At Bharathi&apos;s Kitchen, we believe real health begins in the kitchen. Our signature Sathu Maavu is inspired by traditional South Indian recipes passed down through generations.
              </p>
              <p>
                We meticulously wash, sprout, sun-dry, and slow-roast each ingredient in small batches to preserve their vitamins and minerals.
              </p>
              <div className="highlight-box">
                <i className="fa-solid fa-quote-left"></i>
                <p>We do not mass produce. Every jar is made with the same love, care, and quality standards as we do for our own children.</p>
              </div>
            </div>
            <div className="about-media">
              <div className="journey-card">
                <h4>Our Brand Journey</h4>
                <p>Designed with authenticity, purity, and modern simplicity in mind.</p>
                <div className="journey-visual">
                  <div className="leaf-circle"></div>
                  <div className="journey-pill">Natural</div>
                  <div className="journey-pill muted">Trusted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ingredients" id="ingredients">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Nutrition Science</span>
            <h2 className="section-title">Powerhouse Millets & Ingredients</h2>
            <p className="section-desc">Learn about the extraordinary grains that make this health mix a powerhouse of daily nutrition.</p>
            <div className="title-underline"></div>
          </div>

          <div className="ingredients-banner-container">
            <div className="ingredients-banner-card">
              <div>
                <h3>24 naturally sourced ingredients</h3>
                <p>Washed, sprouted, sun-dried, slow-roasted, and milled into a single nutrient-dense cup.</p>
              </div>
              <div className="banner-pill">No preservatives</div>
            </div>
          </div>

          <div className="millets-grid">
            {ingredients.map((item) => (
              <article key={item.slug} className={`millet-card ${expandedCard === item.slug ? 'expanded' : ''}`}>
                <div className="millet-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p className="millet-brief">{item.brief}</p>
                <div className="millet-details">
                  {item.details.map(([label, value]) => (
                    <div className="detail-group" key={label}>
                      <strong>{label}:</strong>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-card-expand" onClick={() => setExpandedCard(expandedCard === item.slug ? null : item.slug)}>
                  {expandedCard === item.slug ? 'Hide Benefits' : 'View Benefits'} <i className={`fa-solid ${expandedCard === item.slug ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="order" id="order">
        <div className="container">
          <div className="order-grid">
            <div className="order-info-column">
              <div className="order-promo-badge"><i className="fa-solid fa-fire"></i> Freshly Roasted Batch</div>
              <h2>Order Fresh Sathu Maavu</h2>
              <p className="promo-text">
                Order your {selectedSize.label} jar of wholesome multi-grain health drink mix and enjoy a fresh, home-blended experience at your doorstep.
              </p>

              <div className="pricing-card">
                <div className="size-selector-group" role="group" aria-label="Choose pack size">
                  {sizeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`size-option ${selectedSize.value === option.value ? 'active' : ''}`}
                      onClick={() => setSelectedSize(option)}
                      aria-label={option.label}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="price-row">
                  <span className="item-name">Health Drink Mix ({selectedSize.label} Jar)</span>
                  <span className="item-unit-price">₹{selectedSize.price}</span>
                </div>
                <div className="price-row delivery-row">
                  <span>Delivery Partner Fee</span>
                  <span className="delivery-status text-green">FREE Delivery</span>
                </div>
                <div className="divider"></div>
                <div className="price-row total-row">
                  <span>Grand Total</span>
                  <span className="grand-total-val">₹{total}</span>
                </div>
              </div>

              <div className="guarantees">
                <div className="g-item">
                  <i className="fa-solid fa-leaf text-green"></i>
                  <div>
                    <h4>100% Clean Label</h4>
                    <p>Zero artificial preservatives, sugar, or colourants.</p>
                  </div>
                </div>
                <div className="g-item">
                  <i className="fa-solid fa-truck-fast text-gold"></i>
                  <div>
                    <h4>Fast Home Delivery</h4>
                    <p>Dispatched within 24 hours of roasting and grinding.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-form-column">
              <div className="form-wrapper">
                <h3>Delivery Details</h3>
                <p className="form-sub">Fill in the fields below to place your order directly.</p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label htmlFor="customer-name">Full Name <span className="required">*</span></label>
                    <div className="input-with-icon">
                      <i className="fa-regular fa-user"></i>
                      <input id="customer-name" name="name" type="text" placeholder="Enter your full name" value={formValues.name} onChange={handleInputChange} />
                    </div>
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="customer-phone">Phone / WhatsApp <span className="required">*</span></label>
                      <div className="input-with-icon">
                        <i className="fa-solid fa-phone"></i>
                        <input id="customer-phone" name="phone" type="tel" placeholder="10-digit number" value={formValues.phone} onChange={handleInputChange} />
                      </div>
                      {errors.phone && <span className="error-msg">{errors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="customer-email">Email Address</label>
                      <div className="input-with-icon">
                        <i className="fa-regular fa-envelope"></i>
                        <input id="customer-email" name="email" type="email" placeholder="name@example.com" value={formValues.email} onChange={handleInputChange} />
                      </div>
                      {errors.email && <span className="error-msg">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="order-quantity">Quantity ({selectedSize.label} Jar) <span className="required">*</span></label>
                      <div className="quantity-selector">
                        <button type="button" className="btn-qty" onClick={() => handleQuantityChange(-1)}><i className="fa-solid fa-minus"></i></button>
                        <input id="order-quantity" name="quantity" type="number" value={quantity} readOnly />
                        <button type="button" className="btn-qty" onClick={() => handleQuantityChange(1)}><i className="fa-solid fa-plus"></i></button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="payment-method">Payment Method <span className="required">*</span></label>
                      <div className="select-wrapper">
                        <select id="payment-method" name="paymentMethod" value={formValues.paymentMethod} onChange={handleInputChange}>
                          <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                          <option value="UPI / PhonePe / GPay">UPI / GPay (Pay on Delivery)</option>
                        </select>
                        <i className="fa-solid fa-chevron-down select-arrow"></i>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="shipping-address">Full Delivery Address <span className="required">*</span></label>
                    <div className="input-with-icon align-start">
                      <i className="fa-regular fa-map"></i>
                      <textarea id="shipping-address" name="address" rows="3" placeholder="House/Flat No, Street, Landmark, Area, City, Pincode" value={formValues.address} onChange={handleInputChange}></textarea>
                    </div>
                    {errors.address && <span className="error-msg">{errors.address}</span>}
                  </div>

                  <button type="submit" className="btn btn-submit">
                    <span className="btn-text">Confirm Order (₹{total})</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="overlay-dialog-backdrop" onClick={() => setShowModal(false)}>
          <div className="status-card" onClick={(event) => event.stopPropagation()}>
            <div className={`status-icon ${modalType === 'success' ? 'success-icon' : 'error-icon'}`}>
              <i className={modalType === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}></i>
            </div>
            <h2>{modalType === 'success' ? 'Order Placed Successfully!' : 'Submission Failed'}</h2>
            <p>
              {modalType === 'success'
                ? 'Thank you for choosing Bharathi\'s Kitchen. We have saved your order details in our registry.'
                : 'We encountered an issue while writing to our order sheet. Please try again.'}
            </p>
            {summary && (
              <div className="summary-details">
                <p><strong>Customer:</strong> {summary.name}</p>
                <p><strong>Pack:</strong> {summary.size}</p>
                <p><strong>Quantity:</strong> {summary.quantity} Jar(s)</p>
                <p><strong>Total Bill:</strong> ₹{summary.total}</p>
              </div>
            )}
            <button className="btn btn-primary" onClick={() => setShowModal(false)}>Done</button>
          </div>
        </div>
      )}

      <footer className="main-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#hero" className="logo">
              <img src="/logo/logo.svg" alt="Bharathi's Kitchen logo" className="brand-logo" />
              <span className="logo-text-title">Bharathi&apos;s Kitchen</span>
            </a>
            <p>100% natural, home-blended health mixes using premium organic millets and dry fruits.</p>
            <div className="social-icons">
              <a href="#hero" aria-label="Facebook"><i className="fa-brands fa-facebook"></i></a>
              <a href="#hero" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#hero" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#about">Our Story</a></li>
              <li><a href="#ingredients">Millets & Benefits</a></li>
              <li><a href="#order">Order Form</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact Info</h4>
            <p><i className="fa-solid fa-house-chimney"></i> Bangalore, Karnataka, India</p>
            <p><i className="fa-solid fa-phone"></i> +91 98765 43210</p>
            <p><i className="fa-solid fa-envelope"></i> contact@bharathiskitchen.com</p>
          </div>
        </div>
      </footer>

      <button type="button" className="chat-toggle" onClick={() => setIsChatOpen((prev) => !prev)} aria-label="Chat with Bharathi">
        <i className="fa-solid fa-comments"></i>
      </button>

      {isChatOpen && (
        <div className="chat-panel" role="dialog" aria-label="Chat assistant">
          <div className="chat-panel-header">
            <div>
              <h3>Chat with Bharathi</h3>
              <p>Ask about ingredients, delivery, or pack sizes.</p>
            </div>
            <button type="button" className="chat-close" onClick={() => setIsChatOpen(false)} aria-label="Close chat">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="chat-body">
            <div className="chat-bubble bot">Hello! I can help you choose the right pack size or answer questions about the mix.</div>
            <div className="chat-bubble user">What is the best option for a family?</div>
            <div className="chat-bubble bot">The 500g jar is ideal for regular family use, while 1kg is perfect for larger households or gifting.</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
