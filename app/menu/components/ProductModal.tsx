import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import type { MenuOnlineProductDTO, MenuOnlinePublicMenuDTO } from '@/src/types/menu-online';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: MenuOnlineProductDTO;
  isOpen: boolean;
  onClose: () => void;
  menuData: MenuOnlinePublicMenuDTO;
}

export function ProductModal({ product, isOpen, onClose, menuData }: ProductModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    product.priceVariations.find((v) => v.isDefault)?.id || product.priceVariations[0]?.id || null
  );
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState('');

  const hasPromo = product.promoPrice !== null;
  const basePrice = hasPromo ? product.promoPrice : product.basePrice;

  const modifierGroups = useMemo(() => {
    return product.modifierGroupIds
      .map((groupId) => {
        const group = menuData.modifierGroups.find((g) => g.id === groupId);
        if (!group) return null;
        const options = menuData.modifierOptions.filter((o) => o.groupId === groupId && o.status === 'active');
        return { group, options };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [product.modifierGroupIds, menuData]);

  const selectedVariation = useMemo(() => {
    if (!selectedVariationId) return null;
    return product.priceVariations.find((v) => v.id === selectedVariationId);
  }, [selectedVariationId, product.priceVariations]);

  const totalPrice = useMemo(() => {
    let price = selectedVariation ? selectedVariation.price : basePrice || 0;
    
    Object.values(selectedModifiers).flat().forEach((optionId) => {
      const option = menuData.modifierOptions.find((o) => o.id === optionId);
      if (option) {
        price += option.priceDelta;
      }
    });
    
    return price * quantity;
  }, [basePrice, selectedVariation, selectedModifiers, quantity, menuData.modifierOptions]);

  const canAddToCart = useMemo(() => {
    return modifierGroups.every(({ group }) => {
      const selected = selectedModifiers[group.id]?.length || 0;
      return selected >= group.minSelect && selected <= group.maxSelect;
    });
  }, [modifierGroups, selectedModifiers]);

  const handleModifierChange = (groupId: string, optionId: string, isChecked: boolean) => {
    const group = modifierGroups.find((g) => g.group.id === groupId)?.group;
    if (!group) return;

    setSelectedModifiers((prev) => {
      const current = prev[groupId] || [];
      
      if (group.maxSelect === 1) {
        return { ...prev, [groupId]: isChecked ? [optionId] : [] };
      }
      
      if (isChecked) {
        if (current.length < group.maxSelect) {
          return { ...prev, [groupId]: [...current, optionId] };
        }
        return prev;
      } else {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
    });
  };

  const handleAddToCart = () => {
    const allModifierIds = Object.values(selectedModifiers).flat();
    
    addItem({
      productId: product.id,
      variationId: selectedVariationId,
      quantity,
      modifierOptionIds: allModifierIds,
      notes: notes.trim() || undefined,
      price: totalPrice / quantity,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>
        
        {product.images.length > 0 && (
          <div className="relative w-full h-64 -mt-6 -mx-6 mb-4">
            <Image
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              fill
              className="object-cover"
            />
            {hasPromo && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                Promoção
              </Badge>
            )}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            {hasPromo && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.basePrice.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-bold">
              R$ {(basePrice || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {product.priceVariations.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tamanho</Label>
            <RadioGroup value={selectedVariationId || ''} onValueChange={setSelectedVariationId}>
              {product.priceVariations.map((variation) => (
                <div key={variation.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={variation.id} id={variation.id} />
                    <Label htmlFor={variation.id} className="cursor-pointer">
                      {variation.name}
                    </Label>
                  </div>
                  <span className="font-semibold">R$ {variation.price.toFixed(2)}</span>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {modifierGroups.map(({ group, options }) => {
          const isRadio = group.maxSelect === 1;
          const selected = selectedModifiers[group.id] || [];
          
          return (
            <div key={group.id} className="space-y-3">
              <div>
                <Label className="text-base font-semibold">{group.name}</Label>
                {group.description && (
                  <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {group.isRequired && (
                    <Badge variant="secondary" className="text-xs">Obrigatório</Badge>
                  )}
                  {group.maxSelect > 1 && (
                    <span className="text-xs text-muted-foreground">
                      Escolha até {group.maxSelect}
                    </span>
                  )}
                  {selected.length > 0 && group.maxSelect > 1 && (
                    <span className="text-xs text-muted-foreground">
                      ({selected.length}/{group.maxSelect})
                    </span>
                  )}
                </div>
              </div>

              {isRadio ? (
                <RadioGroup 
                  value={selected[0] || ''} 
                  onValueChange={(value) => handleModifierChange(group.id, value, true)}
                >
                  {options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer">
                          {option.name}
                        </Label>
                      </div>
                      {option.priceDelta > 0 && (
                        <span className="text-sm font-medium">+ R$ {option.priceDelta.toFixed(2)}</span>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {options.map((option) => {
                    const isChecked = selected.includes(option.id);
                    const isDisabled = !isChecked && selected.length >= group.maxSelect;
                    
                    return (
                      <div key={option.id} className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={option.id}
                            checked={isChecked}
                            onCheckedChange={(checked) => 
                              handleModifierChange(group.id, option.id, checked === true)
                            }
                            disabled={isDisabled}
                          />
                          <Label 
                            htmlFor={option.id} 
                            className={`cursor-pointer ${isDisabled ? 'opacity-50' : ''}`}
                          >
                            {option.name}
                          </Label>
                        </div>
                        {option.priceDelta > 0 && (
                          <span className="text-sm font-medium">+ R$ {option.priceDelta.toFixed(2)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            placeholder="Alguma observação? Ex: Tirar cebola, sem picante..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="flex-1 ml-4"
          >
            Adicionar • R$ {totalPrice.toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
