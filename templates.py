from pprint import pprint
import lupa
from lupa import LuaRuntime
from collections import namedtuple
from enum import Enum
import termcolor

import utils

DEBUG = False
ERROR_TEXT = termcolor.colored("ERROR", "red")
WARN_TEXT = termcolor.colored("WARNING", "yellow")


class TokenTypes(Enum):
    TEXT = 0
    START_TAG = 1
    SINGLE_TAG = 2
    CLOSE_TAG = 3
    OPEN_TAG = 4


Token = namedtuple("Token", "type data index")

templates = {}


def load_template(path):
    with open(path) as f:
        current_template = ""
        for line in f:
            line = line.removesuffix("\n")
            if line.endswith(":"):
                current_template = line.removesuffix(":").strip()
                templates[current_template] = ""
            else:
                templates[current_template] += line + "\n"


def tokenize(text):
    tokens = []
    token_content = ""
    token_type = TokenTypes.TEXT
    for char in text:
        if token_type == TokenTypes.TEXT:
            if char == "§":
                if token_content:
                    tokens.append(Token(token_type, token_content, 0))
                    token_content = ""
                token_type = TokenTypes.START_TAG
            else:
                token_content += char
        elif token_type == TokenTypes.START_TAG:
            if char == "%":
                token_type = TokenTypes.SINGLE_TAG
                token_content += char
            elif char == "/":
                token_type = TokenTypes.CLOSE_TAG
            else:
                token_type = TokenTypes.OPEN_TAG
                token_content += char
        elif token_type in [
            TokenTypes.SINGLE_TAG,
            TokenTypes.CLOSE_TAG,
            TokenTypes.OPEN_TAG,
        ]:
            if char.isspace():
                tokens.append(Token(token_type, token_content, 0))
                token_content = char
                token_type = TokenTypes.TEXT
            else:
                token_content += char
    if token_type == TokenTypes.TEXT:
        tokens.append(Token(token_type, token_content, 0))
    return tokens


def parse(tokens_list, depth=0, tagname="root"):
    tree = []
    i = 0
    while i < len(tokens_list):
        token = tokens_list[i]
        value = token
        if token.type == TokenTypes.OPEN_TAG:
            match_index = get_matching(i, tokens_list)
            value = parse(tokens_list[i + 1 : match_index], depth + 1, token.data)
            i = match_index
        tree.append(value)
        i += 1
    return {"tagname": tagname, "tree": tree}


def get_matching(start, tokens_list):
    depth = 0
    index = start
    while depth >= 0:
        index += 1
        if index >= len(tokens_list):
            print(tokens_list[start])
        token = tokens_list[index]
        if token.type == TokenTypes.OPEN_TAG:
            depth += 1
        elif token.type == TokenTypes.CLOSE_TAG:
            depth -= 1
    return index


def flatten(tree, templates):
    output = ""
    for element in tree["tree"]:
        flattened = ""
        if isinstance(element, dict):
            flattened = flatten(element, templates)
        elif element.type == TokenTypes.TEXT:
            flattened = element.data
        elif element.type == TokenTypes.SINGLE_TAG:
            if element.data in templates:
                output += format(templates[element.data], templates)
            else:
                print(
                    f"{termcolor.colored("WARNING", "yellow")}: template §{element.data} doesnt exist :/"
                )
        output += flattened
    if tree["tagname"] != "root":
        if tree["tagname"] in templates:
            try:
                func = lua.eval(
                    "function(content, format, templates) "
                    + templates[tree["tagname"]]
                    + " end"
                )
                output = (
                    func(
                        output,
                        lambda x, t=templates: format(x, t),
                        lua.table_from(templates),
                    )
                    or ""
                )
            except Exception as e:
                print(f"{ERROR_TEXT}: uhh theres an error running {tree["tagname"]}...")
                raise e
                print(e)
        else:
            print(f"{WARN_TEXT}: template §{tree["tagname"]} doesnt exist :/")
    return output


def format(text, meta):
    if not isinstance(meta, dict):
        meta = dict(meta)
    tokens = tokenize(text)
    tree = parse(tokens)
    if DEBUG:
        pprint(tree)
    output = flatten(tree, templates | meta)
    if DEBUG:
        print(output)
    return output


lua = LuaRuntime(unpack_returned_tuples=True)
with open("strease.lua") as f:
    lua.execute(f.read())
lua.globals()["listdir"] = lambda p: lua.table_from(utils.listdir(p))
lua.globals()["readfile"] = utils.readfile


def lua_splitmeta(content):
    c, meta = utils.splitmeta(content)
    return c, lua.table_from(meta)


lua.globals()["splitmeta"] = lua_splitmeta
lua.globals()["extract_extra"] = utils.extract_extra
lua.globals()["highlight_code"] = utils.highlight
