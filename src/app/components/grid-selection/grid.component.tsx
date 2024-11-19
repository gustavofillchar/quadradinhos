'use client'
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const GridComponent = () => {
 

  return (
    <div className="w-full h-auto bg-gray-100 overflow-hidden">
      <TransformWrapper>
        <TransformComponent>
          <div
            className="grid grid-cols-[repeat(auto-fit,_15px)] gap-1 border-2 border-red-500 w-[500px] h-[500px]"
          >
            <span>Hello</span>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default GridComponent;