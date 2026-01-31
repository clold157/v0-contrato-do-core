'use client';

import { useState, useRef } from 'react';
import { Search, Clock, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockMenuData } from '../mock-data';
import type { MenuOnlineProductDTO } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { CartProvider } from '../context/CartContext';
import { CartSheet } from '../components/CartSheet';

export default function MenuPage({ params }: { params: { slug: string } }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<MenuOnlineProductDTO | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const menuData = mockMenuData;
  
  const isOpen = true;
  const prepTime = '30-40 min';

  const filteredProducts = menuData.products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory && product.status === 'active';
  });

  const productsByCategory = menuData.categories.map((category) => ({
    category,
    products: filteredProducts.filter((p) => p.categoryId === category.id),
  })).filter((group) => group.products.length > 0);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId !== 'all') {
      setTimeout(() => {
        categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleProductClick = (product: MenuOnlineProductDTO) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background border-b">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-balance">{menuData.tenant.name}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Badge variant={isOpen ? 'default' : 'secondary'} className="text-xs">
                      {isOpen ? 'Aberto' : 'Fechado'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Delivery</span>
                  </div>
                </div>
              </div>
              <CartSheet menuData={menuData} tenantSlug={params.slug} />
            </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar no cardápio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 overflow-x-auto pb-2">
          <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {menuData.categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {productsByCategory.map(({ category, products }) => (
          <section
            key={category.id}
            ref={(el) => {
              categoryRefs.current[category.id] = el;
            }}
            className="mb-8"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-bold">{category.name}</h2>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </main>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={isProductModalOpen}
            onClose={() => {
              setIsProductModalOpen(false);
              setSelectedProduct(null);
            }}
            menuData={menuData}
          />
        )}
      </div>
    </CartProvider>
  );
}
