export const reactComponentCode = `
import { MyButton } from '@/components';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <MyButton
      className="p-1 rounded-md inline-flex items-center justify-center"
      onClick={() => setCount((c) => c + 1)}
    >
      {count}
    </MyButton>
  );
}
`;
