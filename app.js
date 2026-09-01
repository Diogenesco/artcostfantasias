const DEFAULT_WHATSAPP_NUMBER = "554498155843";
const CATALOG_KEY = "artCostCatalog";
const SETTINGS_KEY = "artCostSettings";
const ADMIN_PASSWORD = "artcost";

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
    description: "Conjunto tematico com saia vermelha, camiseta e acessorios para festa a fantasia.",
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
    description: "Fantasia com capa vermelha, saia e acabamento de atelie para eventos e ensaios.",
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
    description: "Look tematico azul e branco com composicao delicada para festas e apresentacoes.",
  },
  {
    id: "atelie",
    name: "Vestido de Atelie",
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
    description: "Peca de atelie para venda, com ajustes e detalhes definidos pelo atendimento.",
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
    description: "Look versatil para venda ou locacao, com brilho e acabamento em tons dourados.",
  },
];

const state = {
  products: loadProducts(),
  settings: loadSettings(),
  filter: "todos",
  selectedProductId: null,
};

const catalogGrid = document.querySelector("#catalogGrid");
const searchInput = document.querySelector("#searchInput");
const bookingProduct = document.querySelector("#bookingProduct");
const bookingMode = document.querySelector("#bookingMode");
const bookingForm = document.querySelector("#bookingForm");
const availabilityMessage = document.querySelector("#availabilityMessage");
const cartCount = document.querySelector("#cartCount");
const drawer = document.querySelector("#drawer");
const dialog = document.querySelector("#productDialog");
const adminList = document.querySelector("#adminList");
const adminStats = document.querySelector("#adminStats");
const blockProduct = document.querySelector("#blockProduct");
const adminLock = document.querySelector("#adminLock");
const adminContent = document.querySelector("#adminContent");
const adminImage = document.querySelector("#adminImage");
const adminImageFile = document.querySelector("#adminImageFile");
const imagePreview = document.querySelector("#imagePreview");
const backupStatus = document.querySelector("#backupStatus");
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

function saveProducts() {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(state.products));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function setBackupStatus(message) {
  backupStatus.textContent = message;
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
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

function typeLabel(product) {
  if (product.type === "ambos") return "Venda e locacao";
  return product.type === "venda" ? "Venda" : "Locacao";
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

function availabilityText(product) {
  const hasBlocks = (product.reservations || []).length > 0;
  return {
    label: hasBlocks ? "Verificar datas" : "Disponivel",
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
  imagePreview.classList.toggle("empty", !value);
  imagePreview.innerHTML = value
    ? `<img src="${value}" alt="Previa da fantasia" />`
    : "Previa da imagem";
}

function setImageSource(source) {
  document.querySelector(".image-tab.active").classList.remove("active");
  document.querySelector(`[data-image-source="${source}"]`).classList.add("active");
  document.querySelectorAll(".image-source").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.sourcePanel === source);
  });
}

function resetAdminForm() {
  document.querySelector("#adminForm").reset();
  editingProductId = "";
  selectedImageData = "";
  setImageSource("url");
  updateImagePreview("");
  document.querySelector("#adminColor").value = "#b3202a";
  document.querySelector("#adminSubmit").textContent = "Adicionar ao catalogo";
  document.querySelector("#cancelEdit").classList.add("hidden-control");
}

function fillAdminForm(product) {
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
  document.querySelector("#adminSubmit").textContent = "Salvar alteracoes";
  document.querySelector("#cancelEdit").classList.remove("hidden-control");
  document.querySelector("#adminForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCatalog() {
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
          <div class="price">${money(product.price)}</div>
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
        `<option value="${product.id}">${product.name} - ${money(product.price)}</option>`
    )
    .join("");

  bookingProduct.innerHTML = options;
  blockProduct.innerHTML = options;
  renderBookingModes();
}

