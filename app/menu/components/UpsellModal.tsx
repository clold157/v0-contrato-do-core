import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import type { MenuOnlineProductDTO, MenuOnlinePublicMenuDTO } from '../types';
import { useCart } from '../context/CartContext';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuData: MenuOnlinePublicMenuDTO;
}

export function UpsellModal({ isOpen, onClose, menuData }: UpsellModalProps) {
  const { addItem } = useCart();
  
  const upsellProducts = menuData.products
    .filter((p) => p.categoryId === 'cat-3' || p.categoryId === 'cat-4')
    .slice(0, 3);

  const handleAddUpsell = (product: MenuOnlineProductDTO) => {
    const price = product.promoPrice !== null ? product.promoPrice : product.basePrice;
    addItem({
      productId: product.id,
      variationId: null,
      quantity: 1,
      modifierOptionIds: [],
      price,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quer adicionar algo mais?</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {upsellProducts.map((product) => {
            const price = product.promoPrice !== null ? product.promoPrice : product.basePrice;
            
            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  {product.images.length > 0 && (
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">R$ {price.toFixed(2)}</span>
                      <Button
                        size="sm"
                        onClick={() => {
                          handleAddUpsell(product);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Não, obrigado
          </Button>
          <Button onClick={onClose} className="flex-1">
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
