import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/src/context/AuthContext';
import { LogOut, User, Activity, PlusCircle } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline-block">KeototLM</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className={buttonVariants({ variant: "ghost", className: location.pathname === '/dashboard' ? 'bg-accent' : '' })}>
                  Tìm Kèo
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="cursor-pointer h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)} className="cursor-pointer flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/create-match`)} className="cursor-pointer flex items-center w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Đăng kèo nhanh</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className={buttonVariants({ variant: "ghost" })}>
                  Đăng nhập
                </Link>
                <Link to="/register" className={buttonVariants()}>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-screen-xl px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-auto px-4">
        </div>
      </footer>
    </div>
  );
}
