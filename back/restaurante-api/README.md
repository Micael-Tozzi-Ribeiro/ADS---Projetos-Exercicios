# 🍽️ Ristorante Bellissimo · REST API

API REST completa para restaurante com interface de testes moderna e animada.

## 🚀 Como Iniciar

### 1. Instale as dependências
```bash
npm install
```

### 2. Inicie o servidor
```bash
node server.js
```
> Ou com hot-reload: `npx nodemon server.js`

### 3. Acesse
- **Interface de Testes:** http://localhost:3000
- **API Root:** http://localhost:3000/api

---

## 📋 Endpoints

### Geral
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api` | Info da API + lista de endpoints |
| GET | `/api/stats` | Estatísticas gerais |

### Cardápio (`/api/menu`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/menu` | Lista todos os itens |
| GET | `/api/menu?categoria=Massas` | Filtra por categoria |
| GET | `/api/menu?disponivel=true` | Filtra por disponibilidade |
| GET | `/api/menu/:id` | Busca item por ID |
| POST | `/api/menu` | Cria novo item |
| PUT | `/api/menu/:id` | Atualiza item |
| DELETE | `/api/menu/:id` | Remove item |

**POST /api/menu — body:**
```json
{
  "nome": "Bruschetta al Pomodoro",
  "descricao": "Pão artesanal com tomate fresco",
  "preco": 34.90,
  "categoria": "Entradas",
  "imagem": "🍞"
}
```

### Pedidos (`/api/pedidos`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/pedidos` | Lista todos |
| GET | `/api/pedidos?status=preparando` | Filtra por status |
| GET | `/api/pedidos?mesa=5` | Filtra por mesa |
| GET | `/api/pedidos/:id` | Busca por ID |
| POST | `/api/pedidos` | Cria pedido |
| PUT | `/api/pedidos/:id` | Atualiza (ex: muda status) |
| DELETE | `/api/pedidos/:id` | Cancela pedido |

**POST /api/pedidos — body:**
```json
{
  "mesa": 8,
  "itens": [
    { "menuId": 3, "quantidade": 2 },
    { "menuId": 7, "quantidade": 1 }
  ]
}
```

**Status disponíveis:** `recebido` | `preparando` | `pronto` | `entregue` | `cancelado`

### Reservas (`/api/reservas`)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/reservas` | Lista todas |
| GET | `/api/reservas?status=confirmada` | Filtra por status |
| GET | `/api/reservas?data=2025-04-15` | Filtra por data |
| GET | `/api/reservas/:id` | Busca por ID |
| POST | `/api/reservas` | Cria reserva |
| PUT | `/api/reservas/:id` | Atualiza |
| DELETE | `/api/reservas/:id` | Cancela |

**POST /api/reservas — body:**
```json
{
  "nome": "Valentina Ferrari",
  "email": "valentina@email.com",
  "telefone": "(11) 98765-4321",
  "data": "2025-04-20",
  "hora": "21:00",
  "pessoas": 4,
  "observacoes": "Aniversário"
}
```

---

## ⌨️ Atalhos da Interface
- **Ctrl/Cmd + Enter** — Enviar requisição

## 📦 Estrutura
```
restaurante-api/
├── server.js        # API Express
├── package.json
├── README.md
└── public/
    └── index.html   # Interface de testes
```
