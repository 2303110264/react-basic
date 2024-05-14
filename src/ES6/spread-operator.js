var array1 = ['one', 'two'];
var array2 = ['three', 'four'];
//ES5 자바스크립트로 배열 합치기, 인덱스로 합치기와 concat 배열의 내장함수로 합치기
var unionArray = array1.concat(array2); //내장함수 사용
var unionArray = [array1[0], array1[1] , array2[0] , array2[1], '인덱스사용'];
console.log(unionArray);
//ES6 전개연산자 용(아래)
var unionArray = [...array1, ...array2, '전개연산자사용'];
console.log(unionArray);