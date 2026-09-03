# Configuração do catálogo central

Este passo faz com que produtos e imagens apareçam iguais para todos os
visitantes, em qualquer celular ou computador.

## 1. Criar banco D1

No painel da Cloudflare:

1. Entre em **Storage & databases**.
2. Acesse **D1 SQL Database**.
3. Crie um banco para o site, por exemplo `artcost_catalogo`.
4. No projeto do Cloudflare Pages, adicione um binding D1:
   - Nome da variável: `DB`
   - Banco: `artcost_catalogo`

## 2. Criar bucket R2

No painel da Cloudflare:

1. Entre em **R2 Object Storage**.
2. Crie um bucket para imagens, por exemplo `artcost-imagens`.
3. No projeto do Cloudflare Pages, adicione um binding R2:
   - Nome da variável: `IMAGES`
   - Bucket: `artcost-imagens`

## 3. Proteger a API administrativa

No Cloudflare Zero Trust Access, a aplicação administrativa deve proteger:

- `/admin*`
- `/api/admin*`

A rota `/api/catalog` deve continuar pública, porque é ela que a vitrine usa
para mostrar produtos aos visitantes.

Importante: não remova a proteção de `/api/admin*`. A API administrativa
confia nessa regra do Cloudflare Access para permitir cadastros e edições.

## 4. Publicar e testar

Depois de salvar os bindings, publique novamente o projeto no Cloudflare Pages.
No painel administrativo, o aviso deve mudar para:

`Catálogo central ligado. Produtos e imagens salvos no painel aparecerão para todos os visitantes.`

Cadastre ou edite um produto no painel. Em seguida, abra o site em outro
navegador ou celular para confirmar que o item aparece no catálogo público.
