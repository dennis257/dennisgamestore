/* ─────────────────────────────────────────────────────────────
   GAME DATA  (no emoji icons — art rendered via CSS cover classes)
───────────────────────────────────────────────────────────── */
const GAMES = [
  {
    id: 1,  title: "Shadow Realm",         genre: "action",   price: 29.99, sale: null,
    rating: 4.7, reviews: "8.2k", platforms: ["PC","PS5"],
    badge: "top",
    desc: "Hack-and-slash through a brutal dark fantasy world with 60+ hours of content."
  },
  {
    id: 2,  title: "Starfall Odyssey",     genre: "rpg",      price: 49.99, sale: 34.99,
    rating: 4.9, reviews: "21k", platforms: ["PC","Xbox","PS5"],
    badge: "sale",
    desc: "Epic space RPG with a branching narrative and hundreds of hours of story."
  },
  {
    id: 3,  title: "Iron Fortress",        genre: "strategy", price: 24.99, sale: null,
    rating: 4.5, reviews: "5.1k", platforms: ["PC"],
    badge: null,
    desc: "Build, defend, and conquer in this sweeping grand strategy experience."
  },
  {
    id: 4,  title: "Velocity Rush",        genre: "sports",   price: 19.99, sale: null,
    rating: 4.6, reviews: "14k",  platforms: ["PC","PS5","Xbox"],
    badge: "new",
    desc: "Blazing-fast arcade racing across 40 hand-crafted tracks worldwide."
  },
  {
    id: 5,  title: "Pixel Dungeon Pro",    genre: "indie",    price: 9.99,  sale: null,
    rating: 4.8, reviews: "33k",  platforms: ["PC"],
    badge: "top",
    desc: "Roguelike madness with procedurally generated levels and brutal difficulty."
  },
  {
    id: 6,  title: "Dragon's Wrath",       genre: "action",   price: 39.99, sale: 27.99,
    rating: 4.6, reviews: "9.8k", platforms: ["PC","PS5"],
    badge: "sale",
    desc: "Slay legendary dragons and claim ancient relics in this action RPG epic."
  },
  {
    id: 7,  title: "Chrono Empire",        genre: "strategy", price: 34.99, sale: null,
    rating: 4.4, reviews: "4.3k", platforms: ["PC"],
    badge: null,
    desc: "Command armies across centuries of history in this strategic masterpiece."
  },
  {
    id: 8,  title: "Neon Streets",         genre: "action",   price: 44.99, sale: null,
    rating: 4.8, reviews: "18k",  platforms: ["PC","PS5","Xbox"],
    badge: "new",
    desc: "Open-world action in a rain-soaked urban sprawl. 100+ missions."
  },
  {
    id: 9,  title: "Legends United",       genre: "sports",   price: 59.99, sale: 49.99,
    rating: 4.5, reviews: "29k",  platforms: ["PC","PS5","Xbox"],
    badge: "sale",
    desc: "The definitive football simulation — global leagues, live rosters, deep career mode."
  },
  {
    id: 10, title: "Mystic Quest",         genre: "rpg",      price: 39.99, sale: null,
    rating: 4.7, reviews: "11k",  platforms: ["PC","Switch"],
    badge: null,
    desc: "Classic JRPG with a heartfelt story, turn-based combat, and gorgeous art."
  },
  {
    id: 11, title: "Tiny World Builder",   genre: "indie",    price: 14.99, sale: null,
    rating: 4.9, reviews: "7.6k", platforms: ["PC","Mac"],
    badge: "top",
    desc: "Design, sculpt, and share miniature worlds in this serene sandbox creator."
  },
  {
    id: 12, title: "Galactic Command",     genre: "strategy", price: 44.99, sale: 29.99,
    rating: 4.6, reviews: "6.2k", platforms: ["PC"],
    badge: "sale",
    desc: "Real-time space strategy at breathtaking scale — build fleets, conquer galaxies."
  },
  {
    id: 99, title: "Cyber Chronicles: Ultimate Edition", genre: "rpg", price: 79.99, sale: 29.99,
    rating: 4.9, reviews: "12.8k", platforms: ["PC","PS5","Xbox"],
    badge: "sale",
    desc: "Definitive open-world RPG — all DLC and expansions included."
  },
];

