import { type FilterType } from '../types/todo';

interface TodoFooterProps {
  itemsLeft: number;
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

const TodoFooter = ({ 
  itemsLeft, 
  currentFilter, 
  onFilterChange, 
  onClearCompleted 
}: TodoFooterProps) => {
  const filters: FilterType[] = ['all', 'active', 'completed'];

  return (
    <div className="mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {itemsLeft} items left
        </span>
        
        <div className="flex gap-4">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`text-sm font-medium transition-colors ${
                currentFilter === filter
                  ? 'text-blue-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        
        <button
          onClick={onClearCompleted}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Clear Completed
        </button>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
        Drag and drop to reorder list
      </div>
    </div>
  );
};

export default TodoFooter;