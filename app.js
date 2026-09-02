const DEFAULT_WHATSAPP_NUMBER = "554498155843";
const CATALOG_KEY = "artCostCatalog";
const SETTINGS_KEY = "artCostSettings";
const ORDERS_KEY = "artCostOrders";
const CASHFLOW_KEY = "artCostCashflow";
const ADMIN_HASH = "ebec06905f9b68b38f09dcf72afbd4992696951bd6411d5b3dfb16001c5e9754";
const ADMIN_ATTEMPTS_KEY = "artCostAdminAttempts";
const ADMIN_LOCK_KEY = "artCostAdminLock";
const ADMIN_SESSION_KEY = "artCostAdminSession";
const ADMIN_MAX_ATTEMPTS = 5;
const ADMIN_LOCK_MINUTES = 15;
const ADMIN_SESSION_HOURS = 8;

const starterProducts = [
  {
    id: "bombeira",
    name: "Conjunto Fantasia Bombeira",
    price: 85,
    type: "locacao",
    audience: "adulto",
    gender: "feminino",
    theme: "tematico",
    sizes: "P, M, G",
    color: "#b3202a",
    icon: "B",
    image: "",
    reservations: [],
    description: "Conjunto temático com saia vermelha, camiseta e acessórios para festa a fantasia.",
  },
  {
    id: "chapeuzinho",
    name: "Chapeuzinho Vermelho",
    price: 95,
    type: "locacao",
    audience: "adulto",
    gender: "feminino",
    theme: "tematico",
    sizes: "P, M",
    color: "#9e1f28",
    icon: "C",
    image: "",
    reservations: [
      {
        id: "demo-chapeuzinho",
        start: "2026-09-12T10:00",
        end: "2026-09-14T18:00",
        reason: "Reserva exemplo",
      },
    ],
    description: "Fantasia com capa vermelha, saia e acabamento de ateliê para eventos e ensaios.",
  },
  {
    id: "fada",
    name: "Fantasia Fada Sininho",
    price: 95,
    type: "locacao",
    audience: "infantil",
    gender: "feminino",
    theme: "tematico",
    sizes: "Infantil 6, 8, 10",
    color: "#0f7f5c",
    icon: "F",
    image: "",
    reservations: [],
    description: "Vestido verde com visual encantado, ideal para festa infantil e tema fantasia.",
  },
  {
    id: "marinheira",
    name: "Conjunto Marinheira Princesa",
    price: 90,
    type: "locacao",
    audience: "adulto",
    gender: "feminino",
    theme: "tematico",
    sizes: "M, G",
    color: "#1d4f8f",
    icon: "M",
    image: "",
    reservations: [],
    description: "Look temático azul e branco com composição delicada para festas e apresentações.",
  },
  {
    id: "atelie",
    name: "Vestido de Ateliê",
    price: 180,
    type: "venda",
    audience: "todos",
    gender: "feminino",
    theme: "atelie",
    sizes: "Sob medida",
    color: "#6f3d7b",
    icon: "A",
    image: "",
    reservations: [],
    description: "Peça de ateliê para venda, com ajustes e detalhes definidos pelo atendimento.",
  },
  {
    id: "carnaval",
    name: "Look Carnaval Dourado",
    price: 120,
    type: "ambos",
    audience: "todos",
    gender: "unissex",
    theme: "tematico",
    sizes: "P, M, G, GG",
    color: "#c9902e",
    icon: "L",
    image: "",
    reservations: [],
    description: "Look versátil para venda ou locação, com brilho e acabamento em tons dourados.",
  },
];

const state = {
  products: loadProducts(),
  settings: loadSettings(),
  orders: loadOrders(),
  cashflow: loadCashflow(),
  filter: "todos",
  adminProductSearch: "",
  orderStatusFilter: "todos",
  orderDateField: "createdAt",
  orderDateStart: "",
  orderDateEnd: "",
  selectedProductId: null,
};

const catalogGrid = document.querySelector("#catalogGrid");
const searchInput = document.querySelector("#searchInput");
const bookingProduct = document.querySelector("#bookingProduct");
const bookingMode = document.querySelector("#bookingMode");
const bookingForm = document.querySelector("#bookingForm");
const availabilityMessage = document.querySelector("#availabilityMessage");
const messagePreview = document.querySelector("#messagePreview");
const cartCount = document.querySelector("#cartCount");
const drawer = document.querySelector("#drawer");
const dialog = document.querySelector("#productDialog");
const adminList = document.querySelector("#adminList");
const adminStats = document.querySelector("#adminStats");
const ordersList = document.querySelector("#ordersList");
const orderSummary = document.querySelector("#orderSummary");
const adminProductSearch = document.querySelector("#adminProductSearch");
const orderStatusFilter = document.querySelector("#orderStatusFilter");
const orderDateField = document.querySelector("#orderDateField");
const orderDateStart = document.querySelector("#orderDateStart");
const orderDateEnd = document.querySelector("#orderDateEnd");
const cashflowList = document.querySelector("#cashflowList");
const financeSummary = document.querySelector("#financeSummary");
const blockProduct = document.querySelector("#blockProduct");
const adminLock = document.querySelector("#adminLock");
const adminContent = document.querySelector("#adminContent");
const adminImage = document.querySelector("#adminImage");
const adminImageFile = document.querySelector("#adminImageFile");
const imagePreview = document.querySelector("#imagePreview");
const backupStatus = document.querySelector("#backupStatus");
const csvStatus = document.querySelector("#csvStatus");
let selectedImageData = "";
let editingProductId = "";

function loadProducts() {
  const saved = localStorage.getItem(CATALOG_KEY);
  const products = saved ? JSON.parse(saved) : starterProducts;
  return products.map((product) => ({
    reservations: [],
    theme: "tematico",
    gender: "unissex",
    image: "",
    ...product,
  }));
}

function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  return saved ? JSON.parse(saved) : { whatsapp: DEFAULT_WHATSAPP_NUMBER };
}

function loadOrders() {
  const saved = localStorage.getItem(ORDERS_KEY);
  const orders = saved ? JSON.parse(saved) : [];
  return orders.map((order) => ({
    status: "solicitado",
    customerPhone: "",
    eventDate: "",
    desiredSize: "",
    rentalStart: "",
    rentalEnd: "",
    ...order,
  }));
}

function loadCashflow() {
  const saved = localStorage.getItem(CASHFLOW_KEY);
  const entries = saved ? JSON.parse(saved) : [];
  return entries.map((entry) => ({
    id: `cash-${Date.now()}`,
    date: todayDateValue(),
    type: "entrada",
    category: "locacao",
    description: "",
    amount: 0,
    sourceOrderId: "",
    ...entry,
  }));
}

function saveProducts() {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(state.products));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function saveOrders() {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders));
}

