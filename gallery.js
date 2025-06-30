// Enhanced Gallery functionality with better organization and user submissions
let galleryItems = [
  {
    id: "1",
    title: "Family Bowl Creation",
    artist: "Sarah & Emma Johnson",
    description:
      "Our first pottery experience together was absolutely magical! We decided to make matching bowls for our Sunday morning breakfast routine. The staff was so patient teaching us the glazing techniques, and we loved every minute of it. Can't wait to come back next month!",
    imageUrl:
      "https://images.pexels.com/photos/4241347/pexels-photo-4241347.jpeg",
    category: "family",
    likes: 42,
    comments: 12,
    rating: 5,
    featured: true,
    date: "2024-12-15",
    isFeaturedArtist: true,
  },
  {
    id: "2",
    title: "Traditional Japanese Ceramic Pot",
    artist: "Michael Chen",
    description:
      "Learned traditional glazing techniques in the advanced workshop. The instructor taught us about Raku firing and how to achieve those beautiful metallic finishes. This piece took me 3 hours to complete but I'm so proud of the result!",
    imageUrl:
      "https://images.pexels.com/photos/8066085/pexels-photo-8066085.jpeg",
    category: "workshop",
    likes: 67,
    comments: 23,
    rating: 5,
    date: "2024-12-10",
  },
  {
    id: "3",
    title: "Sunset Vase Collection",
    artist: "Lisa Rodriguez",
    description:
      "Set of three vases inspired by California sunsets! The terracotta base with gold highlights was exactly what I envisioned for my dining room. The staff helped me choose the perfect glaze combination. These will be perfect for my holiday centerpieces.",
    imageUrl:
      "https://images.pexels.com/photos/18635393/pexels-photo-18635393.jpeg",
    category: "pottery",
    likes: 89,
    comments: 31,
    rating: 5,
    date: "2024-12-08",
    isMostLoved: true,
  },
  {
    id: "4",
    title: "Team Building Masterpieces",
    artist: "Tech Solutions Group",
    description:
      "What an amazing team building experience! Our entire company came here for our quarterly event and everyone created something unique. It was so much fun seeing everyone's personality come through in their pottery. Great bonding experience!",
    imageUrl:
      "https://images.pexels.com/photos/7675081/pexels-photo-7675081.jpeg",
    category: "party",
    likes: 56,
    comments: 18,
    rating: 5,
    date: "2024-12-07",
  },
  {
    id: "5",
    title: "Mother-Daughter Coffee Mugs",
    artist: "Jennifer & Sophie Martinez",
    description:
      "Special mother-daughter date creating our matching coffee mugs! Sophie (age 8) was so focused and proud of her painting. We added our initials and favorite colors. Now our morning coffee routine is even more special with these beautiful mugs.",
    imageUrl:
      "https://images.pexels.com/photos/4241344/pexels-photo-4241344.jpeg",
    category: "family",
    likes: 78,
    comments: 25,
    rating: 5,
    date: "2024-12-12",
    isFeaturedArtist: true,
  },
  {
    id: "6",
    title: "Birthday Party Fun!",
    artist: "Birthday Squad - Emma's 10th",
    description:
      "Best birthday party ever! Emma invited 8 friends and they all created amazing pieces. The party room was perfect and the staff made sure everyone felt like a real artist. All the kids left with beautiful painted pottery and huge smiles!",
    imageUrl:
      "https://images.pexels.com/photos/16374149/pexels-photo-16374149.jpeg",
    category: "party",
    likes: 92,
    comments: 34,
    rating: 5,
    date: "2024-12-05",
  },
  {
    id: "7",
    title: "My First Pottery Adventure",
    artist: "Alex Thompson",
    description:
      "Never thought I'd be good at art, but this place proved me wrong! Made this bowl during my lunch break and it turned out better than I expected. The staff was encouraging and helped me fix my mistakes. Definitely coming back soon!",
    imageUrl:
      "https://images.pexels.com/photos/4241347/pexels-photo-4241347.jpeg",
    category: "pottery",
    likes: 34,
    comments: 8,
    rating: 4,
    date: "2024-12-14",
  },
  {
    id: "8",
    title: "Kids Art Class Creations",
    artist: "Little Artists Workshop",
    description:
      "Our weekly kids class had so much fun making these colorful pieces! Ages 5-10 learning basic pottery techniques. Each child's personality really shines through in their artwork. Parents love seeing their creativity bloom!",
    imageUrl:
      "https://images.pexels.com/photos/4241344/pexels-photo-4241344.jpeg",
    category: "kids",
    likes: 45,
    comments: 15,
    rating: 5,
    date: "2024-12-13",
  },
];

