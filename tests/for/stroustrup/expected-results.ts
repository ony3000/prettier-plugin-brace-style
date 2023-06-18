export const forCodeResult = `for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
`;

export const forInCodeResult = `const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
`;

export const forOfCodeResult = `const array1 = ["a", "b", "c"];

for (const element of array1) {
  console.log(element);
}
`;

export const forAwaitOfCodeResult = `async function* asyncGenerator() {
  let i = 0;
  while (i < 3) {
    yield i++;
  }
}

(async () => {
  for await (const num of asyncGenerator()) {
    console.log(num);
  }
})();
`;