function saveCashflow() {
  localStorage.setItem(CASHFLOW_KEY, JSON.stringify(state.cashflow));
}

function setBackupStatus(message) {
  if (!backupStatus) return;
  backupStatus.textContent = message;
}

function setCsvStatus(message) {
  if (!csvStatus) return;
  csvStatus.textContent = message;
}

function downloadTextFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function csvEscape(value) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseCsv(text) {
  const rows = [];
  let cell = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function productFromCsvRow(headers, row) {
  const data = Object.fromEntries(headers.map((header, index) => [normalizeText(header), row[index] || ""]));
  const name = data.nome || data.name || "";
  if (!name.trim()) return null;

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}-${normalizeText(name).replace(/\W+/g, "-")}`,
    name: name.trim(),
    price: Number(String(data.preco || data.price || "0").replace(",", ".")) || 0,
    type: normalizeText(data.tipo || data.type || "locacao") || "locacao",
    audience: normalizeText(data.publico || data.audience || "todos") || "todos",
    gender: normalizeText(data.genero || data.gender || "unissex") || "unissex",
    theme: normalizeText(data.tema || data.theme || "tematico") || "tematico",
    sizes: data.tamanhos || data.sizes || "Consultar",
    color: data.cor || data.color || "#b3202a",
    icon: name.trim().charAt(0).toUpperCase(),
    image: data.imagem || data.image || "",
    reservations: [],
    description: data.descricao || data.description || "Item importado pela planilha da Art & Cost.",
  };
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function rentalDays(start, end) {
  if (!start || !end) return 1;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) return 1;
  return Math.max(1, Math.ceil((endDate - startDate) / 86400000));
}

function orderTotal(order) {
  return Number(order.totalPrice ?? order.price ?? 0) || 0;
}

function orderDailyPrice(order) {
  return Number(order.dailyPrice ?? order.price ?? 0) || 0;
}

function orderValueDetails(order) {
  if (order.mode !== "locacao") return `Valor: ${money(orderTotal(order))}`;
  const days = Number(order.rentalDays || 1);
  return `Diária: ${money(orderDailyPrice(order))} | ${days} ${days === 1 ? "diária" : "diárias"} | Total: ${money(orderTotal(order))}`;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function sanitizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function adminSessionValid() {
  const expiresAt = Number(sessionStorage.getItem(ADMIN_SESSION_KEY) || 0);
  return expiresAt > Date.now();
}

function unlockAdmin() {
  if (!adminLock || !adminContent) return;
  adminLock.style.display = "none";
  adminContent.classList.remove("locked");
}

function lockAdminUntil() {
  return Number(localStorage.getItem(ADMIN_LOCK_KEY) || 0);
}

function lockRemainingMinutes() {
  const remaining = Math.ceil((lockAdminUntil() - Date.now()) / 60000);
  return Math.max(remaining, 1);
}

function adminIsTemporarilyLocked() {
  return lockAdminUntil() > Date.now();
}

function recordFailedAdminAttempt() {
  const attempts = Number(localStorage.getItem(ADMIN_ATTEMPTS_KEY) || 0) + 1;
  if (attempts >= ADMIN_MAX_ATTEMPTS) {
    localStorage.setItem(ADMIN_LOCK_KEY, String(Date.now() + ADMIN_LOCK_MINUTES * 60000));
    localStorage.removeItem(ADMIN_ATTEMPTS_KEY);
    return true;
  }
  localStorage.setItem(ADMIN_ATTEMPTS_KEY, String(attempts));
  return false;
}

function resetAdminAttempts() {
  localStorage.removeItem(ADMIN_ATTEMPTS_KEY);
  localStorage.removeItem(ADMIN_LOCK_KEY);
}

function typeLabel(product) {
  if (product.type === "ambos") return "Venda e locação";
  return product.type === "venda" ? "Venda" : "Locação";
}

function productPriceLabel(product) {
  if (product.type === "venda") return money(product.price);
  return `${money(product.price)} / diária`;
}

function audienceLabel(product) {
  if (product.audience === "todos") return "Todas as idades";
  return product.audience === "infantil" ? "Infantil" : "Adulto";
}

function genderLabel(product) {
  if (product.gender === "feminino") return "Feminino";
  if (product.gender === "masculino") return "Masculino";
  return "Unissex";
}

function productMatches(product) {
  const term = normalizeText(searchInput.value);
  let inFilter = state.filter === "todos";
  if (state.filter === "locacao" || state.filter === "venda") {
    inFilter = product.type === state.filter || product.type === "ambos";
  }
  if (state.filter === "infantil" || state.filter === "adulto") {
    inFilter = product.audience === state.filter || product.audience === "todos";
  }
  if (state.filter === "feminino" || state.filter === "masculino") {
    inFilter = product.gender === state.filter || product.gender === "unissex";
  }
  if (state.filter === "tematico") {
    inFilter = product.theme === "tematico";
  }
  const searchable = [
    product.name,
    product.description,
    product.sizes,
    product.theme,
    typeLabel(product),
    audienceLabel(product),
    genderLabel(product),
  ];

  return inFilter && (!term || normalizeText(searchable.join(" ")).includes(term));
}

function makeDateTime(dateId, timeId) {
  const date = document.querySelector(dateId).value;
  const time = document.querySelector(timeId).value;
  return date && time ? `${date}T${time}` : "";
}

function periodsOverlap(firstStart, firstEnd, secondStart, secondEnd) {
  return new Date(firstStart) < new Date(secondEnd) && new Date(firstEnd) > new Date(secondStart);
}

function findConflict(product, start, end) {
  if (!start || !end || new Date(start) >= new Date(end)) return null;
  return (product.reservations || []).find((reservation) =>
    periodsOverlap(start, end, reservation.start, reservation.end)
  );
}

function orderReservationId(orderId) {
  return `order-block-${orderId}`;
}

function removeOrderReservation(orderId) {
  let changed = false;
  state.products = state.products.map((product) => {
    const reservations = product.reservations || [];
    const nextReservations = reservations.filter((reservation) => reservation.id !== orderReservationId(orderId));
    const productChanged = nextReservations.length !== reservations.length;
    if (productChanged) changed = true;
    return productChanged ? { ...product, reservations: nextReservations } : product;
  });
  if (changed) saveProducts();
}

function syncOrderReservation(order) {
  removeOrderReservation(order.id);
  if (order.status !== "reservado" || order.mode !== "locacao" || !order.rentalStart || !order.rentalEnd) return true;

  const product = state.products.find((item) => item.id === order.productId);
  if (!product) return true;
  const conflict = findConflict(product, order.rentalStart, order.rentalEnd);
  if (conflict) {
    alert(`Não foi possível reservar. Já existe bloqueio neste período: ${conflict.reason || "reserva"}.`);
    return false;
  }

  state.products = state.products.map((product) => {
    if (product.id !== order.productId) return product;
    return {
      ...product,
      reservations: [
        ...(product.reservations || []),
        {
          id: orderReservationId(order.id),
          start: order.rentalStart,
          end: order.rentalEnd,
          reason: `Reserva - ${order.customerName}`,
        },
      ],
    };
  });
  saveProducts();
  return true;
}

function availabilityText(product) {
  const hasBlocks = (product.reservations || []).length > 0;
  return {
    label: hasBlocks ? "Verificar datas" : "Disponível",
    blocked: hasBlocks,
  };
}

function mediaMarkup(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}" loading="lazy" />`;
  }

  return `<span class="product-figure">${product.icon}</span>`;
}

