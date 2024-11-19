import React from 'react';

const Header: React.FC = () => {
  return (
    <header className='bg-gray-800 py-2 px-4 flex justify-between items-center'>
        <div className='flex flex-col'>
        <h1 className='text-yellow-500 font-bold uppercase text-3xl tracking-widest'>Quadradinhos de <span className='text-orange-500'>um real</span></h1>
         <span className='text-white opacity-50'>00001 / 10000</span>   
        </div>

        <div className='h-14 flex'>
            <img src="moeda.svg" alt="Página de Um Real"  className='h-auto'/>
        </div>
    </header>
  );   
}

export default Header;