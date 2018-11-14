$(function() {
    function parse() {
        var lines = textIn.value.replace("\r", "").split("\n");

        var out = [];

        for (let tries = 0; tries < 1; tries++) {
            var flag = false;
            var flags = 0;
            for (let i = 0; i < lines.length; i++) {
                let e = lines[i];
                if (e.startsWith(">") && !flag) {
                    out.push("[S]");
                    flag = true;
                    flags++;
                }
                out.push(e.replace(">", ""));
                if (!e.startsWith(">") && flag) {
                    out.push("[E]");
                    flag = false;
                    flags--;
                }
            }
            lines = out;
            out = [];
        }

        for (let i = 0; i < flags; i++) {
            out.push("[E]");
        }

        var s = lines.join("\r\n").replace(/\[S\]/gm, "<blockquote><p>").replace(/\[E\]/gm, "</p></blockquote>");
        textOut.value = s;
        divOut.innerHTML = s;
    };

    $("#textIn  ").bind({
        input: parse
    });
    parse();
});