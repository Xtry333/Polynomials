$(function() {

    /// Region Table Parser

    var tables = [];

    var t = document.getElementsByTagName("table");

    for (var tNum = 0; tNum < t.length; tNum++) {
        const tr = t[tNum].getElementsByTagName("tr");
        tables[tNum] = [];
        var thead = [];

        for (var rowNum = 0; rowNum < tr.length; rowNum++) {
            const row = tr[rowNum];
            var tdata = row.getElementsByTagName("td");
            if (tdata.length > 0) {
                if (thead.length >= tdata.length) {
                    var element = {};
                    for (let i = 0; i < tdata.length; i++) {
                        var thText = thead[i].innerText.replace(/\[.*?\]/g, "");
                        if (thText != "Nr" && thText != "Number") {
                            element[thText] = tdata[i].innerText;
                        }
                    }
                    tables[tNum].push(element);
                } else {
                    var element = [];
                    for (let i = 0; i < tdata.length; i++) {
                        element[i] = tdata[i].innerText;
                    }
                    tables[tNum].push(element);
                }
            } else {
                thead = row.getElementsByTagName("th");
            }
        }
    }
    console.log(tables);
    textOut.innerText = JSON.stringify(tables, null, "    ");

    /// End Region
});