import os
import pygments
from pygments import lexers
from pygments import formatters


def listdir(path):
    return os.listdir(path)


def readfile(path):
    with open(path) as f:
        return f.read()


def splitmeta(file):
    meta = {}
    rest = ""
    lines = file.split("\n")
    for i, line in enumerate(lines):
        if line.startswith("---"):
            rest = "\n".join(lines[i + 1 :])
            break
        else:
            splitline = line.split(": ")
            if len(splitline) < 2:
                continue
            meta["%" + splitline[0]] = splitline[1]
    return rest, meta


def extract_extra(text):
    extra = ""
    main = text
    if text.lstrip()[0] == "[":
        text = text.lstrip()
        try:
            index = text.index("]")
        except ValueError:
            return extra, main
        extra = text[1:index]
        main = text[index + 1 :]
    return extra, main


def highlight(code, language):
    lexer = pygments.lexers.get_lexer_by_name(language)
    formatter = pygments.formatters.HtmlFormatter(
        linenos=True, style="fruity", classprefix="hi"
    )
    return pygments.highlight(code, lexer, formatter)
