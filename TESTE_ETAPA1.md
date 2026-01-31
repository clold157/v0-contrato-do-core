# 🧪 Guia de Teste - ETAPA 1 Integração Real

## 🚀 Setup Inicial

### Pré-requisitos
```bash
# 1. Backend rodando
- Verificar: http://localhost:3000 (ou seu-backend.com)
- Verificar: Módulo menu-online habilitado para o tenant

# 2. Frontend buildado
npm run build

# 3. Dev server
npm run dev
```

### Configuração de Env
```bash
# Criar .env.local (ou verificar)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📝 Dados de Teste

### Tenant de Teste
```
- Slug: seu-tenant-slug (ou outro slug cadastrado)
- Status: active
- Módulo menu-online: enabled
- Pelo menos 1 categoria ativa
- Pelo menos 1 produto ativo
- Pelo menos 1 complemento opcional
- 1 complemento obrigatório é ideal para testar validação
```

## ✅ Testes Manuais

### 1️⃣ Teste de Carregamento

**URL**: `http://localhost:3000/menu/seu-tenant-slug`

**Esperado**:
- [ ] Skeleton aparece durante carregamento
- [ ] Dados carregam sem erros
- [ ] Transição suave do skeleton para conteúdo

**Se falhar**:
- [ ] Verifique console (F12 → Console tab)
- [ ] Procure por erro de fetch
- [ ] Verifique NEXT_PUBLIC_API_URL
- [ ] Verifique se tenant existe

---

### 2️⃣ Teste de Exibição de Dados

**Esperado na página**:
- [ ] Nome do estabelecimento (ex: "Pizzaria Do João")
- [ ] Badge "Aberto" ou "Fechado"
- [ ] Tempo de preparo (ex: "30-40 min")
- [ ] Barra de busca
- [ ] Abas de categorias
- [ ] Produtos listados por categoria

**Se falhar**:
- [ ] Dados vazios? Verifique se há produtos/categorias ativas no backend
- [ ] Imagens não aparecem? Verifique `showImages` na settings
- [ ] Categorias não aparecem? Verifique status das categorias (active/inactive)

---

### 3️⃣ Teste de Busca

**Ação**: Digitar um termo na barra de busca

**Exemplo**: "Pizza"

**Esperado**:
- [ ] Produtos filtrados por nome
- [ ] Produtos filtrados por descrição
- [ ] Filtragem é case-insensitive
- [ ] Limpar busca volta a mostrar todos

**Se falhar**:
- [ ] Nenhum produto aparece?
  - Verifique se há produtos com esse termo
  - Verifique se estão com status "active"

---

### 4️⃣ Teste de Filtro por Categoria

**Ação**: Clicar em uma aba de categoria

**Esperado**:
- [ ] Página faz scroll suave para aquela categoria
- [ ] Apenas produtos daquela categoria aparecem
- [ ] "Todos" mostra todos os produtos
- [ ] Smooth scroll é notável

**Se falhar**:
- [ ] Nenhum scroll? Verifique `scrollIntoView` no console
- [ ] Categoria vazia? Pode ser que não haja produtos lincados

---

### 5️⃣ Teste de Modal de Produto

**Ação**: Clicar em um card de produto

**Esperado**:
- [ ] Dialog abre (escurece o fundo)
- [ ] Imagem grande do produto aparece
- [ ] Descrição completa é visível
- [ ] Preço é exibido
- [ ] Abas "X" para fechar está acessível

**Se falhar**:
- [ ] Dialog não abre? Verifique console para erros React
- [ ] Imagem não aparece? Verifique `showImages` e URL da imagem

---

### 6️⃣ Teste de Variações (Tamanho)

**Pré-requisito**: Produto com `priceVariations` no backend

**Ação**: Selecionar diferentes tamanhos no modal

**Esperado**:
- [ ] Radio buttons aparecem com nomes das variações
- [ ] Preço muda quando seleciona tamanho
- [ ] Um tamanho está selecionado por padrão
- [ ] Botão "Adicionar" mostra preço atualizado

**Se falhar**:
- [ ] Nenhuma opção aparece? Produto não tem variações
- [ ] Preço não muda? Verifique se o delta está configurado no backend

---

### 7️⃣ Teste de Complementos Opcionais

**Pré-requisito**: Produto com complementos opcionais (`isRequired: false`)

**Ação**: Selecionar/desselecionar complementos

**Esperado**:
- [ ] Checkboxes aparecem
- [ ] Pode selecionar múltiplos
- [ ] Preço sobe quando seleciona
- [ ] Pode desselecionar
- [ ] Respeita `maxSelect` (não deixa selecionar mais)

