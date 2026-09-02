# Roadmap Art & Cost Fantasias

## Fase 1 - Vitrine pública

- Publicar o site no Cloudflare Pages.
- Conectar o domínio `artcostfantasias.com.br`.
- Aplicar identidade visual preto e dourado da Art & Cost.
- Criar catálogo com busca e filtros.
- Adicionar WhatsApp oficial nos botões de contato.
- Criar página inicial com chamada, destaques e funcionamento.
- Substituir cards de exemplo por fotos reais das fantasias.
- Permitir importar produtos reais por CSV a partir do painel.

## Fase 2 - Reserva por WhatsApp

- Permitir escolha de fantasia, data de retirada, hora de retirada, data de devolução e hora de devolução.
- Bloquear envio quando o período estiver indisponível.
- Montar mensagem automática para WhatsApp com todos os dados.
- Separar visualmente produtos de locação, venda e venda + locação.

## Fase 3 - Painel administrativo

- Criar painel com cadastro de fantasia, preço, tipo, público, tema, tamanhos, fotos e descrição.
- Permitir cadastro de imagem por link ou arquivo local no protótipo.
- Permitir editar itens cadastrados sem recriar o produto.
- Permitir bloqueio de datas por item.
- Adicionar exportação e importação de backup do catálogo no protótipo.
- Registrar histórico local de solicitações enviadas pelo formulário.
- Permitir status de solicitação: solicitado, reservado, retirado, devolvido e cancelado.
- Registrar linha do tempo de mudanças de status por solicitação.
- Criar fluxo local de entradas e saídas para locações, vendas e despesas.
- Criar agenda operacional com próximas retiradas, devoluções e bloqueios.
- Criar dashboard inicial com alertas do dia e valor previsto.
- Salvar histórico local de clientes a partir das solicitações.
- Permitir busca no histórico de clientes.
- Exportar clientes filtrados em CSV.
- Gerar recibo e contrato simples de locação para PDF.
- Melhorar comprovante com número do pedido, pagamento e assinatura.
- Melhorar contrato de locação com termos de caução, atraso, avarias e acessórios.
- Adicionar controle simples de estoque/unidades.
- Respeitar múltiplas unidades da mesma fantasia na disponibilidade de locação.
- Bloquear compras de itens esgotados e baixar estoque ao finalizar venda.
- Listar itens e bloqueios cadastrados.
- Trocar a senha simples de protótipo por login real.

## Fase 4 - Banco de dados

- Conectar Supabase no plano gratuito.
- Salvar catálogo, fotos, bloqueios e configurações no banco.
- Criar login administrativo seguro.
- Garantir que todos os visitantes vejam o mesmo catálogo atualizado.

## Fase 5 - Operação

- Criar fluxo de confirmação de reserva.
- Registrar nome, telefone e observações da cliente.
- Criar status: solicitado, reservado, retirado, devolvido e cancelado.
- Bloquear automaticamente a data da fantasia quando a solicitação for marcada como reservada.
- Responder a cliente pelo WhatsApp a partir da solicitação, com mensagem pronta por status.
- Gerar relatório simples de reservas por período.
- Destacar devoluções atrasadas na agenda operacional.
- Gerar PDF da agenda filtrada para conferência diária.
- Exportar solicitações filtradas por período em CSV.
- Calcular locações por diária e refletir o total no WhatsApp, solicitações e fluxo financeiro.
- Gerar relatório PDF do fluxo financeiro com logo da empresa.
- Melhorar busca pública com filtros por idade, gênero, preço e tamanho.

## Fase 6 - Loja futura

- Adicionar carrinho real para venda.
- Integrar pagamento online se fizer sentido.
- Criar controle de estoque para peças a pronta entrega.
- Adicionar política de retirada, devolução, caução e ajustes.
