var tables = [];
$(function() {
    var t = document.querySelectorAll("table");
    var tN = 0;
    t.forEach(e => {
        tables[tN] = [];
        var headers = e.querySelectorAll("tr > th");
        var data = e.querySelectorAll("tr > td");
        for (let line = 0; line < data.length; line += headers.length) {
            var element = {};
            for (var i = 0; i < headers.length; i++) {
                var h = headers[i].innerText;
                var d = data[line + i].innerText;
                element[h] = d;
            }
            tables[tN].push(element);
            //console.log(element);
        }
        tN++;
    });
    console.log(tables);
});