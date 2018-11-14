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
        var lines = text.replace(/\r/g, "").split("\n");

        var indent = 0;
        var lastIndent = 0;

        for (var line = 0; line < lines.length; line++) {
            const e = lines[line];
            var fix = "";
            indent = countIndent(e);
            if (indent > lastIndent) {
                for (var i = 0; i < indent; i++) {
                    fix += "[S]";
                }
                lines[line] = fix + e;
            } else if (indent < lastIndent) {
                for (var i = 0; i < lastIndent - indent; i++) {
                    fix += "[E]";
                }
                if (true) {
                    lines[line - 1] = lines[line - 1] + fix;
                }
                if (line == lines.length - 1) {
                    lines[line] = e + fix;
                }
            }
            lastIndent = indent;
        }

        text = lines.join("\r\n").replace(/\>/gm, "").replace(/\[S\]/gm, "<blockquote>").replace(/\[E\]/gm, "</blockquote>");
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

    function parse() {
        text = textIn.value;
        parseComments();
        parseList();

        text = text.replace(/\\\'/gm, "&#39;"); // Single quotes to html entity
        text = text.replace(/(?:^|( ))([\"\'])(.*?)\2/gm, "$1<q>$3</q>"); // Double quotes
        text = text.replace(/(^\r\n)+$/gm, ""); // Multiple new lines to one new line

        textOut.value = text;
        divOut.innerHTML = text;
    };

    $("#textIn").bind({
        input: parse
    });
    parse();
});