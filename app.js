'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({input: rs, output: {}});

//データを組み替えるためのMapデータ
const prefectureDataMap = new Map(); //key:都道府県 value:集計データのオブジェクト

//ファイルを行単位で処理する
rl.on('line', lineString => {
  //ファイル単位で出力する
  //console.log(lineString);
  const columns = lineString.split(',');//列別のデータに分別
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015){
    //console.log(year);
    //console.log(prefecture);
    //console.log(popu);
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: 0, //2010年の人口データ
        popu15: 0, //2015年の人口データ
        change: null //変化率
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});

//ファイルの読み込み終了時のコード
rl.on('close', () => {
  for (const [key, value] of prefectureDataMap){
    value.change = value.popu15 / value.popu10;
  }
  //ランキング化したデータを作成　並べ替え
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    //並び替えのルールを書く
    return pair2[1].change - pair1[1].change;
  });
  //console.log(rankingArray);
  //データを表示用に整形
  const rankingStrings = rankingArray.map(([key, value], rank) => {
    return `${rank+1}位 ${key}: ${value.popu10} => ${value.popu15} 変化率: ${value.change}`
      //(key +
      //': ' +
      //value.popu10 +
      //'=>' +
      //value.popu15 +
      //'変化率:' +
      //value.change
    //);
  });
  console.log(rankingStrings);
});
