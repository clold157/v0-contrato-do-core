import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { MenuOnlineProductDTO } from '../types';
import Image from 'next/image';

interface ProductCardProps {
  product: MenuOnlineProductDTO;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const hasPromo = product.promoPrice !== null;
  const currentPrice = hasPromo ? product.promoPrice : product.basePrice;
  const hasModifiers = product.modifierGroupIds.length > 0;
  const hasVariations = product.priceVariations.length > 0;

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-4 p-4">
        {product.images.length > 0 && (
          <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              fill
              className="object-cover"
            />
            {hasPromo && (
              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                Promoção
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-lg leading-tight mb-1">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {hasPromo && (
                  <span className="text-sm text-muted-foreground line-through">
                    R$ {product.basePrice.toFixed(2)}
                  </span>
                )}
                <span className="text-lg font-bold">
                  {hasVariations ? 'A partir de ' : ''}R$ {currentPrice?.toFixed(2)}
                </span>
              </div>
            </div>
            
            <Button size="sm" variant={hasModifiers || hasVariations ? 'outline' : 'default'}>
              {hasModifiers || hasVariations ? 'Personalizar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
