import tkinter
from tkinter import ttk
from tkinter import messagebox
from tkinter import Text
import sys
import subprocess
import os
import json
import unicodedata

window = tkinter.Tk()

def enter_data():
    if(textbox.get("1.0", "end-1c")):
        pubList = str(textbox.get("1.0", "end-1c")).split(',')
        window.destroy()
        jsonFile = open('../data/linkscraper_output/barsTemp.json')
        barsTemp = json.load(jsonFile)
           
        isFile = os.path.isfile('../data/linkscraper_output/deletedPublications.json')
        if(not isFile):
            with open("../data/linkscraper_output/deletedPublications.json", "w") as info:
                json.dump([], info, indent=2) 
        
        jsonFile2 = open('../data/linkscraper_output/deletedPublications.json')
        deletedPubsList = json.load(jsonFile2)        
        
        for pub in pubList:
            if(pub not in deletedPubsList):
                deletedPubsList.append(pub)            
        
        finalBars = []
        
        for publication in barsTemp:
            pubTitle = publication['title']
            
            if(pubTitle not in deletedPubsList):
                finalBars.append(publication)
            else:
                print(pubTitle)
                print("aqui")
        
        with open("../data/linkscraper_output/deletedPublications.json", "w") as info:
            json.dump(deletedPubsList, info, indent=2)        
        
        with open("../data/linkscraper_output/barsTemp.json", "w") as info:
            json.dump(finalBars, info, indent=2)
            
        process = subprocess.Popen("python ../code/printExcel.py 0 1 0 1", shell=True)
        process.wait()
        
    else:
        print("Error: Input Text is Empty")
        
window.title("Delete Publication(s) Form")

frame = tkinter.Frame(window)
frame.pack()

user_info_frame =tkinter.LabelFrame(frame, text="Publication Titles Input")
user_info_frame.grid(row= 0, column=0, padx=20, pady=10)

title_label = tkinter.Label(user_info_frame, text="Insert Publication's Titles separated by a comma")
title_label.grid(row=0, column=0)

user_info_frame2 =tkinter.LabelFrame(frame, text="Example:")
user_info_frame2.grid(row= 1, column=0, padx=20, pady=10)

title_label2 = tkinter.Label(user_info_frame2, text="PublicationTitle1,Publicationtitle2,...")
title_label2.grid(row=1, column=0)

textbox = tkinter.Text(window) 
textbox.pack()

# Button
button = tkinter.Button(frame, text="Run Code", command=enter_data)
button.grid(row=3, column=0, sticky="news", padx=20, pady=10)

window.mainloop()