let currentFilter = "all";
let currentSort = "recent";
let likedItems = new Set();
let currentSpotlightMonth = 12;
let currentSpotlightYear = 2024;

// Initialize gallery when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeGallery();
  setupFileUpload();
  setupRatingInput();
  loadLikedItems();
  updateCommunityStats();
});

function initializeGallery() {
  renderGallery();
  setupGalleryInteractions();
  updateSpotlightHeader();
}

function renderGallery(filter = "all", sort = "recent") {
  const container = document.getElementById("gallery-grid");

  if (!container) return;

  // Filter items
  let filteredItems = [...galleryItems];

  if (filter === "featured-artist") {
    filteredItems = galleryItems.filter((item) => item.isFeaturedArtist);
  } else if (filter !== "all") {
    filteredItems = galleryItems.filter((item) => item.category === filter);
  }

  // Sort items
  filteredItems.sort((a, b) => {
    switch (sort) {
      case "popular":
        return b.likes - a.likes;
      case "artist":
        return a.artist.localeCompare(b.artist);
      case "title":
        return a.title.localeCompare(b.title);
      case "recent":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  // Clear container
  container.innerHTML = "";

  if (filteredItems.length === 0) {
    container.innerHTML = `
            <div class="gallery-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <p>No items found for this category.</p>
                <button class="btn btn-outline" onclick="filterGallery('all')">View All Creations</button>
            </div>
        `;
    return;
  }

  // Render items
  filteredItems.forEach((item, index) => {
    const itemElement = createGalleryItemElement(item, index);
    container.appendChild(itemElement);
  });
}

function createGalleryItemElement(item, index) {
  const isLiked = likedItems.has(item.id);

  const div = document.createElement("div");
  div.className = "gallery-item";
  div.dataset.itemId = item.id;

  // Generate artist initials for avatar
  const initials = item.artist
    .split(" ")
    .map((name) => name[0])
    .join("")
    .substring(0, 2);

  div.innerHTML = `
        <div class="gallery-image-container">
            <img src="${item.imageUrl}" alt="${item.title}" class="gallery-image" loading="lazy">
            <div class="gallery-overlay">
                <div>
                    <h3>${item.title}</h3>
                    <p>by ${item.artist}</p>
                </div>
            </div>
        </div>
        <div class="gallery-content">
            ${getCategoryBadge(item.category)}
            <h3 class="gallery-title">${item.title}</h3>
            <div class="gallery-artist">
                <span class="artist-avatar">${initials}</span>
                by ${item.artist}
            </div>
            <div class="gallery-rating">
                <span class="stars">${getStars(item.rating)}</span>
                <span class="rating-text">${item.rating}/5</span>
            </div>
            <p class="gallery-description">${item.description}</p>
            <div class="gallery-stats">
                <div class="gallery-stat ${isLiked ? "liked" : ""}" onclick="toggleLike('${item.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span class="like-count">${item.likes}</span>
                </div>
                <div class="gallery-stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>${item.comments}</span>
                </div>
                <div class="gallery-stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>${formatDate(item.date)}</span>
                </div>
            </div>
        </div>
    `;

  // Add click event for image modal
  const imageContainer = div.querySelector(".gallery-image-container");
  imageContainer.addEventListener("click", () => {
    showImageModal(item);
  });

  return div;
}

function getCategoryBadge(category) {
  const categoryNames = {
    pottery: "Pottery Painting",
    kids: "Kids Creation",
    workshop: "Workshop Project",
    party: "Party Creation",
    family: "Family Project",
  };

  const categoryName = categoryNames[category] || category;
  return `<span class="gallery-category">${categoryName}</span>`;
}

function getStars(rating) {
  const fullStars = "★".repeat(rating);
  const emptyStars = "☆".repeat(5 - rating);
  return fullStars + emptyStars;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function setupGalleryInteractions() {
  // Setup image modal close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeImageModal();
    }
  });
}

function showImageModal(item) {
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.id = "image-modal";

  modal.innerHTML = `
        <div class="image-modal-content">
            <button class="image-modal-close" onclick="closeImageModal()">&times;</button>
            <img src="${item.imageUrl}" alt="${item.title}">
            <div class="image-modal-info">
                <h3>${item.title}</h3>
                <p class="artist">by ${item.artist}</p>
                <div class="rating">
                    <span class="stars">${getStars(item.rating)}</span>
                    <span>${item.rating}/5 stars</span>
                </div>
                <p class="description">${item.description}</p>
            </div>
        </div>
    `;

  // Close modal when clicking overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeImageModal();
    }
  });

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  const modal = document.getElementById("image-modal");
  if (modal) {
    modal.remove();
    document.body.style.overflow = "auto";
  }
}

