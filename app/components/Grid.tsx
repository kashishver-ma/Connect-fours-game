// app/components/Grid.tsx
interface GridProps {
  grid: number[][];
  onColumnClick: (column: number) => void;
}

export const Grid = ({ grid, onColumnClick }: GridProps) => {
  return (
    <div className="grid grid-cols-7 gap-2 bg-blue-500 p-4 rounded-lg">
      {grid[0]?.map((_, colIndex) => (
        <div
          key={colIndex}
          className="cursor-pointer"
          onClick={() => onColumnClick(colIndex)}
        >
          {grid.map((row, rowIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                  w-12 h-12 rounded-full m-1
                  ${row[colIndex] === 0 ? "bg-white" : ""}
                  ${row[colIndex] === 1 ? "bg-yellow-400" : ""}
                  ${row[colIndex] === 2 ? "bg-red-500" : ""}
                  border-2 border-blue-700
                `}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
