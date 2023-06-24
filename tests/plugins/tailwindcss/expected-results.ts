export const reactComponentCodeResult = `import { MyButton } from "@/components";
import { useState } from "react";

function Counter()
{
  const [count, setCount] = useState(0);

  return (
    <MyButton
      className="inline-flex items-center justify-center rounded-md p-1"
      onClick={() => setCount((c) => c + 1)}
    >
      {count}
    </MyButton>
  );
}
`;
