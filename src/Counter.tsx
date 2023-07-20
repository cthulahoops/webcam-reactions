import { useState } from "react";

export default function Counter() {
  return (
    <>
      <div>
        <button onClick={() => setCount(count + 1)}>+</button>
        <span>{count}</span>
        <button onClick={() => setCount(count - 1)}>-</button>
      </div>
    </>
  );
}
