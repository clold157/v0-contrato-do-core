'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import type { MenuOnlineProductDTO, MenuOnlinePublicMenuDTO } from '@/src/types/menu-online';
import { useCart } from '../context/CartContext';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuData: MenuOnlinePublicMenuDTO;
  excludeProductId?: string;
}

export function UpsellModal({ isOpen, onClose, menuData, excludeProductId }: UpsellModalProps) {
  const { addItem } = useCart();
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  
  const upsellProducts = menuData.products
    .filter((p) => 
      p.status === 'active' && 
      p.id !== excludeProductId
    )
    .sort((a, b) => {
      if (a.promoPrice && !b.promoPrice) return -1;
      if (!a.promoPrice && b.promoPrice) return 1;
      return 0;
    })
    .slice(0, 4);

  const handleAddUpsell = (product: MenuOnlineProductDTO) => {
    const defaultVariationId = product.priceVariations.find((v) => v.isDefault)?.id || 
      product.priceVariations[0]?.id || null;
    
    const price = defaultVariationId 
      ? product.priceVariations.find((v) => v.id === defaultVariationId)?.price || product.basePrice
      : product.promoPrice || product.basePrice;

    addItem({
      productId: product.id,
      variationId: defaultVariationId,
      quantity: 1,
      modifierOptionIds: [],
      price,
    });

    setAddedProducts(prev => new Set(prev).add(product.id));
    
    setTimeout(() => {
      setAddedProducts(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  if (upsellProducts.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <DialogTitle className="text-2xl font-bold text-balance">
              Que tal adicionar algo mais?
            </DialogTitle>
          </div>
          <p className="text-muted-foreground text-balance">
            Aproveite para completar seu pedido. Clientes também adicionaram:
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {upsellProducts.map((product) => {
            const image = product.images[0];
            const hasPromo = product.promoPrice && product.promoPrice < product.basePrice;
            const displayPrice = hasPromo ? product.promoPrice : product.basePrice;
            const originalPrice = product.basePrice;
            const isAdded = addedProducts.has(product.id);
            
            return (
              <div 
                key={product.id}
                className="border-2 rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all group"
              >
                {menuData.settings.showImages && image && (
                  <div className="relative w-full h-36">
                    <Image
                      src={image.url}
                      alt={image.altText || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {hasPromo && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground font-bold">
                        -{Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm line-clamp-1 text-balance">{product.name}</h4>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      {hasPromo && (
                        <span className="text-xs text-muted-foreground line-through">
                          R$ {originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="font-bold text-primary text-base">
                        R$ {displayPrice.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddUpsell(product)}
                      disabled={isAdded}
                      className="gap-1 font-semibold"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          Adicionado
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
            size="lg"
          >
            Não, obrigado
          </Button>
          <Button 
            onClick={onClose} 
            className="flex-1"
            size="lg"
          >
            Ir para o carrinho
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