function toggleLike(itemId) {
  const item = galleryItems.find((item) => item.id === itemId);
  if (!item) return;

  const isLiked = likedItems.has(itemId);

  if (isLiked) {
    likedItems.delete(itemId);
    item.likes--;
  } else {
    likedItems.add(itemId);
    item.likes++;
  }

  // Update UI
  const statElement = document.querySelector(
    `[data-item-id="${itemId}"] .gallery-stat`,
  );
  if (statElement) {
    const svg = statElement.querySelector("svg");
    const count = statElement.querySelector(".like-count");

    if (isLiked) {
      statElement.classList.remove("liked");
      svg.setAttribute("fill", "none");
    } else {
      statElement.classList.add("liked");
      svg.setAttribute("fill", "currentColor");
    }

    count.textContent = item.likes;
  }

  // Save to localStorage
  saveLikedItems();
  updateCommunityStats();

  // Show notification
  const message = isLiked ? "Removed from favorites" : "Added to favorites";
  window.GlazeryUtils.showNotification(message, "info", 2000);
}

function filterGallery(category) {
  currentFilter = category;
  renderGallery(category, currentSort);

  // Update filter buttons if they exist
  document.querySelectorAll(".filter-button").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.filter === category) {
      btn.classList.add("active");
    }
  });
}

function sortGallery(sortType) {
  currentSort = sortType;
  renderGallery(currentFilter, sortType);
}

function handleSearch(query) {
  if (!query.trim()) {
    renderGallery(currentFilter, currentSort);
    return;
  }

  const filteredItems = galleryItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.artist.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()),
  );

  renderSearchResults(filteredItems, query);
}

function renderSearchResults(items, query) {
  const container = document.getElementById("gallery-grid");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = `
            <div class="gallery-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No results found for "${query}"</p>
                <button class="btn btn-outline" onclick="clearSearch()">Clear Search</button>
            </div>
        `;
    return;
  }

  items.forEach((item, index) => {
    const itemElement = createGalleryItemElement(item, index);
    container.appendChild(itemElement);
  });
}

function clearSearch() {
  document.querySelector(".search-input").value = "";
  renderGallery(currentFilter, currentSort);
}

function changeSpotlightMonth(direction) {
  currentSpotlightMonth += direction;

  if (currentSpotlightMonth > 12) {
    currentSpotlightMonth = 1;
    currentSpotlightYear++;
  } else if (currentSpotlightMonth < 1) {
    currentSpotlightMonth = 12;
    currentSpotlightYear--;
  }

  updateSpotlightHeader();
  // Here you would typically load different featured artists for different months
}

function updateSpotlightHeader() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const header = document.querySelector(".spotlight-header h2");
  if (header) {
    header.textContent = `${monthNames[currentSpotlightMonth - 1]} ${currentSpotlightYear} - Featured Artists`;
  }
}

function showMostLoved() {
  const mostLovedItem = galleryItems.find((item) => item.isMostLoved);
  if (mostLovedItem) {
    showImageModal(mostLovedItem);
  }
}

function updateCommunityStats() {
  const totalPieces = galleryItems.length;
  const uniqueArtists = new Set(galleryItems.map((item) => item.artist)).size;
  const totalLikes = galleryItems.reduce((sum, item) => sum + item.likes, 0);
  const totalComments = galleryItems.reduce(
    (sum, item) => sum + item.comments,
    0,
  );

  // Update DOM elements if they exist
  const elements = {
    "total-pieces": totalPieces,
    "total-artists": uniqueArtists,
    "total-likes": totalLikes,
    "total-reviews": totalComments,
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value.toLocaleString();
    }
  });
}

function loadLikedItems() {
  const saved = window.GlazeryUtils.getFromLocalStorage("likedItems");
  if (saved && Array.isArray(saved)) {
    likedItems = new Set(saved);
  }
}

function saveLikedItems() {
  window.GlazeryUtils.saveToLocalStorage("likedItems", Array.from(likedItems));
}

// Upload functionality
function showUploadModal() {
  const modal = document.getElementById("upload-modal");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function hideUploadModal() {
  const modal = document.getElementById("upload-modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";

  // Reset form
  document.getElementById("upload-form").reset();
  updateFileUploadDisplay();
  resetRating();
}

function setupFileUpload() {
  const fileInput = document.getElementById("upload-image");
  const fileDisplay = document.querySelector(".file-upload-display");

  if (!fileInput || !fileDisplay) return;

  fileInput.addEventListener("change", handleFileSelect);

  // Drag and drop functionality
  fileDisplay.addEventListener("dragover", handleDragOver);
  fileDisplay.addEventListener("drop", handleDrop);
  fileDisplay.addEventListener("dragleave", handleDragLeave);
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      window.GlazeryUtils.showNotification(
        "File size must be less than 5MB",
        "error",
      );
      return;
    }
    updateFileUploadDisplay(file);
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("dragover");
}

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("dragover");

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        window.GlazeryUtils.showNotification(
          "File size must be less than 5MB",
          "error",
        );
        return;
      }
      document.getElementById("upload-image").files = files;
      updateFileUploadDisplay(file);
    } else {
      window.GlazeryUtils.showNotification(
        "Please select an image file",
        "error",
      );
    }
  }
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove("dragover");
}

