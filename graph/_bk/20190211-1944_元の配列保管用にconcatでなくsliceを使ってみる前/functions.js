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
    var cols;
    cols = [];
    reader.onload = function() {

        cols = reader.result.split('\n');

        // 最後が改行だけなら除外
        // !)トリミング必要？
        if (cols[cols.length - 1] == "") {
            cols.pop();
        }

        // データ部分を項目に分割
        var rawCsv = [];
        for (var i = 0; i < cols.length; i++) {
            rawCsv[i] = cols[i].split(',');
        }
        console.log('-------------------------');
        console.log('■配列：CSV全体 (rawCsv)');
        console.log(rawCsv);

        // 項目名取得(X)
        var items_x = cols[0].split(',');
        items_x.shift();
        console.log('-------------------------');
        console.log('■配列：項目名X (items_x)');
        console.log(items_x);

        // 項目名取得(Y)
        var items_y = [];
        var tmpCsv;
        for (var i = 0; i < rawCsv.length; i++) {
            tmpCsv = rawCsv.concat();
            items_y[i] = tmpCsv[i][0];
        }
        items_y.shift();
        console.log('-------------------------');
        console.log('■配列：項目名Y (items_y)');
        console.log(items_y);

        // データだけ
        var valueOnly = [];
        valueOnly = rawCsv.concat();
        valueOnly.shift();
        // for (var i = 0; i < valueOnly.length; i++) {
        //     valueOnly[i].shift();
        // }
        console.log('-------------------------');
        console.log('■配列：データだけ (valueOnly)');
        console.log(valueOnly);

        // テーブル作成
        var insert = createTable(test);




        // !)json作成
        var arrJson = [];
        for (var i = 1; i < items_x.length - 1; i++) {

            var a_line = new Object();

            for (var j = 0; j < items_x.length; j++) {
                a_line[items_x[j]] = rawCsv[j];
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

// 項目抽出（Ｘ軸）


// テーブル作成
function createTable(rawCsv) {
    // console.log(rawCsv);
    var table = document.createElement('table');
    for (var i = 0; i < rawCsv.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < rawCsv[i].length; j++) {
            var td = document.createElement('td');
            td.innerText = rawCsv[i][j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    console.log('-------------------------');
    console.log('■テーブル (table)');
    console.log(table);
    return table;
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

};