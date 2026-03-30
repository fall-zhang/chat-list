import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import ChatList from '../components/ChatList';
import BottomNav from '../components/BottomNav';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const state = useRouterState();
  const isChatDetail = state.location.pathname.startsWith('/chat/');
  const isTasksPage = state.location.pathname === '/tasks';
  const isProfilePage = state.location.pathname === '/profile';
  const isHome = state.location.pathname === '/';

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className={`flex h-screen w-full bg-[#f5f5f5] dark:bg-[#111111] overflow-hidden transition-colors duration-300`}>
          {/* Sidebar - Visible on Desktop, or Mobile Home */}
          <aside className={`${isHome ? 'flex' : 'hidden md:flex'} w-full md:w-80 flex-col h-full border-r border-[#d1d1d1] dark:border-[#222222] bg-white dark:bg-[#191919] flex-shrink-0`}>
            <div className="flex-1 overflow-hidden">
              <ChatList />
            </div>
            {/* Bottom Nav inside sidebar for Desktop and Mobile Home */}
            <BottomNav />
          </aside>

          {/* Main Content - Visible on Desktop, or Mobile (ChatDetail / Tasks / Profile) */}
          <main className={`${(isChatDetail || isTasksPage || isProfilePage) ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col h-full overflow-hidden relative`}>
            <div className="flex-1 overflow-hidden">
              <Outlet />
            </div>
            {/* Mobile-only bottom nav for Tasks and Profile pages (since sidebar is hidden) */}
            {(isTasksPage || isProfilePage) && (
              <div className="md:hidden w-full flex-shrink-0">
                <BottomNav />
              </div>
            )}
          </main>
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}
