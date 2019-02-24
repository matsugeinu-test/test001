var file = document.getElementById('file');
var result = document.getElementById('result');

// ページ読み込み時に実行
window.onload = function() {

    availableFileApi()
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

    // ファイル読み込みに成功したときの処理
    var arrRowsCsv = [];
    reader.onload = function() {

        // console.log(reader.result);

        // CSVを1行ごとに分割（最終行が改行だけなら除外(トリミングする？)）
        arrRowsCsv = reader.result.split('\n');
        if (arrRowsCsv[arrRowsCsv.length - 1] == "") {
            arrRowsCsv = arrRowsCsv.slice(0, arrRowsCsv.length - 1);
        }
        console.log(arrRowsCsv);

        // CSV全体を行・項目ごとに分割
        arrRawCsv = getArrRawCsv(arrRowsCsv);
        console.log(arrRawCsv);

        // 項目名取得(X)
        var items_x = getItemsX(arrRowsCsv[0]);
        console.log(items_x);

        // 項目名取得(Y)
        var items_y = getItemsY(arrRawCsv);
        console.log(items_y);

        // データだけ
        onlyValue = getOnlyValue(arrRawCsv);
        console.log(onlyValue);

        // テーブル作成
        var insert = createTable(arrRawCsv);

        // json作成
        // !)何を集計するか
        var arrJson = [];
        for (var i = 1; i < items_x.length - 1; i++) {
            var a_line = new Object();
            for (var j = 0; j < items_x.length; j++) {
                a_line[items_x[j]] = arrRawCsv[j];
            }
            arrJson.push(a_line);
        }
        console.log('-------------------------');
        console.log('■json (a_line)');
        console.log(a_line);

        // HTMLに反映
        result.appendChild(insert);
    }
    // ファイル読み込みを実行
    reader.readAsText(fileData);

    file.addEventListener('change', loadLocalCsv, false);
    createChart();
}


// チャート作成 (CSV->JSON変換：http://lifelog.main.jp/wordpress/?p=2970)
function createChart() {

    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx,
        {
            type: 'line',
            data: {
                labels: ['M', 'T', 'W', 'S', 'F'],
                datasets: [
                    {
                        label: 'apples',
                        data: [12, 19, 3, 17, 6],
                        backgroundColor: "rgba(153,255,51,0.4)"
                    }, {
                        label: 'oranges',
                        data: [2, 29, 5, 5, 2],
                        backgroundColor: "rgba(255,153,0,0.4)"
                    }
                ]
            }
        }
    )

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