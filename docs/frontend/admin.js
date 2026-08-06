const apiBase = '/api';
let token = null;

function showToast(msg, type='success'){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.padding='10px 14px';
  t.style.background = type==='success' ? '#138808' : '#dc3545';
  t.style.color='#fff';
  t.style.borderRadius='6px';
  t.style.marginTop='8px';
  document.getElementById('toast').appendChild(t);
  setTimeout(()=> t.remove(), 3500);
}

// Store Settings Functions
function saveStoreSettings() {
  const openingTime = document.getElementById('openingTime').value;
  const closingTime = document.getElementById('closingTime').value;
  
  localStorage.setItem('storeOpeningTime', openingTime);
  localStorage.setItem('storeClosingTime', closingTime);
  
  // Update display
  const openHour = parseInt(openingTime.split(':')[0]);
  const openMin = openingTime.split(':')[1];
  const closeHour = parseInt(closingTime.split(':')[0]);
  const closeMin = closingTime.split(':')[1];
  
  const openPeriod = openHour >= 12 ? 'PM' : 'AM';
  const closePeriod = closeHour >= 12 ? 'PM' : 'AM';
  const displayOpenHour = openHour > 12 ? openHour - 12 : openHour;
  const displayCloseHour = closeHour > 12 ? closeHour - 12 : closeHour;
  
  document.getElementById('currentHours').textContent = 
    `${displayOpenHour}:${openMin} ${openPeriod} - ${displayCloseHour}:${closeMin} ${closePeriod}`;
  
  showToast('Store settings saved successfully');
}

function loadStoreSettings() {
  const openingTime = localStorage.getItem('storeOpeningTime') || '09:00';
  const closingTime = localStorage.getItem('storeClosingTime') || '22:00';
  
  document.getElementById('openingTime').value = openingTime;
  document.getElementById('closingTime').value = closingTime;
  
  // Update display
  const openHour = parseInt(openingTime.split(':')[0]);
  const openMin = openingTime.split(':')[1];
  const closeHour = parseInt(closingTime.split(':')[0]);
  const closeMin = closingTime.split(':')[1];
  
  const openPeriod = openHour >= 12 ? 'PM' : 'AM';
  const closePeriod = closeHour >= 12 ? 'PM' : 'AM';
  const displayOpenHour = openHour > 12 ? openHour - 12 : openHour;
  const displayCloseHour = closeHour > 12 ? closeHour - 12 : closeHour;
  
  document.getElementById('currentHours').textContent = 
    `${displayOpenHour}:${openMin} ${openPeriod} - ${displayCloseHour}:${closeMin} ${closePeriod}`;
}

// Logo Management Functions
function changeLogo(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const logoData = e.target.result;
      
      // Save to localStorage
      localStorage.setItem('storeLogo', logoData);
      
      // Update preview
      document.getElementById('currentLogo').src = logoData;
      
      // Update main website logo
      const mainLogo = document.getElementById('siteLogo');
      if (mainLogo) {
        mainLogo.src = logoData;
      }
      
      showToast('Logo updated successfully');
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function loadStoreLogo() {
  const savedLogo = localStorage.getItem('storeLogo');
  if (savedLogo) {
    document.getElementById('currentLogo').src = savedLogo;
  }
}

// Website Control Functions
function toggleWebsite() {
  const isDisabled = localStorage.getItem('websiteDisabled') === 'true';
  const btn = document.getElementById('toggleSiteBtn');
  
  if (isDisabled) {
    localStorage.setItem('websiteDisabled', 'false');
    btn.textContent = 'Disable Website';
    btn.style.background = '#dc3545';
    showToast('Website enabled successfully');
  } else {
    localStorage.setItem('websiteDisabled', 'true');
    btn.textContent = 'Enable Website';
    btn.style.background = '#138808';
    showToast('Website disabled successfully');
  }
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    localStorage.clear();
    showToast('All data cleared successfully');
    setTimeout(() => location.reload(), 1500);
  }
}

