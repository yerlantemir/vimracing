export const generateRaceDocs = () => {
  return [
    {
      start: ['let a = 5'],
      target: ['let a = 5;']
    },
    {
      start: ['let array = [1, 2, 3, 4,]'],
      target: ['let array = [1, 2, 3, 4];']
    },
    {
      start: ['let str = "Hello, World'],
      target: ['let str = "Hello, World";']
    },
    {
      start: ['function helloWorld( { console.log("Hello, World!") }'],
      target: ['function helloWorld() { console.log("Hello, World!"); }']
    },
    {
      start: ['let obj = { key: "value" }; console.log(obj.key'],
      target: ['let obj = { key: "value" }; console.log(obj.key);']
    }
  ];
};