function updateImagePreview(value) {
  if (!imagePreview) return;
  imagePreview.classList.toggle("empty", !value);
  imagePreview.innerHTML = value
    ? `<img src="${value}" alt="Prévia da fantasia" />`
    : "Prévia da imagem";
}

function setImageSource(source) {
  if (!document.querySelector(".image-tab.active")) return;
  document.querySelector(".image-tab.active").classList.remove("active");
  document.querySelector(`[data-image-source="${source}"]`).classList.add("active");
  document.querySelectorAll(".image-source").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.sourcePanel === source);
  });
}

function resetAdminForm() {
  if (!document.querySelector("#adminForm")) return;
  document.querySelector("#adminForm").reset();
  editingProductId = "";
  selectedImageData = "";
  setImageSource("url");
  updateImagePreview("");
  document.querySelector("#adminColor").value = "#b3202a";
  document.querySelector("#adminSubmit").textContent = "Adicionar ao catálogo";
  document.querySelector("#cancelEdit").classList.add("hidden-control");
}

function fillAdminForm(product) {
  if (!document.querySelector("#adminForm")) return;
  editingProductId = product.id;
  document.querySelector("#adminName").value = product.name;
  document.querySelector("#adminPrice").value = product.price;
  document.querySelector("#adminType").value = product.type;
  document.querySelector("#adminAudience").value = product.audience;
  document.querySelector("#adminGender").value = product.gender || "unissex";
  document.querySelector("#adminSizes").value = product.sizes;
  document.querySelector("#adminTheme").value = product.theme || "";
  document.querySelector("#adminColor").value = product.color || "#b3202a";
  document.querySelector("#adminDescription").value = product.description || "";
  selectedImageData = product.image && product.image.startsWith("data:") ? product.image : "";
  adminImage.value = product.image && !product.image.startsWith("data:") ? product.image : "";
  setImageSource(selectedImageData ? "file" : "url");
  updateImagePreview(product.image || "");
  document.querySelector("#adminSubmit").textContent = "Salvar alterações";
  document.querySelector("#cancelEdit").classList.remove("hidden-control");
  document.querySelector("#adminForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCatalog() {
  if (!catalogGrid || !searchInput) return;
  const products = state.products.filter(productMatches);
  catalogGrid.innerHTML = products
    .map((product) => {
      const status = availabilityText(product);
      return `
        <article class="product-card" data-id="${product.id}" tabindex="0">
          <div class="product-image" style="background: linear-gradient(145deg, ${product.color}, #111);">
            <span class="status-pill ${status.blocked ? "blocked" : ""}">${status.label}</span>
            <span class="tag">${typeLabel(product)}</span>
            ${mediaMarkup(product)}
            <button class="product-add" type="button" aria-label="Reservar ${product.name}" data-reserve="${product.id}">+</button>
          </div>
          <h3>${product.name}</h3>
          <div class="price">${productPriceLabel(product)}</div>
          <div class="meta">${product.sizes} | ${audienceLabel(product)} | ${genderLabel(product)}</div>
        </article>
      `;
    })
    .join("");

  if (!products.length) {
    catalogGrid.innerHTML = `<p class="empty-state">Nenhuma fantasia encontrada para este filtro.</p>`;
  }
}

function renderBookingOptions() {
  const options = state.products
    .map(
      (product) =>
        `<option value="${product.id}">${product.name} - ${productPriceLabel(product)}</option>`
    )
    .join("");

  if (bookingProduct) bookingProduct.innerHTML = options;
  if (blockProduct) blockProduct.innerHTML = options;
  renderBookingModes();
}

function renderAdminList() {
  if (!adminList) return;
  const term = normalizeText(state.adminProductSearch);
  const products = state.products.filter((product) =>
    !term ||
    normalizeText([
      product.name,
      product.description,
      product.sizes,
      product.theme,
      typeLabel(product),
      audienceLabel(product),
      genderLabel(product),
    ].join(" ")).includes(term)
  );

  if (!products.length) {
    adminList.innerHTML = `<p class="empty-admin">Nenhum item encontrado para essa busca.</p>`;
    return;
  }

  adminList.innerHTML = products
    .map((product) => {
      const reservations = (product.reservations || [])
        .map(
          (reservation) => `
            <div class="reservation-row">
              <span>${reservation.reason || "Bloqueio"}: ${formatDateTime(reservation.start)} até ${formatDateTime(reservation.end)}</span>
              <button class="admin-unblock" type="button" data-unblock-product="${product.id}" data-unblock="${reservation.id}">Liberar</button>
            </div>
          `
        )
        .join("");

      return `
        <article class="admin-item">
          <div>
            <strong>${product.name}</strong>
            <span>${typeLabel(product)} | ${money(product.price)} | ${product.sizes} | ${genderLabel(product)}</span>
            ${reservations || "<span>Sem bloqueios de data.</span>"}
          </div>
          <div class="admin-actions">
            <button class="admin-edit" type="button" data-edit="${product.id}">Editar</button>
            <button class="admin-delete" type="button" data-delete="${product.id}">Remover</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function orderMatchesFilters(order) {
  const statusMatch = state.orderStatusFilter === "todos" || order.status === state.orderStatusFilter;
  const sourceDate = state.orderDateField === "eventDate" ? order.eventDate : order.createdAt;
  const dateValue = String(sourceDate || "").slice(0, 10);
  const afterStart = !state.orderDateStart || (dateValue && dateValue >= state.orderDateStart);
  const beforeEnd = !state.orderDateEnd || (dateValue && dateValue <= state.orderDateEnd);
  return statusMatch && afterStart && beforeEnd;
}

function getFilteredOrders() {
  return state.orders.filter(orderMatchesFilters);
}

function renderOrderSummary(orders) {
  if (!orderSummary) return;
  const rentals = orders.filter((order) => order.mode === "locacao").length;
  const sales = orders.filter((order) => order.mode === "venda").length;
  const open = orders.filter((order) => !["devolvido", "cancelado"].includes(order.status)).length;
  const total = orders.reduce((sum, order) => sum + orderTotal(order), 0);

  orderSummary.innerHTML = `
    <article>
      <span>Filtradas</span>
      <strong>${orders.length}</strong>
    </article>
    <article>
      <span>Locações</span>
      <strong>${rentals}</strong>
    </article>
    <article>
      <span>Vendas</span>
      <strong>${sales}</strong>
    </article>
    <article>
      <span>Em andamento</span>
      <strong>${open}</strong>
    </article>
    <article>
      <span>Valor previsto</span>
      <strong>${money(total)}</strong>
    </article>
  `;
}

function renderOrdersList() {
  if (!ordersList) return;
  const orders = getFilteredOrders();
  renderOrderSummary(orders);

  if (!state.orders.length) {
    ordersList.innerHTML = `<p class="empty-admin">Nenhuma solicitação registrada ainda.</p>`;
    return;
  }

  if (!orders.length) {
    ordersList.innerHTML = `<p class="empty-admin">Nenhuma solicitação encontrada para este status.</p>`;
    return;
  }

  ordersList.innerHTML = orders
    .map(
      (order) => {
        const hasCashflow = state.cashflow.some((entry) => entry.sourceOrderId === order.id);
        return `
        <article class="admin-item">
          <div>
            <strong>${order.customerName} - ${order.productName}</strong>
            <span>${order.modeLabel} | ${orderValueDetails(order)} | ${formatDateTime(order.createdAt)} | ${statusLabel(order.status)}</span>
            <span>${order.customerPhone || "Sem telefone"} | Evento: ${formatDateOnly(order.eventDate) || "Não informado"} | Tamanho: ${order.desiredSize || "Não informado"}</span>
            <span>${order.period || "Pedido de compra"} | ${order.notes}</span>
          </div>
          <div class="admin-actions">
            <button class="admin-edit" type="button" data-order-cashflow="${order.id}" ${hasCashflow ? "disabled" : ""}>${hasCashflow ? "Lançado" : "Lançar entrada"}</button>
            <select class="status-select" data-order-status="${order.id}" aria-label="Status da solicitação">
              ${orderStatusOptions(order.status)}
            </select>
            <button class="admin-delete" type="button" data-delete-order="${order.id}">Remover</button>
          </div>
        </article>
      `;
      }
    )
    .join("");
}

function renderAdminStats() {
  if (!adminStats) return;
  const total = state.products.length;
  const rentals = state.products.filter((product) => product.type === "locacao" || product.type === "ambos").length;
  const sales = state.products.filter((product) => product.type === "venda" || product.type === "ambos").length;
  const blocks = state.products.reduce(
    (sum, product) => sum + (product.reservations || []).length,
    0
  );
  const orders = state.orders.length;

  adminStats.innerHTML = `
    <article class="admin-stat">
      <span>Itens</span>
      <strong>${total}</strong>
    </article>
    <article class="admin-stat">
      <span>Locação</span>
      <strong>${rentals}</strong>
    </article>
    <article class="admin-stat">
      <span>Venda</span>
      <strong>${sales}</strong>
    </article>
    <article class="admin-stat">
      <span>Bloqueios</span>
      <strong>${blocks}</strong>
    </article>
    <article class="admin-stat">
      <span>Solicitações</span>
      <strong>${orders}</strong>
    </article>
  `;
}

function cashflowTypeLabel(type) {
  return type === "saida" ? "Saída" : "Entrada";
}

function cashflowCategoryLabel(category) {
  const labels = {
    locacao: "Locação",
    venda: "Venda",
    ajuste: "Ajuste",
    manutencao: "Manutenção",
    outros: "Outros",
  };
  return labels[category] || "Outros";
}

function renderCashflow() {
  if (!cashflowList || !financeSummary) return;
  const entries = [...state.cashflow].sort((first, second) =>
    String(second.date).localeCompare(String(first.date))
  );
  const totals = entries.reduce(
    (summary, entry) => {
      const amount = Number(entry.amount) || 0;
      if (entry.type === "saida") summary.out += amount;
      else summary.in += amount;
      return summary;
    },
    { in: 0, out: 0 }
  );
  const balance = totals.in - totals.out;

  financeSummary.innerHTML = `
    <article>
      <span>Entradas</span>
      <strong>${money(totals.in)}</strong>
    </article>
    <article>
      <span>Saídas</span>
      <strong>${money(totals.out)}</strong>
    </article>
    <article>
      <span>Saldo</span>
      <strong>${money(balance)}</strong>
    </article>
  `;

  if (!entries.length) {
    cashflowList.innerHTML = `
      <tr>
        <td colspan="6">Nenhum lançamento registrado ainda.</td>
      </tr>
    `;
    return;
  }

  cashflowList.innerHTML = entries
    .map(
      (entry) => `
        <tr>
          <td>${formatDateOnly(entry.date)}</td>
          <td><span class="cashflow-badge ${entry.type}">${cashflowTypeLabel(entry.type)}</span></td>
          <td>${cashflowCategoryLabel(entry.category)}</td>
          <td>${entry.description}</td>
          <td>${money(Number(entry.amount) || 0)}</td>
          <td><button class="admin-delete" type="button" data-delete-cashflow="${entry.id}">Remover</button></td>
        </tr>
      `
    )
    .join("");
}

function addCashflowFromOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order || state.cashflow.some((entry) => entry.sourceOrderId === order.id)) return;

  state.cashflow.unshift({
    id: `cash-${Date.now()}`,
    date: todayDateValue(),
    type: "entrada",
    category: order.mode === "venda" ? "venda" : "locacao",
    description: `${order.modeLabel} - ${order.productName} - ${order.customerName}`,
    amount: orderTotal(order),
    sourceOrderId: order.id,
  });

  saveCashflow();
  renderOrdersList();
  renderCashflow();
}

function exportCashflowCsv() {
  const headers = ["data", "tipo", "categoria", "descricao", "valor"];
  const rows = [...state.cashflow]
    .sort((first, second) => String(first.date).localeCompare(String(second.date)))
    .map((entry) => [
      entry.date,
      cashflowTypeLabel(entry.type),
      cashflowCategoryLabel(entry.category),
      entry.description,
      String(Number(entry.amount || 0).toFixed(2)).replace(".", ","),
    ]);
  const csv = `${headers.join(";")}\n${rows.map((row) => row.map(csvEscape).join(";")).join("\n")}\n`;
  downloadTextFile(
    `art-cost-fluxo-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
    "text/csv;charset=utf-8"
  );
}

function printCashflowPdf() {
  const entries = [...state.cashflow].sort((first, second) =>
    String(first.date).localeCompare(String(second.date))
  );
  const totals = entries.reduce(
    (summary, entry) => {
      const amount = Number(entry.amount) || 0;
      if (entry.type === "saida") summary.out += amount;
      else summary.in += amount;
      return summary;
    },
    { in: 0, out: 0 }
  );
  const balance = totals.in - totals.out;
  const rows = entries.length
    ? entries
        .map(
          (entry) => `
            <tr>
              <td>${escapeHtml(formatDateOnly(entry.date))}</td>
              <td>${escapeHtml(cashflowTypeLabel(entry.type))}</td>
              <td>${escapeHtml(cashflowCategoryLabel(entry.category))}</td>
              <td>${escapeHtml(entry.description)}</td>
              <td class="money">${escapeHtml(money(Number(entry.amount) || 0))}</td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="5">Nenhum lançamento registrado.</td></tr>`;
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) return;

  reportWindow.document.write(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Fluxo financeiro | Art & Cost</title>
        <style>
          * { box-sizing: border-box; }
          body { color: #1e1d1a; font-family: Arial, sans-serif; margin: 0; padding: 32px; }
          header { align-items: center; border-bottom: 2px solid #d8a74a; display: flex; gap: 18px; margin-bottom: 24px; padding-bottom: 18px; }
          header img { background: #080706; height: 78px; object-fit: contain; padding: 8px; width: 180px; }
          h1 { font-size: 24px; margin: 0 0 8px; }
          p { color: #716a5f; margin: 0; }
          .summary { display: grid; gap: 10px; grid-template-columns: repeat(3, 1fr); margin: 24px 0; }
          .summary div { border: 1px solid #e6dccb; border-radius: 8px; padding: 14px; }
          .summary span { color: #716a5f; display: block; font-size: 11px; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; }
          .summary strong { font-size: 20px; }
          table { border-collapse: collapse; margin-top: 16px; width: 100%; }
          th, td { border-bottom: 1px solid #e6dccb; font-size: 12px; padding: 10px 8px; text-align: left; vertical-align: top; }
          th { background: #f5f1e9; color: #716a5f; text-transform: uppercase; }
          .money { text-align: right; white-space: nowrap; }
          @media print { body { padding: 18mm; } }
        </style>
      </head>
      <body>
        <header>
          <img src="${window.location.origin}/assets/logo-art-cost-banner.png" alt="Art & Cost" />
          <div>
            <h1>Fluxo de entradas e saídas</h1>
            <p>Relatório gerado em ${escapeHtml(formatDateTime(new Date().toISOString()))}</p>
          </div>
        </header>
        <section class="summary">
          <div><span>Entradas</span><strong>${escapeHtml(money(totals.in))}</strong></div>
          <div><span>Saídas</span><strong>${escapeHtml(money(totals.out))}</strong></div>
          <div><span>Saldo</span><strong>${escapeHtml(money(balance))}</strong></div>
        </section>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th class="money">Valor</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
}

function exportOrdersCsv() {
  const headers = [
    "data_solicitacao",
    "status",
    "cliente",
    "telefone",
    "produto",
    "tipo",
    "data_evento",
    "periodo",
    "diaria",
    "quantidade_diarias",
    "tamanho",
    "valor_total",
    "observacoes",
  ];
  const rows = getFilteredOrders().map((order) => [
    formatDateTime(order.createdAt),
    statusLabel(order.status),
    order.customerName,
    order.customerPhone,
    order.productName,
    order.modeLabel,
    formatDateOnly(order.eventDate) || "",
    order.period || "",
    order.mode === "locacao" ? String(orderDailyPrice(order).toFixed(2)).replace(".", ",") : "",
    order.mode === "locacao" ? order.rentalDays || 1 : "",
    order.desiredSize || "",
    String(orderTotal(order).toFixed(2)).replace(".", ","),
    order.notes || "",
  ]);
  const csv = `${headers.join(";")}\n${rows.map((row) => row.map(csvEscape).join(";")).join("\n")}\n`;
  downloadTextFile(
    `art-cost-solicitacoes-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
    "text/csv;charset=utf-8"
  );
}

function refreshAll() {
  renderCatalog();
  renderBookingOptions();
  renderAdminList();
  renderOrdersList();
  renderAdminStats();
  renderCashflow();
  updateRentalFields();
  updateAvailabilityMessage();
  updateMessagePreview();
}

function syncAdminVisibility() {
  const path = window.location.pathname.replace(/\/$/, "");
  const isAdminPage = path.endsWith("/admin") || path.endsWith("/admin.html") || window.location.hash === "#admin";
  document.body.classList.toggle("admin-visible", isAdminPage);
}

function selectProduct(productId) {
  if (!bookingProduct || !cartCount) return;
  state.selectedProductId = productId;
  bookingProduct.value = productId;
  renderBookingModes();
  updateRentalFields();
  cartCount.textContent = "1";
  updateAvailabilityMessage();
  document.querySelector("#pedido").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderBookingModes() {
  if (!bookingProduct || !bookingMode) return;
  const product = state.products.find((item) => item.id === bookingProduct.value) || state.products[0];
  if (!product) return;

  if (product.type === "venda") {
    bookingMode.innerHTML = `<option value="venda">Compra</option>`;
    return;
  }

  if (product.type === "ambos") {
    bookingMode.innerHTML = `
      <option value="locacao">Locação</option>
      <option value="venda">Compra</option>
    `;
    return;
  }

  bookingMode.innerHTML = `<option value="locacao">Locação</option>`;
}

function updateRentalFields() {
  if (!bookingMode) return;
  const isRental = bookingMode.value === "locacao";
  document.querySelectorAll(".rental-field").forEach((field) => {
    field.classList.toggle("hidden", !isRental);
    field.querySelector("input").required = isRental;
  });
}

function openProduct(productId) {
  if (!dialog) return;
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  const dialogMedia = document.querySelector("#dialogMedia");
  dialogMedia.style.background = `linear-gradient(145deg, ${product.color}, #111)`;
  dialogMedia.innerHTML = mediaMarkup(product);
  document.querySelector("#dialogType").textContent = typeLabel(product);
  document.querySelector("#dialogTitle").textContent = product.name;
  document.querySelector("#dialogDescription").textContent = product.description;
  document.querySelector("#dialogPrice").textContent = productPriceLabel(product);
  document.querySelector("#dialogSizes").textContent = product.sizes;
  document.querySelector("#dialogReserve").dataset.id = product.id;
  dialog.showModal();
}

function whatsappUrl(message) {
  return `https://wa.me/${state.settings.whatsapp}?text=${encodeURIComponent(message)}`;
}

function buildBookingMessage() {
  if (!bookingProduct || !bookingMode) return "";
  const product = state.products.find((item) => item.id === bookingProduct.value);
  if (!product) return "";
  const customerName = document.querySelector("#customerName").value || "Cliente";
  const customerPhone = document.querySelector("#customerPhone").value || "Não informado";
  const eventDate = document.querySelector("#eventDate").value;
  const desiredSize = document.querySelector("#desiredSize").value || "Não informado";
  const start = makeDateTime("#startDate", "#pickupTime");
  const end = makeDateTime("#endDate", "#returnTime");
  const notes = document.querySelector("#bookingNotes").value || "Sem observações";
  const days = rentalDays(start, end);
  const totalPrice = product.price * days;

  if (bookingMode.value === "venda") {
    return `Olá! Tenho interesse em comprar com a Art & Cost.

Cliente: ${customerName}
Telefone: ${customerPhone}
Item: ${product.name}
Tipo: Compra
Valor: ${money(product.price)}
Data do evento: ${formatDateOnly(eventDate) || "Não informada"}
Tamanho desejado: ${desiredSize}
Tamanhos disponíveis: ${product.sizes}
Observações: ${notes}`;
  }

  return `Olá! Tenho interesse em reservar com a Art & Cost.

Cliente: ${customerName}
Telefone: ${customerPhone}
Item: ${product.name}
Tipo: ${typeLabel(product)}
Diária: ${money(product.price)}
Quantidade de diárias: ${days}
Valor total previsto: ${money(totalPrice)}
Data do evento: ${formatDateOnly(eventDate) || "Não informada"}
Tamanho desejado: ${desiredSize}
Retirada: ${formatDateTime(start)}
Devolução: ${formatDateTime(end)}
Tamanhos disponíveis: ${product.sizes}
Observações: ${notes}`;
}

function updateMessagePreview() {
  if (!messagePreview) return;
  messagePreview.textContent = buildBookingMessage();
}

function createOrderRecord() {
  const product = state.products.find((item) => item.id === bookingProduct.value);
  const customerName = document.querySelector("#customerName").value || "Cliente";
  const customerPhone = document.querySelector("#customerPhone").value || "";
  const eventDate = document.querySelector("#eventDate").value || "";
  const desiredSize = document.querySelector("#desiredSize").value || "";
  const notes = document.querySelector("#bookingNotes").value || "Sem observações";
  const start = makeDateTime("#startDate", "#pickupTime");
  const end = makeDateTime("#endDate", "#returnTime");
  const isRental = bookingMode.value === "locacao";
  const days = isRental ? rentalDays(start, end) : 1;
  const totalPrice = isRental ? product.price * days : product.price;

  return {
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "solicitado",
    customerName,
    customerPhone,
    eventDate,
    desiredSize,
    productId: product.id,
    productName: product.name,
    mode: bookingMode.value,
    modeLabel: isRental ? "Locação" : "Compra",
    price: totalPrice,
    dailyPrice: product.price,
    rentalDays: days,
    totalPrice,
    rentalStart: isRental ? start : "",
    rentalEnd: isRental ? end : "",
    period: isRental ? `${formatDateTime(start)} até ${formatDateTime(end)}` : "",
    notes,
  };
}

function statusLabel(status) {
  const labels = {
    solicitado: "Solicitado",
    reservado: "Reservado",
    retirado: "Retirado",
    devolvido: "Devolvido",
    cancelado: "Cancelado",
  };
  return labels[status] || "Solicitado";
}

function orderStatusOptions(currentStatus) {
  return ["solicitado", "reservado", "retirado", "devolvido", "cancelado"]
    .map(
      (status) =>
        `<option value="${status}" ${status === currentStatus ? "selected" : ""}>${statusLabel(status)}</option>`
    )
    .join("");
}

function formatDateOnly(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(`${value}T12:00`));
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function todayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function nowDateTimeValue() {
  const now = new Date();
  now.setSeconds(0, 0);
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
}

function setDateLimits() {
  const today = todayDateValue();
  const eventDate = document.querySelector("#eventDate");
  const startDate = document.querySelector("#startDate");
  const endDate = document.querySelector("#endDate");
  const cashflowDate = document.querySelector("#cashflowDate");
  const blockStart = document.querySelector("#blockStart");
  const blockEnd = document.querySelector("#blockEnd");
  if (eventDate) eventDate.min = today;
  if (startDate) startDate.min = today;
  if (endDate) endDate.min = startDate?.value || today;
  if (cashflowDate) cashflowDate.value = cashflowDate.value || today;
  if (blockStart) blockStart.min = nowDateTimeValue();
  if (blockEnd) blockEnd.min = blockStart?.value || nowDateTimeValue();
}

function updateAvailabilityMessage() {
  if (!availabilityMessage || !bookingProduct || !bookingMode) return;
  const product = state.products.find((item) => item.id === bookingProduct.value);
  const start = makeDateTime("#startDate", "#pickupTime");
  const end = makeDateTime("#endDate", "#returnTime");

  setDateLimits();
  availabilityMessage.className = "availability-message";
  availabilityMessage.textContent = "";

  if (!product || bookingMode.value !== "locacao" || !start || !end) return;

  if (new Date(start) < new Date()) {
    availabilityMessage.textContent = "A retirada não pode ficar em data ou horário passado.";
    availabilityMessage.classList.add("show", "blocked");
    return;
  }

  if (new Date(start) >= new Date(end)) {
    availabilityMessage.textContent = "A devolução precisa ser depois da retirada.";
    availabilityMessage.classList.add("show", "blocked");
    return;
  }

  const conflict = findConflict(product, start, end);
  if (conflict) {
    availabilityMessage.textContent = `Este período está bloqueado: ${conflict.reason || "reserva"} de ${formatDateTime(conflict.start)} até ${formatDateTime(conflict.end)}.`;
    availabilityMessage.classList.add("show", "blocked");
    return;
  }

  availabilityMessage.textContent = "Período livre no cadastro atual. A confirmação final será feita pelo WhatsApp.";
  availabilityMessage.classList.add("show", "ok");
}

document.querySelector("#menuButton")?.addEventListener("click", () => {
  drawer.classList.toggle("open");
});

window.addEventListener("hashchange", syncAdminVisibility);

document.querySelector("#lockForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const hint = document.querySelector("#lockHint");
  const passwordInput = document.querySelector("#adminPassword");

  if (adminIsTemporarilyLocked()) {
    hint.textContent = `Acesso bloqueado por tentativas incorretas. Tente novamente em ${lockRemainingMinutes()} min.`;
    return;
  }

  if ((await sha256(passwordInput.value)) !== ADMIN_HASH) {
    const locked = recordFailedAdminAttempt();
    hint.textContent = locked
      ? `Acesso bloqueado por ${ADMIN_LOCK_MINUTES} minutos.`
      : "Senha incorreta. Confira e tente novamente.";
    passwordInput.value = "";
    return;
  }

  resetAdminAttempts();
  sessionStorage.setItem(ADMIN_SESSION_KEY, String(Date.now() + ADMIN_SESSION_HOURS * 60 * 60000));
  unlockAdmin();
});

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".segment.active").classList.remove("active");
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderCatalog();
  });
});

document.querySelectorAll(".image-tab").forEach((button) => {
  button.addEventListener("click", () => {
    setImageSource(button.dataset.imageSource);
    const previewValue = button.dataset.imageSource === "url" ? adminImage.value.trim() : selectedImageData;
    updateImagePreview(previewValue);
  });
});

adminImage?.addEventListener("input", () => {
  if (!document.querySelector('[data-image-source="url"]').classList.contains("active")) return;
  updateImagePreview(adminImage.value.trim());
});

adminImageFile?.addEventListener("change", () => {
  const file = adminImageFile.files && adminImageFile.files[0];
  if (!file) {
    selectedImageData = "";
    updateImagePreview("");
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    selectedImageData = String(reader.result || "");
    updateImagePreview(selectedImageData);
  });
  reader.readAsDataURL(file);
});

document.querySelector("#searchImageLink")?.addEventListener("click", () => {
  const productName = document.querySelector("#adminName").value.trim();
  const query = productName ? `${productName} fantasia` : "fantasia ateliê";
  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  window.open(url, "_blank", "noopener");
});

searchInput?.addEventListener("input", renderCatalog);

adminProductSearch?.addEventListener("input", () => {
  state.adminProductSearch = adminProductSearch.value;
  renderAdminList();
});

orderStatusFilter?.addEventListener("change", () => {
  state.orderStatusFilter = orderStatusFilter.value;
  renderOrdersList();
});

orderDateField?.addEventListener("change", () => {
  state.orderDateField = orderDateField.value;
  renderOrdersList();
});

orderDateStart?.addEventListener("input", () => {
  state.orderDateStart = orderDateStart.value;
  renderOrdersList();
});

orderDateEnd?.addEventListener("input", () => {
  state.orderDateEnd = orderDateEnd.value;
  renderOrdersList();
});

["#bookingProduct", "#bookingMode", "#startDate", "#pickupTime", "#endDate", "#returnTime"].forEach((selector) => {
  document.querySelector(selector)?.addEventListener("input", () => {
    setDateLimits();
    updateAvailabilityMessage();
    updateMessagePreview();
  });
});

["#blockStart", "#blockEnd"].forEach((selector) => {
  document.querySelector(selector)?.addEventListener("input", setDateLimits);
});

["#customerName", "#customerPhone", "#eventDate", "#desiredSize", "#bookingNotes"].forEach((selector) => {
  document.querySelector(selector)?.addEventListener("input", updateMessagePreview);
});

bookingProduct?.addEventListener("change", () => {
  renderBookingModes();
  updateRentalFields();
  updateAvailabilityMessage();
  updateMessagePreview();
});

bookingMode?.addEventListener("change", () => {
  updateRentalFields();
  updateAvailabilityMessage();
  updateMessagePreview();
});

catalogGrid?.addEventListener("click", (event) => {
  const reserveButton = event.target.closest("[data-reserve]");
  if (reserveButton) {
    selectProduct(reserveButton.dataset.reserve);
    return;
  }

  const card = event.target.closest(".product-card");
  if (card) openProduct(card.dataset.id);
});

catalogGrid?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const card = event.target.closest(".product-card");
  if (card) openProduct(card.dataset.id);
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = state.products.find((item) => item.id === bookingProduct.value);
  const start = makeDateTime("#startDate", "#pickupTime");
  const end = makeDateTime("#endDate", "#returnTime");

  if (
    bookingMode.value === "locacao" &&
    (findConflict(product, start, end) || new Date(start) >= new Date(end) || new Date(start) < new Date())
  ) {
    updateAvailabilityMessage();
    return;
  }

  const message = buildBookingMessage();
  state.orders.unshift(createOrderRecord());
  saveOrders();
  refreshAll();
  window.open(whatsappUrl(message), "_blank", "noopener");
});

document.querySelector("#dialogClose")?.addEventListener("click", () => dialog.close());

document.querySelector("#dialogReserve")?.addEventListener("click", (event) => {
  dialog.close();
  selectProduct(event.currentTarget.dataset.id);
});

document.querySelector("#adminForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#adminName").value.trim();
  const imageSource = document.querySelector(".image-tab.active").dataset.imageSource;
  const existingProduct = state.products.find((product) => product.id === editingProductId);
  const product = {
    id: existingProduct ? existingProduct.id : `${Date.now()}-${normalizeText(name).replace(/\W+/g, "-")}`,
    name,
    price: Number(document.querySelector("#adminPrice").value),
    type: document.querySelector("#adminType").value,
    audience: document.querySelector("#adminAudience").value,
    gender: document.querySelector("#adminGender").value,
    theme: normalizeText(document.querySelector("#adminTheme").value) || "tematico",
    sizes: document.querySelector("#adminSizes").value || "Consultar",
    color: document.querySelector("#adminColor").value,
    icon: name.charAt(0).toUpperCase(),
    image: imageSource === "file" ? selectedImageData : adminImage.value.trim(),
    reservations: existingProduct ? existingProduct.reservations || [] : [],
    description:
      document.querySelector("#adminDescription").value ||
      "Item cadastrado no painel da Art & Cost.",
  };

  if (existingProduct) {
    state.products = state.products.map((item) => (item.id === product.id ? product : item));
  } else {
    state.products.unshift(product);
  }

  saveProducts();
  refreshAll();
  resetAdminForm();
});

document.querySelector("#cancelEdit")?.addEventListener("click", resetAdminForm);

document.querySelector("#blockForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = state.products.find((item) => item.id === blockProduct.value);
  const start = document.querySelector("#blockStart").value;
  const end = document.querySelector("#blockEnd").value;

  if (!product || !start || !end || new Date(start) >= new Date(end) || new Date(start) < new Date()) return;

  product.reservations = product.reservations || [];
  product.reservations.push({
    id: `block-${Date.now()}`,
    start,
    end,
    reason: document.querySelector("#blockReason").value || "Período bloqueado",
  });

  saveProducts();
  refreshAll();
  event.target.reset();
});

adminList?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  if (editButton) {
    const product = state.products.find((item) => item.id === editButton.dataset.edit);
    if (product) fillAdminForm(product);
    return;
  }

  const unblockButton = event.target.closest("[data-unblock]");
  if (unblockButton) {
    const product = state.products.find((item) => item.id === unblockButton.dataset.unblockProduct);
    if (!product) return;
    product.reservations = (product.reservations || []).filter(
      (reservation) => reservation.id !== unblockButton.dataset.unblock
    );
    saveProducts();
    refreshAll();
    return;
  }

  const deleteButton = event.target.closest("[data-delete]");
  if (!deleteButton) return;
  state.products = state.products.filter((product) => product.id !== deleteButton.dataset.delete);
  saveProducts();
  refreshAll();
});

