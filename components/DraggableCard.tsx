import React from 'react';

interface DraggableCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 flex flex-col ${className}`}>
      <h2 className="text-lg font-bold text-white/80 mb-4 flex-shrink-0">{title}</h2>
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default DraggableCard;