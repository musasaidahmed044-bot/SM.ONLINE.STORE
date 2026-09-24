// ONLINE SM STORE
// Change this number to the store's real WhatsApp number, in international format without +.
// Example Kenya: 2547XXXXXXXX
const STORE_WHATSAPP = "254700000000";

const products = [
  {id:"m1", category:"men", name:"Red & Green Football Jersey", price:2500, image:"images/men-jersey-red-green.jpg"},
  {id:"m2", category:"men", name:"Red & White Football Jersey", price:2500, image:"images/men-jersey-red-white.jpg"},
  {id:"m3", category:"men", name:"Black & Gold Football Jersey", price:2500, image:"images/men-jersey-black-gold.jpg"},
  {id:"m4", category:"men", name:"Blue Football Jersey", price:2500, image:"images/men-jersey-blue.jpg"},
  {id:"m5", category:"men", name:"Blue Geometric Football Jersey", price:2500, image:"images/men-jersey-blue-geometric.jpg"},
  {id:"m6", category:"men", name:"Blue & White Football Jersey", price:2500, image:"images/men-jersey-paris.jpg"},
  {id:"w1", category:"women", name:"Cream Handbag", price:1800, image:"images/women-handbag-cream.jpg"},
  {id:"w2", category:"women", name:"White Handbag", price:1800, image:"images/women-handbag-white.jpg"},
  {id:"w3", category:"women", name:"Black Handbag", price:1800, image:"images/women-handbag-black.jpg"},
  {id:"w4", category:"women", name:"Yellow Handbag", price:1800, image:"images/women-handbag-yellow.jpg"}
];

let cart = JSON.parse(localStorage.getItem("sm_cart") || "[]");

function money(n){ return "KSh " + Number(n).toLocaleString("en-KE"); }

function renderProducts(category, targetId){
  const target = document.getElementById(targetId);
  const list = products.filter(p => p.category === category);
  target.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-image"><img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy"></div>
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="price">${money(p.price)}</div>
        <div class="product-meta">Available to order • Ask for size/colour</div>
        <button class="add-btn" onclick="addToCart('${p.id}')">Add to cart</button>
      </div>
    </article>`).join("");
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
}

function addToCart(id){
  const existing = cart.find(x => x.id === id);
  if(existing) existing.qty++;
  else cart.push({id, qty:1});
  saveCart();
  openCart();
  toast("Added to cart");
}

function changeQty(id, amount){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += amount;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
}

function removeFromCart(id){
  cart = cart.filter(x => x.id !== id);
  saveCart();
}

function saveCart(){
  localStorage.setItem("sm_cart", JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const box = document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML = '<div style="padding:35px 5px;text-align:center;color:#777">Your cart is empty.<br><br><a href="#men" onclick="closeCart()" style="text-decoration:underline;color:#111">Start shopping</a></div>';
  } else {
    box.innerHTML = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      return `<div class="cart-row">
        <img src="${p.image}" alt="">
        <div><h4>${escapeHtml(p.name)}</h4><small>${money(p.price)} each</small>
          <div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button><strong>${item.qty}</strong><button onclick="changeQty('${p.id}',1)">+</button></div>
        </div>
        <div style="text-align:right"><strong>${money(p.price*item.qty)}</strong><br><button class="remove" onclick="removeFromCart('${p.id}')">Remove</button></div>
      </div>`;
    }).join("");
  }
  const total = cart.reduce((sum,item) => {
    const p = products.find(x => x.id === item.id); return sum + p.price * item.qty;
  },0);
  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("checkoutTotal").textContent = money(total);
  document.getElementById("cartCount").textContent = cart.reduce((s,x)=>s+x.qty,0);
}

function openCart(){
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
function closeCart(){
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("overlay").addEventListener("click", closeCart);

function openModal(id){ document.getElementById(id).classList.add("show"); }
function closeModal(id){ document.getElementById(id).classList.remove("show"); }
document.getElementById("signinBtn").addEventListener("click", ()=>openModal("signinModal"));

function signIn(){
  const name = document.getElementById("loginName").value.trim();
  const email = document.getElementById("loginEmail").value.trim();
  if(!name || !email){ document.getElementById("loginStatus").textContent = "Please enter your name and email."; return; }
  localStorage.setItem("sm_user", JSON.stringify({name,email}));
  document.getElementById("loginStatus").textContent = `Signed in as ${name}.`;
  toast("Welcome, " + name);
  setTimeout(()=>closeModal("signinModal"),700);
}

function openCheckout(){
  if(!cart.length){ toast("Add an item to your cart first"); return; }
  openModal("checkoutModal");
}

function buildOrderMessage(){
  const name = document.getElementById("orderName").value.trim();
  const phone = document.getElementById("orderPhone").value.trim();
  const location = document.getElementById("orderLocation").value.trim();
  const notes = document.getElementById("orderNotes").value.trim();
  if(!name || !phone || !location) return null;
  const lines = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `• ${p.name} x${item.qty} — ${money(p.price*item.qty)}`;
  });
  const total = cart.reduce((sum,item)=>{
    const p = products.find(x=>x.id===item.id); return sum+p.price*item.qty;
  },0);
  return `Hello Online SM Store 👋\n\nI would like to place an order.\n\nName: ${name}\nPhone: ${phone}\nLocation: ${location}\n\nItems:\n${lines.join("\n")}\n\nTotal: ${money(total)}\nNotes: ${notes || "None"}\n\nPlease confirm availability and delivery details.`;
}

function placeOrder(){
  const msg = buildOrderMessage();
  if(!msg){ toast("Please fill in name, phone and location"); return; }
  const url = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
  localStorage.setItem("sm_last_order", JSON.stringify({message:msg, time:new Date().toISOString()}));
  cart = [];
  saveCart();
  closeModal("checkoutModal");
  closeCart();
}

function contactWhatsApp(){
  const url = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent("Hello Online SM Store 👋 I would like to ask about your products.")}`;
  window.open(url, "_blank");
}

function showHelp(){ openModal("helpModal"); }

function toast(message){
  const t = document.getElementById("toast");
  t.textContent = message;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1800);
}

document.querySelectorAll(".modal-wrap").forEach(wrap=>{
  wrap.addEventListener("click", e=>{ if(e.target===wrap) wrap.classList.remove("show"); });
});

renderProducts("men","menProducts");
renderProducts("women","womenProducts");
renderCart();
document.getElementById("year").textContent = new Date().getFullYear();

// Restore the demo account name in the sign-in button.
const savedUser = JSON.parse(localStorage.getItem("sm_user") || "null");
if(savedUser?.name) document.getElementById("signinBtn").textContent = savedUser.name.split(" ")[0];
