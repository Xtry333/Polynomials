$(function() {
    function parse() {
        var lines = textIn.value.replace("\r", "").split("\n");

        let out = [];

        var indent = 0;
        for (let i = 0; i < lines.length; i++) {
            let e = lines[i];
            while (true) {
                if (e[indent] == ">") {
                    indent++;
                } else {
                    break;
                }
            }
            
            console.log(indent);
        }

        //console.log(indent);

        var s = out.join("\n").replace(/\[S\]/gm, "<blockquote><p>").replace(/\[E\]/gm, "</p></blockquote>");
        textOut.value = s;
        divOut.innerHTML = s;
    };

    $("#textInput").bind({
        input: parse
    });
    parse();
});