        // ===== ESTADO =====
        let currentPage = 'home';
        let currentFilter = 'todos';
        let cart = [];
        let currentUser = null;
        let menuOpen = false;

        // ===== PRODUTOS =====
        let products = [
            { id: 1, name: 'Carne de Sol com Macaxeira', desc: 'Carne de sol artesanal grelhada, acompanhada de manteiga de garrafa e macaxeira cozida no ponto.', price: 42.90, category: 'prato-principal', emoji: '🍖', time: '35 min', cal: '680 kcal', badge: '⭐ Mais pedido', gradient: 'img-gradient-1' },
            { id: 2, name: 'Baião de Dois Completo', desc: 'Arroz com feijão-verde, queijo coalho, carne seca e linguiça. A combinação perfeita do Nordeste.', price: 38.50, category: 'prato-principal', emoji: '🍚', time: '30 min', cal: '720 kcal', badge: '💛 Favorito', gradient: 'img-gradient-2' },
            { id: 3, name: 'Galinha Caipira Guisada', desc: 'Galinha do campo em molho aromático com pimenta, coentro e legumes frescos da roça.', price: 45.00, category: 'prato-principal', emoji: '🍗', time: '40 min', cal: '590 kcal', gradient: 'img-gradient-4' },
            { id: 4, name: 'Buchada de Bode Tradicional', desc: 'Prato típico nordestino com miúdos temperados, cozidos na panela de barro com ervas frescas.', price: 52.00, category: 'prato-principal', emoji: '🥘', time: '50 min', cal: '550 kcal', badge: '🔥 Especial', gradient: 'img-gradient-1' },
            { id: 5, name: 'Sarapatel do Sertão', desc: 'Fígado e sangue de porco refogados com tempero nordestino. Tradição pura e sabor intenso.', price: 44.90, category: 'prato-principal', emoji: '🍲', time: '45 min', cal: '620 kcal', gradient: 'img-gradient-6' },
            { id: 6, name: 'Tapioca de Queijo Coalho', desc: 'Goma hidratada na chapa, recheada com queijo coalho derretido e manteiga de garrafa.', price: 14.00, category: 'tapioca', emoji: '🫓', time: '10 min', cal: '320 kcal', badge: '⭐ Mais pedido', gradient: 'img-gradient-5' },
            { id: 7, name: 'Tapioca de Carne Seca', desc: 'Goma na chapa com carne seca desfiada, queijo e tomate. Clássico nordestino reinventado.', price: 18.00, category: 'tapioca', emoji: '🥙', time: '12 min', cal: '410 kcal', gradient: 'img-gradient-4' },
            { id: 8, name: 'Tapioca de Banana com Mel', desc: 'Goma doce recheada com banana da terra caramelizada, mel de engenho e canela.', price: 15.00, category: 'tapioca', emoji: '🍌', time: '10 min', cal: '380 kcal', gradient: 'img-gradient-2' },
            { id: 9, name: 'Tapioca de Frango com Catupiry', desc: 'Frango desfiado temperado com ervas e catupiry cremoso. Suave e delicioso.', price: 17.50, category: 'tapioca', emoji: '🫓', time: '12 min', cal: '450 kcal', gradient: 'img-gradient-3' },
            { id: 10, name: 'Tacacá Nordestino', desc: 'Caldinho de tucupi com camarão seco, jambu e pimenta. Sabor único do interior.', price: 16.00, category: 'petisco', emoji: '🍜', time: '15 min', cal: '210 kcal', gradient: 'img-gradient-7' },
            { id: 11, name: 'Paçoca de Carne Seca', desc: 'Carne seca pilada com farinha de mandioca, cebola e coentro. Entrada irresistível.', price: 22.00, category: 'petisco', emoji: '🫘', time: '20 min', cal: '380 kcal', badge: '💛 Favorito', gradient: 'img-gradient-1' },
            { id: 12, name: 'Cuscuz com Queijo', desc: 'Cuscuz de milho no ponto certo, acompanhado de fatias de queijo coalho e manteiga.', price: 12.00, category: 'petisco', emoji: '🌽', time: '10 min', cal: '290 kcal', gradient: 'img-gradient-5' },
            { id: 13, name: 'Suco de Umbú', desc: 'Fruta nativa do Sertão batida na hora, refrescante e cheia de vitaminas.', price: 9.00, category: 'bebida', emoji: '🥤', time: '5 min', cal: '120 kcal', gradient: 'img-gradient-3' },
            { id: 14, name: 'Suco de Cajá', desc: 'Suco cremoso de cajá selecionado, levemente ácido e muito aromático.', price: 8.50, category: 'bebida', emoji: '🍹', time: '5 min', cal: '110 kcal', badge: '⭐ Mais pedido', gradient: 'img-gradient-2' },
            { id: 15, name: 'Água de Coco Natural', desc: 'Direto do coco verde, gelada e natural. A bebida do sertanejo.', price: 7.00, category: 'bebida', emoji: '🥥', time: '2 min', cal: '65 kcal', gradient: 'img-gradient-7' },
            { id: 16, name: 'Café com Rapadura', desc: 'Café coado na hora servido com rapadura artesanal. Do jeito que a vovó fazia.', price: 6.00, category: 'bebida', emoji: '☕', time: '3 min', cal: '40 kcal', gradient: 'img-gradient-5' },
            { id: 17, name: 'Cartola Tradicional', desc: 'Banana frita com queijo coalho derretido, polvilhado com canela e açúcar. Clássico pernambucano.', price: 18.00, category: 'sobremesa', emoji: '🍌', time: '15 min', cal: '430 kcal', badge: '🔥 Especial', gradient: 'img-gradient-2' },
            { id: 18, name: 'Canjica de Milho Verde', desc: 'Canjica cremosa com leite de coco, canela e cravo. Perfeita para fechar a refeição.', price: 14.00, category: 'sobremesa', emoji: '🍮', time: '10 min', cal: '350 kcal', gradient: 'img-gradient-5' },
            { id: 19, name: 'Doce de Leite Artesanal', desc: 'Doce de leite feito na roça, com textura cremosa e sabor inigualável. Pura nostalgia.', price: 10.00, category: 'sobremesa', emoji: '🍯', time: '5 min', cal: '280 kcal', gradient: 'img-gradient-6' },
            { id: 20, name: 'Mungunzá de Milho', desc: 'Mingau de milho branco com leite de coco e açúcar, servido quente ou frio.', price: 13.00, category: 'sobremesa', emoji: '🍚', time: '10 min', cal: '310 kcal', gradient: 'img-gradient-4' },
        ];

        // ===== LOADER =====
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loader').classList.add('fade-out');
                setTimeout(() => document.getElementById('loader').remove(), 700);
            }, 1800);
            renderFeatured();
            renderCardapio();
        });

        // ===== NAV =====
        function showPage(page) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('page-' + page).classList.add('active');
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            const navEl = document.getElementById('nav-' + page);
            if (navEl) navEl.classList.add('active');
            currentPage = page;
            window.scrollTo(0, 0);
            if (page === 'conta') renderContaPage();
            if (menuOpen) toggleMobileMenu();
        }

        function toggleMobileMenu() {
            menuOpen = !menuOpen;
            document.getElementById('nav-links').classList.toggle('open', menuOpen);
        }

        // ===== RENDER =====
        function renderCardProd(p, large = false) {
            const gradMap = { 'prato-principal': 'img-gradient-1', tapioca: 'img-gradient-5', petisco: 'img-gradient-4', bebida: 'img-gradient-3', sobremesa: 'img-gradient-2' };
            const grad = p.gradient || gradMap[p.category] || 'img-gradient-1';
            return `
  <div class="${large ? 'cardapio-card' : 'product-card'}">
    <div class="${large ? 'cardapio-card-img' : 'product-card-img'} ${grad}">
      ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
      ${p.emoji}
    </div>
    <div class="${large ? 'cardapio-card-body' : 'product-card-body'}">
      <div class="${large ? 'cardapio-card-name' : 'product-card-name'}">${p.name}</div>
      <div class="${large ? 'cardapio-card-desc' : 'product-card-desc'}">${p.desc}</div>
      ${large ? `<div class="cardapio-card-meta">
        ${p.time ? `<span class="meta-tag">⏱️ ${p.time}</span>` : ''}
        ${p.cal ? `<span class="meta-tag">🔥 ${p.cal}</span>` : ''}
      </div>` : ''}
      <div class="${large ? 'cardapio-card-footer' : 'product-card-footer'}">
        <span class="${large ? 'cardapio-price' : 'product-price'}">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
        <button class="btn-add ripple-wrapper" id="btn-${p.id}" onclick="addToCart(${p.id})">
          + Adicionar
        </button>
      </div>
    </div>
  </div>`;
        }

        function renderFeatured() {
            const featured = products.filter(p => p.badge).slice(0, 4);
            document.getElementById('featured-products').innerHTML = featured.map(p => renderCardProd(p)).join('');
        }

        function renderCardapio() {
            const search = (document.getElementById('search-input')?.value || '').toLowerCase();
            let filtered = products.filter(p => {
                const matchCat = currentFilter === 'todos' || p.category === currentFilter;
                const matchSearch = !search || p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
                return matchCat && matchSearch;
            });
            const grid = document.getElementById('cardapio-grid');
            if (filtered.length === 0) {
                grid.innerHTML = `<div class="no-results"><span class="emoji">🌵</span><p>Nenhum produto encontrado...</p></div>`;
                return;
            }
            grid.innerHTML = filtered.map((p, i) => {
                const card = renderCardProd(p, true);
                return card.replace('cardapio-card"', `cardapio-card" style="animation-delay:${i * 0.06}s"`);
            }).join('');
        }

        function setFilter(filter, btn) {
            currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCardapio();
        }

        function filterProducts() { renderCardapio(); }

        function filterAndGo(cat) {
            currentFilter = cat;
            showPage('cardapio');
            setTimeout(() => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                const btns = document.querySelectorAll('.filter-btn');
                btns.forEach(b => { if (b.onclick && b.onclick.toString().includes(`'${cat}'`)) b.classList.add('active'); });
                renderCardapio();
            }, 100);
        }

        // ===== CART =====
        function addToCart(id) {
            const prod = products.find(p => p.id === id);
            if (!prod) return;
            const existing = cart.find(i => i.id === id);
            if (existing) { existing.qty++; }
            else { cart.push({ ...prod, qty: 1 }); }
            updateCartUI();
            showToast(`${prod.emoji} ${prod.name} adicionado!`, 'success');
            const btn = document.getElementById('btn-' + id);
            if (btn) { btn.classList.add('added'); btn.textContent = '✓ Adicionado'; setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '+ Adicionar'; }, 1500); }
        }

        function removeFromCart(id) {
            const item = cart.find(i => i.id === id);
            if (!item) return;
            if (item.qty > 1) { item.qty--; } else { cart = cart.filter(i => i.id !== id); }
            updateCartUI();
        }

        function updateCartUI() {
            const totalQty = cart.reduce((s, i) => s + i.qty, 0);
            const totalVal = cart.reduce((s, i) => s + i.price * i.qty, 0);
            const badge = document.getElementById('cartBadge');
            badge.textContent = totalQty;
            badge.style.display = totalQty > 0 ? 'flex' : 'none';
            document.getElementById('cart-total').textContent = 'R$ ' + totalVal.toFixed(2).replace('.', ',');
            const list = document.getElementById('cart-items-list');
            if (cart.length === 0) {
                list.innerHTML = `<div class="cart-empty"><span class="emoji">🛒</span><p>Seu carrinho está vazio</p><p style="font-size:0.8rem;margin-top:4px">Adicione itens do cardápio!</p></div>`;
            } else {
                list.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="removeFromCart(${item.id})">−</button>
          <span style="font-weight:800;min-width:20px;text-align:center">${item.qty}</span>
          <button class="qty-btn" onclick="addToCart(${item.id})">+</button>
        </div>
      </div>
    `).join('');
            }
        }

        function toggleCart() {
            document.getElementById('cart-sidebar').classList.toggle('open');
            document.getElementById('cart-overlay').classList.toggle('open');
        }

        function checkout() {
            if (cart.length === 0) { showToast('Adicione itens ao carrinho primeiro!', 'error'); return; }
            if (!currentUser) { showToast('Faça login para finalizar o pedido!', 'error'); setTimeout(() => showPage('conta'), 1000); return; }
            const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
            cart = [];
            updateCartUI();
            toggleCart();
            showToast(`✅ Pedido de R$ ${total.toFixed(2).replace('.', ',')} realizado! Aguarde...`, 'success');
        }

        // ===== AUTH =====
        function switchAuthTab(tab, btn) {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-login').style.display = tab === 'login' ? 'block' : 'none';
            document.getElementById('tab-cadastro').style.display = tab === 'cadastro' ? 'block' : 'none';
        }

        function doLogin() {
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value;
            const errEl = document.getElementById('login-error');
            errEl.style.display = 'none';
            if (email === 'micael@gmail.com' && pass === '123456') {
                currentUser = { name: 'Micael', email, role: 'admin', avatar: 'M' };
            } else if (email && pass.length >= 3) {
                const name = email.split('@')[0];
                currentUser = { name: name.charAt(0).toUpperCase() + name.slice(1), email, role: 'user', avatar: name[0].toUpperCase() };
            } else {
                errEl.style.display = 'block'; return;
            }
            renderContaPage();
            showToast(`🌵 Bem-vindo(a), ${currentUser.name}!`, 'success');
        }

        function doRegister() {
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const pass = document.getElementById('reg-password').value;
            const errEl = document.getElementById('reg-error');
            const sucEl = document.getElementById('reg-success');
            errEl.style.display = 'none'; sucEl.style.display = 'none';
            if (!name || !email || pass.length < 6) { errEl.style.display = 'block'; return; }
            sucEl.style.display = 'block';
            setTimeout(() => { switchAuthTab('login', document.querySelectorAll('.auth-tab')[0]); sucEl.style.display = 'none'; }, 2000);
        }

        function doLogout() {
            currentUser = null;
            renderContaPage();
            showToast('Até logo! 👋', 'success');
        }

        function renderContaPage() {
            if (!currentUser) {
                document.getElementById('auth-view').style.display = 'block';
                document.getElementById('user-view').style.display = 'none';
            } else {
                document.getElementById('auth-view').style.display = 'none';
                document.getElementById('user-view').style.display = 'block';
                document.getElementById('conta-avatar').textContent = currentUser.avatar;
                document.getElementById('conta-name').textContent = currentUser.name;
                document.getElementById('conta-email').textContent = currentUser.email;
                document.getElementById('conta-role').textContent = currentUser.role === 'admin' ? '⭐ Administrador' : '👤 Cliente';
                document.getElementById('adm-panel').style.display = currentUser.role === 'admin' ? 'block' : 'none';
            }
        }

        // ===== ADM =====
        function addProduct() {
            const name = document.getElementById('adm-name').value.trim();
            const price = parseFloat(document.getElementById('adm-price').value);
            const category = document.getElementById('adm-category').value;
            const emoji = document.getElementById('adm-emoji').value.trim() || '🍽️';
            const desc = document.getElementById('adm-desc').value.trim();
            const time = document.getElementById('adm-time').value.trim();
            const cal = document.getElementById('adm-cal').value.trim();
            const errEl = document.getElementById('adm-error');
            const sucEl = document.getElementById('adm-success');
            errEl.style.display = 'none'; sucEl.style.display = 'none';
            if (!name || !price || !desc) { errEl.style.display = 'block'; return; }
            const newProd = {
                id: Date.now(), name, price, category, emoji, desc, time, cal,
                gradient: 'img-gradient-' + (Math.floor(Math.random() * 7) + 1)
            };
            products.push(newProd);
            renderCardapio(); renderFeatured();
            sucEl.style.display = 'block';
            ['adm-name', 'adm-price', 'adm-emoji', 'adm-desc', 'adm-time', 'adm-cal'].forEach(id => document.getElementById(id).value = '');
            showToast(`✅ ${newProd.name} adicionado ao cardápio!`, 'success');
            setTimeout(() => { sucEl.style.display = 'none'; }, 3000);
        }

        // ===== CONTATO =====
        function sendContact() {
            const n = document.getElementById('cont-name').value.trim();
            const e = document.getElementById('cont-email').value.trim();
            const m = document.getElementById('cont-msg').value.trim();
            const errEl = document.getElementById('cont-error');
            const sucEl = document.getElementById('cont-success');
            errEl.style.display = 'none'; sucEl.style.display = 'none';
            if (!n || !e || !m) { errEl.style.display = 'block'; return; }
            sucEl.style.display = 'block';
            ['cont-name', 'cont-email', 'cont-msg'].forEach(id => document.getElementById(id).value = '');
            showToast('✅ Mensagem enviada com sucesso!', 'success');
            setTimeout(() => sucEl.style.display = 'none', 4000);
        }

        // ===== TOAST =====
        function showToast(msg, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = msg;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'none';
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(60px)';
                toast.style.transition = 'all 0.4s';
                setTimeout(() => toast.remove(), 400);
            }, 3000);
        }

        // ===== RIPPLE =====
        document.addEventListener('click', e => {
            const btn = e.target.closest('.ripple-wrapper');
            if (!btn) return;
            const r = document.createElement('span');
            r.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
            btn.appendChild(r);
            setTimeout(() => r.remove(), 600);
        });