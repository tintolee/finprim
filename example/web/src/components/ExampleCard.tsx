import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const ExampleCard = ({ children }: Props) => {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};