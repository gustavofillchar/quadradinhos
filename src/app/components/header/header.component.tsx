import React from 'react';
import { useCounter } from '@/app/contexts/CounterContext';

const Header: React.FC = () => {
  const { occupiedCount, totalSquares } = useCounter();
  
  const formattedCount = String(occupiedCount).padStart(5, '0');
  const formattedTotal = String(totalSquares).padStart(5, '0');

  return (
    <header className='bg-gray-800 py-1 sm:py-2 px-2 sm:px-4 flex justify-between items-center sticky top-0 z-50'>
      <div className='flex flex-col'>
        <h1 className='text-yellow-500 font-bold uppercase text-lg sm:text-3xl tracking-widest'>
          <span className='hidden sm:inline'>Quadradinhos de </span>
          <span className='sm:hidden'>Quadrados de </span>
          <span className='text-orange-500'>um real</span>
        </h1>
        <span className='text-white opacity-50 text-sm sm:text-base'>{formattedCount} / {formattedTotal}</span>
      </div>

      <div className='h-10 sm:h-14 flex'>
        <img src="moeda.svg" alt="Página de Um Real" className='h-auto'/>
      </div>
    </header>
  );   
}

export default Header;