function exportData() {
  const data = {
    products: JSON.parse(localStorage.getItem('dairy_products') || '[]'),
    orders: JSON.parse(localStorage.getItem('dairy_orders') || '[]'),
    settings: {
      storeName: localStorage.getItem('storeName'),
      storePhone: localStorage.getItem('storePhone'),
      storeAddress: localStorage.getItem('storeAddress'),
      openingTime: localStorage.getItem('storeOpeningTime'),
      closingTime: localStorage.getItem('storeClosingTime')
    }
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dairy_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('Data exported successfully');
}

function resetToDefaults() {
  if (confirm('Are you sure you want to reset to default settings?')) {
    localStorage.removeItem('storeName');
    localStorage.removeItem('storePhone');
    localStorage.removeItem('storeAddress');
    localStorage.removeItem('storeOpeningTime');
    localStorage.removeItem('storeClosingTime');
    localStorage.removeItem('storeLogo');
    
    loadStoreSettings();
    showToast('Settings reset to defaults');
  }
}

function saveStoreInfo() {
  const name = document.getElementById('storeName').value;
  const phone = document.getElementById('storePhone').value;
  const address = document.getElementById('storeAddress').value;
  
  localStorage.setItem('storeName', name);
  localStorage.setItem('storePhone', phone);
  localStorage.setItem('storeAddress', address);
  
  showToast('Store information saved successfully');
}

function loadStoreInfo() {
  document.getElementById('storeName').value = localStorage.getItem('storeName') || 'Indian Doodh Dairy';
  document.getElementById('storePhone').value = localStorage.getItem('storePhone') || '';
  document.getElementById('storeAddress').value = localStorage.getItem('storeAddress') || '';
}

function loadWebsiteStatus() {
  const isDisabled = localStorage.getItem('websiteDisabled') === 'true';
  const btn = document.getElementById('toggleSiteBtn');
  
  if (isDisabled) {
    btn.textContent = 'Enable Website';
    btn.style.background = '#138808';
  } else {
    btn.textContent = 'Disable Website';
    btn.style.background = '#dc3545';
  }
}

async function login(){
  const username = document.getElementById('adminUser').value || '';
  const password = document.getElementById('adminPass').value || '';
  if(!username || !password) return showToast('Enter credentials','error');
  try{
    const res = await fetch(apiBase+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
    if(!res.ok) throw new Error('Login failed');
    const data = await res.json();
    token = data.token;
    showToast('Login successful');
    document.getElementById('adminArea').hidden = false;
    loadProducts();
    loadStoreSettings();
    loadStoreLogo();
    loadStoreInfo();
    loadWebsiteStatus();
  }catch(e){
    console.error(e); showToast('Login failed','error');
  }
}

function logout(){ token = null; document.getElementById('adminArea').hidden = true; showToast('Logged out'); }

async function loadProducts(){
  try{
    const q = document.getElementById('search').value || '';
    const cat = document.getElementById('filterCategory').value || '';
    const url = new URL(apiBase+'/products', location.origin);
    if(q) url.searchParams.set('search', q);
    if(cat) url.searchParams.set('category', cat);
    const res = await fetch(url);
    const list = await res.json();
    renderProductsTable(list);
  }catch(e){ console.error(e); showToast('Failed to load products','error'); }
}

async function loadOrders(){
  if(!token) return showToast('Login required','error');
  try{
    const res = await fetch(apiBase+'/orders',{ headers: { 'Authorization': 'Bearer '+token } });
    if(!res.ok) throw new Error('Failed to fetch orders');
    const list = await res.json();
    renderOrders(list);
  }catch(e){ console.error(e); showToast('Failed to load orders','error'); }
}

function renderOrders(list){
  const tbody = document.getElementById('ordersTableBody');
  if(!list || list.length===0){ tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#888;">No orders</td></tr>'; return; }
  let html = '';
  list.forEach(o=>{
    html += `<tr>
      <td><strong>${o.orderId}</strong></td>
      <td>${o.customerName}</td>
      <td>${o.customerPhone}</td>
      <td style="color:var(--green);font-weight:700">₹${o.totalAmount}</td>
      <td>
        <select onchange="changeOrderStatus('${o.orderId}', this.value)">
          <option value="received" ${o.status==='received'?'selected':''}>received</option>
          <option value="preparing" ${o.status==='preparing'?'selected':''}>preparing</option>
          <option value="out_for_delivery" ${o.status==='out_for_delivery'?'selected':''}>out_for_delivery</option>
          <option value="delivered" ${o.status==='delivered'?'selected':''}>delivered</option>
        </select>
      </td>
      <td>${new Date(o.date).toLocaleString()}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

async function changeOrderStatus(orderId, status){
  try{
    const res = await fetch(apiBase+`/orders/${orderId}`,{ method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status }) });
    if(!res.ok) throw new Error('Update failed');
    showToast('Order updated');
    loadOrders();
  }catch(e){ console.error(e); showToast('Order update failed','error'); }
}

function renderProductsTable(list){
  const container = document.getElementById('productsTable');
  if(!list || list.length===0){ container.innerHTML = '<p>No products</p>'; return; }
  let html = '<table style="width:100%;border-collapse:collapse"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>MRP</th><th>Unit</th><th>InStock</th><th>Actions</th></tr></thead><tbody>';
  list.forEach(p=>{
    html += `<tr><td>${p.name}</td><td>${p.category}</td><td>₹${p.price}</td><td>₹${p.mrp}</td><td>${p.unit}</td><td>${p.inStock? 'Yes':'No'}</td><td><button onclick="showEdit('${p.id}')">Edit</button> <button onclick="del('${p.id}')" style="margin-left:6px;background:#dc3545;color:#fff">Delete</button></td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function showCreate(){ document.getElementById('createForm').style.display = 'block'; }
function hideCreate(){ document.getElementById('createForm').style.display = 'none'; }

async function createProduct(){
  const body = collectForm();
  if(!body) return;
  try{
    const res = await fetch(apiBase+'/products',{method:'POST',headers:authHeaders(),body:JSON.stringify(body)});
    if(!res.ok){ const err = await res.json(); throw new Error(err.error || (err.errors && err.errors.join(', ')) || 'Create failed'); }
    showToast('Product created'); hideCreate(); loadProducts();
  }catch(e){ console.error(e); showToast(e.message||'Create failed','error'); }
}

function collectForm(){
  const name = document.getElementById('p_name').value.trim();
  const category = document.getElementById('p_category').value;
  const price = parseFloat(document.getElementById('p_price').value);
  const mrp = parseFloat(document.getElementById('p_mrp').value);
  const unit = document.getElementById('p_unit').value || '1 kg';
  const imageUrl = document.getElementById('p_image').value || '/images/placeholder.png';
  const description = document.getElementById('p_desc').value || '';
  if(!name || isNaN(price)) { showToast('Name and price required','error'); return null; }
  return { name, category, price, mrp: mrp || price, unit, imageUrl, description, inStock: true };
}

function authHeaders(){ return { 'Content-Type':'application/json', 'Authorization': 'Bearer '+(token||'') }; }

async function del(id){ if(!confirm('Delete product?')) return; try{ const res = await fetch(apiBase+`/products/${id}`,{ method:'DELETE', headers: authHeaders() }); if(!res.ok) throw new Error('Delete failed'); showToast('Deleted'); loadProducts(); }catch(e){ console.error(e); showToast('Delete failed','error'); } }

// Edit flow (simple prompt-based)
async function showEdit(id){
  try{
    const res = await fetch(apiBase+`/products/${id}`);
    const p = await res.json();
    const newPrice = prompt('Price', p.price);
    const newMrp = prompt('MRP', p.mrp);
    const inStock = confirm('Mark as in stock? OK = Yes');
    const category = prompt('Category', p.category);
    const imageUrl = prompt('Image URL', p.imageUrl || '') || p.imageUrl;
    const name = prompt('Name', p.name) || p.name;
    const body = { price: Number(newPrice), mrp: Number(newMrp), inStock, category, imageUrl, name };
    const resp = await fetch(apiBase+`/products/${id}`,{method:'PUT',headers:authHeaders(),body:JSON.stringify(body)});
    if(!resp.ok){ const err = await resp.json(); throw new Error(err.error || (err.errors && err.errors.join(', ')) || 'Update failed'); }
    showToast('Updated'); loadProducts();
  }catch(e){ console.error(e); showToast('Update failed','error'); }
}

// Auto-load if token present in localStorage
(function(){
  const t = localStorage.getItem('idd_token');
  if(t) { token = t; document.getElementById('adminArea').hidden = false; loadProducts(); }
})();

// Persist token in localStorage for convenience
setInterval(()=>{ if(token) localStorage.setItem('idd_token', token); }, 2000);