const NEW_RELEASE_IDS  = [8, 4, 2, 11, 1, 10];
const DEAL_IDS         = [2, 6, 9, 12];

let cart = [];
let activeGenre = "all";
let searchQuery = "";

/* ─────────────────────────────────────────────────────────────
   COVER ART HELPER — renders the CSS cover block
───────────────────────────────────────────────────────────── */
function coverArt(id, extraClass = "") {
  return `<div class="cover-${id} ${extraClass}" style="width:100%;height:100%">
    <div class="cover-label"><div class="cover-label-title"></div></div>
  </div>`;
}

/* ─────────────────────────────────────────────────────────────
   NEW RELEASES SHELF
───────────────────────────────────────────────────────────── */
function renderNewReleases() {
  const shelf = document.getElementById("newReleasesShelf");
  const games = NEW_RELEASE_IDS.map(id => GAMES.find(g => g.id === id)).filter(Boolean);

  shelf.innerHTML = games.map(g => {
    const price = g.sale ?? g.price;
    const discountPct = g.sale ? Math.round((1 - g.sale / g.price) * 100) : 0;
    const origHtml = g.sale ? `<span class="orig">$${g.price.toFixed(2)}</span>` : "";
    const discBadge = g.sale ? `<div class="p-card-discount">−${discountPct}%</div>` : "";
    return `
      <div class="p-card" onclick="addToCartById(${g.id})">
        <div class="p-card-art">
          <div class="cover-${g.id}" style="width:100%;height:100%"></div>
          ${discBadge}
        </div>
        <div class="p-card-info">
          <div class="p-card-title">${g.title}</div>
          <div class="p-card-genre">${g.genre}</div>
          <div class="p-card-price">
            ${origHtml}
            <span class="curr${g.sale ? " sale" : ""}">$${price.toFixed(2)}</span>
          </div>
        </div>
      </div>`;
  }).join("");
}

/* ─────────────────────────────────────────────────────────────
   DEALS GRID
───────────────────────────────────────────────────────────── */
function renderDeals() {
  const grid = document.getElementById("dealsGrid");
  const games = DEAL_IDS.map(id => GAMES.find(g => g.id === id)).filter(Boolean);

  grid.innerHTML = games.map(g => {
    const pct = Math.round((1 - g.sale / g.price) * 100);
    return `
      <div class="deal-row" onclick="addToCartById(${g.id})">
        <div class="deal-art"><div class="cover-${g.id}" style="width:100%;height:100%"></div></div>
        <div class="deal-info">
          <div class="deal-title">${g.title}</div>
          <div class="deal-genre">${g.genre}</div>
        </div>
        <div class="deal-right">
          <div class="deal-pct">−${pct}%</div>
          <div class="deal-prices">
            <span class="deal-orig">$${g.price.toFixed(2)}</span>
            <span class="deal-curr">$${g.sale.toFixed(2)}</span>
          </div>
        </div>
      </div>`;
  }).join("");
}

