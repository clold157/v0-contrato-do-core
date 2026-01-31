import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { MenuOnlinePublicMenuDTO } from '../types';
import Link from 'next/link';

interface CartSheetProps {
  menuData: MenuOnlinePublicMenuDTO;
  tenantSlug: string;
}

export function CartSheet({ menuData, tenantSlug }: CartSheetProps) {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCart();

  const getProductName = (productId: string) => {
    return menuData.products.find((p) => p.id === productId)?.name || 'Produto';
  };

  const getVariationName = (productId: string, variationId: string | null | undefined) => {
    if (!variationId) return null;
    const product = menuData.products.find((p) => p.id === productId);
    return product?.priceVariations.find((v) => v.id === variationId)?.name;
  };

  const getModifierNames = (modifierIds: string[]) => {
    return modifierIds
      .map((id) => menuData.modifierOptions.find((m) => m.id === id)?.name)
      .filter(Boolean);
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Seu Pedido</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item, index) => {
                  const productName = getProductName(item.productId);
                  const variationName = getVariationName(item.productId, item.variationId);
                  const modifierNames = getModifierNames(item.modifierOptionIds);
                  const itemTotal = item.price * item.quantity;

                  return (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold">{productName}</h4>
                          {variationName && (
                            <p className="text-sm text-muted-foreground">{variationName}</p>
                          )}
                          {modifierNames.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {modifierNames.join(', ')}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-sm text-muted-foreground italic mt-1">
                              Obs: {item.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(index)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="font-semibold">R$ {itemTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span>R$ 5,00</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {(totalPrice + 5).toFixed(2)}</span>
                </div>
              </div>

              <Button size="lg" className="w-full" asChild>
                <Link href={`/menu/${tenantSlug}/checkout`}>
                  Finalizar Pedido
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
