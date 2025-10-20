import sys
import pygments.formatters

with open("code.css", "w") as f:
    formatter = pygments.formatters.HtmlFormatter(
        linenos=True, style=sys.argv[1], classprefix="hi"
    )
    f.write(formatter.get_style_defs())
