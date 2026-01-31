'use client';

import { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [useCashback, setUseCashback] = useState(false);

  const mockCart = {
    items: [
      { name: 'X-Bacon Especial', quantity: 1, price: 28.90 },
      { name: 'Coca-Cola 350ml', quantity: 2, price: 5.00 },
    ],
    subtotal: 38.90,
    deliveryFee: 5.00,
    discount: 0,
    total: 43.90,
  };

  const mockCashback = {
    available: 15.50,
    canUse: true,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[v0] Submitting order...');
    alert('Pedido confirmado! (Integração virá depois)');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Finalizar Pedido</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Dados Pessoais</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" placeholder="Seu nome" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" placeholder="(00) 00000-0000" required />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Endereço de Entrega</h2>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Rua, número" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" placeholder="Bairro" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" placeholder="Apto, bloco..." />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="cursor-pointer flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Cartão de Crédito
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="debit-card" id="debit-card" />
                    <Label htmlFor="debit-card" className="cursor-pointer flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Cartão de Débito
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="cursor-pointer flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Dinheiro
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {mockCashback.canUse && (
              <Card className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Cashback Disponível</h2>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">R$ {mockCashback.available.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Disponível para uso</p>
                  </div>
                  <Button
                    type="button"
                    variant={useCashback ? 'default' : 'outline'}
                    onClick={() => setUseCashback(!useCashback)}
                  >
                    {useCashback ? 'Usando' : 'Usar'}
                  </Button>
                </div>
              </Card>
            )}

            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Observações</h2>
              <Textarea
                placeholder="Alguma observação para o restaurante?"
                rows={3}
              />
            </Card>
          </div>

          <div>
            <Card className="p-6 space-y-4 sticky top-24">
              <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
              
              <div className="space-y-3">
                {mockCart.items.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {mockCart.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span>R$ {mockCart.deliveryFee.toFixed(2)}</span>
                </div>
                
                {useCashback && (
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span>Cashback</span>
                    <span>- R$ {Math.min(mockCashback.available, mockCart.total).toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    R$ {(useCashback 
                      ? Math.max(0, mockCart.total - mockCashback.available)
                      : mockCart.total
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Confirmar Pedido
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Ao confirmar, você concorda com os termos de uso
              </p>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
}
