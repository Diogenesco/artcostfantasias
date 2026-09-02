# Art & Cost Fantasias

Site inicial para catálogo de locação e venda de fantasias da Art & Cost.

## Publicação

Este projeto é estático. Pode ser publicado gratuitamente no Cloudflare Pages,
Vercel, Netlify ou GitHub Pages.

No Cloudflare Pages, use:

- Framework preset: `None`
- Build command: deixe vazio
- Build output directory: `/`

O telefone do WhatsApp fica em `app.js`, na constante
`DEFAULT_WHATSAPP_NUMBER`.

No protótipo atual, as imagens podem ser cadastradas no painel por link ou por
arquivo escolhido no computador. Esses dados ficam salvos no navegador até a
integração com banco de dados e armazenamento real.

O painel também permite exportar e importar um backup JSON do catálogo enquanto
os dados ainda ficam salvos localmente no navegador.

As solicitações enviadas pelo formulário também ficam registradas localmente no
painel administrativo e entram no arquivo de backup.

O histórico local possui status operacional para acompanhar solicitações,
reservas, retiradas, devoluções e cancelamentos.

Ao marcar uma solicitação de locação como reservada, o período é bloqueado
automaticamente no item para evitar conflito com outra reserva.

Cada solicitação possui um botão para responder a cliente pelo WhatsApp com uma
mensagem pronta conforme o status do atendimento.

O painel também possui um fluxo financeiro local para lançar entradas, saídas,
locações, vendas, ajustes e manutenções.

Nas locações, o preço cadastrado é tratado como diária. O sistema calcula o
total pelo período escolhido e usa esse valor nas solicitações, no WhatsApp e no
fluxo financeiro.

O fluxo financeiro permite exportar CSV e gerar um relatório para salvar em PDF
com a logo da Art & Cost no cabeçalho.

O painel também possui uma agenda de locações com próximas retiradas,
devoluções e bloqueios manuais em ordem de data.

O painel administrativo inclui dashboard diário, histórico de clientes,
controle simples de estoque/unidades e geração de recibo ou contrato de locação
para salvar em PDF.

O histórico de clientes possui busca por nome, telefone ou atendimento, e a
agenda pode ser filtrada por retiradas, devoluções, bloqueios e atrasos.

Clientes podem ser exportados em CSV, e a agenda filtrada pode ser gerada em
PDF para conferência diária.

Para acelerar o cadastro real, o painel oferece um modelo CSV e importação de
produtos por planilha.

## Roadmap

O planejamento de evolução do site está em `ROADMAP.md`.

## Segurança

As orientações para proteger o painel administrativo estão em `SECURITY.md`.
