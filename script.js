document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Scroll Animation Observer for rich dynamic experience
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Carousel Logic
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        let images = Array.from(track.querySelectorAll('.carousel-img'));
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        let currentIndex = 0;

        const updateButtons = () => {
            if (images.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }
        };

        const updateCarousel = () => {
            images.forEach((img, index) => {
                if (index === currentIndex) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        };

        // Dynamically load additional images in the folder (2.jpeg, 3.jpg, etc.)
        const firstImg = images[0];
        if (firstImg && !carousel.classList.contains('no-auto')) {
            const srcAttr = firstImg.getAttribute('src');
            const srcMatch = srcAttr.match(/(.*\/)1\.[a-z0-9]+$/i);

            if (srcMatch) {
                const basePath = srcMatch[1];
                let imgIndex = 2;
                const extensions = ['jpeg', 'jpg', 'png', 'webp', 'JPEG', 'JPG', 'PNG', 'WEBP'];

                const tryLoadImage = (index, extIndex) => {
                    if (extIndex >= extensions.length) {
                        // Stop attempting to load when all extensions are not found
                        updateButtons();
                        return;
                    }

                    const img = new Image();
                    img.src = `${basePath}${index}.${extensions[extIndex]}`;

                    img.onload = () => {
                        img.className = 'carousel-img';
                        img.alt = firstImg.alt;
                        track.appendChild(img);
                        images.push(img);
                        imgIndex++;
                        updateButtons();
                        tryLoadImage(imgIndex, 0); // try loading the next one
                    };

                    img.onerror = () => {
                        // Try next extension
                        tryLoadImage(index, extIndex + 1);
                    };
                };

                tryLoadImage(imgIndex, 0);
            }
        }

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (images.length <= 1) return;
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (images.length <= 1) return;
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        });

        // Initial setup
        updateButtons();
    });

    // --- CART FUNCTIONALITY ---

    // 1. Dynamically Add "Add to Cart" to Product Cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        const nameEl = card.querySelector('h3');
        const priceEl = card.querySelector('.price');
        if (!nameEl || !priceEl) return;

        const name = nameEl.textContent.trim();
        const priceText = priceEl.textContent.trim();
        const productId = 'prod_' + index;

        let optionsHtml = '';

        if (priceText.includes('Combo Price:')) {
            const match = priceText.match(/₹(\d+(?:\.\d+)?)/);
            const p = match ? match[1] : 0;
            optionsHtml = `<div class="cart-action-group"><button class="btn btn-primary add-to-cart-btn" data-id="${productId}" data-name="${name}" data-price="${p}" data-variant="Combo">Add to Cart</button></div>`;
        } else if (priceText.includes('|')) {
            const parts = priceText.split('|');
            // e.g. "₹60.00" or "₹10.00 each "
            const p1Match = parts[0].match(/₹(\d+(?:\.\d+)?)/);
            const p1 = p1Match ? p1Match[1] : 0;

            // e.g. " Pack of 2 for ₹110.00"
            const p2Str = parts[1].trim();
            const p2Match = p2Str.match(/for ₹(\d+(?:\.\d+)?)/);
            const p2 = p2Match ? p2Match[1] : 0;
            const variantName = p2Str.split('for')[0].trim();

            const variantOption1 = parts[0].includes('each') ? '1 Piece' : '1 Piece';

            optionsHtml = `
                <div class="cart-action-group">
                    <select class="variant-select" id="var_${productId}">
                        <option value="${p1}" data-variant="${variantOption1}">${variantOption1} - ₹${p1}</option>
                        <option value="${p2}" data-variant="${variantName}">${variantName} - ₹${p2}</option>
                    </select>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${productId}" data-name="${name}" data-has-variants="true">Add to Cart</button>
                </div>
            `;
        } else {
            const match = priceText.match(/₹(\d+(?:\.\d+)?)/);
            const p = match ? match[1] : 0;
            optionsHtml = `<div class="cart-action-group"><button class="btn btn-primary add-to-cart-btn" data-id="${productId}" data-name="${name}" data-price="${p}" data-variant="1 Piece">Add to Cart</button></div>`;
        }

        priceEl.insertAdjacentHTML('afterend', optionsHtml);
    });

    // 2. Cart State & Methods
    let cart = [];

    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalPriceEl = document.getElementById('cart-total-price');

    function toggleCart(show) {
        if (show) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('show');
        } else {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('show');
        }
    }

    cartBtn.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    function renderCart() {
        cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty</div>';
            cartTotalPriceEl.textContent = '₹0.00';
            return;
        }

        let total = 0;
        cartItemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const rowTotal = item.price * item.quantity;
            total += rowTotal;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-header">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${rowTotal.toFixed(2)}</div>
                </div>
                <div class="cart-item-variant">${item.variant} (₹${item.price} each)</div>
                <div class="item-controls">
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalPriceEl.textContent = `₹${total.toFixed(2)}`;
    }

    window.updateQty = function (index, delta) {
        if (cart[index]) {
            cart[index].quantity += delta;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            renderCart();
        }
    };

    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        renderCart();
    };

    // 3. Add to Cart Logic
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const hasVariants = btn.getAttribute('data-has-variants') === 'true';
            let price, variant;
            const name = btn.getAttribute('data-name');
            const id = btn.getAttribute('data-id');

            if (hasVariants) {
                const selectEl = document.getElementById('var_' + id);
                const selectedOption = selectEl.options[selectEl.selectedIndex];
                price = parseFloat(selectedOption.value);
                variant = selectedOption.getAttribute('data-variant');
            } else {
                price = parseFloat(btn.getAttribute('data-price'));
                variant = btn.getAttribute('data-variant');
            }

            // Check if item already exists in cart with same variant
            const existingItem = cart.find(item => item.name === name && item.variant === variant);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, variant, price, quantity: 1 });
            }

            renderCart();
            toggleCart(true); // Open cart automatically when adding
        });
    });

    // 4. Checkout Logic (WhatsApp, Email, Insta)
    const checkoutBtns = document.querySelectorAll('.checkout-btn');
    checkoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (cart.length === 0) {
                alert('Your cart is empty. Add items to order.');
                return;
            }

            const platform = btn.getAttribute('data-platform');
            let orderText = 'Hello VAIRA! I would like to place an order:\n\n';
            let total = 0;

            cart.forEach(item => {
                const subT = item.price * item.quantity;
                total += subT;
                orderText += `- ${item.quantity}x ${item.name} (${item.variant}) - ₹${subT.toFixed(2)}\n`;
            });

            orderText += `\nTotal Amount: ₹${total.toFixed(2)}\n\nPlease let me know the payment and delivery details. Thank you!`;

            if (platform === 'whatsapp') {
                const waText = encodeURIComponent(orderText);
                window.open(`https://wa.me/919746820802?text=${waText}`, '_blank');
            } else if (platform === 'email') {
                const emText = encodeURIComponent(orderText);
                const emSubject = encodeURIComponent('New Order - VAIRA Candles');
                const mailtoLink = `mailto:vaira.lumes@gmail.com?subject=${emSubject}&body=${emText}`;
                window.location.href = mailtoLink;
            } else if (platform === 'instagram') {
                // Copy to clipboard to paste in Insta DM
                navigator.clipboard.writeText(orderText).then(() => {
                    alert('Order text copied to clipboard! Redirecting to Instagram to DM us...');
                    window.open('https://www.instagram.com/vairaluxurycandles?igsh=NDc4d3NkaWZ2cm0x', '_blank');
                }).catch(err => {
                    alert('Could not copy to clipboard. Please copy manually:\n\n' + orderText);
                });
            }
        });
    });
});

