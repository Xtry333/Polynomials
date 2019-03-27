const _table_ = document.createElement('table');
const _tr_ = document.createElement('tr');
const _th_ = document.createElement('th');
const _td_ = document.createElement('td');
const _a_ = document.createElement('a');
const _input_ = document.createElement('input');

let table;
let g_set = false;
let g_sums = [];
let g_avgs = [];

const buildSimpleTable = (arr) => {
    var table = _table_.cloneNode(false);
    var columns = addAllColumnHeaders(arr, table);
    for (var i = 0, maxi = arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        for (var j = 0, maxj = columns.length; j < maxj; ++j) {
            var td = _td_.cloneNode(false);
            cellValue = arr[i][columns[j]];
            if (typeof cellValue === 'object') {
                td.appendChild(buildSimpleTable(cellValue));
            } else {
                td.appendChild(document.createTextNode(cellValue));
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}

const buildHtmlTable = (arr) => {
    var table = _table_.cloneNode(false);
    var columns = addAllColumnHeaders(arr, table);
    var id = 0;
    for (var i = 0, maxi = arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        tr.setAttribute('data-id', id++);
        for (var j = 0, maxj = columns.length; j < maxj; ++j) {
            var td = _td_.cloneNode(false);
            cellValue = arr[i][columns[j]];
            if (typeof cellValue === 'object') {
                td.appendChild(buildSimpleTable(cellValue));
            } else {
                td.appendChild(document.createTextNode(cellValue));
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    addColumnFooters(table);
    return table;
}

const addAllColumnHeaders = (arr, table) => {
    var columnSet = [];
    var tr = _tr_.cloneNode(false);
    for (var i = 0, l = arr.length; i < l; i++) {
        for (var key in arr[i]) {
            if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
                columnSet.push(key);
                var a = _a_.cloneNode(false);
                a.classList.add('sort-by');

                a.appendChild(document.createTextNode(capitalize(key)));
                var th = _th_.cloneNode(false);

                var input = _input_.cloneNode(false);
                input.addEventListener('keyup', event => {
                    if (event.keyCode == 13) {
                        onFilterInput(event);
                    }
                });

                th.scope = 'col';
                th.appendChild(a);
                th.appendChild(input);
                tr.appendChild(th);
            }
        }
    }
    table = table.appendChild(tr);
    return columnSet;
}

const addColumnFooters = (table) => {
    const trAvg = _tr_.cloneNode(false);
    const trSum = _tr_.cloneNode(false);
    const trGAvg = _tr_.cloneNode(false);
    const trGSum = _tr_.cloneNode(false);
    const trMed = _tr_.cloneNode(false);
    trAvg.classList.add('table-footer', 'table-average');
    trSum.classList.add('table-footer', 'table-sum');
    trGAvg.classList.add('table-footer', 'table-average', 'table-global');
    trGSum.classList.add('table-footer', 'table-sum', 'table-global');
    //trMed.classList.add('table-footer', 'table-median');
    const elements = Array.from(table.querySelectorAll('tr:nth-child(n+2)'));
    const headers = Array.from(table.querySelectorAll('th'));
    const sums = [];
    const count = [];
    console.log(elements);

    for (var i = 0, l = headers.length; i < l; i++) {
        sums.push(0);
        count.push(0);
        for (var j = 0, maxj = elements.length; j < maxj; ++j) {
            if (!isHidden(elements[j]) && elements[j].children[i]) {
                sums[i] += Number.parseFloat(elements[j].children[i].textContent || elements[j].children[i].innerText);
                count[i]++;
            }
        }

        const td1 = _td_.cloneNode(false);
        td1.appendChild(document.createTextNode(Number.parseFloat(sums[i].toFixed(2)) || ' '));
        const td2 = _td_.cloneNode(false);
        td2.appendChild(document.createTextNode(Number.parseFloat((sums[i] / count[i]).toFixed(2)) || ' '));
        const tdG1 = _td_.cloneNode(false);
        const tdG2 = _td_.cloneNode(false);
        if (g_set) {
            tdG1.appendChild(document.createTextNode(Number.parseFloat(g_sums[i].toFixed(2)) || ' '));
            tdG2.appendChild(document.createTextNode(Number.parseFloat((g_avgs[i]).toFixed(2)) || ' '));
        }
        //const td3 = _td_.cloneNode(false);
        //td3.appendChild(document.createTextNode(Number.parseFloat((median(elements)).toFixed(2)) || ' '))
        trSum.appendChild(td1);
        trAvg.appendChild(td2);
        trGSum.appendChild(tdG1);
        trGAvg.appendChild(tdG2);
        //trMed.appendChild(td3);
    }
    table.appendChild(trSum);
    table.appendChild(trAvg);
    if (!g_set) {
        g_set = true
        for (let i = 0; i < sums.length; i++) {
            g_sums.push(sums[i])
            g_avgs.push(sums[i] / count[i])
        }
    } else {
        table.appendChild(trGSum);
        table.appendChild(trGAvg);
    }
    //table.appendChild(trMed);
}

const hide = (tr) => {
    tr.style.display = "none";
}

const show = (tr) => {
    tr.style.display = "";
}

const isHidden = (e) => {
    return e.style.display == "none";
}

const onFilterInput = (event) => {
    //const input = event.srcElement;
    const input = document.querySelector('input');
    const table = input.closest('table');
    const inputs = table.querySelectorAll('input');
    const tr = table.rows;
    // Remove sum and average footer rows
    while (table.querySelectorAll('tr.table-footer').length > 0) {
        table.querySelector('tr.table-footer').remove();
    }
    for (r of tr) {
        show(r);
    }
    for (j = 0; j < inputs.length; j++) {
        const filterValue = inputs[j].value.toLowerCase();
        if (filterValue.length > 0) {
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName('td')[inputs[j].parentElement.cellIndex];
                if (td) {
                    let maxv = -1, minv = 1;
                    if (filterValue.indexOf('-') > -1) {
                        minv = Number.parseFloat(filterValue.split('-')[0] || Number.MIN_VALUE);
                        maxv = Number.parseFloat(filterValue.split('-')[1] || Number.MAX_VALUE);
                        if (minv > maxv) {
                            t = maxv;
                            maxv = minv;
                            minv = t;
                        }
                    }
                    let txtValue = (td.textContent || td.innerText).toLowerCase();
                    if (!(txtValue.indexOf(filterValue) > -1 || (txtValue >= minv && txtValue <= maxv))) {
                        hide(tr[i]);
                    }
                }
            }
        }
    }
    // Add sum and average back to footer
    addColumnFooters(table);
    addArrows(table);
}

const addArrows = (table) => {
    for (let e of document.querySelectorAll('td.avg-above')) {
        e.classList.remove('avg-above');
    }
    for (let e of document.querySelectorAll('td.avg-below')) {
        e.classList.remove('avg-below');
    }
    const rows = document.querySelectorAll('tr');
    const average = document.querySelector('tr.table-average');
    console.log(rows)
    for (let r = 1; r < rows.length - 4; r++) {
        for (let i = 0; i < rows[r].cells.length; i++) {
            const rc = rows[r].cells[i]
            const num = Number.parseFloat(rows[r].cells[i].textContent);
            if (num > Number.parseFloat(average.cells[i].textContent)) {
                rows[r].cells[i].classList.add('avg-above');
            } else if (num < Number.parseFloat(average.cells[i].textContent)) {
                rows[r].cells[i].classList.add('avg-below');
            }
        }
    }
}

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const median = (values) => {
    values.sort(comparer);

    const half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];
    else
        return (values[half - 1] + values[half]) / 2.0;
}

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ?
    v1 - v2 : v1.toString().localeCompare(v2))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

window.onload = x => {
    table = buildHtmlTable(tableContent);
    document.querySelector('#content').appendChild(table);
    addArrows(table);
    document.querySelectorAll('th').forEach(th => th.querySelector('a').addEventListener('click', (() => {
        const table = th.closest('table');
        while (table.querySelectorAll('tr.table-footer').length > 0) {
            table.querySelector('tr.table-footer').remove();
        }
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr));
        onFilterInput(null);
    })));
};