function renderAdminList() {
  adminList.innerHTML = state.products
    .map((product) => {
      const reservations = (product.reservations || [])
        .map(
          (reservation) => `
            <div class="reservation-row">
              <span>${reservation.reason || "Bloqueio"}: ${formatDateTime(reservation.start)} ate ${formatDateTime(reservation.end)}</span>
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

function renderAdminStats() {
  const total = state.products.length;
  const rentals = state.products.filter((product) => product.type === "locacao" || product.type === "ambos").length;
  const sales = state.products.filter((product) => product.type === "venda" || product.type === "ambos").length;
  const blocks = state.products.reduce(
    (sum, product) => sum + (product.reservations || []).length,
    0
  );

  adminStats.innerHTML = `
    <article class="admin-stat">
      <span>Itens</span>
      <strong>${total}</strong>
    </article>
    <article class="admin-stat">
      <span>Locacao</span>
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
  `;
}

function refreshAll() {
  renderCatalog();
  renderBookingOptions();
  renderAdminList();
  renderAdminStats();
  updateRentalFields();
  updateAvailabilityMessage();
}

function syncAdminVisibility() {
  document.body.classList.toggle("admin-visible", window.location.hash === "#admin");
}

function selectProduct(productId) {
  state.selectedProductId = productId;
  bookingProduct.value = productId;
  renderBookingModes();
  updateRentalFields();
  cartCount.textContent = "1";
  updateAvailabilityMessage();
  document.querySelector("#pedido").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderBookingModes() {
  const product = state.products.find((item) => item.id === bookingProduct.value) || state.products[0];
  if (!product) return;

  if (product.type === "venda") {
    bookingMode.innerHTML = `<option value="venda">Compra</option>`;
    return;
  }

  if (product.type === "ambos") {
    bookingMode.innerHTML = `
      <option value="locacao">Locacao</option>
      <option value="venda">Compra</option>
    `;
    return;
  }

  bookingMode.innerHTML = `<option value="locacao">Locacao</option>`;
}

function updateRentalFields() {
  const isRental = bookingMode.value === "locacao";
  document.querySelectorAll(".rental-field").forEach((field) => {
    field.classList.toggle("hidden", !isRental);
    field.querySelector("input").required = isRental;
  });
}

function openProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  const dialogMedia = document.querySelector("#dialogMedia");
  dialogMedia.style.background = `linear-gradient(145deg, ${product.color}, #111)`;
  dialogMedia.innerHTML = mediaMarkup(product);
  document.querySelector("#dialogType").textContent = typeLabel(product);
  document.querySelector("#dialogTitle").textContent = product.name;
  document.querySelector("#dialogDescription").textContent = product.description;
  document.querySelector("#dialogPrice").textContent = money(product.price);
  document.querySelector("#dialogSizes").textContent = product.sizes;
  document.querySelector("#dialogReserve").dataset.id = product.id;
  dialog.showModal();
}

function whatsappUrl(message) {
  return `https://wa.me/${state.settings.whatsapp}?text=${encodeURIComponent(message)}`;
}

function buildBookingMessage() {
  const product = state.products.find((item) => item.id === bookingProduct.value);
  const customerName = document.querySelector("#customerName").value || "Cliente";
  const start = makeDateTime("#startDate", "#pickupTime");
  const end = makeDateTime("#endDate", "#returnTime");
  const notes = document.querySelector("#bookingNotes").value || "Sem observacoes";

  if (bookingMode.value === "venda") {
    return `Ola! Tenho interesse em comprar com a Art & Cost.

Cliente: ${customerName}
Item: ${product.name}
Tipo: Compra
Valor: ${money(product.price)}
Tamanhos disponiveis: ${product.sizes}
Observacoes: ${notes}`;
  }

  return `Ola! Tenho interesse em reservar com a Art & Cost.

Cliente: ${customerName}
Item: ${product.name}
Tipo: ${typeLabel(product)}
Valor: ${money(product.price)}
Retirada: ${formatDateTime(start)}
Devolucao: ${formatDateTime(end)}
Tamanhos disponiveis: ${product.sizes}
Observacoes: ${notes}`;
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function updateAvailabilityMessage() {
  const product = state.products.find((item) => item.id === bookingProduct.value);
  const start = makeDateTime("#startDate", "#pickupTime");
  const end = makeDateTime("#endDate", "#returnTime");

  availabilityMessage.className = "availability-message";
  availabilityMessage.textContent = "";

  if (!product || bookingMode.value !== "locacao" || !start || !end) return;

  if (new Date(start) >= new Date(end)) {
    availabilityMessage.textContent = "A devolucao precisa ser depois da retirada.";
    availabilityMessage.classList.add("show", "blocked");
    return;
  }

  const conflict = findConflict(product, start, end);
  if (conflict) {
    availabilityMessage.textContent = `Este periodo esta bloqueado: ${conflict.reason || "reserva"} de ${formatDateTime(conflict.start)} ate ${formatDateTime(conflict.end)}.`;
    availabilityMessage.classList.add("show", "blocked");
    return;
  }

  availabilityMessage.textContent = "Periodo livre no cadastro atual. A confirmacao final sera feita pelo WhatsApp.";
  availabilityMessage.classList.add("show", "ok");
}

document.querySelector("#menuButton").addEventListener("click", () => {
  drawer.classList.toggle("open");
});

window.addEventListener("hashchange", syncAdminVisibility);

document.querySelector("#lockForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const password = document.querySelector("#adminPassword").value.trim().toLowerCase();

  if (password !== ADMIN_PASSWORD) {
    document.querySelector("#lockHint").textContent = "Senha incorreta. Tente novamente.";
    return;
  }

  adminLock.style.display = "none";
  adminContent.classList.remove("locked");
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

adminImage.addEventListener("input", () => {
  if (!document.querySelector('[data-image-source="url"]').classList.contains("active")) return;
  updateImagePreview(adminImage.value.trim());
});

adminImageFile.addEventListener("change", () => {
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

document.querySelector("#searchImageLink").addEventListener("click", () => {
  const productName = document.querySelector("#adminName").value.trim();
  const query = productName ? `${productName} fantasia` : "fantasia atelie";
  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  window.open(url, "_blank", "noopener");
});

searchInput.addEventListener("input", renderCatalog);

["#bookingProduct", "#bookingMode", "#startDate", "#pickupTime", "#endDate", "#returnTime"].forEach((selector) => {
  document.querySelector(selector).addEventListener("input", updateAvailabilityMessage);
});

bookingProduct.addEventListener("change", () => {
  renderBookingModes();
  updateRentalFields();
  updateAvailabilityMessage();
});

bookingMode.addEventListener("change", () => {
  updateRentalFields();
  updateAvailabilityMessage();
});

catalogGrid.addEventListener("click", (event) => {
  const reserveButton = event.target.closest("[data-reserve]");
  if (reserveButton) {
    selectProduct(reserveButton.dataset.reserve);
    return;
  }

  const card = event.target.closest(".product-card");
  if (card) openProduct(card.dataset.id);
});

catalogGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const card = event.target.closest(".product-card");
  if (card) openProduct(card.dataset.id);
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = state.products.find((item) => item.id === bookingProduct.value);
  const start = makeDateTime("#startDate", "#pickupTime");
  const end = makeDateTime("#endDate", "#returnTime");

  if (bookingMode.value === "locacao" && (findConflict(product, start, end) || new Date(start) >= new Date(end))) {
    updateAvailabilityMessage();
    return;
  }

  window.open(whatsappUrl(buildBookingMessage()), "_blank", "noopener");
});

document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());

document.querySelector("#dialogReserve").addEventListener("click", (event) => {
  dialog.close();
  selectProduct(event.currentTarget.dataset.id);
});

document.querySelector("#adminForm").addEventListener("submit", (event) => {
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

document.querySelector("#cancelEdit").addEventListener("click", resetAdminForm);

document.querySelector("#blockForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const product = state.products.find((item) => item.id === blockProduct.value);
  const start = document.querySelector("#blockStart").value;
  const end = document.querySelector("#blockEnd").value;

  if (!product || !start || !end || new Date(start) >= new Date(end)) return;

  product.reservations = product.reservations || [];
  product.reservations.push({
    id: `block-${Date.now()}`,
    start,
    end,
    reason: document.querySelector("#blockReason").value || "Periodo bloqueado",
  });

  saveProducts();
  refreshAll();
  event.target.reset();
});

adminList.addEventListener("click", (event) => {
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

document.querySelector("#saveWhatsapp").addEventListener("click", () => {
  const phone = sanitizePhone(document.querySelector("#adminWhatsapp").value);
  state.settings.whatsapp = phone || DEFAULT_WHATSAPP_NUMBER;
  saveSettings();
  document.querySelector("#contactWhatsapp").href = whatsappUrl(
    "Ola! Quero falar com a Art & Cost sobre fantasias."
  );
  document.querySelector("#floatingWhatsapp").href = whatsappUrl(
    "Ola! Quero falar com a Art & Cost sobre fantasias."
  );
});

document.querySelector("#exportCatalog").addEventListener("click", () => {
  const payload = {
    exportedAt: new Date().toISOString(),
    products: state.products,
    settings: state.settings,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `art-cost-catalogo-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  setBackupStatus("Backup exportado. Guarde esse arquivo em local seguro.");
});

document.querySelector("#importCatalog").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const data = JSON.parse(String(reader.result || "{}"));
      if (!Array.isArray(data.products)) {
        throw new Error("Arquivo sem catalogo valido.");
      }

      state.products = data.products;
      state.settings = data.settings || state.settings;
      saveProducts();
      saveSettings();
      refreshAll();
      document.querySelector("#adminWhatsapp").value =
        state.settings.whatsapp === DEFAULT_WHATSAPP_NUMBER ? "" : state.settings.whatsapp;
      setBackupStatus("Backup importado com sucesso.");
    } catch (error) {
      setBackupStatus("Nao foi possivel importar este arquivo.");
    } finally {
      event.target.value = "";
    }
  });
  reader.readAsText(file);
});

document.querySelector("#resetCatalog").addEventListener("click", () => {
  state.products = starterProducts;
  saveProducts();
  refreshAll();
});

document.querySelector("#contactWhatsapp").href = whatsappUrl(
  "Ola! Quero falar com a Art & Cost sobre fantasias."
);
document.querySelector("#floatingWhatsapp").href = whatsappUrl(
  "Ola! Quero falar com a Art & Cost sobre fantasias."
);
document.querySelector("#adminWhatsapp").value =
  state.settings.whatsapp === DEFAULT_WHATSAPP_NUMBER ? "" : state.settings.whatsapp;

syncAdminVisibility();
refreshAll();
