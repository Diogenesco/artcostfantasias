# Art & Cost Fantasias

Site inicial para catalogo de locacao e venda de fantasias da Art & Cost.

## Publicacao

Este projeto e estatico. Pode ser publicado gratuitamente no Cloudflare Pages,
Vercel, Netlify ou GitHub Pages.

No Cloudflare Pages, use:

- Framework preset: `None`
- Build command: deixe vazio
- Build output directory: `/`

O telefone do WhatsApp fica em `app.js`, na constante
`DEFAULT_WHATSAPP_NUMBER`.

No prototipo atual, as imagens podem ser cadastradas no painel por link ou por
arquivo escolhido no computador. Esses dados ficam salvos no navegador ate a
integracao com banco de dados e armazenamento real.

O painel tambem permite exportar e importar um backup JSON do catalogo enquanto
os dados ainda ficam salvos localmente no navegador.

As solicitacoes enviadas pelo formulario tambem ficam registradas localmente no
painel administrativo e entram no arquivo de backup.

O historico local possui status operacional para acompanhar solicitacoes,
reservas, retiradas, devolucoes e cancelamentos.

Para acelerar o cadastro real, o painel oferece um modelo CSV e importacao de
produtos por planilha.

## Roadmap

O planejamento de evolucao do site esta em `ROADMAP.md`.
