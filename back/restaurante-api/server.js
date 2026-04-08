const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── IN-MEMORY DATA ────────────────────────────────────────────────────────────

let menus = [
  { id: 1, categoria: "Entradas", nome: "Carpaccio di Manzo", descricao: "Finas fatias de filé mignon, rúcula, parmesão e azeite trufado", preco: 58.90, disponivel: true, imagem: "🥩" },
  { id: 2, categoria: "Entradas", nome: "Burrata Caprese", descricao: "Burrata cremosa com tomate San Marzano e manjericão fresco", preco: 52.00, disponivel: true, imagem: "🧀" },
  { id: 3, categoria: "Massas", nome: "Tagliatelle al Tartufo", descricao: "Massa fresca artesanal com creme de trufa negra e parmesão 36 meses", preco: 89.90, disponivel: true, imagem: "🍝" },
  { id: 4, categoria: "Massas", nome: "Risotto ai Frutti di Mare", descricao: "Arroz arbóreo com frutos do mar frescos e açafrão espanhol", preco: 94.50, disponivel: true, imagem: "🦞" },
  { id: 5, categoria: "Principais", nome: "Filé à Wellington", descricao: "Filé mignon envolto em duxelles de cogumelos e massa folhada", preco: 148.00, disponivel: true, imagem: "🥩" },
  { id: 6, categoria: "Principais", nome: "Salmão en Croûte", descricao: "Salmão atlântico em crosta de ervas com purê de couve-flor trufado", preco: 112.00, disponivel: false, imagem: "🐟" },
  { id: 7, categoria: "Sobremesas", nome: "Tiramisu Clássico", descricao: "Receita original com mascarpone, espresso e cacau belga", preco: 38.00, disponivel: true, imagem: "🍰" },
  { id: 8, categoria: "Sobremesas", nome: "Fondant au Chocolat", descricao: "Bolo quente de chocolate 70% com sorvete de baunilha Madagascar", preco: 42.00, disponivel: true, imagem: "🍫" },
];

let pedidos = [
  { id: 1, mesa: 5, status: "preparando", itens: [{ menuId: 3, quantidade: 2 }, { menuId: 7, quantidade: 2 }], total: 255.80, criadoEm: new Date(Date.now() - 1800000).toISOString() },
  { id: 2, mesa: 12, status: "entregue", itens: [{ menuId: 1, quantidade: 1 }, { menuId: 5, quantidade: 2 }], total: 354.90, criadoEm: new Date(Date.now() - 3600000).toISOString() },
];

let reservas = [
  { id: 1, nome: "Isabella Rossi", email: "isabella@email.com", telefone: "(11) 99999-0001", data: "2025-04-15", hora: "20:00", pessoas: 4, status: "confirmada", observacoes: "Aniversário - decoração especial" },
  { id: 2, nome: "Marco Oliveira", email: "marco@email.com", telefone: "(11) 99999-0002", data: "2025-04-16", hora: "19:30", pessoas: 2, status: "pendente", observacoes: "" },
];

let nextMenuId = menus.length + 1;
let nextPedidoId = pedidos.length + 1;
let nextReservaId = reservas.length + 1;

// ─── HELPER ────────────────────────────────────────────────────────────────────
const now = () => new Date().toISOString();
const notFound = (res, msg) => res.status(404).json({ erro: msg });
const success = (res, data, status = 200) => res.status(status).json(data);

// ─── ROOT ──────────────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  success(res, {
    nome: "Ristorante Bellissimo API",
    versao: "1.0.0",
    endpoints: {
      menu: ["GET /api/menu", "GET /api/menu/:id", "POST /api/menu", "PUT /api/menu/:id", "DELETE /api/menu/:id"],
      pedidos: ["GET /api/pedidos", "GET /api/pedidos/:id", "POST /api/pedidos", "PUT /api/pedidos/:id", "DELETE /api/pedidos/:id"],
      reservas: ["GET /api/reservas", "GET /api/reservas/:id", "POST /api/reservas", "PUT /api/reservas/:id", "DELETE /api/reservas/:id"],
      stats: ["GET /api/stats"]
    }
  });
});

// ─── STATS ─────────────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const totalReceita = pedidos.reduce((acc, p) => acc + p.total, 0);
  success(res, {
    totalItensCardapio: menus.length,
    totalPedidos: pedidos.length,
    totalReservas: reservas.length,
    receitaTotal: totalReceita,
    pedidosAtivos: pedidos.filter(p => p.status === 'preparando').length,
    reservasHoje: reservas.filter(r => r.data === new Date().toISOString().split('T')[0]).length,
  });
});

// ─── MENU ──────────────────────────────────────────────────────────────────────
app.get('/api/menu', (req, res) => {
  const { categoria, disponivel } = req.query;
  let result = [...menus];
  if (categoria) result = result.filter(m => m.categoria.toLowerCase() === categoria.toLowerCase());
  if (disponivel !== undefined) result = result.filter(m => m.disponivel === (disponivel === 'true'));
  success(res, { total: result.length, dados: result });
});

