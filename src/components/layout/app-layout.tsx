"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  Settings, 
  Layers, 
  Receipt, 
  FileText,
  LogOut,
  Menu
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    title: "Materiales",
    href: "/materiales",
    icon: Layers,
  },
  {
    title: "Complementos",
    href: "/complementos",
    icon: Box,
  },
  {
    title: "Gastos Adicionales",
    href: "/gastos",
    icon: Receipt,
  },
  {
    title: "Productos",
    href: "/productos",
    icon: Settings, // Simboliza el motor/engranaje principal
  },
  {
    title: "Proformas",
    href: "/proformas",
    icon: FileText,
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  onNavigate?: () => void;
}

function SidebarNav({ className, onNavigate, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid items-start gap-2", className)} {...props}>
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link key={index} href={item.href} onClick={onNavigate}>
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

import { logout } from "@/lib/actions/logout";

interface AppLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    username: string;
    name?: string | null;
    nivel: number;
  };
}

export function AppLayout({ children, user }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="px-2 md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-start gap-2 border-b py-6">
                    <span className="text-xl font-bold tracking-tight">Laser Creation</span>
                  </div>
                  <ScrollArea className="flex-1 py-6">
                    <SidebarNav onNavigate={() => setIsMobileMenuOpen(false)} />
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Logo */}
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-xl font-bold tracking-tight">Laser Creation Tacna</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user.name || "User"} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    @{user.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1 text-primary">
                    {user.nivel === 2 ? "Administrador" : "Usuario"}
                  </p>
                </div>
                <div className="p-2 border-t mt-2">
                  <form action={logout}>
                    <Button variant="destructive" size="sm" className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </form>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Desktop Sidebar */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <SidebarNav />
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex w-full flex-col overflow-hidden py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
