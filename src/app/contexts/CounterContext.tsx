import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CounterContextType {
  occupiedCount: number;
  totalSquares: number;
}

const CounterContext = createContext<CounterContextType>({
  occupiedCount: 0,
  totalSquares: 30000
});

export const useCounter = () => useContext(CounterContext);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [occupiedCount, setOccupiedCount] = useState(0);
  const totalSquares = 30000;

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('purchases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      
      setOccupiedCount(count || 0);
    };

    fetchCount();

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
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      purchasesChannel.unsubscribe();
    };
  }, []);

  return (
    <CounterContext.Provider value={{ occupiedCount, totalSquares }}>
      {children}
    </CounterContext.Provider>
  );
}