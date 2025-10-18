import os
import shutil
from pprint import pprint
import termcolor

import utils
import templates

TEMPLATES_ROOT = "./templates/"
INPUT_DIR = "./src/"
OUTPUT_DIR = "./out/"
templates.lua.globals()["INPUT_DIR"] = INPUT_DIR
templates.lua.globals()["OUTPUT_DIR"] = OUTPUT_DIR

# TODO: RECURSIVE LOAD ALL TEMPLATES

for template_path in os.listdir(TEMPLATES_ROOT):
    if template_path.endswith(".txt"):
        templates.load_template(TEMPLATES_ROOT + template_path)

if os.path.isdir(OUTPUT_DIR):
    shutil.rmtree(OUTPUT_DIR)
os.makedirs(OUTPUT_DIR)

for root, dirs, files in os.walk(INPUT_DIR):
    root = root.removeprefix(INPUT_DIR)
    if root != "":
        root += "/"
    for dir in dirs:
        filepath = root + dir
        termcolor.cprint(f"CREATING DIRECTORY {filepath}", "green")
        os.makedirs(OUTPUT_DIR + filepath)
    for file in files:
        filepath = root + file
        if filepath.endswith(".page"):
            with open(INPUT_DIR + filepath) as f:
                text, meta = utils.splitmeta(f.read())
                outputfile = OUTPUT_DIR + filepath.removesuffix("page") + "html"
                termcolor.cprint(f"TEMPLATING {filepath}", "blue")
                meta["%path"] = filepath
                formatted = templates.format(text, meta)

                with open(outputfile, "w") as f:
                    f.write(formatted)
        else:
            termcolor.cprint(f"COPYING {filepath}", "cyan")
            shutil.copy(INPUT_DIR + filepath, OUTPUT_DIR + filepath)
