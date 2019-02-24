var file = document.getElementById('file');
var result = document.getElementById('csvTable');

/* 概要:    ページ読み込み時に実行
   引数:    -
*/
window.onload = function() {

    // File APIに対応しているか確認
    availableFileApi()

    // CSVファイル読み込み＆グラフ生成
    file.addEventListener("change", loadLocalCsv, false);
}

/* 概要:    ブラウザのFile API対応確認
   引数:    -
*/
function availableFileApi() {

    // 対応
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log('File API対応OK!!');
        return result;
    }

    // 非対応
    file.style.display = 'none';
    var unavailableMsg = 'File APIに対応したブラウザでご確認ください';
    console.log(unavailableMsg);
    alert(unavailableMsg);
}

/* 概要:    CSVファイル読み込み＆グラフ生成
   引数:    e
*/
function loadLocalCsv(e) {

    console.log('★');
    console.log(e);

    // ファイル情報を取得
    var fileData = e.target.files[0];

    // CSV以外は中断
    if(!fileData.name.match('.csv$')) {
        alert('CSVファイルを選択してください');
        return;
    }

    // FileReaderオブジェクトを使ってファイル読み込み
    var reader = new FileReader();

    reader.onload = function() {

        // ファイル読み込みに成功
        console.log("---------------------------------------------\n■全体（CSV読み込み結果そのまま）");
        console.log(reader.result);

        // チャート作成
        createChart(reader.result);
    }

    // ファイル読み込みを実行
    reader.readAsText(fileData);

    file.addEventListener('change', loadLocalCsv, false);
}

/* 概要:    チャート設定～作成
   引数:    readerRes
*/
function createChart(readerRes) {

    // CSVを1行ごとに分割（最終行が改行だけなら除外(トリミングする？)）
    var arrRowsCsv = [];
    arrRowsCsv = readerRes.split('\n');
    if (arrRowsCsv[arrRowsCsv.length - 1] == "") {
        arrRowsCsv = arrRowsCsv.slice(0, arrRowsCsv.length - 1);
    }
    console.log("---------------------------------------------\n■全体（CSV行分割）");
    console.log(arrRowsCsv);

    // チャート設定
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx,
        {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: '合計値',
                        data: [],

                        // 線のカーブ
                        lineTension: 0,
                        // 線の色
                        borderColor: "rgba(0, 255, 0, 1)",
                        // 塗りつぶし
                        fill: true,
                        backgroundColor: "rgba(111, 210, 116, 0.4)"
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'サンプルグラフ'
                },
                // 軸
                scales: {
                    // X軸
                    xAxes: [{
                        ticks: {
                            // 表示項目
                            callback: function(value, index, values){
                                var unit = '月';
                                if (value.indexOf(unit) != -1) {
                                    return  value;
                                }
                                return value + unit;
                            }
                        }
                    }],
                    // Y軸
                    yAxes: [{
                        ticks: {
                            // 最大値
                            // suggestedMax: 1000,
                            // 最小値
                            suggestedMin: 0,
                            // 刻み幅
                            // stepSize: 100,
                            // 表示項目
                            callback: function(value, index, values){
                                return  value + '円'
                            }
                        }
                    }]
                }
            }
        }
    )

    // チャートデータ作成
    createData(myChart, arrRowsCsv);
}

/* 概要:    チャートデータ作成
   引数:    myChart
            arrRowsCsv
*/
function createData(myChart, arrRowsCsv) {

    // CSV全体を行・項目ごとに分割
    var arrRawCsv = getArrRawCsv(arrRowsCsv);
    console.log("---------------------------------------------\n■全体（CSV全項目分割）");
    console.log(arrRawCsv);

    // テーブル作成
    var insertTable = createTable(arrRawCsv);
    result.appendChild(insertTable);

    // 項目名取得(X)
    var items_x = getItemsX(arrRawCsv[0]);
    console.log("---------------------------------------------\n■項目名X");
    console.log(items_x);

    // 項目名取得(Y)
    var items_y = getItemsY(arrRawCsv);
    console.log("---------------------------------------------\n■項目名Y");
    console.log(items_y);

    // データだけ
    onlyValue = getOnlyValue(arrRawCsv);
    console.log("---------------------------------------------\n■データだけ");
    console.log(onlyValue);

    // 合計（Ｘ軸）
    console.log('---------------------------------------------\n■合計（Ｘ軸）');
    console.log(totalX(onlyValue));

    // 合計（Ｙ軸）
    console.log("---------------------------------------------\n■合計（Ｙ軸）");
    console.log(totalY(onlyValue));

    // ラベル追加
    addLabel(myChart, items_x)

    // データ追加
    addData(myChart, '合計値', totalY(onlyValue));

    myChart.update();
}

/* 概要:    ラベル作成
   引数:    chart
            labels
*/
function addLabel(chart, labels) {

    for (var i = 0; i < labels.length; i++) {
        chart.data.labels.push(labels[i]);
    }
}

/* 概要:    チャートデータ作成
   引数:    chart
            chartNames
            datas
*/
function addData(chart, chartName, datas) {

    // チャート名
    chart.data.datasets[0].label = chartName;

    // データ追加
    for (var i = 0; i < datas.length; i++) {
        chart.data.datasets[0].data.push(datas[i]);
    }
}

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
}

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
}

/* 概要:    テーブル作成
   引数:    arr
*/
function createTable(arr) {

    var table = document.createElement('table');

    for (var i = 0; i < arr.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < arr[i].length; j++) {
            var td = document.createElement('td');
            td.innerText = arr[i][j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    return table;
}
;