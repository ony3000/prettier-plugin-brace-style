export const forCode = `
for (let i = 0; i < 9; i++) {
  console.log(i);
  // more statements
}
`;

export const forInCode = `
const obj = { a: 1, b: 2, c: 3 };

for (const prop in obj) {
  console.log(\`\${prop}: \${obj[prop]}\`);
}
`;

export const forOfCode = `
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
`;

export const forAwaitOfCode = `
async function* asyncGenerator() {
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