/* ─────────────────────────────────────────────────────────────
   BROWSE GRID
───────────────────────────────────────────────────────────── */
function renderBrowse() {
  const grid = document.getElementById("browseGrid");
  const filtered = GAMES.filter(g => {
    if (g.id === 99) return false;
    const matchGenre = activeGenre === "all" || g.genre === activeGenre;
    const matchSearch = !searchQuery ||
      g.title.toLowerCase().includes(searchQuery) ||
      g.genre.toLowerCase().includes(searchQuery);
    return matchGenre && matchSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="no-results">No games match "${searchQuery}"</div>`;
    return;
  }

  grid.innerHTML = filtered.map(g => {
    const price = g.sale ?? g.price;
    const discountPct = g.sale ? Math.round((1 - g.sale / g.price) * 100) : 0;

    let badgeHtml = "";
    if (g.badge === "sale")  badgeHtml = `<span class="bcbadge bcbadge-sale">−${discountPct}%</span>`;
    else if (g.badge === "new")  badgeHtml = `<span class="bcbadge bcbadge-new">New</span>`;
    else if (g.badge === "top")  badgeHtml = `<span class="bcbadge bcbadge-top">Top Rated</span>`;

    const platsHtml = g.platforms.slice(0, 2).map(p =>
      `<span class="b-card-plat">${p}</span>`
    ).join("");

    const origHtml = g.sale ? `<span class="orig">$${g.price.toFixed(2)}</span>` : "";

    return `
      <div class="b-card">
        <div class="b-card-art">
          <div class="cover-${g.id} card-cover-inner"></div>
          <div class="b-card-art-overlay"></div>
          <div class="b-card-badges">${badgeHtml}</div>
          <div class="b-card-rating">&#9733; ${g.rating}</div>
          <div class="b-card-plats">${platsHtml}</div>
        </div>
        <div class="b-card-body">
          <span class="b-card-genre">${g.genre}</span>
          <div class="b-card-title">${g.title}</div>
          <div class="b-card-desc">${g.desc}</div>
          <div class="b-card-footer">
            <div class="b-card-price">
              ${origHtml}
              <span class="curr${g.sale ? " onsale" : ""}">$${price.toFixed(2)}</span>
            </div>
            <button class="b-card-add" onclick="event.stopPropagation();addToCartById(${g.id})" title="Add to cart">+</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

/* ─────────────────────────────────────────────────────────────
   CART
───────────────────────────────────────────────────────────── */
function addToCartById(id) {
  const g = GAMES.find(x => x.id === id);
  if (!g) return;
  if (cart.find(c => c.id === id)) { showToast("Already in your cart"); return; }
  cart.push({ ...g, cartPrice: g.sale ?? g.price });
  syncCart();
  showToast(`${g.title} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  syncCart();
}

function syncCart() {
  const n = cart.length;
  document.getElementById("cartCount").textContent = n;
  document.getElementById("drawerCount").textContent = `${n} item${n !== 1 ? "s" : ""}`;

  const body = document.getElementById("cartItems");
  if (!n) {
    body.innerHTML = `
      <div class="cart-empty-msg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2H3l-2 6v12a2 2 0 002 2h18a2 2 0 002-2V8L21 2h-3M16 10a4 4 0 01-8 0"/>
        </svg>
        <span>Your cart is empty</span>
      </div>`;
  } else {
    body.innerHTML = cart.map(g => `
      <div class="c-item">
        <div class="c-item-art"><div class="cover-${g.id}" style="width:100%;height:100%"></div></div>
        <div class="c-item-info">
          <div class="c-item-title">${g.title}</div>
          <div class="c-item-genre">${g.genre}</div>
          <div class="c-item-price">$${g.cartPrice.toFixed(2)}</div>
        </div>
        <button class="c-item-remove" onclick="removeFromCart(${g.id})" title="Remove">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/>
          </svg>
        </button>
      </div>`).join("");
  }

  const total = cart.reduce((s, g) => s + g.cartPrice, 0);
  document.getElementById("cartSubtotal").textContent = `$${total.toFixed(2)}`;
  document.getElementById("cartTotal").textContent    = `$${total.toFixed(2)}`;
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

/* ─────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  t.classList.add("show");
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ─────────────────────────────────────────────────────────────
   COUNTDOWN
───────────────────────────────────────────────────────────── */
function startTimer() {
  let s = 14 * 3600 + 23 * 60 + 17;
  const el = document.getElementById("timerDisplay");
  function tick() {
    if (s <= 0) s = 86400;
    s--;
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    el.textContent = `${h}:${m}:${sec}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ─────────────────────────────────────────────────────────────
   EVENTS
───────────────────────────────────────────────────────────── */
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) { showToast("Your cart is empty"); return; }
  closeCart();
  cart = [];
  syncCart();
  showToast("Order placed — check your email for your keys!");
});

document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderBrowse();
});

document.getElementById("filterTabs").addEventListener("click", e => {
  const btn = e.target.closest(".ftab");
  if (!btn) return;
  document.querySelectorAll(".ftab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeGenre = btn.dataset.genre;
  renderBrowse();
});

/* ─────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────── */
renderNewReleases();
renderDeals();
renderBrowse();
syncCart();
startTimer();