ordersList?.addEventListener("click", (event) => {
  const cashflowButton = event.target.closest("[data-order-cashflow]");
  if (cashflowButton) {
    addCashflowFromOrder(cashflowButton.dataset.orderCashflow);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-order]");
  if (!deleteButton) return;
  removeOrderReservation(deleteButton.dataset.deleteOrder);
  state.orders = state.orders.filter((order) => order.id !== deleteButton.dataset.deleteOrder);
  saveOrders();
  refreshAll();
});

ordersList?.addEventListener("change", (event) => {
  const statusSelect = event.target.closest("[data-order-status]");
  if (!statusSelect) return;
  const order = state.orders.find((item) => item.id === statusSelect.dataset.orderStatus);
  if (!order) return;
  const updatedOrder = { ...order, status: statusSelect.value };
  const synced = syncOrderReservation(updatedOrder);
  if (!synced) {
    statusSelect.value = order.status;
    return;
  }
  state.orders = state.orders.map((order) =>
    order.id === statusSelect.dataset.orderStatus
      ? updatedOrder
      : order
  );
  saveOrders();
  refreshAll();
});

document.querySelector("#clearOrders")?.addEventListener("click", () => {
  state.orders.forEach((order) => removeOrderReservation(order.id));
  state.orders = [];
  saveOrders();
  refreshAll();
});

