// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (savedTheme) {
    document.body.className = savedTheme;
  } else if (systemPrefersDark) {
    document.body.className = "dark-theme";
  } else {
    document.body.className = "light-theme";
  }

  updateThemeIcons();
}

function toggleTheme() {
  const currentTheme = document.body.className;
  const newTheme =
    currentTheme === "light-theme" ? "dark-theme" : "light-theme";

  document.body.className = newTheme;
  localStorage.setItem("theme", newTheme);
  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = document.body.className === "dark-theme";
  const moonIcons = document.querySelectorAll(".moon-icon");
  const sunIcons = document.querySelectorAll(".sun-icon");

  moonIcons.forEach((icon) => {
    icon.style.display = isDark ? "none" : "block";
  });

  sunIcons.forEach((icon) => {
    icon.style.display = isDark ? "block" : "none";
  });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Intersection Observer for animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe service cards and testimonials
  document
    .querySelectorAll(".service-card, .testimonial-card")
    .forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(card);
    });
}

// Image lazy loading
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Header scroll effect
function initializeHeaderScroll() {
  const header = document.querySelector(".header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.style.backgroundColor =
        document.body.className === "dark-theme"
          ? "rgba(25, 20, 15, 0.9)"
          : "rgba(255, 251, 245, 0.9)";
      header.style.backdropFilter = "blur(12px)";
    } else {
      header.style.backgroundColor =
        document.body.className === "dark-theme"
          ? "rgba(25, 20, 15, 0.6)"
          : "rgba(255, 251, 245, 0.6)";
      header.style.backdropFilter = "blur(8px)";
    }

    lastScrollTop = scrollTop;
  });
}

// Mobile menu functionality (if needed)
function initializeMobileMenu() {
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      mobileMenuButton.classList.toggle("active");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !mobileMenu.contains(e.target) &&
        !mobileMenuButton.contains(e.target)
      ) {
        mobileMenu.classList.remove("active");
        mobileMenuButton.classList.remove("active");
      }
    });
  }
}

// Form validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/\s/g, ""));
}

// Local storage helpers
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}

// Gallery image modal functionality
function initializeImageModal() {
  const galleryImages = document.querySelectorAll(
    ".gallery-item img, .feature-image-large img",
  );

  galleryImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      e.preventDefault();
      showImageModal(img.src, img.alt);
    });
  });
}

function showImageModal(src, alt) {
  // Create modal overlay
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.innerHTML = `
        <div class="modal-overlay" onclick="closeImageModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeImageModal()">&times;</button>
                <img src="${src}" alt="${alt}" class="modal-image">
                <p class="modal-caption">${alt}</p>
            </div>
        </div>
    `;

  // Add modal styles
  const style = document.createElement("style");
  style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
        }
        
        .modal-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            background-color: var(--bg-card);
            border-radius: var(--border-radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-lg);
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-image {
            width: 100%;
            height: auto;
            max-height: 80vh;
            object-fit: contain;
        }
        
        .modal-caption {
            padding: 1rem;
            color: var(--text-primary);
            text-align: center;
            margin: 0;
        }
    `;

  document.head.appendChild(style);
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  // Add escape key listener
  document.addEventListener("keydown", handleModalKeydown);
}

function closeImageModal() {
  const modal = document.querySelector(".image-modal");
  if (modal) {
    modal.remove();
    document.body.style.overflow = "auto";
    document.removeEventListener("keydown", handleModalKeydown);
  }
}

function handleModalKeydown(e) {
  if (e.key === "Escape") {
    closeImageModal();
  }
}

// Notification system
function showNotification(message, type = "info", duration = 3000) {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add notification styles if not already present
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                color: white;
                font-weight: 500;
                z-index: 1000;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 300px;
                word-wrap: break-word;
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification-info {
                background-color: var(--accent-primary);
            }
            
            .notification-success {
                background-color: #10b981;
            }
            
            .notification-error {
                background-color: #ef4444;
            }
            
            .notification-warning {
                background-color: #f59e0b;
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Remove notification
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();
  initializeSmoothScrolling();
  initializeAnimations();
  initializeLazyLoading();
  initializeHeaderScroll();
  initializeMobileMenu();
  initializeImageModal();

  // Add loading states to buttons
  document.querySelectorAll("button, .btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      if (this.dataset.loading !== "true") {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);
      }
    });
  });

  console.log("The Glazery website initialized successfully!");
});

// Export functions for use in other files
window.GlazeryUtils = {
  toggleTheme,
  validateEmail,
  validatePhone,
  saveToLocalStorage,
  getFromLocalStorage,
  showNotification,
  showImageModal,
  closeImageModal,
};
