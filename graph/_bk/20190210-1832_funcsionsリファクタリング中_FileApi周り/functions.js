var file = document.getElementById('file');
var result = document.getElementById('result');

// File APIに対応しているか確認
function availableFileApi() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        return result;
    }
    return false;
}

if(window.File && window.FileReader && window.FileList && window.Blob) {
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
            // !:トリミング必要？
            if (cols[cols.length - 1] == "") {
                cols.pop();
            }

            var data = [];
            for (var i = 0; i < cols.length; i++) {
                data[i] = cols[i].split(',');
            }
            var insert = createTable(data);
            result.appendChild(insert);
        }
        // ファイル読み込みを実行
        reader.readAsText(fileData);
    }
    file.addEventListener('change', loadLocalCsv, false);

    testCreateChart();

} else {
    file.style.display = 'none';
    result.innerHTML = 'File APIに対応したブラウザでご確認ください';
}

// テーブル作成
function createTable(data) {
    console.log(data);
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

function testCreateChart() {

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [{
        label: 'apples',
        data: [12, 19, 3, 17, 6, 3, 7],
        backgroundColor: "rgba(153,255,51,0.4)"
        }, {
        label: 'oranges',
        data: [2, 29, 5, 5, 2, 3, 10],
        backgroundColor: "rgba(255,153,0,0.4)"
        }]
    }
    })

};