document.querySelector("#exportOrders")?.addEventListener("click", exportOrdersCsv);

document.querySelector("#cashflowForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(document.querySelector("#cashflowAmount").value);
  if (!amount || amount <= 0) return;

  state.cashflow.unshift({
    id: `cash-${Date.now()}`,
    date: document.querySelector("#cashflowDate").value || todayDateValue(),
    type: document.querySelector("#cashflowType").value,
    category: document.querySelector("#cashflowCategory").value,
    description: document.querySelector("#cashflowDescription").value.trim(),
    amount,
  });

  saveCashflow();
  renderCashflow();
  event.target.reset();
  setDateLimits();
});

cashflowList?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-cashflow]");
  if (!deleteButton) return;
  state.cashflow = state.cashflow.filter((entry) => entry.id !== deleteButton.dataset.deleteCashflow);
  saveCashflow();
  renderCashflow();
});

document.querySelector("#clearCashflow")?.addEventListener("click", () => {
  state.cashflow = [];
  saveCashflow();
  renderCashflow();
});

document.querySelector("#exportCashflow")?.addEventListener("click", exportCashflowCsv);
document.querySelector("#printCashflow")?.addEventListener("click", printCashflowPdf);

document.querySelector("#saveWhatsapp")?.addEventListener("click", () => {
  const phone = sanitizePhone(document.querySelector("#adminWhatsapp").value);
  state.settings.whatsapp = phone || DEFAULT_WHATSAPP_NUMBER;
  saveSettings();
  const contactWhatsapp = document.querySelector("#contactWhatsapp");
  const floatingWhatsapp = document.querySelector("#floatingWhatsapp");
  if (contactWhatsapp) contactWhatsapp.href = whatsappUrl("Olá! Quero falar com a Art & Cost sobre fantasias.");
  if (floatingWhatsapp) floatingWhatsapp.href = whatsappUrl("Olá! Quero falar com a Art & Cost sobre fantasias.");
});

