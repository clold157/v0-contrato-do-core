'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MenuOnlineProductDTO, MenuOnlinePublicMenuDTO } from '@/src/types/menu-online';

interface ProductCardProps {
  product: MenuOnlineProductDTO;
  onClick: () => void;
  menuData: MenuOnlinePublicMenuDTO;
}

export function ProductCard({ product, onClick, menuData }: ProductCardProps) {
  const image = product.images[0];
  const hasPromo = product.promoPrice && product.promoPrice < product.basePrice;
  const displayPrice = hasPromo ? product.promoPrice : product.basePrice;
  const originalPrice = product.basePrice;

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex gap-4 p-4">
        {menuData.settings.showImages && image && (
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={image.url}
              alt={image.altText || product.name}
              fill
              className="object-cover rounded-lg"
              priority={false}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm">{product.name}</h3>
              {product.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>
            {hasPromo && <Badge variant="destructive" className="text-xs">Promoção</Badge>}
          </div>
          <div className="flex items-center gap-2 mt-3">
            {hasPromo && (
              <span className="text-xs text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-sm">R$ {displayPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
