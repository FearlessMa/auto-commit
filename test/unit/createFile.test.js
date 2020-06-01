// const { fileNameList, createDepFile } = require('../createFile');
// const fs = require('fs');
// const path = require('path');

const add = (a, b) => a + b;

// // test('create file', () => {
// //   fileNameList.forEach((item) => {
// // //     createDepFile(item);
// //     expect(() => {
// //       const stat = fs.statSync(
// //         path.resolve(__dirname, '../data/' + item.fileName)
// //       );
// //       console.log('stat: ', stat.size);
// //       return stat.size;
// //     }).toBeGreaterThan(0);
// //   });
// // });

test('1+2 = 3', () => {
  expect(add(1, 2)).toBe(3);
});
