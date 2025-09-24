
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { LoginState } from '@/ai/types';

// --- ADMIN AUTH ---
export async function login(prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const username = (formData.get('username') as string).trim();
  const password = (formData.get('password') as string).trim();

  // Hardcode credential check to bypass any potential environment variable issues.
  const adminUsername = 'admin';
  const adminPassword = 'admin1234';

  const credentialsMatch = username === adminUsername && password === adminPassword;

  if (credentialsMatch) {
    cookies().set('auth_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    redirect('/admin/dashboard');
  } 
  
  return { success: false, message: 'Invalid username or password.' };
}

export async function logout() {
    cookies().delete('auth_session');
    redirect('/admin/login');
}


// --- CLIENT AUTH (Mock Implementation) ---
export async function clientLogin(prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const email = (formData.get('email') as string).trim();
  const password = (formData.get('password') as string).trim();

  // Hardcode credential check to bypass any potential environment variable issues.
  const clientUsername = "client@revive.com";
  const clientPassword = "password123";

  const credentialsMatch = email === clientUsername && password === clientPassword;

  if (credentialsMatch) {
    cookies().set('client_auth_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    redirect('/client/dashboard');
  } 
  
  return { success: false, message: 'Invalid email or password.' };
}

export async function clientLogout() {
    cookies().delete('client_auth_session');
    redirect('/client/login');
}
