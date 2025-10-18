#!/bin/bash
while true; do
  inotifywait -e modify,create,delete -r . &&
    python main.py
done
