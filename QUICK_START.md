# 🚀 Quick Start - Cardápio Público ETAPA 1

## ⚡ TL;DR

**Integração real do cardápio público com o backend. Sem mocks. Pronto para produção.**

```
/menu/{tenantSlug} → Fetch real /menu/:tenantSlug → Cardápio + Carrinho
```

---

## 🔧 Setup em 2 minutos

### 1. Verificar Env
```bash
# .env.local (ou criar)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Validar Instalação
```bash
npm run type-check  # ✅ Sem erros?
npm run lint        # ✅ Sem violations?
npm run build       # ✅ Build ok?
```

### 3. Acessar
```
http://localhost:3000/menu/seu-tenant-slug
```

---

## 📁 Arquivos Principais

| Arquivo | Propósito |
|---------|-----------|
| `/app/menu/[tenantSlug]/page.tsx` | Fetch real do cardápio |
| `/app/menu/[tenantSlug]/MenuPageClient.tsx` | UI principal |
| `/app/menu/components/ProductModal.tsx` | Modal com complementos |
| `/app/menu/components/CartSheet.tsx` | Carrinho lateral |
| `/app/menu/context/CartContext.tsx` | localStorage do carrinho |

---

## 🎯 Fluxo Rápido

```
1. User acessa /menu/{slug}
2. Server fetch /menu/:slug (real)
3. MenuSkeleton mostra enquanto carrega
4. MenuPageClient renderiza dados reais
5. User busca/filtra/seleciona produto
6. ProductModal abre com complementos
7. Adiciona ao carrinho → CartContext
8. CartSheet mostra itens + totais
9. localStorage persiste entre reloads
```

---

## 🧪 Teste Rápido

### Um produto com complemento obrigatório
```
1. Abra /menu/seu-slug
2. Clique em um produto
3. Tente adicionar sem selecionar complemento obrigatório
4. Deve aparecer: "Por favor, selecione os complementos obrigatórios"
5. Selecione o complemento → agora pode adicionar
```

### Carrinho persiste
```
1. Adicione um item ao carrinho
2. Recarregue a página (F5)
3. Item continua lá? ✅ localStorage funcionando
```

---

## 🚨 Troubleshooting

### "Cardápio não encontrado"
- [ ] Slug do tenant está correto?
- [ ] Tenant existe no banco?
- [ ] Tenant status é "active"?
- [ ] Módulo menu-online habilitado?

### Produtos não aparecem
- [ ] Há produtos ativos no banco?
- [ ] Há categorias ativas?
- [ ] Está buscando um termo que existe?

### Imagens não carregam
- [ ] `showImages: true` nas settings?
- [ ] URL da imagem é válida?
- [ ] Crossorigin configurado?

### Carrinho vazio após recarregar
- [ ] localStorage habilitado no navegador?
- [ ] Check: `localStorage.getItem('menu_cart')`

---

## 📊 Dados Real vs Mock

### Antes (ETAPA 0)
```typescript
const mockMenuData = { /* hardcoded */ };
```

### Depois (ETAPA 1)
```typescript
const response = await fetch('/menu/:tenantSlug');
const menuData = response.data; // 100% real
```

---

## ✅ O Que Funciona

- [x] Busca em tempo real
- [x] Filtro por categoria
- [x] Variações de preço
- [x] Complementos obrigatórios
- [x] Complementos opcionais
- [x] Promoções
- [x] Observações
- [x] Carrinho com localStorage
- [x] Cálculo de totais
- [x] Error handling
- [x] Loading state

---

## 🎓 Documentação Detalhada

| Doc | Conteúdo |
|-----|----------|
| `/app/menu/README.md` | Docs técnica |
| `/INTEGRATION_STATUS.md` | Status features |
| `/ETAPA1_VALIDACAO.md` | Checklist completo |
| `/TESTE_ETAPA1.md` | 20 casos teste |
| `/ETAPA1_RESUMO.md` | Sumário executivo |
| `/MANIFEST_ETAPA1.md` | Arquivos criados |

---

## 🔗 API Consumida

```
GET /menu/:tenantSlug

Response:
{
  success: true,
  data: {
    tenant: { id, slug, name },
    settings: { currency, showImages, showOutOfStock },
    categories: [...],
    products: [...],
    modifierGroups: [...],
    modifierOptions: [...],
    combos: [...]
  }
}
```

---

## 💾 localStorage

Chave: `menu_cart`

```javascript
// Exemplo
[
  {
    productId: "uuid",
    quantity: 2,
    modifierOptionIds: ["uuid"],
    price: 45.50,
    notes: "Sem cebola"
  }
]
```

---

## 🔐 TypeScript

Todos os tipos vêm de:
```typescript
import type { ... } from '@/src/types/menu-online';
```

- ✅ Nenhum `any`
- ✅ Strict mode
- ✅ Build type-safe

---

## 🎯 ETAPA 1 Status

```
✅ COMPLETO E TESTADO
- Integração real: OK
- Sem mocks: OK
- Tipos corretos: OK
- Error handling: OK
- Documentação: OK
- Testes: OK
```

---

## 📋 Checklist Antes de Deploy

- [ ] `npm run type-check` ✅
- [ ] `npm run lint` ✅
- [ ] `npm run build` ✅
- [ ] Teste `/menu/um-slug-real`
- [ ] Carrinho persiste
- [ ] Complemento obrigatório valida
- [ ] Erros mostram mensagens legíveis
- [ ] NEXT_PUBLIC_API_URL setado

---

## 🎬 Próximos Passos

ETAPA 2 (depois):
- [ ] Modal de upsell
- [ ] Página de checkout
- [ ] Sistema de pedidos
- [ ] Otimizações de conversão

---

## 👨‍💻 Para Desenvolvedores

### Adicionar Funcionalidade?

1. Feature local → Teste em `MenuPageClient.tsx`
2. Feature de dados → Valide tipos em `MenuOnlinePublicMenuDTO`
3. Feature carrinho → Edite `CartContext.tsx`
4. Feature modal → Edite `ProductModal.tsx`

### Debug?

```javascript
// Console browser
console.log(localStorage.getItem('menu_cart'))

// Network tab
// Procure por requisição GET para /menu/{slug}
```

---

## 📞 Help

Problema não resolvido?

1. Leia `/TESTE_ETAPA1.md`
2. Verifique `/INTEGRATION_STATUS.md`
3. Consulte `/ETAPA1_VALIDACAO.md`
4. Check `/app/menu/README.md`

---

## 🎉 Conclusão

**ETAPA 1 está 100% pronta. Sem mocks. Dados reais. Pronto para produção.**

Qualquer dúvida → Veja docs acima.

---

**Última atualização**: 2026-01-31  
**Versão**: ETAPA 1 - Integração Real  
**Status**: ✅ COMPLETO
