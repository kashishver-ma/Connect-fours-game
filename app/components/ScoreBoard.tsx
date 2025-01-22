// app/components/ScoreBoard.tsx
interface ScoreBoardProps {
  scores: { [key: string]: number };
  currentPlayer: string;
}

export const ScoreBoard = ({ scores, currentPlayer }: ScoreBoardProps) => {
  return (
    <div className="flex justify-between mb-6 p-4 bg-gray-100 rounded-lg">
      {Object.entries(scores).map(([player, score]) => (
        <div
          key={player}
          className={`text-center p-2 rounded ${
            currentPlayer === player ? "bg-blue-100" : ""
          }`}
        >
          <div className="font-bold">{player}</div>
          <div className="text-2xl">{score}</div>
        </div>
      ))}
    </div>
  );
};
