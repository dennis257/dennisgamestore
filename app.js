const GAMES = [
  {
    id: 1,  title: "Shadow Realm",      genre: "action",   price: 29.99, sale: null,
    icon: "⚔️",  rating: 4.7, reviews: "8.2k",
    platforms: ["PC","PS5"],  badge: "top",
    desc: "Hack-and-slash through a brutal dark fantasy world. 60+ hours of content."
  },
  {
    id: 2,  title: "Starfall Odyssey",  genre: "rpg",      price: 49.99, sale: 34.99,
    icon: "🚀",  rating: 4.9, reviews: "21k",
    platforms: ["PC","Xbox","PS5"], badge: "sale",
    desc: "An epic space RPG with a branching narrative and hundreds of hours of story."
  },
  {
    id: 3,  title: "Iron Fortress",     genre: "strategy", price: 24.99, sale: null,
    icon: "🏰",  rating: 4.5, reviews: "5.1k",
    platforms: ["PC"],        badge: null,
    desc: "Build, defend, and conquer in this sweeping grand strategy experience."
  },
  {
    id: 4,  title: "Velocity Rush",     genre: "sports",   price: 19.99, sale: null,
    icon: "🏎️",  rating: 4.6, reviews: "14k",
    platforms: ["PC","PS5","Xbox"], badge: "new",
    desc: "Blazing-fast arcade racing across 40 hand-crafted tracks worldwide."
  },
  {
    id: 5,  title: "Pixel Dungeon Pro", genre: "indie",    price: 9.99,  sale: null,
    icon: "👾",  rating: 4.8, reviews: "33k",
    platforms: ["PC"],        badge: "top",
    desc: "Roguelike madness with procedurally generated levels and brutal difficulty."
  },
  {
    id: 6,  title: "Dragon's Wrath",    genre: "action",   price: 39.99, sale: 27.99,
    icon: "🐉",  rating: 4.6, reviews: "9.8k",
    platforms: ["PC","PS5"], badge: "sale",
    desc: "Slay legendary dragons and claim ancient relics in this action RPG epic."
  },
  {
    id: 7,  title: "Chrono Empire",     genre: "strategy", price: 34.99, sale: null,
    icon: "⏳",  rating: 4.4, reviews: "4.3k",
    platforms: ["PC"],        badge: null,
    desc: "Command armies across centuries of history in this strategic masterpiece."
  },
  {
    id: 8,  title: "Neon Streets",      genre: "action",   price: 44.99, sale: null,
    icon: "🌆",  rating: 4.8, reviews: "18k",
    platforms: ["PC","PS5","Xbox"], badge: "new",
    desc: "Open-world cyberpunk action in a rain-soaked, neon-lit sprawling metropolis."
  },
  {
    id: 9,  title: "Legends United",    genre: "sports",   price: 59.99, sale: 49.99,
    icon: "⚽",  rating: 4.5, reviews: "29k",
    platforms: ["PC","PS5","Xbox"], badge: "sale",
    desc: "The ultimate football sim with global leagues, live rosters, and deep career mode."
  },
  {
    id: 10, title: "Mystic Quest",      genre: "rpg",      price: 39.99, sale: null,
    icon: "🧙",  rating: 4.7, reviews: "11k",
    platforms: ["PC","Switch"], badge: null,
    desc: "Classic JRPG with a heartfelt story, turn-based combat, and stunning pixel art."
  },
  {
    id: 11, title: "Tiny World Builder", genre: "indie",   price: 14.99, sale: null,
    icon: "🌍",  rating: 4.9, reviews: "7.6k",
    platforms: ["PC","Mac"], badge: "top",
    desc: "Design, sculpt, and share perfect miniature worlds in this serene sandbox."
  },
  {
    id: 12, title: "Galactic Command",  genre: "strategy", price: 44.99, sale: 29.99,
    icon: "🛸",  rating: 4.6, reviews: "6.2k",
    platforms: ["PC"],        badge: "sale",
    desc: "Real-time space strategy at breathtaking scale — build fleets, conquer galaxies."
  },
  {
    id: 99, title: "Cyber Chronicles: Ultimate", genre: "rpg", price: 29.99, sale: null,
    icon: "🔥",  rating: 4.9, reviews: "12.8k",
    platforms: ["PC","PS5","Xbox"], badge: null,
    desc: "The definitive RPG experience in a neon-lit dystopia — all DLC included."
  },
];

const TRENDING_IDS = [8, 2, 5, 1, 10, 4];

let cart = [];
let activeGenre = "all";
let searchQuery = "";

