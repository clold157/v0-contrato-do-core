# Cardápio Público - Integração Real (ETAPA 1)

## 📦 Estrutura

```
app/menu/
├── [tenantSlug]/
│   ├── page.tsx           # Server component com fetch real
│   └── MenuPageClient.tsx # Client component com UI
├── components/
│   ├── ProductCard.tsx    # Card de produto
│   ├── ProductModal.tsx   # Modal de seleção com complementos
│   ├── CartSheet.tsx      # Carrinho lateral
│   ├── MenuSkeleton.tsx   # Loading state
│   └── MenuError.tsx      # Error state
├── context/
│   └── CartContext.tsx    # Carrinho com localStorage
├── layout.tsx             # Layout wrapper com CartProvider
└── README.md
```

## 🔌 Integração com Backend

### Endpoint
```
GET /menu/:tenantSlug
```

### Resposta
```typescript
{
  success: true,
  data: MenuOnlinePublicMenuDTO {
    tenant: { id, slug, name },
    settings: { currency, showOutOfStock, showImages },
    categories: MenuOnlineCategoryDTO[],
    products: MenuOnlineProductDTO[],
    modifierGroups: MenuOnlineModifierGroupDTO[],
    modifierOptions: MenuOnlineModifierOptionDTO[],
    combos: MenuOnlineComboDTO[]
  }
}
```

## 💾 Carrinho (localStorage)

Chave: `menu_cart`

Estrutura:
```typescript
CartItemData {
  productId: string;
  variationId?: string | null;
  quantity: number;
  modifierOptionIds: string[];
  notes?: string;
  price: number;
}
```

## 🎯 Fluxo de Dados

1. **Server (page.tsx)**
   - Fetch real do `/menu/:tenantSlug`
   - Validação de resposta
   - Suspense boundary com skeleton

2. **Client (MenuPageClient.tsx)**
   - Filtro por status "active"
   - Busca e filtragem por categoria
   - Seleção de produto
   - Abertura de modal

3. **ProductModal.tsx**
   - Validação de complementos obrigatórios
   - Seleção de variações
   - Cálculo dinâmico de preço
   - Adição ao carrinho

4. **CartSheet.tsx**
   - Exibição de itens
   - Edição de quantidades
   - Cálculo de totais
   - Link para checkout

## ✅ Validações Implementadas

- [x] Complementos obrigatórios (`isRequired`)
- [x] Minério e máximo de seleção (`minSelect`, `maxSelect`)
- [x] Preço delta de complementos
- [x] Variações de preço
- [x] Promoções (baseadas em `promoPrice` e data)
- [x] Status "active" para categorias/produtos/complementos
- [x] Ordenação por `sortOrder`

## 🚨 Tratamento de Erros

### 404 - Tenant não encontrado
→ Exibe `MenuError` com mensagem amigável

### 403 - Tenant inativo
→ Exibe `MenuError` com "Estabelecimento indisponível"

### 404 - Módulo desativado
→ Exibe `MenuError` com "Cardápio temporariamente indisponível"

### Erro de rede
→ Exibe `MenuError` genérico

### Erro ao parsear JSON
→ Exibe `MenuError` e loga no console

## 🔒 Tipagem

Todos os tipos vêm de `@/src/types/menu-online`:
- ✅ Nenhum `any`
- ✅ Nenhum cast forçado
- ✅ TypeScript strict

## 🧪 Teste

```bash
# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## 📍 URL de Acesso

```
http://localhost:3000/menu/{tenantSlug}
```

Onde `{tenantSlug}` é o slug configurado no tenant.

## 🔄 Estados da Interface

### Loading
- Skeleton com estrutura de página
- Progressiva enhancement

### Vazio
- "Nenhum produto encontrado" (quando filtro não retorna itens)
- "Seu carrinho está vazio" (no CartSheet)

### Erro
- "Cardápio não encontrado" (tenant inexistente ou módulo desativado)
- Link de volta ao início

### Sucesso
- Cardápio completo
- Carrinho funcional
- Modal de produto com complementos

## 📋 Checklist para ETAPA 2

- [ ] Modal de upsell após adicionar ao carrinho
- [ ] Página de checkout com formulário
- [ ] Integração com sistema de pedidos
- [ ] Validação de disponibilidade em tempo real
- [ ] Otimizações de conversão (recomendações, cupons, etc)