function updateFileUploadDisplay(file) {
  const display = document.querySelector(".file-upload-display");

  if (file) {
    display.classList.add("has-file");
    display.querySelector("span").textContent = file.name;
    display.querySelector("small").textContent =
      `${(file.size / 1024 / 1024).toFixed(1)}MB`;
  } else {
    display.classList.remove("has-file");
    display.querySelector("span").textContent =
      "Choose a photo or drag and drop";
    display.querySelector("small").textContent = "JPG, PNG, or WEBP (max 5MB)";
  }
}

function setupRatingInput() {
  const stars = document.querySelectorAll(".rating-input .star");
  const ratingInput = document.getElementById("upload-rating");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      const rating = index + 1;
      ratingInput.value = rating;
      updateStarDisplay(rating);
    });

    star.addEventListener("mouseenter", () => {
      updateStarDisplay(index + 1);
    });
  });

  // Reset on mouse leave
  document.querySelector(".rating-input").addEventListener("mouseleave", () => {
    updateStarDisplay(ratingInput.value);
  });
}

function updateStarDisplay(rating) {
  const stars = document.querySelectorAll(".rating-input .star");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.textContent = "★";
      star.classList.add("active");
    } else {
      star.textContent = "☆";
      star.classList.remove("active");
    }
  });
}

function resetRating() {
  document.getElementById("upload-rating").value = "5";
  updateStarDisplay(5);
}

function submitUpload() {
  const form = document.getElementById("upload-form");
  const formData = new FormData(form);

  // Validate required fields
  const title = document.getElementById("upload-title").value.trim();
  const artist = document.getElementById("upload-artist").value.trim();
  const image = document.getElementById("upload-image").files[0];
  const consent = document.getElementById("upload-consent").checked;

  if (!title || !artist || !image) {
    window.GlazeryUtils.showNotification(
      "Please fill in all required fields",
      "error",
    );
    return;
  }

  if (!consent) {
    window.GlazeryUtils.showNotification(
      "Please agree to the consent terms",
      "error",
    );
    return;
  }

  // Simulate upload process
  const submitButton = document.querySelector("#upload-modal .btn-primary");
  const originalText = submitButton.textContent;

  submitButton.textContent = "Uploading...";
  submitButton.disabled = true;

  setTimeout(() => {
    // Create new gallery item
    const newItem = {
      id: Date.now().toString(),
      title: title,
      artist: artist,
      description:
        document.getElementById("upload-description").value.trim() ||
        "A beautiful pottery creation shared by our community!",
      imageUrl: URL.createObjectURL(image),
      category: document.getElementById("upload-category").value || "pottery",
      likes: 0,
      comments: 0,
      rating: parseInt(document.getElementById("upload-rating").value) || 5,
      date: new Date().toISOString().split("T")[0],
    };

    // Add to gallery
    galleryItems.unshift(newItem);
    renderGallery(currentFilter, currentSort);
    updateCommunityStats();

    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;

    // Close modal
    hideUploadModal();

    // Show success notification
    window.GlazeryUtils.showNotification(
      "Your creation has been shared with the community!",
      "success",
    );

    // Scroll to top to see new item
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 2000);
}

// Export functions for global use
window.GalleryApp = {
  showUploadModal,
  hideUploadModal,
  submitUpload,
  filterGallery,
  sortGallery,
  handleSearch,
  clearSearch,
  toggleLike,
  showImageModal,
  closeImageModal,
  changeSpotlightMonth,
  showMostLoved,
};

// Make functions available globally for onclick handlers
window.showUploadModal = showUploadModal;
window.hideUploadModal = hideUploadModal;
window.submitUpload = submitUpload;
window.filterGallery = filterGallery;
window.sortGallery = sortGallery;
window.handleSearch = handleSearch;
window.clearSearch = clearSearch;
window.toggleLike = toggleLike;
window.showImageModal = showImageModal;
window.closeImageModal = closeImageModal;
window.changeSpotlightMonth = changeSpotlightMonth;
window.showMostLoved = showMostLoved;
