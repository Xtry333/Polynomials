$(function() {
    function parse() {
        var lines = textIn.value.replace("\r", "").split("\n");

        

        var s = text.replace(/\[S\]/gm, "<blockquote><p>").replace(/\[E\]/gm, "</p></blockquote>");
        textOut.value = s;
        divOut.innerHTML = s;
    };

    $("#textInput").bind({
        input: parse
    });
    parse();
});