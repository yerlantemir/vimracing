export const generateRaceDocs = () => {
  return [
    {
      start: ['for(let i=0;i<5;i++){', 'console.log(i);', '}'],
      target: ['for (let i = 0; i < 10; i++) {', '  console.log(i);', '}']
    },
    {
      start: [
        'let sum=0;',
        'for(let i=0;i<5;i++){',
        'sum+=i;',
        '}',
        'console.log(sum);'
      ],
      target: [
        'let sum = 0;',
        'for (let i = 0; i < 10; i++) {',
        '  sum += i;',
        '}',
        'console.log(sum);'
      ]
    },
    {
      start: [
        'let arr=[1,2,3,4,5];',
        'arr.forEach((item)=>{',
        'console.log(item)',
        '});'
      ],
      target: [
        'let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];',
        'arr.forEach((item) => {',
        '  console.log(item);',
        '});'
      ]
    }
  ];
};
