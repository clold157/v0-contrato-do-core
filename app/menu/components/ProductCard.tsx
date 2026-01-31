'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
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
  const discount = hasPromo ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-xl hover:border-primary/20 transition-all duration-200 group"
      onClick={onClick}
    >
      <div className="flex gap-4 p-3">
        {menuData.settings.showImages && image && (
          <div className="relative w-28 h-28 flex-shrink-0">
            <Image
              src={image.url}
              alt={image.altText || product.name}
              fill
              className="object-cover rounded-xl"
              priority={false}
            />
            {hasPromo && (
              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground font-bold shadow-lg">
                -{discount}%
              </Badge>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base leading-tight text-balance mb-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col gap-0.5">
              {hasPromo && (
                <span className="text-xs text-muted-foreground line-through">
                  R$ {originalPrice.toFixed(2)}
                </span>
              )}
              <span className="font-bold text-lg text-primary">
                R$ {displayPrice.toFixed(2)}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
