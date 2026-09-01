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

O painel também possui um fluxo financeiro local para lançar entradas, saídas,
locações, vendas, ajustes e manutenções.

Para acelerar o cadastro real, o painel oferece um modelo CSV e importação de
produtos por planilha.

## Roadmap

O planejamento de evolução do site está em `ROADMAP.md`.