app.get('/api/menu/:id', (req, res) => {
  const item = menus.find(m => m.id === parseInt(req.params.id));
  if (!item) return notFound(res, 'Item do cardápio não encontrado');
  success(res, item);
});

app.post('/api/menu', (req, res) => {
  const { nome, descricao, preco, categoria, imagem } = req.body;
  if (!nome || !preco || !categoria) return res.status(400).json({ erro: 'nome, preco e categoria são obrigatórios' });
  const novoItem = { id: nextMenuId++, nome, descricao: descricao || '', preco: parseFloat(preco), categoria, disponivel: true, imagem: imagem || '🍽️', criadoEm: now() };
  menus.push(novoItem);
  success(res, novoItem, 201);
});

app.put('/api/menu/:id', (req, res) => {
  const idx = menus.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, 'Item não encontrado');
  menus[idx] = { ...menus[idx], ...req.body, id: menus[idx].id, atualizadoEm: now() };
  success(res, menus[idx]);
});

app.delete('/api/menu/:id', (req, res) => {
  const idx = menus.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, 'Item não encontrado');
  const removido = menus.splice(idx, 1)[0];
  success(res, { mensagem: 'Item removido com sucesso', item: removido });
});

// ─── PEDIDOS ───────────────────────────────────────────────────────────────────
app.get('/api/pedidos', (req, res) => {
  const { status, mesa } = req.query;
  let result = [...pedidos];
  if (status) result = result.filter(p => p.status === status);
  if (mesa) result = result.filter(p => p.mesa === parseInt(mesa));
  success(res, { total: result.length, dados: result });
});

app.get('/api/pedidos/:id', (req, res) => {
  const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
  if (!pedido) return notFound(res, 'Pedido não encontrado');
  success(res, pedido);
});

app.post('/api/pedidos', (req, res) => {
  const { mesa, itens } = req.body;
  if (!mesa || !itens || !Array.isArray(itens) || itens.length === 0)
    return res.status(400).json({ erro: 'mesa e itens são obrigatórios' });
  
  let total = 0;
  for (const item of itens) {
    const menuItem = menus.find(m => m.id === item.menuId);
    if (!menuItem) return res.status(400).json({ erro: `Item de cardápio ${item.menuId} não encontrado` });
    if (!menuItem.disponivel) return res.status(400).json({ erro: `Item ${menuItem.nome} não está disponível` });
    total += menuItem.preco * item.quantidade;
  }
  
  const novoPedido = { id: nextPedidoId++, mesa, status: 'recebido', itens, total: parseFloat(total.toFixed(2)), criadoEm: now() };
  pedidos.push(novoPedido);
  success(res, novoPedido, 201);
});

app.put('/api/pedidos/:id', (req, res) => {
  const idx = pedidos.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, 'Pedido não encontrado');
  pedidos[idx] = { ...pedidos[idx], ...req.body, id: pedidos[idx].id, atualizadoEm: now() };
  success(res, pedidos[idx]);
});

app.delete('/api/pedidos/:id', (req, res) => {
  const idx = pedidos.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, 'Pedido não encontrado');
  const removido = pedidos.splice(idx, 1)[0];
  success(res, { mensagem: 'Pedido cancelado', pedido: removido });
});

// ─── RESERVAS ──────────────────────────────────────────────────────────────────
app.get('/api/reservas', (req, res) => {
  const { status, data } = req.query;
  let result = [...reservas];
  if (status) result = result.filter(r => r.status === status);
  if (data) result = result.filter(r => r.data === data);
  success(res, { total: result.length, dados: result });
});

app.get('/api/reservas/:id', (req, res) => {
  const reserva = reservas.find(r => r.id === parseInt(req.params.id));
  if (!reserva) return notFound(res, 'Reserva não encontrada');
  success(res, reserva);
});

app.post('/api/reservas', (req, res) => {
  const { nome, email, telefone, data, hora, pessoas } = req.body;
  if (!nome || !email || !data || !hora || !pessoas)
    return res.status(400).json({ erro: 'nome, email, data, hora e pessoas são obrigatórios' });
  const novaReserva = { id: nextReservaId++, nome, email, telefone: telefone || '', data, hora, pessoas: parseInt(pessoas), status: 'pendente', observacoes: req.body.observacoes || '', criadoEm: now() };
  reservas.push(novaReserva);
  success(res, novaReserva, 201);
});

app.put('/api/reservas/:id', (req, res) => {
  const idx = reservas.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, 'Reserva não encontrada');
  reservas[idx] = { ...reservas[idx], ...req.body, id: reservas[idx].id, atualizadoEm: now() };
  success(res, reservas[idx]);
});

app.delete('/api/reservas/:id', (req, res) => {
  const idx = reservas.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return notFound(res, 'Reserva não encontrada');
  const removida = reservas.splice(idx, 1)[0];
  success(res, { mensagem: 'Reserva cancelada', reserva: removida });
});

// ─── START ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✨ Ristorante Bellissimo API rodando em http://localhost:${PORT}`);
  console.log(`📋 Documentação: http://localhost:${PORT}/api`);
  console.log(`🌐 Interface: http://localhost:${PORT}\n`);
});
