$(function() {
    var text = "";
    function countIndent(str) {
        var indent = 0;
        while (true) {
            if (str[indent] == ">") {
                //lines[line] = "[S]" + e.substring(1);
                indent++;
            } else {
                break;
            }
        }
        return indent;
    }

    function parseComments() {
        var txt = text;

        for (let i = 0; i < 64; i++) {
            txt = txt.replace(/(^\>+)((.*\n\>)*.*)/gm, "$1<blockquote><p>$2</p></blockquote>");
            var lines = txt.split("\n");
            var counter = 0;
            for (let l = 0; l < lines.length; l++) {
                if (lines[l].startsWith(">")) {
                    lines[l] = lines[l].substr(1);
                    counter++;
                }
            }
            txt = lines.join("\n");
            if (counter == 0) {
                break;
            }
        }
        text = txt;
    };

    function parseList() {
        var lines = text.replace(/\r/g, "").split("\n");
        var out = [];
        var number = 1;

        for (var line = 0; line < lines.length; line++) {
            const e = lines[line];
            var fix = "";
            indent = countIndent(e);
            if (e.startsWith(number + ".")) {
                lines[line] = "<li>" + lines[line].replace(/^\d+.? */g, "").replace(/\r/g, "") + "</li>";
                if (number == 1) {
                    lines[line] = "<ol>" + lines[line];
                }
                number++;
            } else {
                if (number != 1) {
                    lines[line-1] = lines[line-1] + "</ol>";
                }
                number = 1;
            }
        }
        text = lines.join("\r\n");
    };

    function parseParagraphs() {
        var lines = text.replace(/\r/g, "").split("\n");

        for (var line = 0; line < lines.length; line++) {
            const e = lines[line].replace(/\r\n/gm, "");
            if ((!e.startsWith("<") && !e.endsWith(">") && e != "")) {
                //console.log(e);
                lines[line] = "<p>" + lines[line] + "</p>";
            }
        }

        text = lines.join("\r\n");
    }

    function parse() {
        text = textIn.value;
        parseComments();
        parseList();

        text = text.replace(/\\\'/gm, "&#39;"); // Single quotes to html entity
        text = text.replace(/(?:^|( ))([\"\'])(.*?)\2/gm, "$1<q>$3</q>"); // Double quotes
        text = text.replace(/(?:^|([A-Za-z ]))(\_)(.*?)\_/gm, "$1<sub>$3</sub>"); // Underscore to sub
        text = text.replace(/(?:^|([A-Za-z ]))(\^)(.*?)\^/gm, "$1<sup>$3</sup>"); // Hat to sup
        parseParagraphs(); // Line to <p>
        text = text.replace(/(^\r\n)+$/gm, ""); // Multiple new lines to one new line

        textOut.value = text;
        divOut.innerHTML = text;
    };

    $("#textIn").on({
        input: parse
    });
    parse();
});