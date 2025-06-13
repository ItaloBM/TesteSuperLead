
import React from "react";

interface ResultsHeaderProps {
  totalResults: number;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ totalResults }) => {
  return (
    <div className="text-sm text-gray-600 mb-4">
      <span className="font-medium">{totalResults}</span> resultados encontrados
    </div>
  );
};

export default ResultsHeader;