**Se falhar**:
- [ ] Nenhum complemento aparece? Verifique `modifierGroupIds` no produto
- [ ] Preço não muda? Verifique `priceDelta` do complemento

---

### 8️⃣ Teste de Complementos Obrigatórios

**Pré-requisito**: Produto com complemento obrigatório (`isRequired: true`)

**Ação**: Tentar adicionar ao carrinho sem selecionar complemento obrigatório

**Esperado**:
- [ ] Alert aparece: "Por favor, selecione os complementos obrigatórios"
- [ ] Não adiciona ao carrinho
- [ ] Modal continua aberto
- [ ] Selecionar complemento debloqueia o botão

**Se falhar**:
- [ ] Nenhuma validação aparece?
  - Verifique se `isRequired: true` está no backend
  - Verifique se `minSelect > 0`
- [ ] Bloqueou mesmo tendo selecionado?
  - Verifique `minSelect` vs. quantidade selecionada

---

### 9️⃣ Teste de Observações

**Ação**: Digitar observações no campo de texto

**Exemplo**: "Sem cebola, com molho extra"

**Esperado**:
- [ ] Campo aceita texto
- [ ] Após adicionar ao carrinho, nota aparece no carrinho
- [ ] No ProductModal, vê a observação digitada

**Se falhar**:
- [ ] Campo desapareceu? É opcional, pode estar oculto
- [ ] Nota não persiste no carrinho? Verifique CartContext

---

### 🔟 Teste de Quantidade

**Ação**: Clicar em + e - para alterar quantidade

**Esperado**:
- [ ] Botão "-" fica desabilitado quando quantidade é 1
- [ ] Quantidade aumenta/diminui com cliques
- [ ] Preço total multiplica pela quantidade
- [ ] Botão mostra "Adicionar • R$ XX,XX"

**Se falhar**:
- [ ] Quantidade não muda? Verifique onClick dos botões
- [ ] Preço não multiplica? Verifique cálculo no `useMemo`

---

### 1️⃣1️⃣ Teste de Adicionar ao Carrinho

**Ação**: Clicar em "Adicionar • R$ XX,XX"

**Esperado**:
- [ ] Modal fecha
- [ ] Badge no carrinho mostra número incrementado
- [ ] Não há erro no console
- [ ] Carrinho persiste se recarregar a página

**Se falhar**:
- [ ] Modal não fecha? Verifique `onClose()` chamado
- [ ] Badge não atualiza? Verifique Context re-render
- [ ] Carrinho não persiste? localStorage pode estar desabilitado

---

### 1️⃣2️⃣ Teste do Carrinho (CartSheet)

**Ação**: Clicar no ícone de carrinho (shopping cart)

**Esperado**:
- [ ] Sheet abre da direita
- [ ] Mostra lista de itens adicionados
- [ ] Cada item mostra:
  - [x] Nome do produto
  - [x] Complementos selecionados
  - [x] Observações (se houver)
  - [x] Quantidade
  - [x] Preço unitário × quantidade
- [ ] Botão "Finalizar Pedido" está visível

**Se falhar**:
- [ ] Sheet não abre? Verifique Radix UI Sheet
- [ ] Itens não aparecem? Verifique CartContext.items
- [ ] Dados errados? Verifique mapeamento de nomes

---

### 1️⃣3️⃣ Teste de Edição de Quantidade

**Ação**: No carrinho, clicar em + e - de um item

**Esperado**:
- [ ] Quantidade muda
- [ ] Preço total atualiza
- [ ] Se quantidade fica 0, item é removido
- [ ] Subtotal recalcula

**Se falhar**:
- [ ] Quantidade não muda? Verifique onClick dos botões
- [ ] Total não atualiza? Verifique `getTotalPrice()`

---

### 1️⃣4️⃣ Teste de Remoção

**Ação**: Clicar no ícone de lixeira em um item do carrinho

**Esperado**:
- [ ] Item desaparece
- [ ] Badge é decrementado
- [ ] Subtotal recalcula
- [ ] Se carrinho fica vazio, mostra mensagem vazia

**Se falhar**:
- [ ] Item não desaparece? Verifique `removeItem()`
- [ ] Badge não atualiza? Verifique `getTotalItems()`

---

### 1️⃣5️⃣ Teste de Persistência do Carrinho

**Ação**:
1. Adicionar item ao carrinho
2. Recarregar página (F5)
3. Abrir carrinho novamente