document.querySelector("#exportCatalog")?.addEventListener("click", () => {
  const payload = {
    exportedAt: new Date().toISOString(),
    products: state.products,
    settings: state.settings,
    orders: state.orders,
    cashflow: state.cashflow,
  };
  downloadTextFile(
    `art-cost-catalogo-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(payload, null, 2),
    "application/json"
  );
  setBackupStatus("Backup exportado. Guarde esse arquivo em local seguro.");
});

document.querySelector("#importCatalog")?.addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const data = JSON.parse(String(reader.result || "{}"));
      if (!Array.isArray(data.products)) {
        throw new Error("Arquivo sem catálogo válido.");
      }

      state.products = data.products;
      state.settings = data.settings || state.settings;
      state.orders = Array.isArray(data.orders) ? data.orders : [];
      state.cashflow = Array.isArray(data.cashflow) ? data.cashflow : [];
      saveProducts();
      saveSettings();
      saveOrders();
      saveCashflow();
      refreshAll();
      document.querySelector("#adminWhatsapp").value =
        state.settings.whatsapp === DEFAULT_WHATSAPP_NUMBER ? "" : state.settings.whatsapp;
      setBackupStatus("Backup importado com sucesso.");
    } catch (error) {
      setBackupStatus("Não foi possível importar este arquivo.");
    } finally {
      event.target.value = "";
    }
  });
  reader.readAsText(file);
});

document.querySelector("#downloadCsvTemplate")?.addEventListener("click", () => {
  const headers = ["nome", "preco", "tipo", "publico", "genero", "tamanhos", "tema", "imagem", "descricao"];
  const example = [
    "Fantasia Princesa",
    "95",
    "locacao",
    "infantil",
    "feminino",
    "Infantil 8, Infantil 10",
    "tematico",
    "https://exemplo.com/foto.jpg",
    "Vestido de princesa com acessórios",
  ];
  const csv = `${headers.join(",")}\n${example.map(csvEscape).join(",")}\n`;
  downloadTextFile("modelo-produtos-art-cost.csv", csv, "text/csv;charset=utf-8");
  setCsvStatus("Modelo CSV baixado.");
});

document.querySelector("#importProductsCsv")?.addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const rows = parseCsv(String(reader.result || ""));
      const headers = rows.shift() || [];
      const imported = rows.map((row) => productFromCsvRow(headers, row)).filter(Boolean);
      if (!imported.length) {
        throw new Error("Nenhum produto encontrado.");
      }

      state.products = [...imported, ...state.products];
      saveProducts();
      refreshAll();
      setCsvStatus(`${imported.length} produto(s) importado(s) com sucesso.`);
    } catch (error) {
      setCsvStatus("Não foi possível importar a planilha. Confira as colunas do modelo.");
    } finally {
      event.target.value = "";
    }
  });
  reader.readAsText(file);
});

document.querySelector("#resetCatalog")?.addEventListener("click", () => {
  state.products = starterProducts;
  saveProducts();
  refreshAll();
});

const contactWhatsapp = document.querySelector("#contactWhatsapp");
const floatingWhatsapp = document.querySelector("#floatingWhatsapp");
const adminWhatsapp = document.querySelector("#adminWhatsapp");
if (contactWhatsapp) contactWhatsapp.href = whatsappUrl("Olá! Quero falar com a Art & Cost sobre fantasias.");
if (floatingWhatsapp) floatingWhatsapp.href = whatsappUrl("Olá! Quero falar com a Art & Cost sobre fantasias.");
if (adminWhatsapp) adminWhatsapp.value =
  state.settings.whatsapp === DEFAULT_WHATSAPP_NUMBER ? "" : state.settings.whatsapp;

syncAdminVisibility();
setDateLimits();
if (adminSessionValid()) unlockAdmin();
refreshAll();
