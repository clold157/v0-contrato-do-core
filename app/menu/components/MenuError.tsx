'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface MenuErrorProps {
  tenantSlug: string;
}

export function MenuError({ tenantSlug }: MenuErrorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4 max-w-md">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="w-16 h-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Cardápio não encontrado</h1>
        <p className="text-muted-foreground mb-6">
          Desculpe, não conseguimos carregar o cardápio neste momento. O estabelecimento pode estar indisponível ou o módulo de cardápio online pode estar desativado.
        </p>
        <div className="space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
