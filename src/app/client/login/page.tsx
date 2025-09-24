
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { clientLogin } from '@/app/actions/authActions';
import type { LoginState } from '@/ai/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2, AlertTriangle, User } from 'lucide-react';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
      Sign In
    </Button>
  );
}

export default function ClientLoginPage() {
  const initialState: LoginState = { success: false, message: '' };
  const [state, dispatch] = useFormState(clientLogin, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <Image src="/logo.png" alt="Rudra R8 Logo" width={250} height={60} className="mx-auto glow-primary mb-4" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
                <User /> Client Portal Access
            </h2>
            <p className="mt-2 text-muted-foreground">
                Enter your credentials to access your personal dashboard.
            </p>
        </div>
        <Card>
          <form action={dispatch}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Client Login</CardTitle>
              <CardDescription>
                Use the credentials provided during your onboarding.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {state && !state.success && state.message && (
                <div className="flex items-center gap-x-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/50">
                  <AlertTriangle className="h-4 w-4" />
                  <p>{state.message}</p>
                </div>
              )}
              <p className="text-xs text-center text-muted-foreground bg-muted p-2 rounded-md">
                Demo Credentials:<br/>
                Email: <strong>client@revive.com</strong> | Password: <strong>password123</strong>
              </p>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="client@revive.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
