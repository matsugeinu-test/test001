// CSVファイル内容集計

/* 概要:    合計算出（Ｘ軸）
   引数:    data
*/
function totalX(data) {

    var totals = [];

    for (var i = 0; i < data.length; i++) {

        var totalLine = 0;
        for (var j = 0; j < data[i].length; j++) {
            totalLine += parseInt(data[i][j], 10);
        }
        totals.push(totalLine);
    }

    return totals;
}

/* 概要:    合計算出（Ｙ軸）
   引数:    data
*/
function totalY(data) {

    var totals = [];

    for (var i = 0; i < data[0].length; i++) {

        var totalLine = 0;
        for (var j = 0; j < data.length; j++) {
            totalLine += parseInt(data[j][i], 10);
        }
        totals.push(totalLine);
    }

    return totals;
};