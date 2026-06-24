const GAMES = [
  { id: 1,  title: "Shadow Realm",         genre: "action",   price: 29.99, icon: "⚔️",  desc: "Hack-and-slash your way through a dark fantasy world.", sale: null },
  { id: 2,  title: "Starfall Odyssey",     genre: "rpg",      price: 49.99, icon: "🚀",  desc: "An epic space RPG with hundreds of hours of story.", sale: 34.99 },
  { id: 3,  title: "Iron Fortress",        genre: "strategy", price: 24.99, icon: "🏰",  desc: "Build, defend, and conquer in this grand strategy game.", sale: null },
  { id: 4,  title: "Velocity Rush",        genre: "sports",   price: 19.99, icon: "🏎️",  desc: "Blazing-fast arcade racing across 40 tracks.", sale: null },
  { id: 5,  title: "Pixel Dungeon Pro",    genre: "indie",    price: 9.99,  icon: "👾",  desc: "Roguelike madness with procedurally generated levels.", sale: null },
  { id: 6,  title: "Dragon's Wrath",       genre: "action",   price: 39.99, icon: "🐉",  desc: "Slay legendary dragons in this action RPG epic.", sale: 27.99 },
  { id: 7,  title: "Chrono Empire",        genre: "strategy", price: 34.99, icon: "⏳",  desc: "Command armies across time in this strategic masterpiece.", sale: null },
  { id: 8,  title: "Neon Streets",         genre: "action",   price: 44.99, icon: "🌆",  desc: "Open-world cyberpunk action in a sprawling metropolis.", sale: null },
  { id: 9,  title: "Legends United",       genre: "sports",   price: 59.99, icon: "⚽",  desc: "The ultimate football simulation with global leagues.", sale: 49.99 },
  { id: 10, title: "Mystic Quest",         genre: "rpg",      price: 39.99, icon: "🧙",  desc: "Classic JRPG with a heartfelt story and turn-based combat.", sale: null },
  { id: 11, title: "Tiny World Builder",   genre: "indie",    price: 14.99, icon: "🌍",  desc: "Design your perfect miniature worlds from scratch.", sale: null },
  { id: 12, title: "Galactic Command",     genre: "strategy", price: 44.99, icon: "🛸",  desc: "Real-time space strategy with breathtaking scale.", sale: 29.99 },
  { id: 99, title: "Cyber Chronicles: Ultimate", genre: "rpg", price: 29.99, icon: "🔥", desc: "The definitive RPG experience in a neon-lit dystopia.", sale: null },
];

let cart = [];
let activeGenre = "all";
let searchQuery = "";

function renderGames() {
  const grid = document.getElementById("gameGrid");
  const filtered = GAMES.filter(g => {
    if (g.id === 99) return false; // featured only
    const matchGenre = activeGenre === "all" || g.genre === activeGenre;
    const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGenre && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1">No games found.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(g => {
    const displayPrice = g.sale ? g.sale : g.price;
    const priceHtml = g.sale
      ? `<div class="game-price has-discount"><span class="strike">$${g.price.toFixed(2)}</span>$${g.sale.toFixed(2)}</div>`
      : `<div class="game-price">$${g.price.toFixed(2)}</div>`;
    const discountHtml = g.sale
      ? `<span class="discount-tag">-${Math.round((1 - g.sale/g.price)*100)}%</span>`
      : "";
    return `
      <div class="game-card">
        <div class="game-thumb">${g.icon}</div>
        <div class="game-body">
          <span class="game-genre">${g.genre} ${discountHtml}</span>
          <div class="game-title">${g.title}</div>
          <div class="game-desc">${g.desc}</div>
          <div class="game-footer">
            ${priceHtml}
            <button class="add-btn" onclick="addToCartById(${g.id})">Add to Cart</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

function addToCartById(id) {
  const game = GAMES.find(g => g.id === id);
  if (!game) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    showToast(`${game.title} is already in your cart`);
    return;
  }
  cart.push({ ...game, cartPrice: game.sale ?? game.price });
  updateCartUI();
  showToast(`${game.title} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cartCount").textContent = cart.length;

  const items = document.getElementById("cartItems");
  if (cart.length === 0) {
    items.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
  } else {
    items.innerHTML = cart.map(g => `
      <div class="cart-item">
        <span class="cart-item-icon">${g.icon}</span>
        <div class="cart-item-info">
          <div class="cart-item-title">${g.title}</div>
          <div class="cart-item-price">$${g.cartPrice.toFixed(2)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${g.id})" title="Remove">✕</button>
      </div>`).join("");
  }

  const total = cart.reduce((sum, g) => sum + g.cartPrice, 0);
  document.getElementById("cartTotal").textContent = total.toFixed(2);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// FILTER BUTTONS
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeGenre = btn.dataset.genre;
    renderGames();
  });
});

// SEARCH
document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value;
  renderGames();
});

// CART MODAL
document.getElementById("cartBtn").addEventListener("click", () => {
  document.getElementById("cartModal").classList.add("open");
});
document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartModal").classList.remove("open");
});
document.getElementById("cartModal").addEventListener("click", e => {
  if (e.target === document.getElementById("cartModal")) {
    document.getElementById("cartModal").classList.remove("open");
  }
});

// CHECKOUT
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  document.getElementById("cartModal").classList.remove("open");
  cart = [];
  updateCartUI();
  showToast("Order placed! Thank you for your purchase 🎉");
});

// INIT
renderGames();
updateCartUI();
