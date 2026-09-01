const WHATSAPP_NUMBER = "5500000000000";
const STORAGE_KEY = "artCostCatalog";

const starterProducts = [
  {
    id: "bombeira",
    name: "Conjunto Fantasia Bombeira",
    price: 85,
    type: "locacao",
    audience: "adulto",
    sizes: "P, M, G",
    color: "#b3202a",
    icon: "B",
    description: "Conjunto tematico com saia vermelha, camiseta e acessorios para festa a fantasia.",
  },
  {
    id: "chapeuzinho",
    name: "Chapeuzinho Vermelho",
    price: 95,
    type: "locacao",
    audience: "adulto",
    sizes: "P, M",
    color: "#9e1f28",
    icon: "C",
    description: "Fantasia com capa vermelha, saia e acabamento de atelie para eventos e ensaios.",
  },
  {
    id: "fada",
    name: "Fantasia Fada Sininho",
    price: 95,
    type: "locacao",
    audience: "infantil",
    sizes: "Infantil 6, 8, 10",
    color: "#0f7f5c",
    icon: "F",
    description: "Vestido verde com visual encantado, ideal para festa infantil e tema fantasia.",
  },
  {
    id: "marinheira",
    name: "Conjunto Marinheira Princesa",
    price: 90,
    type: "locacao",
    audience: "adulto",
    sizes: "M, G",
    color: "#1d4f8f",
    icon: "M",
    description: "Look tematico azul e branco com composicao delicada para festas e apresentacoes.",
  },
  {
    id: "atelie",
    name: "Vestido de Atelie",
    price: 180,
    type: "venda",
    audience: "todos",
    sizes: "Sob medida",
    color: "#6f3d7b",
    icon: "A",
    description: "Peca de atelie para venda, com ajustes e detalhes definidos pelo atendimento.",
  },
  {
    id: "carnaval",
    name: "Look Carnaval Dourado",
    price: 120,
    type: "ambos",
    audience: "todos",
    sizes: "P, M, G, GG",
    color: "#c9902e",
    icon: "L",
    description: "Look versatil para venda ou locacao, com brilho e acabamento em tons dourados.",
  },
];

const state = {
  products: loadProducts(),
  filter: "todos",
  selectedProductId: null,
};

const catalogGrid = document.querySelector("#catalogGrid");
const searchInput = document.querySelector("#searchInput");
const bookingProduct = document.querySelector("#bookingProduct");
const bookingForm = document.querySelector("#bookingForm");
const cartCount = document.querySelector("#cartCount");
const drawer = document.querySelector("#drawer");
const dialog = document.querySelector("#productDialog");

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : starterProducts;
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.products));
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function typeLabel(product) {
  if (product.type === "ambos") return "Venda e locacao";
  return product.type === "venda" ? "Venda" : "Locacao";
}

function productMatches(product) {
  const term = searchInput.value.trim().toLowerCase();
  const inFilter =
    state.filter === "todos" ||
    product.type === state.filter ||
    product.audience === state.filter ||
    product.type === "ambos" ||
    product.audience === "todos";
  const inSearch =
    !term ||
    [product.name, product.description, product.sizes, typeLabel(product)]
      .join(" ")
      .toLowerCase()
      .includes(term);

  return inFilter && inSearch;
}

function renderCatalog() {
  const products = state.products.filter(productMatches);
  catalogGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card" data-id="${product.id}" tabindex="0">
          <div class="product-image" style="background: linear-gradient(145deg, ${product.color}, #111);">
            <span class="tag">${typeLabel(product)}</span>
            <span class="product-figure">${product.icon}</span>
            <button class="product-add" type="button" aria-label="Reservar ${product.name}" data-reserve="${product.id}">+</button>
          </div>
          <h3>${product.name}</h3>
          <div class="price">${money(product.price)}</div>
          <div class="meta">${product.sizes} | ${product.audience}</div>
        </article>
      `
    )
    .join("");

  if (!products.length) {
    catalogGrid.innerHTML = `<p class="empty-state">Nenhuma fantasia encontrada para este filtro.</p>`;
  }
}

function renderBookingOptions() {
  bookingProduct.innerHTML = state.products
    .map(
      (product) =>
        `<option value="${product.id}">${product.name} - ${money(product.price)}</option>`
    )
    .join("");
}

function selectProduct(productId) {
  state.selectedProductId = productId;
  bookingProduct.value = productId;
  cartCount.textContent = "1";
  document.querySelector("#pedido").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  document.querySelector("#dialogMedia").style.background = `linear-gradient(145deg, ${product.color}, #111)`;
  document.querySelector("#dialogMedia").innerHTML = `<span class="product-figure">${product.icon}</span>`;
  document.querySelector("#dialogType").textContent = typeLabel(product);
  document.querySelector("#dialogTitle").textContent = product.name;
  document.querySelector("#dialogDescription").textContent = product.description;
  document.querySelector("#dialogPrice").textContent = money(product.price);
  document.querySelector("#dialogSizes").textContent = product.sizes;
  document.querySelector("#dialogReserve").dataset.id = product.id;
  dialog.showModal();
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildBookingMessage() {
  const product = state.products.find((item) => item.id === bookingProduct.value);
  const customerName = document.querySelector("#customerName").value || "Cliente";
  const startDate = document.querySelector("#startDate").value;
  const pickupTime = document.querySelector("#pickupTime").value;
  const endDate = document.querySelector("#endDate").value;
  const returnTime = document.querySelector("#returnTime").value;

  return `Ola! Tenho interesse em reservar com a Art & Cost.

Cliente: ${customerName}
Item: ${product.name}
Tipo: ${typeLabel(product)}
Valor: ${money(product.price)}
Retirada: ${startDate} as ${pickupTime}
Devolucao: ${endDate} as ${returnTime}
Tamanhos disponiveis: ${product.sizes}`;
}

document.querySelector("#menuButton").addEventListener("click", () => {
  drawer.classList.toggle("open");
});

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".segment.active").classList.remove("active");
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderCatalog();
  });
});

searchInput.addEventListener("input", renderCatalog);

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
  const product = {
    id: `${Date.now()}-${name.toLowerCase().replace(/\W+/g, "-")}`,
    name,
    price: Number(document.querySelector("#adminPrice").value),
    type: document.querySelector("#adminType").value,
    audience: document.querySelector("#adminAudience").value,
    sizes: document.querySelector("#adminSizes").value || "Consultar",
    color: document.querySelector("#adminColor").value,
    icon: name.charAt(0).toUpperCase(),
    description:
      document.querySelector("#adminDescription").value ||
      "Item cadastrado no painel da Art & Cost.",
  };

  state.products.unshift(product);
  saveProducts();
  renderCatalog();
  renderBookingOptions();
  event.target.reset();
  document.querySelector("#adminColor").value = "#b3202a";
});

document.querySelector("#resetCatalog").addEventListener("click", () => {
  state.products = starterProducts;
  saveProducts();
  renderCatalog();
  renderBookingOptions();
});

document.querySelector("#contactWhatsapp").href = whatsappUrl(
  "Ola! Quero falar com a Art & Cost sobre fantasias."
);

renderCatalog();
renderBookingOptions();
