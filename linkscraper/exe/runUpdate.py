import tkinter
from tkinter import ttk
from tkinter import messagebox
import sys
import subprocess

window = tkinter.Tk()

class PrintLogger: 
    def __init__(self, textbox): 
        self.textbox = textbox 

    def write(self, text): 
        self.textbox.insert(tkinter.END, text)

def enter_data():
    # Input Info
    scrapeData = title_combobox.get()    
    writeData = title_combobox2.get()
    fillPubType = title_combobox3.get()
    writeJson = title_combobox4.get()
    
    window.destroy()
    
    if(scrapeData == "Yes"):
        scrapeDataFlag = 1
    elif(scrapeData == "No"):
        scrapeDataFlag = 0
    else:
        tkinter.messagebox.showwarning(title="Error: ScrapeData = " + scrapeData, message=' - Must only use "Yes" or "No"')
    
    if(writeData == "Yes"):
        writeDataFlag = 1
    elif(writeData == "No"):
        writeDataFlag = 0
    else:
        tkinter.messagebox.showwarning(title="Error: WriteData = " + writeData, message=' - Must only use "Yes" or "No"')
        
    if(fillPubType == "Yes"):
        fillPubTypeFlag = 1
    elif(fillPubType == "No"):
        fillPubTypeFlag = 0
    else:
        tkinter.messagebox.showwarning(title="Error: FillPubType = " + fillPubType, message=' - Must only use "Yes" or "No"')
    
    if(writeJson == "Yes"):
        writeJsonFlag = 1
    elif(writeJson == "No"):
        writeJsonFlag = 0
    else:
        tkinter.messagebox.showwarning(title="Error: WriteJson = " + writeJson, message=' - Must only use "Yes" or "No"')
        
    process = subprocess.Popen("python ../code/printExcel.py " + str(scrapeDataFlag) + " " + str(writeDataFlag) + " " + str(fillPubTypeFlag) + " " + str(writeJsonFlag), shell=True)
    process.wait()   

window.title("Input Entry Form")

frame = tkinter.Frame(window)
frame.pack()

# Saving User Info
user_info_frame =tkinter.LabelFrame(frame, text="Flags Input")
user_info_frame.grid(row= 0, column=0, padx=20, pady=10)

title_label = tkinter.Label(user_info_frame, text="Data Extraction: Do you wish to extract data from Google Scholar?")
title_combobox = ttk.Combobox(user_info_frame, values=["Yes", "No"])
title_label.grid(row=0, column=0)
title_combobox.grid(row=1, column=0)

title_label2 = tkinter.Label(user_info_frame, text="Data Update: Do you wish to update the data?")
title_combobox2 = ttk.Combobox(user_info_frame, values=["Yes", "No"])
title_label2.grid(row=0, column=1)
title_combobox2.grid(row=1, column=1)

title_label3 = tkinter.Label(user_info_frame, text="Fill Publications' Types: Do you wish to fill the publications' types?")
title_combobox3 = ttk.Combobox(user_info_frame, values=["Yes", "No"])
title_label3.grid(row=0, column=2)
title_combobox3.grid(row=1, column=2)

title_label4 = tkinter.Label(user_info_frame, text="Data Crossing: Do you wish to write the final data?")
title_combobox4 = ttk.Combobox(user_info_frame, values=["Yes", "No"])
title_label4.grid(row=0, column=3)
title_combobox4.grid(row=1, column=3)

for widget in user_info_frame.winfo_children():
    widget.grid_configure(padx=10, pady=5)

# Button
button = tkinter.Button(frame, text="Run Code", command=enter_data)
button.grid(row=3, column=0, sticky="news", padx=20, pady=10)

textbox = tkinter.Text(window) 
textbox.pack() 

printlogger = PrintLogger(textbox) 
sys.stdout = printlogger

window.mainloop()
