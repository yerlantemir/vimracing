export const generateRaceDocs = () => {
  return [
    {
      start: [
        'if (true) {',
        '  console.log(hello);',
        '}',
        'else {',
        '   console.log(fuck you!)',
        '}'
      ],
      target: [
        'if (false) {',
        '  console.log(hello);',
        '}',
        'else {',
        "  console.log('fuck you!')",
        '}'
      ]
    },
    {
      start: ['print(hey)', '   print(mey)', 'print(ss)'],
      target: ['print()', 'print()', 'print()']
    },
    {
      start: [
        'if (true) {',
        '  console.log(hello);',
        '}',
        'else {',
        '   console.log(fuck you!)',
        '}'
      ],
      target: [
        'if (false) {',
        '  console.log(hello);',
        '}',
        'else {',
        "  console.log('fuck you!')",
        '}'
      ]
    }
  ];
};