**Esperado**:
- [ ] Itens continuam no carrinho
- [ ] Quantidades estão corretas
- [ ] Preços estão corretos
- [ ] Observações estão preservadas

**Se falhar**:
- [ ] Carrinho vaziano após recarregar?
  - Verifique localStorage.getItem('menu_cart')
  - Verifique JSON.parse/stringify
  - Pode estar desabilitado no navegador

---

### 1️⃣6️⃣ Teste de Erro 404 (Tenant Inexistente)

**Ação**: Acessar `/menu/slug-inexistente`

**Esperado**:
- [ ] Página exibe erro
- [ ] Mensagem: "Cardápio não encontrado"
- [ ] Ícone de alerta
- [ ] Botão "Voltar ao início"

**Se falhar**:
- [ ] Tela branca? Erro não foi tratado
- [ ] Mensagem genérica? Verifique status code no handler

---

### 1️⃣7️⃣ Teste de Erro 403 (Tenant Inativo)

**Pré-requisito**: Tenant com `status: 'inactive'`

**Ação**: Acessar `/menu/tenant-inativo`

**Esperado**:
- [ ] Exibe erro amigável
- [ ] Mensagem: "Estabelecimento indisponível"

**Se falhar**:
- [ ] Não reconheceu status 403? Verifique `res.status`

---

### 1️⃣8️⃣ Teste de Erro 404 (Módulo Desativado)

**Pré-requisito**: Tenant sem módulo menu-online habilitado

**Ação**: Acessar `/menu/tenant-sem-modulo`

**Esperado**:
- [ ] Exibe erro
- [ ] Mensagem: "Cardápio temporariamente indisponível"

**Se falhar**:
- [ ] Tratamento pode estar genérico

---

### 1️⃣9️⃣ Teste de Offline

**Pré-requisito**: DevTools aberto (F12 → Network tab)

**Ação**:
1. Abrir Network tab
2. Marcar "Offline"
3. Recarregar página

**Esperado**:
- [ ] Exibe erro amigável (não tela branca)
- [ ] Mensagem clara sobre problema de conexão

**Se falhar**:
- [ ] Error handling pode estar incompleto

---

### 2️⃣0️⃣ Teste de Performance (Console)

**Ação**: Abrir DevTools → Console

**Esperado**:
- [ ] Nenhum erro em vermelho
- [ ] Nenhum aviso de TypeScript
- [ ] [v0] logs aparecem para debug (se houver)
- [ ] Network tab mostra requisição ao `/menu/{slug}`

**Se falhar**:
- [ ] Erros em vermelho? Copie e reporte
- [ ] Warnings? Verifique se são críticos

---

## 🐛 Debug

### Logs Úteis
```javascript
// Console browser (F12)
// Ver último fetch
localStorage.getItem('menu_cart')
JSON.parse(localStorage.getItem('menu_cart'))

// Ver estado do Context
// Coloque break point em CartContext
```

### Network Debugging
```
F12 → Network tab → Filtrar por "menu"
Verifique:
- Status: 200 (sucesso)
- Content-Type: application/json
- Response: MenuOnlinePublicMenuDTO válido
- Size: nem muito grande nem vazio
```

### Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| "Cardápio não encontrado" | Tenant slug errado ou não existe | Verifique slug no banco |
| Produtos não aparecem | Sem produtos ativos ou sem categorias | Crie dados no backend |
| Imagens quebradas | showImages false ou URL inválida | Verifique URL da imagem |
| Carrinho vazio | localStorage desabilitado | Habilite localStorage no navegador |
| Modal não fecha | Erro no onClose() | Verifique console para exceptions |
| Fetch não acontece | NEXT_PUBLIC_API_URL errado | Verifique env var |

---

## 📊 Resultado Esperado

Após completar todos os testes acima:

✅ **Integração Real Validada**
- Cardápio carrega dados reais do backend
- Todos os estados de erro tratados
- Carrinho funciona com persistência
- Validações de complementos funcionam
- Sem erros no console
- Sem telas brancas
- TypeScript strict sem erros
- ESLint sem violations

---

## 🚀 Próximos Passos

Se todos os testes passarem:

1. ✅ ETAPA 1 concluída
2. 📋 Vá para ETAPA 2 (Conversão, Checkout, Pedidos)
3. 🎯 Implementar:
   - Modal de upsell
   - Página de checkout
   - Integração com pedidos
   - Validações em tempo real

---

**Tempo estimado**: 20-30 minutos para todos os testes  
**Último atualizado**: 2026-01-31  
**Versão**: ETAPA 1 - Integração Real
