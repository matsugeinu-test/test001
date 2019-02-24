/* 概要:    データ抽出：CSV全体を行・項目ごとに分割
   引数:    arr
*/
function getArrRawCsv(arr) {

    var arrRawCsv = [];

    for (var i = 0; i < arr.length; i++) {
        arrRawCsv[i] = arr[i].split(',');
    }

    return arrRawCsv;
}

/* 概要:    データ抽出：項目（Ｘ軸）
   引数:    arr
*/
function getItemsX(arr) {

    return arr.slice(1);
}

/* 概要:    データ抽出：項目（Ｙ軸）
   引数:    arr
*/
function getItemsY(arr) {

    var items_y = [];
    var tmpItems;

    for (var i = 0; i < arr.length; i++) {
        tmpItems = arr[i].slice(0,1);
        for (var j = 0; j < tmpItems.length; j++) {
            items_y.push(tmpItems[j]);
        }
    }
    items_y = items_y.slice(1);

    return items_y;
}

/* 概要:    データ抽出：データのみ
   引数:    arr
*/
function getOnlyValue(arr) {

    var rowValue = [];
    rowValue = arr.slice(1, arr.length);

    var onlyValue = [];
    for (var i = 0; i < rowValue.length; i++) {
        onlyValue[i] = rowValue[i].slice(1, rowValue[i].length);
    }

    return onlyValue;
};