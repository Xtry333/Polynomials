const replaceTokens = (text) => {
    return text
        .replace(/\>\>(.+)\<\</g, '<q>$1</q>')
        .replace(/\*\*(.+?(\*)*)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?[^\\]{1})\*/g, '<em>$1</em>')
        .replace(/\_\!(.+)\!\_/g, '<u>$1</u>')
        .replace(/\-\!(.+)\!\-/g, '<del>$1</del>')
        .replace(/(\[(.+)\|(.+?)\])/g, '<a href=\"$2\">$3</a>')
}

const replaceHeaders = (text) => {
    let headerId = 0
    let lines = text.split('\n')
    let newLines = []
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line[0] == '#') {
            newLines.push(`<h1 id='n${headerId++}'>${line.slice(1)}</h1>`)
        } else {
            newLines.push(`<p>${line}</p>`)
        }
    }

    return newLines.join('\n')
}

const parse = (text) => {
    let replaced = replaceHeaders(replaceTokens(text))

    const stack = []

    let tag = ''

    const textLength = replaced.length
    for (let i = 0; i < textLength; i++) {

        const prevChar = replaced[i - 1]
        const char = replaced[i]

        if (prevChar !== '\\') {
            if (char === '<') {
                i++
                while (i < textLength && replaced[i] != '>' && replaced[i] != ' ') {
                    tag += replaced[i]
                    i++
                }
                i--
            }
            if (char === '>') {
                //console.log(tag)
                if (tag[0] === '/') {
                    if (topElement(stack) === tag.slice(1))
                        stack.pop()
                } else {
                    stack.push(tag)
                }
                tag = ''
            }
        } else {
            //replaced = removeAt(replaced, i - 1)
        }
    }
    console.log('Stack:', stack)
    //console.log(stack.length == 0 ? 'Valid syntax' : 'Invalid syntax')
    console.log(replaced)
    return stack.length == 0 ? replaced : '<p>Invalid syntax. Every tag has to be closed</p>'
}

const topElement = (stack) => {
    if (stack && stack.length > 0) return stack[stack.length - 1]
    return null
}

const removeAt = (string, index) => {
    if (!index) throw "Index must be defined"
    return string.slice(0, index) + string.slice(index + 1)
}

const onTextInput = (event) => {
    let value = 0
    if (event) value = event.target.value
    if (!event) value = document.querySelector('#textIn').value
    let parsed = parse(value)
    document.querySelector('#textOut').value = parsed
    document.querySelector('#divOut').innerHTML = parsed
}

window.onload = () => {
    console.log('Window loaded')
    document.querySelector('#textIn').addEventListener('input', onTextInput)
    onTextInput()
}