/* ── RENDER TRENDING ── */
function renderTrending() {
  const row = document.getElementById("trendingRow");
  const list = TRENDING_IDS.map(id => GAMES.find(g => g.id === id)).filter(Boolean);
  row.innerHTML = list.map((g, i) => {
    const displayPrice = g.sale ?? g.price;
    const saleHtml = g.sale
      ? `<span class="price-strike">$${g.price.toFixed(2)}</span>`
      : "";
    return `
      <div class="trending-card" onclick="addToCartById(${g.id})">
        <span class="trending-rank">${String(i + 1).padStart(2,"0")}</span>
        <div class="trending-thumb">${g.icon}</div>
        <div class="trending-info">
          <div class="trending-title">${g.title}</div>
          <div class="trending-genre">${g.genre}</div>
        </div>
        <div class="trending-price">
          <span class="price-main">$${displayPrice.toFixed(2)}</span>
          ${saleHtml}
        </div>
      </div>`;
  }).join("");
}

/* ── RENDER GAME GRID ── */
function renderGames() {
  const grid = document.getElementById("gameGrid");
  const filtered = GAMES.filter(g => {
    if (g.id === 99) return false;
    const matchGenre = activeGenre === "all" || g.genre === activeGenre;
    const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        g.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGenre && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results">No games found for "${searchQuery}"</div>`;
    return;
  }

  grid.innerHTML = filtered.map(g => {
    const displayPrice = g.sale ?? g.price;
    const badgeHtml = g.badge
      ? `<span class="card-badge badge-${g.badge}">${g.badge === "sale" ? "Sale" : g.badge === "new" ? "New" : "Top"}</span>`
      : "";
    const discountHtml = g.sale
      ? `<span class="card-badge badge-sale">−${Math.round((1 - g.sale / g.price) * 100)}%</span>`
      : "";
    const platformsHtml = g.platforms.slice(0, 2).map(p => `<span class="card-platform">${p}</span>`).join("");
    const priceHtml = g.sale
      ? `<div class="card-price">
           <span class="strike">$${g.price.toFixed(2)}</span>
           <span class="current discounted">$${g.sale.toFixed(2)}</span>
         </div>`
      : `<div class="card-price">
           <span class="current">$${g.price.toFixed(2)}</span>
         </div>`;
    return `
      <div class="game-card">
        <div class="card-cover">
          <div class="card-cover-bg">${g.icon}</div>
          <div class="card-cover-overlay"></div>
          <div class="card-badges">${badgeHtml}${discountHtml}</div>
          <div class="card-rating">★ ${g.rating}</div>
          <div class="card-platforms">${platformsHtml}</div>
        </div>
        <div class="card-body">
          <span class="card-genre">${g.genre}</span>
          <div class="card-title">${g.title}</div>
          <div class="card-desc">${g.desc}</div>
          <div class="card-footer">
            ${priceHtml}
            <button class="card-add" onclick="addToCartById(${g.id})" title="Add to cart">+</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

/* ── CART ── */
function addToCartById(id) {
  const game = GAMES.find(g => g.id === id);
  if (!game) return;
  if (cart.find(c => c.id === id)) {
    showToast(`Already in cart`);
    return;
  }
  cart.push({ ...game, cartPrice: game.sale ?? game.price });
  updateCartUI();
  showToast(`${game.title} added`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.length;
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerSub").textContent = `${count} item${count !== 1 ? "s" : ""}`;

  const body = document.getElementById("cartItems");
  if (count === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <span class="empty-icon">🛒</span>
        <p>Your cart is empty</p>
      </div>`;
  } else {
    body.innerHTML = cart.map(g => `
      <div class="cart-item">
        <div class="cart-item-thumb">${g.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${g.title}</div>
          <div class="cart-item-genre">${g.genre}</div>
          <div class="cart-item-price">$${g.cartPrice.toFixed(2)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${g.id})" title="Remove">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/></svg>
        </button>
      </div>`).join("");
  }

  const subtotal = cart.reduce((s, g) => s + g.cartPrice, 0);
  document.getElementById("cartSubtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("cartTotal").textContent = `$${subtotal.toFixed(2)}`;
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ── TOAST ── */
function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ── COUNTDOWN TIMER ── */
function startTimer() {
  let remaining = 11 * 3600 + 59 * 60 + 42;
  const el = document.getElementById("timerDisplay");
  setInterval(() => {
    if (remaining <= 0) { remaining = 86400; return; }
    remaining--;
    const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
    const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
    const s = String(remaining % 60).padStart(2, "0");
    el.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

/* ── NAVBAR SCROLL ── */
window.addEventListener("scroll", () => {
  document.getElementById("navbar").style.background =
    window.scrollY > 20 ? "rgba(8,11,18,0.95)" : "rgba(8,11,18,0.72)";
});

/* ── EVENTS ── */
document.querySelectorAll(".pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeGenre = btn.dataset.genre;
    renderGames();
  });
});

document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.trim();
  renderGames();
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) { showToast("Your cart is empty"); return; }
  closeCart();
  cart = [];
  updateCartUI();
  showToast("Order placed — check your email!");
});

/* ── INIT ── */
renderTrending();
renderGames();
updateCartUI();
startTimer();
