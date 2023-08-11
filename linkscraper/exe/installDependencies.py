import sys
import subprocess

process = subprocess.Popen("pip install lxml-4.9.0-cp311-cp311-win_amd64.whl", shell=True)
process.wait()
process = subprocess.Popen("pip install scrapy", shell=True)
process.wait()
process = subprocess.Popen("pip install xlsxwriter", shell=True)
process.wait()
process = subprocess.Popen("pip install scholarly", shell=True)
process.wait()