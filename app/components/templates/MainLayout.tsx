'use client';

import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Heart Recipes
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Find the perfect recipe that matches your mood and occasion
          </p>
        </header>

        <main>{children}</main>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Made with ❤️ for food and feelings</p>
        </footer>
      </div>
    </div>
  );
} 