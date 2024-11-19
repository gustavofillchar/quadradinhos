'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface GridProps {
  onPositionSelect: (position: number) => void;
}

type OccupiedPosition = {
  position: number;
  name: string;
  imagePath: string;
}

const GridComponent: React.FC<GridProps> = ({ onPositionSelect }) => {
  const [occupiedPositions, setOccupiedPositions] = useState<OccupiedPosition[]>([])
  const [reservedPositions, setReservedPositions] = useState<number[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const fetchOccupiedPositions = useCallback(async () => {
    const { data: purchases } = await supabase
      .from('purchases')
      .select('position, name, image_path')
      .eq('status', 'completed')

    if (purchases) {
      setOccupiedPositions(
        purchases.map(p => ({
          position: p.position,
          name: p.name,
          imagePath: p.image_path
        }))
      )
    }
  }, [])

  const fetchReservedPositions = useCallback(async () => {
    const { data: reservations } = await supabase
      .from('purchases')
      .select('position')
      .eq('status', 'pending')
      .gte('reserved_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())

    if (reservations) {
      setReservedPositions(reservations.map(r => r.position))
    }
  }, [])

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchOccupiedPositions(),
        fetchReservedPositions()
      ])
      setIsInitialLoading(false)
    }

    fetchInitialData()

    const purchasesChannel = supabase
      .channel('purchases')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchases'
        },
        () => {
          fetchOccupiedPositions()
          fetchReservedPositions()
        }
      )
      .subscribe()

    return () => {
      purchasesChannel.unsubscribe()
    }
  }, [fetchOccupiedPositions, fetchReservedPositions])

  const gridData = useMemo(() => {
    const grid: { position: number; isOccupied: OccupiedPosition | undefined; isReserved: boolean; }[][] = []
    for (let i = 0; i < 150; i++) {
      const row: { position: number; isOccupied: OccupiedPosition | undefined; isReserved: boolean; }[] = []
      for (let j = 0; j < 200; j++) {
        const position = i * 200 + j + 1
        row.push({
          position,
          isOccupied: occupiedPositions.find(p => p.position === position),
          isReserved: reservedPositions.includes(position)
        })
      }
      grid.push(row)
    }
    return grid
  }, [occupiedPositions, reservedPositions])

  const handleSquareClick = useCallback((position: number) => {
    onPositionSelect(position)
  }, [onPositionSelect])

  const GridSquare = useMemo(() => {
    return ({ position, isOccupied, isReserved }: { 
      position: number, 
      isOccupied: OccupiedPosition | undefined, 
      isReserved: boolean 
    }) => {
      const squareContent = (
        <div
          className={`
            relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border border-gray-200
            flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs
            group overflow-hidden text-gray-500
            ${isReserved ? 'bg-yellow-500' : ''}
            ${!isOccupied && !isReserved ? 'bg-white hover:bg-blue-200' : ''}
            transition-colors duration-200 cursor-pointer
          `}
          onClick={() => !isOccupied && !isReserved && handleSquareClick(position)}
          title={`Posição ${position}`}
        >
          {isOccupied ? (
            <>
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${isOccupied.imagePath}`}
                alt={isOccupied.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute hidden group-hover:block z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                <div className="bg-white rounded-lg shadow-lg p-2">
                  <p className="text-xs text-center text-gray-700 whitespace-nowrap">{isOccupied.name}</p>
                </div>
              </div>
            </>
          ) : (
            position
          )}
        </div>
      );

      return isOccupied ? (
        <Link href={`/square/${position}`} target="_blank">
          {squareContent}
        </Link>
      ) : (
        squareContent
      );
    };
  }, [handleSquareClick]);

  if (isInitialLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Carregando quadradinhos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-auto flex flex-col p-2 sm:p-4 items-center">
      <div className="mb-4 flex flex-wrap justify-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200"></div>
          <span className="text-xs sm:text-sm">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500"></div>
          <span className="text-xs sm:text-sm">Reservado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500"></div>
          <span className="text-xs sm:text-sm">Comprado</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto w-full">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(24px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(32px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-px max-w-full sm:max-w-[800px] md:max-w-[1000px] mx-auto">
          {gridData.flat().map((square) => (
            <GridSquare
              key={square.position}
              position={square.position}
              isOccupied={square.isOccupied}
              isReserved={square.isReserved}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GridComponent;