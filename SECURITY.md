# Segurança do Art & Cost Fantasias

## O que já está no site

- Login administrativo com senha mais forte e verificação por hash no navegador.
- Bloqueio temporário depois de tentativas incorretas.
- Sessão administrativa temporária no navegador.
- Cabeçalhos de segurança via Cloudflare Pages em `_headers`.

## Próximo passo obrigatório para segurança real

O painel atual roda em site estático. A senha no navegador ajuda contra uso casual,
mas não substitui autenticação real, porque arquivos JavaScript públicos podem ser
inspecionados.

Para proteger de verdade, ative o Cloudflare Zero Trust Access no painel
administrativo. O painel já está separado em `/admin.html`, então essa rota
deve receber login por e-mail/autenticação da Cloudflare.

Configuração recomendada:

- Aplicação: Self-hosted.
- Domínio: `artcostfantasias.com.br`.
- Caminho protegido: `/admin.html`.
- Política: permitir apenas o e-mail do administrador.
- Sessão: expiração curta, como 8 horas.

## Proteção antirobô e antiataque no Cloudflare

Ative no painel do Cloudflare:

- Security > Settings > Bot Fight Mode: ligado.
- Security > WAF > Managed rules: ligado.
- Security > Settings > Browser Integrity Check: ligado, se disponível no plano.
- SSL/TLS: modo Full ou Full Strict quando houver origem própria.

## Turnstile

Cloudflare Turnstile só deve ser usado quando houver validação no servidor ou em
uma função serverless. Colocar apenas o widget no HTML não protege de verdade,
porque o token precisa ser validado no backend.
