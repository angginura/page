import motorData from '../../data/motor.json';

document.addEventListener('DOMContentLoaded', () => {
    // Config
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const createWhatsAppLink = (productName) => {
        const phone = '6281290881377'; // Updated Number
        const message = `Halo, saya tertarik motor Honda ${productName}, mohon info harga & promo.`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    // Render Products
    const productGrid = document.querySelector('.product-grid');
    const filters = document.querySelectorAll('.filter-btn');

    const renderProducts = (category = 'all') => {
        productGrid.innerHTML = '';

        const filteredData = category === 'all'
            ? motorData
            : motorData.filter(item => item.type.toLowerCase() === category.toLowerCase());

        if (filteredData.length === 0) {
            productGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">Tidak ada produk di kategori ini.</p>';
            return;
        }

        filteredData.forEach((motor, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.opacity = '0';
            card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;

            const featureBadges = motor.features.map(f => `<span class="badge">${f}</span>`).join('');

            card.innerHTML = `
        <div class="product-image">
          <img src="${motor.image}" alt="${motor.name}" loading="lazy">
        </div>
        <div class="product-info">
          <div class="product-type">${motor.type}</div>
          <h3 class="product-name">${motor.name}</h3>
          <div class="product-price">${motor.price}</div>
          <div class="product-features">
            ${featureBadges}
          </div>
          <div class="product-action">
            <a href="${createWhatsAppLink(motor.name)}" target="_blank" class="btn btn-primary btn-block btn-whatsapp">
              <i class="fab fa-whatsapp"></i> Pesan Sekarang
            </a>
          </div>
        </div>
      `;
            productGrid.appendChild(card);
        });
    };

    // Filter Logic
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filters.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');
            // Render
            renderProducts(btn.dataset.category);
        });
    });

    // Initial Render
    renderProducts();

    // Modal Review Logic
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReviewModal');
    const closeBtn = document.querySelector('.close-modal');
    const reviewForm = document.getElementById('reviewForm');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Handle Review Submit
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reviewName').value;
            const message = document.getElementById('reviewMessage').value;
            const ratingInput = document.querySelector('input[name="rating"]:checked');
            const rating = ratingInput ? ratingInput.value : '5';

            // Phone for reviews (using the primary admin)
            const reviewPhone = '6281290881377';

            const waText = `Halo BOS MOTOR, saya ingin memberikan ulasan:%0A%0A` +
                `Nama: ${name}%0A` +
                `Rating: ${rating} Bintang ⭐️%0A` +
                `Ulasan: ${message}%0A%0A` +
                `Terima kasih.`;

            const waLink = `https://wa.me/${reviewPhone}?text=${waText}`;

            // Open WhatsApp
            window.open(waLink, '_blank');

            // Close modal
            modal.classList.remove('active');
            reviewForm.reset();
        });
    }

    // Floating WhatsApp Toggle
    const waToggle = document.getElementById('waToggle');
    const waContainer = document.querySelector('.floating-wa-container');

    if (waToggle) {
        waToggle.addEventListener('click', () => {
            waContainer.classList.toggle('active');
        });
    }

    // Sticky Header Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
        }
    });
});
