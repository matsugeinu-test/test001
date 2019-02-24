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

        // 項目に分割
        var data = [];
        for (var i = 0; i < cols.length; i++) {
            data[i] = cols[i].split(',');
        }

        console.log('-------------------------');
        console.log(data);
        console.log('-------------------------');

        var insert = createTable(data);

        result.appendChild(insert);
    }
    // ファイル読み込みを実行
    reader.readAsText(fileData);

    file.addEventListener('change', loadLocalCsv, false);
    createChart();
}

// テーブル作成
function createTable(data) {
    // console.log(data);
    var table = document.createElement('table');
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < data[i].length; j++) {
            var td = document.createElement('td');
            td.innerText = data[i][j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    console.log(table);
    return table;
}

// チャート作成
// CSV->JSON変換：http://lifelog.main.jp/wordpress/?p=2970
function createChart() {

    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx,
        {
            type: 'bar',
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