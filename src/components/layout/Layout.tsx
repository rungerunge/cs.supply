import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'CS.Supply - CS:GO Skin Marketplace' 
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Buy and sell CS:GO skins at the best prices" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout; 