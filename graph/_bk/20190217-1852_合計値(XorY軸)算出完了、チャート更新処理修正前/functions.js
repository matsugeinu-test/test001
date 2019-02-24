var file = document.getElementById('file');
var result = document.getElementById('csvTable');

// ページ読み込み時に実行
window.onload = function() {

    // File APIに対応しているか確認
    availableFileApi()

    // CSVファイル読み込み＆グラフ生成
    file.addEventListener("change", loadLocalCsv, false);

}

// File APIに対応しているか確認
function availableFileApi() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log('File API対応OK!!');
        return result;
    }
    file.style.display = 'none';
    console.log('File APIに対応したブラウザでご確認ください');
    alert('File APIに対応したブラウザでご確認ください');
}

// CSVファイル読み込み＆グラフ生成
function loadLocalCsv(e) {

    // ファイル情報を取得
    var fileData = e.target.files[0];

    // CSVファイル以外は処理を止める
    if(!fileData.name.match('.csv$')) {
        alert('CSVファイルを選択してください');
        return;
    }

    // FileReaderオブジェクトを使ってファイル読み込み
    var reader = new FileReader();

    reader.onload = function() {

        // ファイル読み込みに成功したときの処理
        var arrRowsCsv = [];

        console.log('---------------------------------------------');
        console.log("■全体（CSV読み込み結果そのまま）");
        console.log(reader.result);

        // CSVを1行ごとに分割（最終行が改行だけなら除外(トリミングする？)）
        arrRowsCsv = reader.result.split('\n');
        if (arrRowsCsv[arrRowsCsv.length - 1] == "") {
            arrRowsCsv = arrRowsCsv.slice(0, arrRowsCsv.length - 1);
        }
        console.log('---------------------------------------------');
        console.log("■全体（CSV行分割）");
        console.log(arrRowsCsv);

        // CSV全体を行・項目ごとに分割
        arrRawCsv = getArrRawCsv(arrRowsCsv);
        console.log('---------------------------------------------');
        console.log("■全体（CSV全項目分割）");
        console.log(arrRawCsv);

        // 項目名取得(X)
        var items_x = getItemsX(arrRowsCsv[0]);
        console.log('---------------------------------------------');
        console.log("■項目名X");
        console.log(items_x);

        // 項目名取得(Y)
        var items_y = getItemsY(arrRawCsv);
        console.log('---------------------------------------------');
        console.log("■項目名Y");
        console.log(items_y);

        // データだけ
        onlyValue = getOnlyValue(arrRawCsv);
        console.log('---------------------------------------------');
        console.log("■データだけ");
        console.log(onlyValue);

        // テーブル作成
        var insertTable = createTable(arrRawCsv);
        result.appendChild(insertTable);

        // 合計（Ｘ軸）
        console.log('---------------------------------------------');
        console.log("■合計（Ｘ軸）");
        console.log(totalX(onlyValue));

        // 合計（Ｙ軸）
        console.log('---------------------------------------------');
        console.log("■合計（Ｙ軸）");
        console.log(totalY(onlyValue));
    }

    // ファイル読み込みを実行
    reader.readAsText(fileData);

    file.addEventListener('change', loadLocalCsv, false);
    createChart();
}

// チャートにラベルとデータを追加
function addData(chart, data) {

    // // ラベル
    chart.data.labels.push("XXX");

    // データ追加
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });

    chart.update();
}

// チャート作成
function createChart() {

    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx,
        {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                datasets: [
                    {
                        label: 'apples',
                        data: [12, 19, 3, 17, 6],

                        // 線のカーブ
                        lineTension: 0,
                        // 線の色
                        borderColor: "rgba(0, 255, 0, 1)",
                        // 塗りつぶし
                        fill: true,
                        backgroundColor: "rgba(111, 210, 116, 0.4)"
                    }, {
                        label: 'oranges',
                        data: [2, 29, 5, 5, 2],

                        // 線のカーブ
                        lineTension: 0,
                        // 線の色
                        borderColor: "rgba(255, 0, 0, 1)",
                        // 塗りつぶし
                        fill: true,
                        backgroundColor: "rgba(247, 107, 104, 0.4)"
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
                            // 軸ラベルの文字サイズ
                            // fontSize: 12,
                            // 表示項目
                            callback: function(value, index, values){
                                return  value + '月'
                            }
                        }
                    }],
                    // Y軸
                    yAxes: [{
                        ticks: {
                            // 軸ラベルの文字サイズ
                            // fontSize: 12,
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

    addData(myChart, 99);
}

// 合計（Ｘ軸）
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

// 合計（Ｙ軸）
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


// CSV全体を行・項目ごとに分割
function getArrRawCsv(arr) {

    var arrRawCsv = [];

    for (var i = 0; i < arr.length; i++) {
        arrRawCsv[i] = arr[i].split(',');
    }

    return arrRawCsv;
}

// 項目抽出（Ｘ軸）
function getItemsX(arr) {

    var items_x = arr.split(',');
    items_x = items_x.slice(1);

    return items_x;
}

// 項目抽出（Ｙ軸）
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

// データのみ
function getOnlyValue(arr) {

    var rowValue = [];
    rowValue = arr.slice(1, arr.length);

    var onlyValue = [];
    for (var i = 0; i < rowValue.length; i++) {
        onlyValue[i] = rowValue[i].slice(1, rowValue[i].length);
    }

    return onlyValue;

}

// テーブル作成
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
};