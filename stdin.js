// process.stdin 스트림은 표준 입력 데이터를 읽기위해 사용되는 Node.js의 내장 스트림이다.
// stdin => 이벤트 방식 (=비동기)
// 키보드 = 하나의 저장소

// 키보드에서 발생하는 입력 이벤트 처리
console.log("아무것나 입력혀봐 : ");
process.stdin.on("data", (data) => {
  // on : 이벤트 리스너 등록해주는 메소드
  console.log(`읽은 데이터 : ${data}`);
  if (data.toString().trim() === "exit") {
    process.exit();
  }
});

// chunk  단위 읽기
// process.stdin.on('readable', () => { //readable은 이벤트
//     let chunk;
//     while ((chunk = process.stdin.read()) !== null) {
//         process.stdout.write(`chunk: ${chunk}`);
//     }
// });
