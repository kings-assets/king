'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Activity,
  LogOut,
  Newspaper,
  PanelLeft,
} from 'lucide-react';
import { logout } from '@/app/actions/authActions';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const adminNavLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Activity },
  { href: '/admin/blog-assistant', label: 'Blog Assistant', icon: Newspaper },
];

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar className="border-r border-sidebar-border bg-sidebar-background">
            <SidebarHeader>
              <div className="flex items-center gap-2 p-2">
                <Image src="/logo.png" alt="Rudra R8 Logo" width={150} height={40} className="h-8 w-auto" />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {adminNavLinks.map((link) => (
                  <SidebarMenuItem key={link.href}>
                    <Link href={link.href}>
                      <SidebarMenuButton
                        isActive={pathname === link.href}
                        tooltip={link.label}
                      >
                        <link.icon />
                        <span>{link.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <form action={logout}>
                     <SidebarMenu>
                         <SidebarMenuItem>
                            <button type="submit" className={cn(
                                "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50",
                                "h-8 text-sm"
                            )}>
                                <LogOut className="h-4 w-4 shrink-0" />
                                <span className="truncate">Logout</span>
                            </button>
                        </SidebarMenuItem>
                     </SidebarMenu>
                </form>
            </SidebarFooter>
        </Sidebar>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
