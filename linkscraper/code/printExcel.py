import xlsxwriter
import unicodedata

from scholarly import scholarly, ProxyGenerator

from collections import OrderedDict
from collections import Counter

import json
import sys
import re
import random
import math
import datetime
import time
import shutil
import subprocess
import os
import fileinput

abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

def logIn(key):
    pg = ProxyGenerator()

    #success = pg.ScraperAPI('0554895b418cba64e79764bdec219845', country_code='pt', premium=True, render=True)
    success = pg.ScraperAPI(key)
    scholarly.use_proxy(pg)

    print("logged in")

def findGoogleScholarID(link):
    result = re.search('user=(.*)AJ', link)
    if(result):
        authorID = re.sub('user=', '', result.group())
        return authorID
    else:
        result = re.search('user=(.*)&', link)
        if(result):
            authorID = re.sub('user=', '', result.group())
            return authorID
    
    return None

def findPhDAuthors():
    jsonFile = open('../data/linkscraper_output/bars.json')
    bars = json.load(jsonFile)
    
    authorInfo = {}   
    authorInfoList = []
    
    pubInfoList = []
    pubList = []
    n = 0
    for i in range(0, len(bars)):
        name = bars[i]['author']
        unicodedata.normalize('NFKD', name).encode('ascii', 'ignore')
        print("author: " + str(name) + ", " + "pub_title: " + str(bars[i]['title']))
        print("pub_index: " + str(i + 1) + "/" + str(len(bars)))
        
        pubInfo = {}
        if(i == 0):
            authorInfo = {}
            authorInfo['author'] = bars[i]['author']
            authorInfo['affiliation'] = bars[i]['affiliation']
            authorInfo['research_area'] = bars[i]['research_area']
            authorInfo['research_area_acronym'] = bars[i]['research_area_acronym']
            authorInfo['type'] = bars[i]['type']
            authorInfo['previous_cmu_advisor'] = bars[i]['previous_cmu_advisor']
            authorInfo['cmu_advisor'] = bars[i]['cmu_advisor']
            authorInfo['previous_pt_advisor'] = bars[i]['previous_pt_advisor']
            authorInfo['pt_advisor'] = bars[i]['pt_advisor']
            authorInfo['start_research_year'] = bars[i]['start_research_year']
            authorInfo['end_research_year'] = bars[i]['end_research_year']
            authorInfo['graduation_year'] = bars[i]['graduation_year']
            authorInfo['status'] = bars[i]['status']
            authorInfo['google_scholar_link'] = bars[i]['google_scholar_link']
            authorInfo['picture'] = bars[i]['image']
            authorInfo['index'] = bars[i]['index']
            
            pubTitle = bars[i]['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')                
            if(pubTitle not in pubList):
                pubInfo['title'] = pubTitle
                pubInfo['pub_year'] = bars[i]['publication_year']
                pubInfo['author'] = bars[i]['author']
                pubInfo['authors'] = bars[i]['authors']
                pubInfo['bars'] = bars[i]['bars']
                pubInfo['years'] = bars[i]['years']
                
                pubInfo['pub_type'] = bars[i]['pub_type']
                pubInfo['research_area'] = bars[i]['research_area']
                pubInfo['research_area_acronym'] = bars[i]['research_area_acronym']
                pubInfo['pub_link'] = bars[i]['pub_link']
                pubInfo['pub_DOI'] = bars[i]['pub_DOI']
                pubInfo['pub_scholar_link'] = bars[i]['pub_scholar_link']                            
                
                if(pubInfo['pub_type'] != "mastersthesis"):
                    pubInfoList.append(pubInfo)
                    
                pubList.append(pubTitle)
        elif(i == len(bars) - 1):
            pubTitle = bars[i]['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')                
            if(pubTitle not in pubList):
                pubInfo['title'] = pubTitle
                pubInfo['pub_year'] = bars[i]['publication_year']
                pubInfo['author'] = bars[i]['author']
                pubInfo['authors'] = bars[i]['authors']
                pubInfo['bars'] = bars[i]['bars']
                pubInfo['years'] = bars[i]['years']
                
                pubInfo['pub_type'] = bars[i]['pub_type']
                pubInfo['research_area'] = bars[i]['research_area']
                pubInfo['research_area_acronym'] = bars[i]['research_area_acronym']
                pubInfo['pub_link'] = bars[i]['pub_link']
                pubInfo['pub_DOI'] = bars[i]['pub_DOI']
                pubInfo['pub_scholar_link'] = bars[i]['pub_scholar_link']                            
                
                if(pubInfo['pub_type'] != "mastersthesis"):
                    pubInfoList.append(pubInfo)
                
                authorInfo['publications'] = pubInfoList
                authorInfoList.append(authorInfo)                            
        else:
            previousIndex = bars[i-1]['index']
            index = bars[i]['index']
            
            if(previousIndex != index):
                authorInfo['publications'] = pubInfoList
                authorInfoList.append(authorInfo)
                pubInfoList = []
                pubList = []
                
                authorInfo = {}
                authorInfo['author'] = bars[i]['author']
                authorInfo['affiliation'] = bars[i]['affiliation']
                authorInfo['research_area'] = bars[i]['research_area']
                authorInfo['research_area_acronym'] = bars[i]['research_area_acronym']
                authorInfo['type'] = bars[i]['type']
                authorInfo['previous_cmu_advisor'] = bars[i]['previous_cmu_advisor']
                authorInfo['cmu_advisor'] = bars[i]['cmu_advisor']
                authorInfo['previous_pt_advisor'] = bars[i]['previous_pt_advisor']
                authorInfo['pt_advisor'] = bars[i]['pt_advisor']
                authorInfo['start_research_year'] = bars[i]['start_research_year']
                authorInfo['end_research_year'] = bars[i]['end_research_year']
                authorInfo['graduation_year'] = bars[i]['graduation_year']
                authorInfo['status'] = bars[i]['status']
                authorInfo['google_scholar_link'] = bars[i]['google_scholar_link']
                authorInfo['picture'] = bars[i]['image']
                authorInfo['index'] = index
                
                pubTitle = bars[i]['title']
                unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')                
                if(pubTitle not in pubList):
                    pubInfo['title'] = pubTitle
                    pubInfo['pub_year'] = bars[i]['publication_year']
                    pubInfo['author'] = bars[i]['author']
                    pubInfo['authors'] = bars[i]['authors']
                    pubInfo['bars'] = bars[i]['bars']
                    pubInfo['years'] = bars[i]['years']
                    
                    pubInfo['pub_type'] = bars[i]['pub_type']
                    pubInfo['research_area'] = bars[i]['research_area']
                    pubInfo['research_area_acronym'] = bars[i]['research_area_acronym']
                    pubInfo['pub_link'] = bars[i]['pub_link']
                    pubInfo['pub_DOI'] = bars[i]['pub_DOI']
                    pubInfo['pub_scholar_link'] = bars[i]['pub_scholar_link']                            
                    
                    if(pubInfo['pub_type'] != "mastersthesis"):
                        pubInfoList.append(pubInfo)
                    pubList.append(pubTitle)
            else:
                pubTitle = bars[i]['title']
                unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')                
                if(pubTitle not in pubList):
                    pubInfo['title'] = pubTitle
                    pubInfo['pub_year'] = bars[i]['publication_year']
                    pubInfo['author'] = bars[i]['author']
                    pubInfo['authors'] = bars[i]['authors']
                    pubInfo['bars'] = bars[i]['bars']
                    pubInfo['years'] = bars[i]['years']
                    
                    pubInfo['pub_type'] = bars[i]['pub_type']
                    pubInfo['research_area'] = bars[i]['research_area']
                    pubInfo['research_area_acronym'] = bars[i]['research_area_acronym']
                    pubInfo['pub_link'] = bars[i]['pub_link']
                    pubInfo['pub_DOI'] = bars[i]['pub_DOI']
                    pubInfo['pub_scholar_link'] = bars[i]['pub_scholar_link']                            
                    
                    if(pubInfo['pub_type'] != "mastersthesis"):
                        pubInfoList.append(pubInfo)
                    pubList.append(pubTitle)                            
    
    with open("../data/code_output/authorsInfoList.json", "w") as info:
        json.dump(authorInfoList, info, indent=2)
                   
def hIndex(citations, n):
    hindex = 0
    # Set the range for binary search
    low = 0
    high = n - 1
    while (low <= high):
        mid = (low + high) // 2
        # Check if current citations is
        # possible
        if (int(citations[mid]) >= (mid + 1)):
            # Check to the right of mid
            low = mid + 1 
            # Update h-index
            hindex = mid + 1
        else:
            # Since current value is not
            # possible, check to the left
            # of mid
            high = mid - 1
  
    return hindex

def i10Index(citations, n):
    for i in range(n):
        if(int(citations[i]) < 10):
            return i
    return 0

def excelColumnsNames(l):
    
    repetion = 1
    column = ""
    for i in range(l):
        if("Z" in column):
            repetion += 1
        
        column = abc[i]*repetion + "1"
    
    return "A1:" + column

def printExcelSheet1(workbook):
    print("sheet1")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile)
    
    worksheet = workbook.add_worksheet('Global Data')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True) 
    
    today = datetime.date.today()
    currentYear = today.year    
    
    worksheet.write('A1', 'AUTHORS', cell_format)
    worksheet.write('B1', 'AFFILIATIONS', cell_format)
    worksheet.write('C1', 'RESEARCH_AREAS', cell_format)
    worksheet.write('D1', 'CITATIONS_COUNT', cell_format)
    worksheet.write('E1', 'CITATIONS_COUNT_5', cell_format)
    worksheet.write('F1', 'H_INDEX', cell_format)
    worksheet.write('G1', 'H_INDEX_5', cell_format)
    worksheet.write('H1', 'I10_INDEX', cell_format)
    worksheet.write('I1', 'I10_INDEX_5', cell_format)
    worksheet.write('J1', 'NUMBER_OF_PUBLICATIONS', cell_format)
    worksheet.write('K1', 'PUBLICATIONS', cell_format)
    worksheet.write('L1', "NUMBER_OF_AUTHORS", cell_format)
    worksheet.write('M1', 'NUMBER_OF_INTERNATIONAL_PUBLICATIONS', cell_format)
    worksheet.write('N1', 'NUMBER_OF_STUDENT_COLLABORATION_PUBLICATIONS', cell_format)
    
    worksheet.set_column(0, 0, 27)
    worksheet.set_column(1, 1, 25)
    worksheet.set_column(2, 2, 25)
    worksheet.set_column(3, 3, 20)
    worksheet.set_column(4, 4, 22)
    worksheet.set_column(5, 5, 14)
    worksheet.set_column(6, 6, 14)
    worksheet.set_column(7, 7, 14)
    worksheet.set_column(8, 8, 14)
    worksheet.set_column(9, 9, 25)
    worksheet.set_column(10, 10, 12)
    worksheet.set_column(11, 11, 25)
    worksheet.set_column(12, 12, 25)
    worksheet.set_column(13, 13, 25)
    worksheet.set_column(14, 14, 25)
    worksheet.set_column(15, 15, 25)    
    
    internationalCollabPubsCount = 0
    studentCollabPubsCount = 0    
    pubCollabDic = {}    
    for i in range(len(data)):
        author = data[i]
        
        previousAdvisorCMU = author['previous_cmu_advisor']
        advisorCMU = author['cmu_advisor']
        previousAdvisorPT = author['previous_pt_advisor']
        advisorPT = author['pt_advisor']
        
        previousCMUAdvisors = previousAdvisorCMU.split('/')
        CMUAdvisors = advisorCMU.split('/')
        previousPTAdvisors = previousAdvisorPT.split('/')
        PTAdvisors = advisorPT.split('/')
            
        authorInternationalCollabPubsCount = 0
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')

            authors = pub['authors'].split(', ')
            pubAuthorsList = [] 
            for k in range(len(authors)):
                authorName = authors[k]
                unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
                
                pubAuthorsList.append(authorName)            
            
            CMUAdvisorsList = []
            PTAdvisorsList = []
            if(str(pubTitle) not in pubCollabDic):
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a)):
                                    CMUAdvisorFlag = 1
                                    CMUAdvisorsList.append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor)):
                            CMUAdvisorFlag = 1
                            CMUAdvisorsList.append(cmuAdvisor)
        
                PTAdvisorFlag = 0
                for ptAdvisor in previousPTAdvisors:
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a)):                                                            
                                    PTAdvisorFlag = 1
                                    PTAdvisorsList.append(ptAdvisor)
                            elif(isin(a, ptAdvisor)):
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                            
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a)):                                                            
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                        elif(isin(a, ptAdvisor)):
                            PTAdvisorFlag = 1
                            PTAdvisorsList.append(ptAdvisor)
                
                pubCollabDic[str(pubTitle)] = {
                            'authors': [author['author']],
                            'cmu_advisor_flags': [CMUAdvisorFlag],
                            'pt_advisor_flags': [PTAdvisorFlag],
                            'cmu_advisors': CMUAdvisorsList,
                            'pt_advisors': PTAdvisorsList
                        }  
                                                  
                if(CMUAdvisorFlag == 1 and PTAdvisorFlag == 1):
                    pubCollabDic[str(pubTitle)]['colab'] = "Yes"
                    internationalCollabPubsCount += 1
                else:
                    pubCollabDic[str(pubTitle)]['colab'] = "No"    
            else:
                pubCollabDic[str(pubTitle)]['authors'].append(author['author'])
                
                if(len(pubCollabDic[str(pubTitle)]['authors']) == 2):
                    studentCollabPubsCount += 1                
                                    
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                    CMUAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                            CMUAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
        
                PTAdvisorFlag = 0 
                for ptAdvisor in previousPTAdvisors: 
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                    PTAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                            elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)                
                
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                        elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                            PTAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
        
                pubCollabDic[str(pubTitle)]['cmu_advisor_flags'].append(CMUAdvisorFlag)
                pubCollabDic[str(pubTitle)]['pt_advisor_flags'].append(PTAdvisorFlag)
        
                if(pubCollabDic[str(pubTitle)]['colab'] != "Yes"):
                    if(1 in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                        pubCollabDic[str(pubTitle)]['colab'] = "Yes"
                        internationalCollabPubsCount += 1
                    else:
                        pubCollabDic[str(pubTitle)]['colab'] = "No"    
    
    authorsNames = ""
    affiliations = ""
    researchAreas = ""
    cmuAdvisors = ""
    ptAdvisors = ""
    publicationsTitles = ""
    
    publicationsCitationsCount = 0
    publicationsCitationsCount5 = 0
    citationsOverYears = []
    citationsOver5Years = []
    pubList = []
    areasList = []
    nPublications = 0
    nAuthors = 0
    for i in range(len(data)):
        author = data[i]
        nAuthors += 1
        
        authorName = author['author']
        unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
                
        authorAffiliation = author['affiliation']
        unicodedata.normalize('NFKD', authorAffiliation).encode('ascii', 'ignore')        
        
        authorResearchArea = author['research_area']
        unicodedata.normalize('NFKD', authorResearchArea).encode('ascii', 'ignore')
                    
        authorCMUAdvisor = author['cmu_advisor']
        unicodedata.normalize('NFKD', authorCMUAdvisor).encode('ascii', 'ignore')
        
        authorPTAdvisor = author['pt_advisor']
        unicodedata.normalize('NFKD', authorPTAdvisor).encode('ascii', 'ignore')        
        
        if(i != len(data) - 1):
            authorsNames += str(authorName) + ';'
            affiliations += str(authorAffiliation) + ';'     
        else:
            authorsNames += str(authorName)
            affiliations += str(authorAffiliation)
            
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')
            
            if(str(pubTitle) not in pubList):
                pubList.append(str(pubTitle))
                nPublications += 1
                
                if(j != len(author['publications']) - 1):
                    publicationsTitles += str(pubTitle) + ';'
                else:
                    publicationsTitles += str(pubTitle)
                
                if(len(pub['years']) == len(pub['bars']) and len(pub['years']) != 0):
                    for k in range(len(pub['years'])):
                        if(int(pub['years'][k]) >= int(author['start_research_year']) and int(pub['years'][k]) >= int(pub['pub_year'])):
                            publicationsCitationsCount += int(pub['bars'][k])
                            citationsOverYears.append(int(pub['bars'][k]))
                        
                            if(int(pub['years'][k]) >= currentYear - 5):
                                publicationsCitationsCount5 += int(pub['bars'][k])
                                citationsOver5Years.append(int(pub['bars'][k]))
        
    citationsOverYears.sort(reverse = True)
    citationsOver5Years.sort(reverse = True)        
    
    h_index = hIndex(citationsOverYears, len(citationsOverYears))
    h_index5 = hIndex(citationsOver5Years, len(citationsOver5Years))
    i10_index = i10Index(citationsOverYears, len(citationsOverYears))
    i10_index5 = i10Index(citationsOver5Years, len(citationsOver5Years))    
    
    worksheet.write(1, 0, str(authorsNames))
    worksheet.write(1, 1, str(affiliations))
    worksheet.write(1, 2, str(authorResearchArea))
    worksheet.write(1, 3, publicationsCitationsCount)
    worksheet.write(1, 4, publicationsCitationsCount5)
    worksheet.write(1, 5, h_index)
    worksheet.write(1, 6, h_index5)
    worksheet.write(1, 7, i10_index)
    worksheet.write(1, 8, i10_index5)  
    worksheet.write(1, 9, nPublications)
    worksheet.write(1, 10, str(publicationsTitles))
    worksheet.write(1, 11, nAuthors)
    worksheet.write(1, 12, internationalCollabPubsCount)
    worksheet.write(1, 13, studentCollabPubsCount)
    
    jsonFile.close()

def printExcelSheet2(workbook):
    print("sheet2")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Global Citation Per Year')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    today = datetime.date.today()
    currentYear = today.year    
    
    yearsDict = {}    
    pubTitleList = []
    for i in range(len(data)):
        author = data[i]
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')            
            if(str(pubTitle) not in pubTitleList):
                pubTitleList.append(str(pubTitle))
                if(len(pub['years']) == len(pub['bars']) and len(pub['years']) != 0):
                    for k in range(len(pub['years'])):
                        if(int(pub['years'][k]) >= int(author['start_research_year']) and int(pub['years'][k]) >= int(pub['pub_year'])):
                            if(str(pub['years'][k]) not in yearsDict):
                                yearsDict[str(pub['years'][k])] = 0
                            
                            yearsDict[str(pub['years'][k])] += int(pub['bars'][k])
    
    if("2006" not in yearsDict):
        yearsDict["2006"] = 0
           
    if(str(currentYear) not in yearsDict):
        yearsDict[str(currentYear)] = 0
    
    yearsList = []
    for key, value in yearsDict.items():
        yearsList.append(int(key))
    
    yearsList.sort()
    missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
    
    for year in missingYears:
        yearsDict[str(year)] = 0
        yearsList.append(year)
    
    yearsList.sort()
                       
    for i in range(len(yearsList)):
        worksheet.write(0, i, str(yearsList[i]), cell_format)
    
    sortedCiteYearsAndBars = OrderedDict(sorted(yearsDict.items()))

    for key, value in sortedCiteYearsAndBars.items():
        for j in range(len(yearsList)):
            if(str(key) == str(yearsList[j])):
                worksheet.write(1, j, int(value))
                
    worksheet.autofilter(0, 0, len(data)-1, len(yearsList) -1)
    
    columns = excelColumnsNames(len(yearsList))
    worksheet.ignore_errors({'number_stored_as_text': columns})
    jsonFile.close()

def printExcelSheet3(workbook):
    print("sheet3")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Global Pubs Per Year')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    today = datetime.date.today()
    currentYear = today.year
    
    totalNumberOfPubsPerYear = {}    
    pubTitleList = []
    for i in range(len(data)):
        author = data[i]
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')            
            if(str(pubTitle) not in pubTitleList):
                pubTitleList.append(str(pubTitle))
                
                if(str(pub['pub_year']) not in totalNumberOfPubsPerYear):
                    totalNumberOfPubsPerYear[str(pub['pub_year'])] = 0
                
                totalNumberOfPubsPerYear[str(pub['pub_year'])] += 1
                            
    if("2006" not in totalNumberOfPubsPerYear):
        totalNumberOfPubsPerYear["2006"] = 0
           
    if(str(currentYear) not in totalNumberOfPubsPerYear):
        totalNumberOfPubsPerYear[str(currentYear)] = 0
    
    yearsList = []
    for key, value in totalNumberOfPubsPerYear.items():
        yearsList.append(int(key))
    
    yearsList.sort()
    missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
    
    for year in missingYears:
        totalNumberOfPubsPerYear[str(year)] = 0
        yearsList.append(year)
    
    yearsList.sort()        
                         
    for i in range(len(yearsList)):
        worksheet.write(0, i, str(yearsList[i]), cell_format)
    
    sortedCiteYearsAndBars = OrderedDict(sorted(totalNumberOfPubsPerYear.items()))

    for key, value in sortedCiteYearsAndBars.items():
        for j in range(len(yearsList)):
            if(str(key) == str(yearsList[j])):
                worksheet.write(1, j, int(value))
                
    worksheet.autofilter(0, 0, len(data)-1, len(yearsList) -1)
    
    columns = excelColumnsNames(len(yearsList))
    worksheet.ignore_errors({'number_stored_as_text': columns})
    jsonFile.close()

def printExcelSheet4(workbook):
    print("sheet4")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Global Pub Types')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    totalNumberOfPubsPerType = {}    
    pubTitleList = []
    for i in range(len(data)):
        author = data[i]
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')            
            if(str(pubTitle) not in pubTitleList):
                pubTitleList.append(str(pubTitle))
                
                if(str(pub['pub_type']) not in totalNumberOfPubsPerType):
                    totalNumberOfPubsPerType[str(pub['pub_type'])] = 0                
                
                totalNumberOfPubsPerType[str(pub['pub_type'])] += 1
                            
    typeList = []
    for key, value in totalNumberOfPubsPerType.items():
        typeList.append(key)
    
    typeList.sort()
                         
    for i in range(len(typeList)):
        worksheet.write(0, i, typeList[i], cell_format)
    
    sortedCiteTypesAndBars = OrderedDict(sorted(totalNumberOfPubsPerType.items()))

    for key, value in sortedCiteTypesAndBars.items():
        for j in range(len(typeList)):
            if(str(key) == str(typeList[j])):
                worksheet.write(1, j, int(value))
                
    worksheet.autofilter(0, 0, len(data)-1, len(typeList) -1)
    
    columns = excelColumnsNames(len(typeList))
    jsonFile.close()

def printExcelSheet5(workbook):
    print("sheet5")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Global Pub Areas')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    totalNumberOfPubsPerArea = {}    
    pubTitleList = []
    for i in range(len(data)):
        author = data[i]
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')            
            if(str(pubTitle) not in pubTitleList):
                pubTitleList.append(str(pubTitle))
                
                if(str(pub['research_area']) not in totalNumberOfPubsPerArea):
                    totalNumberOfPubsPerArea[pub['research_area']] = 0                    
                    
                totalNumberOfPubsPerArea[pub['research_area']] += 1
                            
    areaList = []
    for key, value in totalNumberOfPubsPerArea.items():
        areaList.append(key)
    
    areaList.sort()
                         
    for i in range(len(areaList)):
        worksheet.write(0, i, areaList[i], cell_format)
    
    sortedCiteTypesAndBars = OrderedDict(sorted(totalNumberOfPubsPerArea.items()))

    for key, value in sortedCiteTypesAndBars.items():
        for j in range(len(areaList)):
            if(str(key) == str(areaList[j])):
                worksheet.write(1, j, int(value))
                
    worksheet.autofilter(0, 0, len(data)-1, len(areaList) -1)
    
    columns = excelColumnsNames(len(areaList))
    jsonFile.close()

def printExcelSheet6(workbook):
    print("sheet6")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Global Author Areas')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    totalNumberOfAuthorsPerArea = {}    
    pubTitleList = []
    for i in range(len(data)):
        author = data[i]
        
        if(str(author['research_area']) not in totalNumberOfAuthorsPerArea):
            totalNumberOfAuthorsPerArea[str(author['research_area'])] = 0                    
        
        totalNumberOfAuthorsPerArea[str(author['research_area'])] += 1        
                
                            
    areaList = []
    for key, value in totalNumberOfAuthorsPerArea.items():
        areaList.append(key)
    
    areaList.sort()
                         
    for i in range(len(areaList)):
        worksheet.write(0, i, areaList[i], cell_format)
    
    sortedCiteTypesAndBars = OrderedDict(sorted(totalNumberOfAuthorsPerArea.items()))

    for key, value in sortedCiteTypesAndBars.items():
        for j in range(len(areaList)):
            if(str(key) == str(areaList[j])):
                worksheet.write(1, j, int(value))
                
    worksheet.autofilter(0, 0, len(data)-1, len(areaList) -1)
    
    columns = excelColumnsNames(len(areaList))
    jsonFile.close()

def printExcelSheet7(workbook):
    print("sheet7")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Global Pub Author Ratio Areas')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    totalNumberOfPubsPerArea = {}
    totalNumberOfAuthorsPerArea = {}
    pubTitleList = []
    for i in range(len(data)):
        author = data[i]
        
        
        if(str(author['research_area']) not in totalNumberOfAuthorsPerArea):
            totalNumberOfAuthorsPerArea[str(author['research_area'])] = 0                    
        
        totalNumberOfAuthorsPerArea[str(author['research_area'])] += 1        
        
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')            
            if(str(pubTitle) not in pubTitleList):
                pubTitleList.append(str(pubTitle))
                
                if(str(pub['research_area']) not in totalNumberOfPubsPerArea):
                    totalNumberOfPubsPerArea[str(pub['research_area'])] = 0                    
                
                totalNumberOfPubsPerArea[str(pub['research_area'])] += 1
                            
    areaList = []
    for key, value in totalNumberOfPubsPerArea.items():
        areaList.append(key)
    
    areaList.sort()
                         
    for i in range(len(areaList)):
        worksheet.write(0, i, areaList[i], cell_format)
    
    sortedCiteTypesAndBars = OrderedDict(sorted(totalNumberOfPubsPerArea.items()))
    sortedAuthorsArea = OrderedDict(sorted(totalNumberOfAuthorsPerArea.items()))
    
    for key, value in sortedCiteTypesAndBars.items():
        for j in range(len(areaList)):
            if(str(key) == str(areaList[j])):
                worksheet.write(1, j, int(value)/int(sortedAuthorsArea[key]))
                
    worksheet.autofilter(0, 0, len(data)-1, len(areaList) -1)
    
    columns = excelColumnsNames(len(areaList))
    jsonFile.close()

def printExcelSheet8(workbook):
    print("sheet8")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Global Collabs Per Year')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    today = datetime.date.today()
    currentYear = today.year
    
    totalNumberOfCollabsPerYear = {}    
    pubTitleList = []
    pubCollabDic = {}
    for i in range(len(data)):
        author = data[i]
        previousAdvisorCMU = author['previous_cmu_advisor']
        advisorCMU = author['cmu_advisor']
        previousAdvisorPT = author['previous_pt_advisor']
        advisorPT = author['pt_advisor']
        
        previousCMUAdvisors = previousAdvisorCMU.split('/')
        CMUAdvisors = advisorCMU.split('/')
        previousPTAdvisors = previousAdvisorPT.split('/')
        PTAdvisors = advisorPT.split('/')        
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')
            
            authors = pub['authors'].split(', ')
            pubAuthorsList = [] 
            for k in range(len(authors)):
                authorName = authors[k]
                unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
                
                pubAuthorsList.append(authorName)            
            
            CMUAdvisorsList = []
            PTAdvisorsList = []            
            
            if(str(pubTitle) not in pubTitleList):
                pubTitleList.append(str(pubTitle))
                
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a)):
                                    CMUAdvisorFlag = 1
                                    CMUAdvisorsList.append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor)):
                            CMUAdvisorFlag = 1
                            CMUAdvisorsList.append(cmuAdvisor)
        
                PTAdvisorFlag = 0
                for ptAdvisor in previousPTAdvisors:
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a)):                                                            
                                    PTAdvisorFlag = 1
                                    PTAdvisorsList.append(ptAdvisor)
                            elif(isin(a, ptAdvisor)):
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                            
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a)):                                                            
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                        elif(isin(a, ptAdvisor)):
                            PTAdvisorFlag = 1
                            PTAdvisorsList.append(ptAdvisor)
                
                pubCollabDic[str(pubTitle)] = {
                            'authors': [author['author']],
                            'cmu_advisor_flags': [CMUAdvisorFlag],
                            'pt_advisor_flags': [PTAdvisorFlag],
                            'cmu_advisors': CMUAdvisorsList,
                            'pt_advisors': PTAdvisorsList
                        }  
        
                if(CMUAdvisorFlag == 1 and PTAdvisorFlag == 0):
                    pubCollabDic[str(pubTitle)]['colab'] = "Just CMU Advisor"
                elif(CMUAdvisorFlag == 0 and PTAdvisorFlag == 1):
                    pubCollabDic[str(pubTitle)]['colab'] = "Just PT Advisor"                                          
                elif(CMUAdvisorFlag == 1 and PTAdvisorFlag == 1):
                    pubCollabDic[str(pubTitle)]['colab'] = "Yes"
                    
                    if(str(pub['pub_year']) not in totalNumberOfCollabsPerYear):
                        totalNumberOfCollabsPerYear[str(pub['pub_year'])] = 0                
                    
                    totalNumberOfCollabsPerYear[str(pub['pub_year'])] += 1                    
                else:
                    pubCollabDic[str(pubTitle)]['colab'] = "No"    
            else:
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                    CMUAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                            CMUAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
        
                PTAdvisorFlag = 0 
                for ptAdvisor in previousPTAdvisors: 
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                    PTAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                            elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)                
                
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                        elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                            PTAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
        
                pubCollabDic[str(pubTitle)]['cmu_advisor_flags'].append(CMUAdvisorFlag)
                pubCollabDic[str(pubTitle)]['pt_advisor_flags'].append(PTAdvisorFlag)
        
                if(pubCollabDic[str(pubTitle)]['colab'] != "Yes"):
                    if(1 in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                        pubCollabDic[str(pubTitle)]['colab'] = "Yes"
                        internationalCollabPubsCount += 1
                        if(str(pub['pub_year']) not in totalNumberOfCollabsPerYear):
                            totalNumberOfCollabsPerYear[str(pub['pub_year'])] = 0                
                        
                        totalNumberOfCollabsPerYear[str(pub['pub_year'])] += 1                        
                                                        
    if("2006" not in totalNumberOfCollabsPerYear):
        totalNumberOfCollabsPerYear["2006"] = 0
           
    if(str(currentYear) not in totalNumberOfCollabsPerYear):
        totalNumberOfCollabsPerYear[str(currentYear)] = 0
    
    yearsList = []
    for key, value in totalNumberOfCollabsPerYear.items():
        yearsList.append(int(key))
        
    yearsList.sort()
    missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
    
    for year in missingYears:
        totalNumberOfCollabsPerYear[str(year)] = 0    
        yearsList.append(year)
    
    yearsList.sort()                       
    for i in range(len(yearsList)):
        worksheet.write(0, i, str(yearsList[i]), cell_format)
    
    sortedCiteYearsAndBars = OrderedDict(sorted(totalNumberOfCollabsPerYear.items()))

    for key, value in sortedCiteYearsAndBars.items():
        for j in range(len(yearsList)):
            if(str(key) == str(yearsList[j])):
                worksheet.write(1, j, int(value))
                
    worksheet.autofilter(0, 0, len(data)-1, len(yearsList) -1)
    
    columns = excelColumnsNames(len(yearsList))
    worksheet.ignore_errors({'number_stored_as_text': columns})
    jsonFile.close()


def printExcelSheet9(workbook):
    print("sheet9")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Global Student Collabs Per Year')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    today = datetime.date.today()
    currentYear = today.year
    
    totalNumberOfStudentCollabsPerYear = {}    
    pubTitleList = []
    pubCollabDic = {}
    for i in range(len(data)):
        author = data[i]
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')            
            if(str(pubTitle) not in pubTitleList):
                pubTitleList.append(str(pubTitle))
                
                pubCollabDic[str(pubTitle)] = {
                            'authors': [author['author']]
                        }                
            else:
                pubCollabDic[str(pubTitle)]['authors'].append(author['author'])
                
                if(len(pubCollabDic[str(pubTitle)]['authors']) == 2):
                    
                    if(str(pub['pub_year']) not in totalNumberOfStudentCollabsPerYear):
                        totalNumberOfStudentCollabsPerYear[str(pub['pub_year'])] = 0                
                    
                    totalNumberOfStudentCollabsPerYear[str(pub['pub_year'])] += 1                                           
                                                        
    if("2006" not in totalNumberOfStudentCollabsPerYear):
        totalNumberOfStudentCollabsPerYear["2006"] = 0
           
    if(str(currentYear) not in totalNumberOfStudentCollabsPerYear):
        totalNumberOfStudentCollabsPerYear[str(currentYear)] = 0
    
    yearsList = []
    for key, value in totalNumberOfStudentCollabsPerYear.items():
        yearsList.append(int(key))
    
    yearsList.sort()
    missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
    
    for year in missingYears:
        totalNumberOfStudentCollabsPerYear[str(year)] = 0    
        yearsList.append(year)
    
    yearsList.sort()                       
    for i in range(len(yearsList)):
        worksheet.write(0, i, str(yearsList[i]), cell_format)
    
    sortedCiteYearsAndBars = OrderedDict(sorted(totalNumberOfStudentCollabsPerYear.items()))

    for key, value in sortedCiteYearsAndBars.items():
        for j in range(len(yearsList)):
            if(str(key) == str(yearsList[j])):
                worksheet.write(1, j, int(value))
                
    worksheet.autofilter(0, 0, len(data)-1, len(yearsList) -1)
    
    columns = excelColumnsNames(len(yearsList))
    worksheet.ignore_errors({'number_stored_as_text': columns})
    jsonFile.close()

def printExcelSheet10(workbook):
    print("sheet10")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile)
    
    worksheet = workbook.add_worksheet('Author Data')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True) 
    
    worksheet.write('A1', 'AUTHOR', cell_format)
    worksheet.write('B1', 'AFFILIATION', cell_format)
    worksheet.write('C1', 'RESEARCH_AREA', cell_format)
    worksheet.write('D1', 'CITATIONS_COUNT', cell_format)
    worksheet.write('E1', 'CITATIONS_COUNT_5', cell_format)
    worksheet.write('F1', 'H_INDEX', cell_format)
    worksheet.write('G1', 'H_INDEX_5', cell_format)
    worksheet.write('H1', 'I10_INDEX', cell_format)
    worksheet.write('I1', 'I10_INDEX_5', cell_format)
    worksheet.write('J1', 'NUMBER_OF_PUBLICATIONS', cell_format)
    worksheet.write('K1', 'PUBLICATIONS', cell_format)
    worksheet.write('L1', 'TYPE', cell_format)
    worksheet.write('M1', 'CMU_ADVISOR', cell_format)
    worksheet.write('N1', 'PT_ADVISOR', cell_format)
    worksheet.write('O1', 'NUMBER_OF_INTERNATIONAL_PUBLICATIONS', cell_format)
    worksheet.write('P1', 'NUMBER_OF_STUDENT_COLLABORATION_PUBLICATIONS', cell_format)
    worksheet.write('Q1', 'COLLABORATION_STUDENTS', cell_format)
    worksheet.write('R1', 'START_RESEARCH_YEAR', cell_format)
    worksheet.write('S1', 'END_RESEARCH_YEAR', cell_format)
    worksheet.write('T1', 'GRADUATION_YEAR', cell_format)
    worksheet.write('U1', 'STATUS', cell_format)
    worksheet.write('V1', 'GOOGLE_SCHOLAR_LINK', cell_format)
    worksheet.write('W1', 'PICTURE', cell_format)
    
    worksheet.set_column(0, 0, 27)
    worksheet.set_column(1, 1, 25)
    worksheet.set_column(2, 2, 25)
    worksheet.set_column(3, 3, 20)
    worksheet.set_column(4, 4, 22)
    worksheet.set_column(5, 5, 14)
    worksheet.set_column(6, 6, 14)
    worksheet.set_column(7, 7, 14)
    worksheet.set_column(8, 8, 14)
    worksheet.set_column(9, 9, 25)
    worksheet.set_column(10, 10, 12)
    worksheet.set_column(11, 11, 25)
    worksheet.set_column(12, 12, 25)
    worksheet.set_column(13, 13, 25)
    worksheet.set_column(14, 14, 25)
    worksheet.set_column(15, 15, 25)
    worksheet.set_column(16, 16, 10)
    worksheet.set_column(17, 17, 25)
    worksheet.set_column(18, 18, 25)
    worksheet.set_column(19, 19, 25)
    worksheet.set_column(20, 20, 25)
    worksheet.set_column(21, 21, 25)
    worksheet.set_column(22, 22, 25)    
    
    today = datetime.date.today()
    currentYear = today.year
    
    pubCollabDic = {}    
    for i in range(len(data)):
        author = data[i]
        
        previousAdvisorCMU = author['previous_cmu_advisor']
        advisorCMU = author['cmu_advisor']
        previousAdvisorPT = author['previous_pt_advisor']
        advisorPT = author['pt_advisor']
        
        previousCMUAdvisors = previousAdvisorCMU.split('/')
        CMUAdvisors = advisorCMU.split('/')
        previousPTAdvisors = previousAdvisorPT.split('/')
        PTAdvisors = advisorPT.split('/')
            
        authorInternationalCollabPubsCount = 0
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')

            authors = pub['authors'].split(', ')
            pubAuthorsList = [] 
            for k in range(len(authors)):
                authorName = authors[k]
                unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
                
                pubAuthorsList.append(authorName)            
            
            CMUAdvisorsList = []
            PTAdvisorsList = []
            if(str(pubTitle) not in pubCollabDic):
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a)):
                                    CMUAdvisorFlag = 1
                                    CMUAdvisorsList.append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor)):
                            CMUAdvisorFlag = 1
                            CMUAdvisorsList.append(cmuAdvisor)
        
                PTAdvisorFlag = 0
                for ptAdvisor in previousPTAdvisors:
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a)):                                                            
                                    PTAdvisorFlag = 1
                                    PTAdvisorsList.append(ptAdvisor)
                            elif(isin(a, ptAdvisor)):
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                            
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a)):                                                            
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                        elif(isin(a, ptAdvisor)):
                            PTAdvisorFlag = 1
                            PTAdvisorsList.append(ptAdvisor)
                
                pubCollabDic[str(pubTitle)] = {
                            'authors': [author['author']],
                            'cmu_advisor_flags': [CMUAdvisorFlag],
                            'pt_advisor_flags': [PTAdvisorFlag],
                            'cmu_advisors': CMUAdvisorsList,
                            'pt_advisors': PTAdvisorsList
                        }  
                                                  
                if(CMUAdvisorFlag == 1 and PTAdvisorFlag == 1):
                    pubCollabDic[str(pubTitle)]['colab'] = "Yes"        
                else:
                    pubCollabDic[str(pubTitle)]['colab'] = "No"    
            else:
                pubCollabDic[str(pubTitle)]['authors'].append(author['author'])
                                    
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                    CMUAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                            CMUAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
        
                PTAdvisorFlag = 0 
                for ptAdvisor in previousPTAdvisors: 
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                    PTAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                            elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)                
                
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                        elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                            PTAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
        
                pubCollabDic[str(pubTitle)]['cmu_advisor_flags'].append(CMUAdvisorFlag)
                pubCollabDic[str(pubTitle)]['pt_advisor_flags'].append(PTAdvisorFlag)
        
                if(pubCollabDic[str(pubTitle)]['colab'] != "Yes"):
                    if(1 in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                        pubCollabDic[str(pubTitle)]['colab'] = "Yes"              
                    else:
                        pubCollabDic[str(pubTitle)]['colab'] = "No"   
    
    for i in range(len(data)):
        author = data[i]
        
        authorName = author['author']
        unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
        worksheet.write(i+1, 0, str(authorName))
        
        authorAffiliation = author['affiliation']
        unicodedata.normalize('NFKD', authorAffiliation).encode('ascii', 'ignore')        
        worksheet.write(i+1, 1, str(authorAffiliation))
        
        authorResearchArea = author['research_area']
        areasString = ""
        for area in authorResearchArea:
            unicodedata.normalize('NFKD', area).encode('ascii', 'ignore')
            areasString += str(area)
                    
        worksheet.write(i+1, 2, str(areasString))
        
        publicationsCitationsCount = 0
        publicationsCitationsCount5 = 0
        citationsOverYears = []
        citationsOver5Years = []
        publicationsTitles = ""
        nPublications = 0
        authorInternationalCollabPubsCount = 0
        authorStudentCollabPubsCount = 0
        collabStudents = ""
        studentColabList = []
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')
            
            nPublications += 1
            
            if(j != len(author['publications']) - 1):
                publicationsTitles += str(pubTitle) + ';'
            else:
                publicationsTitles += str(pubTitle)
            
            if(len(pub['years']) == len(pub['bars']) and len(pub['years']) != 0):
                for k in range(len(pub['years'])):
                    if(int(pub['years'][k]) >= int(author['start_research_year']) and int(pub['years'][k]) >= int(pub['pub_year'])):
                        publicationsCitationsCount += int(pub['bars'][k])
                        citationsOverYears.append(int(pub['bars'][k]))
                    
                        if(int(pub['years'][k]) >= currentYear - 5):
                            publicationsCitationsCount5 += int(pub['bars'][k])
                            citationsOver5Years.append(int(pub['bars'][k]))
            
            for key, value in pubCollabDic.items():
                if(str(pubTitle) == key):
                    if(value['colab'] == "Yes"):
                        authorInternationalCollabPubsCount += 1
                                                  
                    if(len(value['authors']) > 1):
                        collabStudentsList = []
                        for l in range(len(value['authors'])):
                            studentName = value['authors'][l]
                            unicodedata.normalize('NFKD', studentName).encode('ascii', 'ignore')
                            if(str(studentName) != str(authorName)):
                                if(str(studentName) not in studentColabList):
                                    collabStudentsList.append(str(studentName))
                                    studentColabList.append(str(studentName)) 
                        for l in range(len(collabStudentsList)):
                            if(l != len(collabStudentsList) - 1):
                                collabStudents += str(studentName) + ";"
                            else:
                                collabStudents += str(studentName)
                                  
                        authorStudentCollabPubsCount += 1
        
        citationsOverYears.sort(reverse = True)
        citationsOver5Years.sort(reverse = True)        
        
        worksheet.write(i+1, 9, nPublications)
        worksheet.write(i+1, 10, str(publicationsTitles))  
        
        h_index = hIndex(citationsOverYears, len(citationsOverYears))
        h_index5 = hIndex(citationsOver5Years, len(citationsOver5Years))
        i10_index = i10Index(citationsOverYears, len(citationsOverYears))
        i10_index5 = i10Index(citationsOver5Years, len(citationsOver5Years))
        
        worksheet.write(i+1, 3, publicationsCitationsCount)
        worksheet.write(i+1, 4, publicationsCitationsCount5)
        worksheet.write(i+1, 5, h_index)
        worksheet.write(i+1, 6, h_index5)
        worksheet.write(i+1, 7, i10_index)
        worksheet.write(i+1, 8, i10_index5)
        
        authorType = author['type']
        unicodedata.normalize('NFKD', authorType).encode('ascii', 'ignore')  
        worksheet.write(i+1, 11, str(authorType))
        
        authorCMUAdvisor = author['cmu_advisor']
        unicodedata.normalize('NFKD', authorCMUAdvisor).encode('ascii', 'ignore')        
        worksheet.write(i+1, 12, str(authorCMUAdvisor))
        
        authorPTAdvisor = author['pt_advisor']
        unicodedata.normalize('NFKD', authorPTAdvisor).encode('ascii', 'ignore')         
        worksheet.write(i+1, 13, str(authorPTAdvisor))
        
        worksheet.write(i+1, 14, authorInternationalCollabPubsCount)
        worksheet.write(i+1, 15, authorStudentCollabPubsCount)
        
        worksheet.write(i+1, 16, collabStudents)
            
        worksheet.write(i+1, 17, int(author['start_research_year']))
        worksheet.write(i+1, 18, int(author['end_research_year']))
        
        if(author['graduation_year'] != 'ongoing'):
            worksheet.write(i+1, 19, int(author['graduation_year']))
        else:
            worksheet.write(i+1, 19, str(author['graduation_year']))
        
        authorStatus = author['status']
        unicodedata.normalize('NFKD', authorStatus).encode('ascii', 'ignore') 
        worksheet.write(i+1, 20, str(authorStatus))
        
        authorScholarLink = author['google_scholar_link']
        unicodedata.normalize('NFKD', authorScholarLink).encode('ascii', 'ignore')        
        worksheet.write(i+1, 21, str(authorScholarLink))
        
        authorScholarPicture = author['picture']
        unicodedata.normalize('NFKD', authorScholarPicture).encode('ascii', 'ignore')        
        worksheet.write(i+1, 22, str(authorScholarPicture))       
    
    worksheet.freeze_panes(1, 1)
    worksheet.autofilter(0, 0, len(data)-1, 22)    
    jsonFile.close()

def printExcelSheet11(workbook):
    print("sheet11")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Author Citations Per Year')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    today = datetime.date.today()
    currentYear = today.year    
    
    worksheet.write('A1', 'AUTHOR', cell_format)
    worksheet.set_column(0, 0, 27)
    
    citeYears = []
    citeYearsAndBars = []
    authorYear = 0
    for i in range(len(data)):
        author = data[i]
        
        authorName = author['author']
        unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
        worksheet.write(i+1, 0, str(authorName))        
        
        authorYear = int(author['start_research_year'])
        
        yearsDict = {}    
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            if(len(pub['years']) == len(pub['bars']) and len(pub['years']) != 0):
                for k in range(len(pub['years'])):
                    if(int(pub['years'][k]) >= int(author['start_research_year']) and int(pub['years'][k]) >= int(pub['pub_year'])):
                        if(str(pub['years'][k]) not in yearsDict):
                            yearsDict[str(pub['years'][k])] = 0
                        
                        yearsDict[str(pub['years'][k])] += int(pub['bars'][k])
                        
                        if(int(pub['years'][k]) not in citeYears):
                            citeYears.append(int(pub['years'][k]))
        
        citeYearsAndBars.append(yearsDict)
     
    citeYears.sort()  
    if(authorYear not in citeYears):
        citeYears.append(authorYear)
           
    if(int(currentYear) not in citeYears):
        citeYears.append(int(currentYear))

    citeYears.sort()
    missingYears = find_missing_years(citeYears, citeYears[0], citeYears[len(citeYears)-1])
    
    for year in missingYears:
        citeYears.append(year)
    
    citeYears.sort()    
    for i in range(len(citeYears)):
        worksheet.write(0, i+1, str(citeYears[i]), cell_format)

    for i in range(len(data)):
        author = data[i]
        if(len(citeYearsAndBars[i]) != 0):
            sortedCiteYearsAndBars = OrderedDict(sorted(citeYearsAndBars[i].items()))
            for j in range(len(citeYears)):
                if(int(citeYears[j]) >= int(int(author['start_research_year']))):
                    if(str(citeYears[j]) not in sortedCiteYearsAndBars):
                        citeYearsAndBars[i][str(citeYears[j])] = 0
        else:
            for j in range(len(citeYears)):
                if(int(citeYears[j]) >= int(int(author['start_research_year']))):
                    citeYearsAndBars[i][str(citeYears[j])] = 0

    for i in range(len(data)):
        for key, value in citeYearsAndBars[i].items():
            for j in range(len(citeYears)):
                if(str(key) == str(citeYears[j])):
                    worksheet.write(i+1, j+1, int(value))
    
    worksheet.freeze_panes(1, 1)    
    worksheet.autofilter(0, 0, len(data)-1, len(citeYears))
    
    columns = excelColumnsNames(len(citeYears))
    worksheet.ignore_errors({'number_stored_as_text': columns})
    
    jsonFile.close()        

def printExcelSheet12(workbook):
    print("sheet12")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Author Publications Per Year')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    today = datetime.date.today()
    currentYear = today.year    
    
    worksheet.write('A1', 'AUTHOR', cell_format)
    worksheet.set_column(0, 0, 27)
    
    citeYears = []
    citeYearsAndBars = []
    authorYear = 0
    for i in range(len(data)):
        author = data[i]
        
        authorName = author['author']
        unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
        worksheet.write(i+1, 0, str(authorName))        
        
        authorYear = int(author['start_research_year'])
        
        totalNumberOfPubsPerYear = {}    
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            if(str(pub['pub_year']) not in totalNumberOfPubsPerYear):
                totalNumberOfPubsPerYear[str(pub['pub_year'])] = 0
            
            totalNumberOfPubsPerYear[str(pub['pub_year'])] += 1
            
            if(int(pub['pub_year']) not in citeYears):
                citeYears.append(int(pub['pub_year']))
            
        citeYearsAndBars.append(totalNumberOfPubsPerYear)
     
    citeYears.sort()  
    if(authorYear not in citeYears):
        citeYears.append(authorYear)
           
    if(int(currentYear) not in citeYears):
        citeYears.append(int(currentYear))

    citeYears.sort()
    missingYears = find_missing_years(citeYears, citeYears[0], citeYears[len(citeYears)-1])
    
    for year in missingYears:
        citeYears.append(year)
    
    citeYears.sort()    
    
    for i in range(len(citeYears)):
        worksheet.write(0, i+1, str(citeYears[i]), cell_format)

    for i in range(len(data)):
        author = data[i]
        if(len(citeYearsAndBars[i]) != 0):
            sortedCiteYearsAndBars = OrderedDict(sorted(citeYearsAndBars[i].items()))
            for j in range(len(citeYears)):
                if(int(citeYears[j]) >= int(int(author['start_research_year']))):
                    if(str(citeYears[j]) not in sortedCiteYearsAndBars):
                        citeYearsAndBars[i][str(citeYears[j])] = 0
        else:
            for j in range(len(citeYears)):
                if(int(citeYears[j]) >= int(int(author['start_research_year']))):
                    citeYearsAndBars[i][str(citeYears[j])] = 0

    for i in range(len(data)):
        for key, value in citeYearsAndBars[i].items():
            for j in range(len(citeYears)):
                if(str(key) == str(citeYears[j])):
                    worksheet.write(i+1, j+1, int(value))
    
    worksheet.freeze_panes(1, 1)
    worksheet.autofilter(0, 0, len(data)-1, len(citeYears))
    
    columns = excelColumnsNames(len(citeYears))
    worksheet.ignore_errors({'number_stored_as_text': columns})
    
    jsonFile.close()        

def printExcelSheet13(workbook):
    print("sheet13")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Author Publications Type')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    worksheet.write('A1', 'AUTHOR', cell_format)
    worksheet.set_column(0, 0, 27)
    
    pubTypes = []
    pubTypeList = []
    authorYear = 0
    for i in range(len(data)):
        author = data[i]
        
        authorName = author['author']
        unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
        worksheet.write(i+1, 0, str(authorName))        
        
        authorYear = int(author['start_research_year'])
        
        publicationTypes = {}    
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            if(str(pub['pub_type']) not in publicationTypes):
                publicationTypes[str(pub['pub_type'])] = 0
                    
            publicationTypes[str(pub['pub_type'])] += 1
            
            if(str(pub['pub_type']) not in pubTypeList):
                pubTypeList.append(str(pub['pub_type']))            
        
        pubTypes.append(publicationTypes)
     
    pubTypeList.sort()  
    
    for i in range(len(pubTypeList)):
        worksheet.write(0, i+1, pubTypeList[i], cell_format)

    for i in range(len(data)):
        for key, value in pubTypes[i].items():
            for j in range(len(pubTypeList)):
                if(str(key) == str(pubTypeList[j])):
                    worksheet.write(i+1, j+1, int(value))
    
    worksheet.freeze_panes(1, 1)
    worksheet.autofilter(0, 0, len(data)-1, len(pubTypeList))
    
    columns = excelColumnsNames(len(pubTypeList))
    jsonFile.close()

def printExcelSheet14(workbook):
    print("sheet14")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Author Publication Area')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    worksheet.write('A1', 'AUTHOR', cell_format)
    worksheet.set_column(0, 0, 27)
    
    pubAreas = []
    pubAreaList = []
    authorYear = 0
    for i in range(len(data)):
        author = data[i]
        
        authorName = author['author']
        unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
        worksheet.write(i+1, 0, str(authorName))        
        
        authorYear = int(author['start_research_year'])
        
        publicationTypes = {}    
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            if(str(pub['research_area']) not in publicationTypes):
                publicationTypes[str(pub['research_area'])] = 0
            
            publicationTypes[str(pub['research_area'])] += 1 
            
            if(str(pub['research_area']) not in pubAreaList):
                pubAreaList.append(str(pub['research_area']))
                    
        pubAreas.append(publicationTypes)
     
    pubAreaList.sort()  
    
    for i in range(len(pubAreaList)):
        worksheet.write(0, i+1, pubAreaList[i], cell_format)

    for i in range(len(data)):
        for key, value in pubAreas[i].items():
            for j in range(len(pubAreaList)):
                if(str(key) == str(pubAreaList[j])):
                    worksheet.write(i+1, j+1, int(value))
    
    worksheet.freeze_panes(1, 1)
    worksheet.autofilter(0, 0, len(data)-1, len(pubAreaList))
    
    columns = excelColumnsNames(len(pubAreaList))
    jsonFile.close()

def printExcelSheet15(workbook):
    print("sheet15")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Author Collab Per Year')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    today = datetime.date.today()
    currentYear = today.year    
    
    worksheet.write('A1', 'AUTHOR', cell_format)
    worksheet.set_column(0, 0, 27)
    
    citeYears = []
    citeYearsAndBars = []
    authorYear = 0
    pubCollabDic = {}
    for i in range(len(data)):
        author = data[i]
        
        authorName = author['author']
        unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
        worksheet.write(i+1, 0, str(authorName))        
        
        authorYear = int(author['start_research_year'])
        
        previousAdvisorCMU = author['previous_cmu_advisor']
        advisorCMU = author['cmu_advisor']
        previousAdvisorPT = author['previous_pt_advisor']
        advisorPT = author['pt_advisor']
        
        previousCMUAdvisors = previousAdvisorCMU.split('/')
        CMUAdvisors = advisorCMU.split('/')
        previousPTAdvisors = previousAdvisorPT.split('/')
        PTAdvisors = advisorPT.split('/')        
        
        totalNumberOfCollabsPerYear = {}    
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            pubTitle = pub['title']
            
            authors = pub['authors'].split(', ')
            pubAuthorsList = [] 
            
            for k in range(len(authors)):
                authorName = authors[k]
                unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
                
                pubAuthorsList.append(authorName)            
            
            CMUAdvisorsList = []
            PTAdvisorsList = []
            
            CMUAdvisorFlag = 0
            for cmuAdvisor in previousCMUAdvisors:
                if(cmuAdvisor != ""):
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor)):
                            CMUAdvisorFlag = 1
                            CMUAdvisorsList.append(cmuAdvisor)                
            
            for cmuAdvisor in CMUAdvisors:                                        
                for a in pubAuthorsList:
                    if(len(cmuAdvisor) <= len(a)):
                        if(isin(cmuAdvisor, a)):
                            CMUAdvisorFlag = 1
                            CMUAdvisorsList.append(cmuAdvisor)
                    elif(isin(a, cmuAdvisor)):
                        CMUAdvisorFlag = 1
                        CMUAdvisorsList.append(cmuAdvisor)
    
            PTAdvisorFlag = 0
            for ptAdvisor in previousPTAdvisors:
                if(ptAdvisor != ""):
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a)):                                                            
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                        elif(isin(a, ptAdvisor)):
                            PTAdvisorFlag = 1
                            PTAdvisorsList.append(ptAdvisor)
                        
            for ptAdvisor in PTAdvisors:                                                
                for a in pubAuthorsList:                                                    
                    if(len(ptAdvisor) <= len(a)):
                        if(isin(ptAdvisor, a)):                                                            
                            PTAdvisorFlag = 1
                            PTAdvisorsList.append(ptAdvisor)
                    elif(isin(a, ptAdvisor)):
                        PTAdvisorFlag = 1
                        PTAdvisorsList.append(ptAdvisor)
            
            pubCollabDic[str(pubTitle)] = {
                        'authors': [author['author']],
                        'cmu_advisor_flags': [CMUAdvisorFlag],
                        'pt_advisor_flags': [PTAdvisorFlag],
                        'cmu_advisors': CMUAdvisorsList,
                        'pt_advisors': PTAdvisorsList
                    }  
    
            if(CMUAdvisorFlag == 1 and PTAdvisorFlag == 0):
                pubCollabDic[str(pubTitle)]['colab'] = "Just CMU Advisor"
            elif(CMUAdvisorFlag == 0 and PTAdvisorFlag == 1):
                pubCollabDic[str(pubTitle)]['colab'] = "Just PT Advisor"                                          
            elif(CMUAdvisorFlag == 1 and PTAdvisorFlag == 1):
                pubCollabDic[str(pubTitle)]['colab'] = "Yes"
                
                if(str(pub['pub_year']) not in totalNumberOfCollabsPerYear):
                    totalNumberOfCollabsPerYear[str(pub['pub_year'])] = 0
                
                if(int(pub['pub_year']) not in citeYears):
                    citeYears.append(int(pub['pub_year']))                
                
                totalNumberOfCollabsPerYear[str(pub['pub_year'])] += 1                    
            else:
                pubCollabDic[str(pubTitle)]['colab'] = "No"    
        else:
            CMUAdvisorFlag = 0
            for cmuAdvisor in previousCMUAdvisors:
                if(cmuAdvisor != ""):
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                            CMUAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)                
            
            for cmuAdvisor in CMUAdvisors:                                        
                for a in pubAuthorsList:
                    if(len(cmuAdvisor) <= len(a)):
                        if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                            CMUAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                    elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                        CMUAdvisorFlag = 1
                        pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
    
            PTAdvisorFlag = 0 
            for ptAdvisor in previousPTAdvisors: 
                if(ptAdvisor != ""):
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                        elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                            PTAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)                
            
            for ptAdvisor in PTAdvisors:                                                
                for a in pubAuthorsList:                                                    
                    if(len(ptAdvisor) <= len(a)):
                        if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                            PTAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                    elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                        PTAdvisorFlag = 1
                        pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
    
            pubCollabDic[str(pubTitle)]['cmu_advisor_flags'].append(CMUAdvisorFlag)
            pubCollabDic[str(pubTitle)]['pt_advisor_flags'].append(PTAdvisorFlag)
    
            if(pubCollabDic[str(pubTitle)]['colab'] != "Yes"):
                if(1 in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                    pubCollabDic[str(pubTitle)]['colab'] = "Yes"
                    if(str(pub['pub_year']) not in totalNumberOfCollabsPerYear):
                        totalNumberOfCollabsPerYear[str(pub['pub_year'])] = 0
                    
                    if(int(pub['pub_year']) not in citeYears):
                        citeYears.append(int(pub['pub_year']))
                    
                    totalNumberOfCollabsPerYear[str(pub['pub_year'])] += 1            
        
        citeYearsAndBars.append(totalNumberOfCollabsPerYear)
     
    citeYears.sort()  
    
    if(authorYear not in citeYears):
        citeYears.append(authorYear)
           
    if(int(currentYear) not in citeYears):
        citeYears.append(int(currentYear))

    citeYears.sort()
    missingYears = find_missing_years(citeYears, citeYears[0], citeYears[len(citeYears)-1])
    
    for year in missingYears:
        citeYears.append(year)
    
    citeYears.sort()    
    
    for i in range(len(citeYears)):
        worksheet.write(0, i+1, str(citeYears[i]), cell_format)

    for i in range(len(data)):
        author = data[i]
        if(len(citeYearsAndBars[i]) != 0):
            sortedCiteYearsAndBars = OrderedDict(sorted(citeYearsAndBars[i].items()))
            for j in range(len(citeYears)):
                if(int(citeYears[j]) >= int(int(author['start_research_year']))):
                    if(str(citeYears[j]) not in sortedCiteYearsAndBars):
                        citeYearsAndBars[i][str(citeYears[j])] = 0
        else:
            for j in range(len(citeYears)):
                if(int(citeYears[j]) >= int(int(author['start_research_year']))):
                    citeYearsAndBars[i][str(citeYears[j])] = 0

    for i in range(len(data)):
        for key, value in citeYearsAndBars[i].items():
            for j in range(len(citeYears)):
                if(str(key) == str(citeYears[j])):
                    worksheet.write(i+1, j+1, int(value))
    
    worksheet.freeze_panes(1, 1)
    worksheet.autofilter(0, 0, len(data)-1, len(citeYears))
    
    columns = excelColumnsNames(len(citeYears))
    worksheet.ignore_errors({'number_stored_as_text': columns})
    
    jsonFile.close()

def printExcelSheet16(workbook):
    print("sheet16")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile) 
    
    worksheet = workbook.add_worksheet('Author Student Collab Per Year')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    today = datetime.date.today()
    currentYear = today.year    
    
    worksheet.write('A1', 'AUTHOR', cell_format)
    worksheet.set_column(0, 0, 27)
    
    citeYears = []
    citeYearsAndBars = []
    authorYear = 0
    pubCollabDic = {}
    for i in range(len(data)):
        author = data[i]
        
        authorName = author['author']
        unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
        worksheet.write(i+1, 0, str(authorName))        
        
        authorYear = int(author['start_research_year'])
        
        totalNumberOfStudentCollabsPerYear = {}
        pubTitleList = []
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')            
            if(str(pubTitle) not in pubTitleList):
                pubTitleList.append(str(pubTitle))
                
                if(int(pub['pub_year']) not in citeYears):
                    citeYears.append(int(pub['pub_year']))
                
                pubCollabDic[str(pubTitle)] = {
                            'authors': [author['author']],
                        }                 
            else:
                pubCollabDic[str(pubTitle)]['authors'].append(author['author'])
                
                if(len(pubCollabDic[str(pubTitle)]['authors']) == 2):
                    studentCollabPubsCount += 1
                    
                    if(str(pub['pub_year']) not in totalNumberOfStudentCollabsPerYear):
                        totalNumberOfStudentCollabsPerYear[str(pub['pub_year'])] = 0                
                    
                    totalNumberOfStudentCollabsPerYear[str(pub['pub_year'])] += 1 
        
        citeYearsAndBars.append(totalNumberOfStudentCollabsPerYear)
     
    citeYears.sort()  
    
    if(authorYear not in citeYears):
        citeYears.append(authorYear)
           
    if(int(currentYear) not in citeYears):
        citeYears.append(int(currentYear))

    citeYears.sort()
    missingYears = find_missing_years(citeYears, citeYears[0], citeYears[len(citeYears)-1])
    
    for year in missingYears:
        citeYears.append(year)
    
    citeYears.sort()    
    
    for i in range(len(citeYears)):
        worksheet.write(0, i+1, str(citeYears[i]), cell_format)

    for i in range(len(data)):
        author = data[i]
        if(len(citeYearsAndBars[i]) != 0):
            sortedCiteYearsAndBars = OrderedDict(sorted(citeYearsAndBars[i].items()))
            for j in range(len(citeYears)):
                if(int(citeYears[j]) >= int(int(author['start_research_year']))):
                    if(str(citeYears[j]) not in sortedCiteYearsAndBars):
                        citeYearsAndBars[i][str(citeYears[j])] = 0
        else:
            for j in range(len(citeYears)):
                if(int(citeYears[j]) >= int(int(author['start_research_year']))):
                    citeYearsAndBars[i][str(citeYears[j])] = 0

    for i in range(len(data)):
        for key, value in citeYearsAndBars[i].items():
            for j in range(len(citeYears)):
                if(str(key) == str(citeYears[j])):
                    worksheet.write(i+1, j+1, int(value))
    
    worksheet.freeze_panes(1, 1)
    worksheet.autofilter(0, 0, len(data)-1, len(citeYears))
    
    columns = excelColumnsNames(len(citeYears))
    worksheet.ignore_errors({'number_stored_as_text': columns})
    
    jsonFile.close()

def printExcelSheet17(workbook):
    print("sheet17")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile)

    worksheet = workbook.add_worksheet('Pub Data')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    worksheet.write('A1', 'TITLE', cell_format)
    worksheet.write('B1', 'YEAR', cell_format)
    worksheet.write('C1', 'AUTHOR', cell_format)
    worksheet.write('D1', 'AUTHORS', cell_format)
    worksheet.write('E1', 'CITATIONS_COUNT', cell_format)
    worksheet.write('F1', 'PUBLICATION_TYPE', cell_format)
    worksheet.write('G1', 'PUBLICATION_RESEARCH_AREA', cell_format)
    worksheet.write('H1', 'PUBLICATION_LINK', cell_format)
    worksheet.write('I1', 'PUBLICATION_DOI', cell_format)
    worksheet.write('J1', 'INTER_COLAB', cell_format)
    worksheet.write('K1', 'CMU_ADVISOR', cell_format)
    worksheet.write('L1', 'PT_ADVISOR', cell_format)
    worksheet.write('M1', 'STUDENTS_COLAB', cell_format)
    worksheet.write('N1', 'NUMBER_OF_COLLAB_STUDENTS', cell_format)
    worksheet.write('O1', 'PUBLICATION_SCHOLAR_LINK', cell_format)
    
    worksheet.set_column(0, 0, 56)
    worksheet.set_column(1, 1, 20)
    worksheet.set_column(2, 2, 25)
    worksheet.set_column(3, 3, 20)
    worksheet.set_column(4, 4, 20)
    worksheet.set_column(5, 5, 20)
    worksheet.set_column(6, 6, 20)
    worksheet.set_column(7, 7, 20)
    worksheet.set_column(8, 8, 25)
    worksheet.set_column(9, 9, 25)
    worksheet.set_column(10, 10, 20)
    worksheet.set_column(11, 11, 25)
    worksheet.set_column(11, 11, 25)
    worksheet.set_column(12, 12, 25)
    worksheet.set_column(13, 13, 25)
    worksheet.set_column(14, 14, 25)
    
    pubCollabDic = {}
    for i in range(len(data)):
        author = data[i]
        
        previousAdvisorCMU = author['previous_cmu_advisor']
        advisorCMU = author['cmu_advisor']
        previousAdvisorPT = author['previous_pt_advisor']
        advisorPT = author['pt_advisor']
        
        previousCMUAdvisors = previousAdvisorCMU.split('/')
        CMUAdvisors = advisorCMU.split('/')
        previousPTAdvisors = previousAdvisorPT.split('/')
        PTAdvisors = advisorPT.split('/')
        
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')

            authors = pub['authors'].split(', ')
            pubAuthorsList = [] 
            for k in range(len(authors)):
                authorName = authors[k]
                unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
                
                pubAuthorsList.append(authorName)            
            
            CMUAdvisorsList = []
            PTAdvisorsList = []
            if(str(pubTitle) not in pubCollabDic):           
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a)):
                                    CMUAdvisorFlag = 1
                                    CMUAdvisorsList.append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor)):
                            CMUAdvisorFlag = 1
                            CMUAdvisorsList.append(cmuAdvisor)
        
                PTAdvisorFlag = 0
                for ptAdvisor in previousPTAdvisors:
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a)):                                                            
                                    PTAdvisorFlag = 1
                                    PTAdvisorsList.append(ptAdvisor)
                            elif(isin(a, ptAdvisor)):
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                            
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a)):                                                            
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                        elif(isin(a, ptAdvisor)):
                            PTAdvisorFlag = 1
                            PTAdvisorsList.append(ptAdvisor)
                
                pubCollabDic[str(pubTitle)] = {
                            'authors': [author['author']],
                            'cmu_advisor_flags': [CMUAdvisorFlag],
                            'pt_advisor_flags': [PTAdvisorFlag],
                            'cmu_advisors': CMUAdvisorsList,
                            'pt_advisors': PTAdvisorsList
                        }  
        
                if(CMUAdvisorFlag == 1 and PTAdvisorFlag == 0):
                    pubCollabDic[str(pubTitle)]['colab'] = "Just CMU Advisor"
                elif(CMUAdvisorFlag == 0 and PTAdvisorFlag == 1):
                    pubCollabDic[str(pubTitle)]['colab'] = "Just PT Advisor"                                          
                elif(CMUAdvisorFlag == 1 and PTAdvisorFlag == 1):
                    pubCollabDic[str(pubTitle)]['colab'] = "Yes"                   
                else:
                    pubCollabDic[str(pubTitle)]['colab'] = "No"    
            else:
                pubCollabDic[str(pubTitle)]['authors'].append(author['author'])
                
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                    CMUAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                            CMUAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
        
                PTAdvisorFlag = 0 
                for ptAdvisor in previousPTAdvisors: 
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                    PTAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                            elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)                
                
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                        elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                            PTAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
        
                pubCollabDic[str(pubTitle)]['cmu_advisor_flags'].append(CMUAdvisorFlag)
                pubCollabDic[str(pubTitle)]['pt_advisor_flags'].append(PTAdvisorFlag)
        
                if(pubCollabDic[str(pubTitle)]['colab'] != "Yes"):
                    if(1 in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 not in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                        pubCollabDic[str(pubTitle)]['colab'] = "Just CMU Advisor"
                    elif(1 not in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                        pubCollabDic[str(pubTitle)]['colab'] = "Just PT Advisor"
                    elif(1 in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                        pubCollabDic[str(pubTitle)]['colab'] = "Yes"                      
                    else:
                        pubCollabDic[str(pubTitle)]['colab'] = "No"    
    
    pubIndex = 0
    pubList = []
    for i in range(len(data)):
        author = data[i]       
        for j in range(len(author['publications'])):
            pub = author['publications'][j]

            publicationTitle = pub['title']
            unicodedata.normalize('NFKD', publicationTitle).encode('ascii', 'ignore')
            
            authors = pub['authors'].split(', ')
            pubAuthorsList = [] 
            for k in range(len(authors)):
                authorName = authors[k]
                unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
                
                pubAuthorsList.append(authorName)            
            
            CMUAdvisorsList = []
            PTAdvisorsList = []            
            if(str(publicationTitle) not in pubList):
                pubList.append(str(publicationTitle))
                worksheet.write(pubIndex + 1, 0, str(publicationTitle))            
                
                publicationYear = pub['pub_year']
                worksheet.write(pubIndex + 1, 1, int(publicationYear))            
                
                publicationType = pub['pub_type']
                worksheet.write(pubIndex + 1, 5, publicationType)
                
                publicationArea = pub['research_area']    
                worksheet.write(pubIndex + 1, 6, publicationArea)                
                        
                authors = pub['authors'].split(', ')
                pubAuthors = ""
                pubAuthorsList = [] 
                for k in range(len(authors)):
                    authorName = authors[k]
                    unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
                    
                    pubAuthorsList.append(authorName)
                                        
                    if(k != len(authors) - 1):
                        pubAuthors += authorName + ";"
                    else:
                        pubAuthors += authorName
        
                worksheet.write(pubIndex + 1, 3, pubAuthors)            
                
                for key, value in pubCollabDic.items():
                    if(str(publicationTitle) == key):
                        worksheet.write(pubIndex + 1, 9, value['colab'])
                        
                        if(value['colab'] == "Yes"):
                            pubCMUAdvisors = ''
                            for l in range(len(value['cmu_advisors'])):
                                if(l != len(value['cmu_advisors']) - 1):
                                    pubCMUAdvisors += value['cmu_advisors'][l] + ";"
                                else:
                                    pubCMUAdvisors += value['cmu_advisors'][l]
                            
                            pubPTAdvisors = ''
                            for l in range(len(value['pt_advisors'])):
                                if(l != len(value['pt_advisors']) - 1):
                                    pubPTAdvisors += value['pt_advisors'][l] + ";"
                                else:
                                    pubPTAdvisors += value['pt_advisors'][l]
                                    
                            worksheet.write(pubIndex + 1, 10, pubCMUAdvisors)
                            worksheet.write(pubIndex + 1, 11, pubPTAdvisors)
                            
                        elif(value['colab'] == "Just CMU Advisor"):
                            pubCMUAdvisors = ''
                            for l in range(len(value['cmu_advisors'])):
                                if(l != len(value['cmu_advisors']) - 1):
                                    pubCMUAdvisors += value['cmu_advisors'][l] + ";"
                                else:
                                    pubCMUAdvisors += value['cmu_advisors'][l]                                
                            
                            worksheet.write(pubIndex + 1, 10, pubCMUAdvisors)
                        
                        elif(value['colab']== "Just PT Advisor"):
                            pubPTAdvisors = ''
                            for l in range(len(value['pt_advisors'])):
                                if(l != len(value['pt_advisors']) - 1):
                                    pubPTAdvisors += value['pt_advisors'][l] + ";"
                                else:
                                    pubPTAdvisors += value['pt_advisors'][l]                                
                            
                            worksheet.write(pubIndex + 1, 11, pubPTAdvisors)
                                                        
                        if(len(value['authors']) >= 1):
                            collabStudents = ''
                            for l in range(len(value['authors'])):
                                if(l != len(value['authors']) - 1):
                                    collabStudents += value['authors'][l] + ";"
                                else:
                                    collabStudents += value['authors'][l]
                            
                            worksheet.write(pubIndex + 1, 2, collabStudents)
                            worksheet.write(pubIndex + 1, 12, "Yes")
                        else:
                            worksheet.write(pubIndex + 1, 2, value['authors'])
                            worksheet.write(pubIndex + 1, 12, "No")
                        
                        worksheet.write(pubIndex + 1, 13, len(value['authors']))
                          
                publicationCitationsCount = 0
                if(len(pub['years']) == len(pub['bars']) and len(pub['years']) != 0):
                    for k in range(len(pub['years'])):
                        if(int(pub['years'][k]) >= int(publicationYear)):
                            publicationCitationsCount += int(pub['bars'][k])
                
                worksheet.write(pubIndex + 1, 4, int(publicationCitationsCount))
                 
                publicationLink = pub['pub_link']
                worksheet.write(pubIndex + 1, 7, publicationLink)
                
                publicationDOI = pub['pub_DOI']
                worksheet.write(pubIndex + 1, 8, publicationDOI)
                
                worksheet.write(pubIndex + 1, 14, pub['pub_scholar_link'])
                
                pubIndex += 1            
    
    worksheet.freeze_panes(1, 1)   
    worksheet.autofilter(0, 0, len(data)-1, 14)
    jsonFile.close()

def printExcelSheet18(workbook):
    print("sheet18")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile)

    worksheet = workbook.add_worksheet('Pub Citations Per Year')
    
    cell_format = workbook.add_format()
    cell_format.set_bold(True)    
    
    today = datetime.date.today()
    currentYear = today.year    
    
    worksheet.write('A1', 'TITLE', cell_format)
    
    worksheet.set_column(0, 0, 120)
    pubIndex = 0
    yearsList = []
    pubList = []
    pubYear = 0
    for i in range(len(data)):
        author = data[i]      
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            publicationTitle = pub['title']
            unicodedata.normalize('NFKD', publicationTitle).encode('ascii', 'ignore')
            pubYear = int(pub['pub_year'])
            if(str(publicationTitle) not in pubList):
                pubList.append(str(publicationTitle))            
                worksheet.write(pubIndex + 1, 0, str(publicationTitle))
                
                if(len(pub['years']) == len(pub['bars']) and len(pub['years']) != 0):
                    for k in range(len(pub['years'])):
                        if(int(pub['years'][k]) >= int(pub['pub_year'])):
                            if(int(pub['years'][k]) not in yearsList):
                                yearsList.append(int(pub['years'][k]))
                
                pubIndex += 1
    
    if(pubYear not in yearsList):
        yearsList.append(pubYear)
    
    if(int(currentYear) not in yearsList):
        yearsList.append(int(currentYear))
    
    yearsList.sort()
    missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
    
    for year in missingYears:
        yearsList.append(year)
    
    yearsList.sort()    
   
    for i in range(len(yearsList)):
        worksheet.write(0, i+1, str(yearsList[i]), cell_format)
    
    pubIndex = 0
    pubList = []
    for i in range(len(data)):
        author = data[i]      
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            publicationTitle = pub['title']
            unicodedata.normalize('NFKD', publicationTitle).encode('ascii', 'ignore')
            if(str(publicationTitle) not in pubList):
                pubList.append(str(publicationTitle))             
                publicationYear = pub['pub_year']
                if(len(pub['years']) == len(pub['bars']) and len(pub['years']) != 0):
                    for k in range(len(yearsList)):
                        if(int(yearsList[k]) >= int(publicationYear) and str(yearsList[k]) not in pub['years']):
                            worksheet.write(pubIndex + 1, k+1, 0)
                        for l in range(len(pub['years'])):
                            if(int(yearsList[k]) == int(pub['years'][l]) and int(pub['years'][l]) >= int(publicationYear)):
                                worksheet.write(pubIndex + 1, k+1, int(pub['bars'][l]))
    
                elif(len(pub['years']) == 0):
                    for k in range(len(yearsList)):
                        if(int(yearsList[k]) >= int(publicationYear)):
                            worksheet.write(pubIndex + 1, k+1, 0)
                pubIndex += 1
       
    worksheet.freeze_panes(1, 1)         
    worksheet.autofilter(0, 0, pubIndex, len(yearsList))
    
    columns = excelColumnsNames(len(yearsList))
    worksheet.ignore_errors({'number_stored_as_text': columns})    
    jsonFile.close()

def printJsonFile1():
    print("json1")
    jsonFile = open('../data/code_output/authorsInfoList.json')
    data = json.load(jsonFile)
    
    today = datetime.date.today()
    currentYear = today.year
    
    totalCitationsCount = 0
    totalCitationsCount5 = 0
    totalNPublications = 0
    totalCitationsOverYears = []
    totalCitationsOver5Years = []
    
    affiliationsList = []
    researchAreasList = {}
    
    yearsDict = {}
    pubCollabDic = {}
    nAuthors = 0
    totalNumberOfPubsPerYear = {}
    totalNumberOfCollabsPerYear = {}
    totalNumberOfStudentCollabsPerYear = {}    
    internationalCollabPubsCount = 0
    studentCollabPubsCount = 0
    pubTypeDic = {}
    pubAreaDic = {}
    authorAreaDic = {}
    authorPubAreaRatioDic = {}
    for i in range(len(data)):
        author = data[i]
        nAuthors += 1
        
        previousAdvisorCMU = author['previous_cmu_advisor']
        advisorCMU = author['cmu_advisor']
        previousAdvisorPT = author['previous_pt_advisor']
        advisorPT = author['pt_advisor']
        
        previousCMUAdvisors = previousAdvisorCMU.split('/')
        CMUAdvisors = advisorCMU.split('/')
        previousPTAdvisors = previousAdvisorPT.split('/')
        PTAdvisors = advisorPT.split('/')
        
        authorAffiliation = author['affiliation']
        unicodedata.normalize('NFKD', authorAffiliation).encode('ascii', 'ignore')        
        
        if(str(authorAffiliation) not in affiliationsList):
            affiliationsList.append(str(authorAffiliation))
        
        authorResearchArea = author['research_area_acronym']
        
        if(authorResearchArea not in researchAreasList):
            researchAreasList[authorResearchArea] = author['research_area']
            authorAreaDic[authorResearchArea] = 0
        
        authorAreaDic[authorResearchArea] += 1
    
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')

            authors = pub['authors'].split(', ')
            pubAuthorsList = [] 
            for k in range(len(authors)):
                authorName = authors[k]
                unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
                
                pubAuthorsList.append(authorName)            
            
            CMUAdvisorsList = []
            PTAdvisorsList = []
            if(str(pubTitle) not in pubCollabDic):
                totalNPublications += 1
                
                if(pub['pub_type'] not in pubTypeDic):
                    pubTypeDic[pub['pub_type']] = 0
                
                pubTypeDic[pub['pub_type']] += 1
                
                
                if(pub['research_area_acronym'] not in pubAreaDic):
                    pubAreaDic[pub['research_area_acronym']] = 0
            
                pubAreaDic[pub['research_area_acronym']] += 1
                
                if(str(pub['pub_year']) not in totalNumberOfPubsPerYear):
                    totalNumberOfPubsPerYear[str(pub['pub_year'])] = 0                
                
                totalNumberOfPubsPerYear[str(pub['pub_year'])] += 1
                   
                if(len(pub['years']) == len(pub['bars']) and len(pub['years']) != 0):
                    for k in range(len(pub['years'])):
                        if(int(pub['years'][k]) >= int(author['start_research_year']) and int(pub['years'][k]) >= int(pub['pub_year'])):
                            totalCitationsCount += int(pub['bars'][k])
                            totalCitationsOverYears.append(int(pub['bars'][k]))
                            
                            if(int(pub['years'][k]) >= currentYear - 5):
                                totalCitationsCount5 += int(pub['bars'][k])
                                totalCitationsOver5Years.append(int(pub['bars'][k]))
                            
                            if(str(pub['years'][k]) not in yearsDict):
                                yearsDict[str(pub['years'][k])] = 0
                            
                            yearsDict[str(pub['years'][k])] += int(pub['bars'][k])
                
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a)):
                                    CMUAdvisorFlag = 1
                                    CMUAdvisorsList.append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a)):
                                CMUAdvisorFlag = 1
                                CMUAdvisorsList.append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor)):
                            CMUAdvisorFlag = 1
                            CMUAdvisorsList.append(cmuAdvisor)
        
                PTAdvisorFlag = 0
                for ptAdvisor in previousPTAdvisors:
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a)):                                                            
                                    PTAdvisorFlag = 1
                                    PTAdvisorsList.append(ptAdvisor)
                            elif(isin(a, ptAdvisor)):
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                            
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a)):                                                            
                                PTAdvisorFlag = 1
                                PTAdvisorsList.append(ptAdvisor)
                        elif(isin(a, ptAdvisor)):
                            PTAdvisorFlag = 1
                            PTAdvisorsList.append(ptAdvisor)
                
                pubCollabDic[str(pubTitle)] = {
                            'authors': [author['author']],
                            'cmu_advisor_flags': [CMUAdvisorFlag],
                            'pt_advisor_flags': [PTAdvisorFlag],
                            'cmu_advisors': CMUAdvisorsList,
                            'pt_advisors': PTAdvisorsList
                        }  
        
                if(CMUAdvisorFlag == 1 and PTAdvisorFlag == 0):
                    pubCollabDic[str(pubTitle)]['colab'] = "Just CMU Advisor"
                elif(CMUAdvisorFlag == 0 and PTAdvisorFlag == 1):
                    pubCollabDic[str(pubTitle)]['colab'] = "Just PT Advisor"                                          
                elif(CMUAdvisorFlag == 1 and PTAdvisorFlag == 1):
                    pubCollabDic[str(pubTitle)]['colab'] = "Yes"
                    internationalCollabPubsCount += 1
                    
                    if(str(pub['pub_year']) not in totalNumberOfCollabsPerYear):
                        totalNumberOfCollabsPerYear[str(pub['pub_year'])] = 0                
                    
                    totalNumberOfCollabsPerYear[str(pub['pub_year'])] += 1                    
                else:
                    pubCollabDic[str(pubTitle)]['colab'] = "No"    
            else:
                pubCollabDic[str(pubTitle)]['authors'].append(author['author'])
                
                if(len(pubCollabDic[str(pubTitle)]['authors']) == 2):
                    studentCollabPubsCount += 1
                    
                    if(str(pub['pub_year']) not in totalNumberOfStudentCollabsPerYear):
                        totalNumberOfStudentCollabsPerYear[str(pub['pub_year'])] = 0                
                    
                    totalNumberOfStudentCollabsPerYear[str(pub['pub_year'])] += 1                    
                
                CMUAdvisorFlag = 0
                for cmuAdvisor in previousCMUAdvisors:
                    if(cmuAdvisor != ""):
                        for a in pubAuthorsList:
                            if(len(cmuAdvisor) <= len(a)):
                                if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                    CMUAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                            elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)                
                
                for cmuAdvisor in CMUAdvisors:                                        
                    for a in pubAuthorsList:
                        if(len(cmuAdvisor) <= len(a)):
                            if(isin(cmuAdvisor, a) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                                CMUAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
                        elif(isin(a, cmuAdvisor) and cmuAdvisor not in pubCollabDic[str(pubTitle)]['cmu_advisors']):
                            CMUAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['cmu_advisors'].append(cmuAdvisor)
        
                PTAdvisorFlag = 0 
                for ptAdvisor in previousPTAdvisors: 
                    if(ptAdvisor != ""):
                        for a in pubAuthorsList:                                                    
                            if(len(ptAdvisor) <= len(a)):
                                if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                    PTAdvisorFlag = 1
                                    pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                            elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)                
                
                for ptAdvisor in PTAdvisors:                                                
                    for a in pubAuthorsList:                                                    
                        if(len(ptAdvisor) <= len(a)):
                            if(isin(ptAdvisor, a) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):                                                            
                                PTAdvisorFlag = 1
                                pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
                        elif(isin(a, ptAdvisor) and ptAdvisor not in pubCollabDic[str(pubTitle)]['pt_advisors']):
                            PTAdvisorFlag = 1
                            pubCollabDic[str(pubTitle)]['pt_advisors'].append(ptAdvisor)
        
                pubCollabDic[str(pubTitle)]['cmu_advisor_flags'].append(CMUAdvisorFlag)
                pubCollabDic[str(pubTitle)]['pt_advisor_flags'].append(PTAdvisorFlag)
        
                if(pubCollabDic[str(pubTitle)]['colab'] != "Yes"):
                    if(1 in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 not in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                        pubCollabDic[str(pubTitle)]['colab'] = "Just CMU Advisor"
                    elif(1 not in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                        pubCollabDic[str(pubTitle)]['colab'] = "Just PT Advisor"
                    elif(1 in pubCollabDic[str(pubTitle)]['cmu_advisor_flags'] and 1 in pubCollabDic[str(pubTitle)]['pt_advisor_flags']):
                        pubCollabDic[str(pubTitle)]['colab'] = "Yes"
                        internationalCollabPubsCount += 1
                        if(str(pub['pub_year']) not in totalNumberOfCollabsPerYear):
                            totalNumberOfCollabsPerYear[str(pub['pub_year'])] = 0                
                        
                        totalNumberOfCollabsPerYear[str(pub['pub_year'])] += 1                        
                    else:
                        pubCollabDic[str(pubTitle)]['colab'] = "No"
    
    if("2006" not in yearsDict):
        yearsDict["2006"] = 0
           
    if(str(currentYear) not in yearsDict):
        yearsDict[str(currentYear)] = 0
    
    yearsList = []
    for key, value in yearsDict.items():
        yearsList.append(int(key))
    
    yearsList.sort()
    missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
    
    for year in missingYears:
        yearsDict[str(year)] = 0
    
    if("2006" not in totalNumberOfPubsPerYear):
        totalNumberOfPubsPerYear["2006"] = 0
    
    if(str(currentYear) not in totalNumberOfPubsPerYear):
        totalNumberOfPubsPerYear[str(currentYear)] = 0
    
    yearsList = []
    for key, value in totalNumberOfPubsPerYear.items():
        yearsList.append(int(key))
    
    yearsList.sort()
    missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
    
    for year in missingYears:
        totalNumberOfPubsPerYear[str(year)] = 0    
               
    if("2006" not in totalNumberOfCollabsPerYear):
        totalNumberOfCollabsPerYear["2006"] = 0
    
    if(str(currentYear) not in totalNumberOfCollabsPerYear):
        totalNumberOfCollabsPerYear[str(currentYear)] = 0
    
    yearsList = []
    for key, value in totalNumberOfCollabsPerYear.items():
        yearsList.append(int(key))
    
    yearsList.sort()
    missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
    
    for year in missingYears:
        totalNumberOfCollabsPerYear[str(year)] = 0
    
    if("2006" not in totalNumberOfStudentCollabsPerYear):
        totalNumberOfStudentCollabsPerYear["2006"] = 0
    
    if(str(currentYear) not in totalNumberOfStudentCollabsPerYear):
        totalNumberOfStudentCollabsPerYear[str(currentYear)] = 0
    
    yearsList = []
    for key, value in totalNumberOfStudentCollabsPerYear.items():
        yearsList.append(int(key))
    
    yearsList.sort()
    missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
    
    for year in missingYears:
        totalNumberOfStudentCollabsPerYear[str(year)] = 0    
    
    for key, value in authorAreaDic.items():
        authorPubAreaRatioDic[key] = float("{:.2f}".format(pubAreaDic[key]/authorAreaDic[key]))
    
    totalCitationsOverYears.sort(reverse = True)
    totalCitationsOver5Years.sort(reverse = True)        
    
    total_h_index = hIndex(totalCitationsOverYears, len(totalCitationsOverYears))
    total_h_index5 = hIndex(totalCitationsOver5Years, len(totalCitationsOver5Years))
    total_i10_index = i10Index(totalCitationsOverYears, len(totalCitationsOverYears))
    total_i10_index5 = i10Index(totalCitationsOver5Years, len(totalCitationsOver5Years))
    
    authorInfoList = []
    
    sortedCiteYearsAndBars = OrderedDict(sorted(yearsDict.items()))
    sortedTotalPubsPerYear = OrderedDict(sorted(totalNumberOfPubsPerYear.items()))
    sortedTotalCollabsPerYear = OrderedDict(sorted(totalNumberOfCollabsPerYear.items()))
    sortedTotalStudentCollabsPerYear = OrderedDict(sorted(totalNumberOfStudentCollabsPerYear.items()))
    sortedTotalPubTypeDic = OrderedDict(sorted(pubTypeDic.items()))
    sortedTotalPubAreaDic = OrderedDict(sorted(pubAreaDic.items()))
    sortedTotalAuthorPubAreaDic = OrderedDict(sorted(authorAreaDic.items()))
    sortedTotalAuthorPubAreaRatioDic = OrderedDict(sorted(authorPubAreaRatioDic.items()))
    cmuDic = {
        'affiliations': affiliationsList,
        'research_areas': researchAreasList,
        'citations_count': totalCitationsCount,
        'citations_count5': totalCitationsCount5,
        'citations_per_year': sortedCiteYearsAndBars,
        'h_index': total_h_index,
        'h_index5': total_h_index5,
        'i10_index': total_i10_index,
        'i10_index5': total_i10_index5,
        'number_of_publications': totalNPublications,
        'number_of_international_pubs': internationalCollabPubsCount,
        'pubs_per_year': sortedTotalPubsPerYear,
        'collabs_per_year': sortedTotalCollabsPerYear,
        'student_collabs_per_year': sortedTotalStudentCollabsPerYear,
        'pubTypesCount': sortedTotalPubTypeDic,
        'pubAreaCount': sortedTotalPubAreaDic,
        'authorPubAreaCount': sortedTotalAuthorPubAreaDic,
        'authorPubAreaRatioCount': sortedTotalAuthorPubAreaRatioDic,
        'number_of_authors': nAuthors,
        'number_of_student_collabs': studentCollabPubsCount
    }
    
    cmuPubsList = []
    titlesList = []
    for i in range(len(data)):
        author = data[i]
        authorDic = {}
        
        authorName = author['author']
        unicodedata.normalize('NFKD', authorName).encode('ascii', 'ignore')
        authorDic['author'] = str(authorName)
        
        authorAffiliation = author['affiliation']
        unicodedata.normalize('NFKD', authorAffiliation).encode('ascii', 'ignore')        
        authorDic['affiliation'] = str(authorAffiliation)
        
        authorDic['research_area'] = author['research_area']
        authorDic['research_area_acronym'] = author['research_area_acronym']
        
        publicationsCitationsCount = 0
        publicationsCitationsCount5 = 0
        nPublications = 0
        citationsOverYears = []
        citationsOver5Years = []
        publicationsList = []
        yearsDict = {}
        numberOfPubsPerYear = {}
        numberOfCollabsPerYear = {}
        numberOfStudentCollabsPerYear = {}
        authorInternationalCollabPubsCount = 0
        authorStudentCollabPubsCount = 0
        studentsCollabList = []
        authorPubTypeDic = {}
        authorPubAreaDic = {}
        for j in range(len(author['publications'])):
            pub = author['publications'][j]
            
            pubCitationsCount = 0
            pubDic = {}
            pubTitle = pub['title']
            unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')
            pubDic['title'] = str(pubTitle)
            pubDic['pub_year'] = str(pub['pub_year'])
            
            nPublications += 1
            
            if(pub['pub_type'] not in authorPubTypeDic):
                authorPubTypeDic[pub['pub_type']] = 0
            
            authorPubTypeDic[pub['pub_type']] += 1 
            
            
            if(pub['research_area_acronym'] not in authorPubAreaDic):
                authorPubAreaDic[pub['research_area_acronym']] = 0
        
            authorPubAreaDic[pub['research_area_acronym']] += 1            
            
            if(str(pub['pub_year']) not in numberOfPubsPerYear):
                numberOfPubsPerYear[str(pub['pub_year'])] = 0                
            
            numberOfPubsPerYear[str(pub['pub_year'])] += 1            
                    
            pubDic['author'] = [str(authorName)]
            authors = pub['authors'].split(', ')
            pubAuthorsList = [] 
            for k in range(len(authors)):
                authorNames = authors[k]
                unicodedata.normalize('NFKD', authorNames).encode('ascii', 'ignore')
                
                pubAuthorsList.append(authorNames)            
            
            pubDic['authors'] = pubAuthorsList
            
            pubCitationsDic = {}
            if(len(pub['years']) == len(pub['bars']) and len(pub['years']) != 0):
                for k in range(len(pub['years'])):
                    if(int(pub['years'][k]) >= int(author['start_research_year']) and int(pub['years'][k]) >= int(pub['pub_year'])):
                        pubCitationsDic[str(pub['years'][k])] = int(pub['bars'][k])
                        
                        pubCitationsCount += int(pub['bars'][k])
                        publicationsCitationsCount += int(pub['bars'][k])
                        citationsOverYears.append(int(pub['bars'][k]))
                    
                        if(int(pub['years'][k]) >= currentYear - 5):
                            publicationsCitationsCount5 += int(pub['bars'][k])
                            citationsOver5Years.append(int(pub['bars'][k]))
                        
                        if(str(pub['years'][k]) not in yearsDict):
                            yearsDict[str(pub['years'][k])] = 0
                            
                        yearsDict[str(pub['years'][k])] += int(pub['bars'][k])
               
            pubDic['citations_count'] = pubCitationsCount
            pubDic['citations_per_year'] = pubCitationsDic
            pubDic['pub_type'] = pub['pub_type']
            pubDic['pub_area_tag'] = pub['research_area']
            pubDic['pub_area_tag_acronym'] = pub['research_area_acronym']
            
            for key, value in pubCollabDic.items():
                if(str(pubTitle) == key):
                    pubDic['inter_colab'] = value['colab']
                    
                    if(value['colab'] == "Yes"):
                        pubCMUAdvisors = []
                        for l in range(len(value['cmu_advisors'])):
                            pubCMUAdvisors.append(value['cmu_advisors'][l])
                        
                        pubPTAdvisors = []
                        for l in range(len(value['pt_advisors'])):
                            pubPTAdvisors.append(value['pt_advisors'][l])
                            
                        pubDic['cmu_advisors'] = pubCMUAdvisors
                        pubDic['pt_advisors'] = pubPTAdvisors
                        authorInternationalCollabPubsCount += 1
                        
                        if(str(pub['pub_year']) not in numberOfCollabsPerYear):
                            numberOfCollabsPerYear[str(pub['pub_year'])] = 0                
                        
                        numberOfCollabsPerYear[str(pub['pub_year'])] += 1                        
                        
                    elif(value['colab'] == "Just CMU Advisor"):
                        pubCMUAdvisors = []
                        for l in range(len(value['cmu_advisors'])):
                            pubCMUAdvisors.append(value['cmu_advisors'][l])                                
                        
                        pubDic['cmu_advisors'] = pubCMUAdvisors
                        pubDic['pt_advisors'] = []
                    
                    elif(value['colab']== "Just PT Advisor"):
                        pubPTAdvisors = []
                        for l in range(len(value['pt_advisors'])):
                            pubPTAdvisors.append(value['pt_advisors'][l])                                
                        
                        pubDic['cmu_advisors'] = []
                        pubDic['pt_advisors'] = pubPTAdvisors
                        
                    elif(value['colab'] == "No"):
                        pubDic['cmu_advisors'] = []
                        pubDic['pt_advisors'] = []
                                              
                    if(len(value['authors']) > 1):
                        collabStudents = []
                        for l in range(len(value['authors'])):
                            collabStudents.append(value['authors'][l])
                            
                            if(value['authors'][l] != authorName):
                                if(value['authors'][l] not in studentsCollabList):
                                    studentsCollabList.append(value['authors'][l])
                        
                        pubDic['author'] = collabStudents
                        authorStudentCollabPubsCount += 1
                        pubDic['collab_students'] = "Yes"
                        pubDic['number_of_collab_students'] = len(collabStudents)
                        
                        if(str(pub['pub_year']) not in numberOfStudentCollabsPerYear):
                            numberOfStudentCollabsPerYear[str(pub['pub_year'])] = 0                
                        
                        numberOfStudentCollabsPerYear[str(pub['pub_year'])] += 1                        
                    else:
                        pubDic['collab_students'] = "No"
                        pubDic['number_of_collab_students'] = 1
             
            pubDic['pub_link'] = pub['pub_link']
            pubDic['pub_DOI'] = pub['pub_DOI']
            pubDic['pub_scholar_link'] = pub['pub_scholar_link']
            
            publicationsList.append(pubDic)

            if(str(pubTitle) not in titlesList):
                cmuPubsList.append(pubDic)
                titlesList.append(str(pubTitle))
            
        
        citationsOverYears.sort(reverse = True)
        citationsOver5Years.sort(reverse = True)        
          
        h_index = hIndex(citationsOverYears, len(citationsOverYears))
        h_index5 = hIndex(citationsOver5Years, len(citationsOver5Years))
        i10_index = i10Index(citationsOverYears, len(citationsOverYears))
        i10_index5 = i10Index(citationsOver5Years, len(citationsOver5Years))
        
        authorDic['collab_students'] = studentsCollabList
        authorDic['citations_count'] = publicationsCitationsCount
        authorDic['citations_count5'] = publicationsCitationsCount5
        
        if(str(author['start_research_year']) not in yearsDict):
            yearsDict[str(author['start_research_year'])] = 0
        
        if(str(currentYear) not in yearsDict):
            yearsDict[str(currentYear)] = 0
        
        yearsList = []
        for key, value in yearsDict.items():
            yearsList.append(int(key))
        
        yearsList.sort()
        missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
        
        for year in missingYears:
            yearsDict[str(year)] = 0
        
        if(str(author['start_research_year']) not in numberOfPubsPerYear):
            numberOfPubsPerYear[str(author['start_research_year'])] = 0
        
        if(str(currentYear) not in numberOfPubsPerYear):
            numberOfPubsPerYear[str(currentYear)] = 0
        
        yearsList = []
        for key, value in numberOfPubsPerYear.items():
            yearsList.append(int(key))
        
        yearsList.sort()
        missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
        
        for year in missingYears:
            numberOfPubsPerYear[str(year)] = 0        
        
        if(str(author['start_research_year']) not in numberOfCollabsPerYear):
            numberOfCollabsPerYear[str(author['start_research_year'])] = 0
        
        if(str(currentYear) not in numberOfCollabsPerYear):
            numberOfCollabsPerYear[str(currentYear)] = 0
        
        yearsList = []
        for key, value in numberOfCollabsPerYear.items():
            yearsList.append(int(key))
        
        yearsList.sort()
        missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
        
        for year in missingYears:
            numberOfCollabsPerYear[str(year)] = 0        
        
        if(str(author['start_research_year']) not in numberOfStudentCollabsPerYear):
            numberOfStudentCollabsPerYear[str(author['start_research_year'])] = 0
        
        if(str(currentYear) not in numberOfStudentCollabsPerYear):
            numberOfStudentCollabsPerYear[str(currentYear)] = 0
        
        yearsList = []
        for key, value in numberOfStudentCollabsPerYear.items():
            yearsList.append(int(key))
        
        yearsList.sort()
        missingYears = find_missing_years(yearsList, yearsList[0], yearsList[len(yearsList)-1])
        
        for year in missingYears:
            numberOfStudentCollabsPerYear[str(year)] = 0        
        
        sortedCiteYearsAndBars = OrderedDict(sorted(yearsDict.items()))
        sortedPubsPerYear = OrderedDict(sorted(numberOfPubsPerYear.items()))
        sortedCollabsPerYear = OrderedDict(sorted(numberOfCollabsPerYear.items()))
        sortedStudentCollabsPerYear = OrderedDict(sorted(numberOfStudentCollabsPerYear.items()))
        sortedPubTypeDic = OrderedDict(sorted(authorPubTypeDic.items()))
        sortedPubAreaDic = OrderedDict(sorted(authorPubAreaDic.items()))
        
        authorDic['citations_per_year'] = sortedCiteYearsAndBars
        
        authorDic['h_index'] = h_index
        authorDic['h_index5'] = h_index5
        authorDic['i10_index'] = i10_index
        authorDic['i10_index5'] = i10_index5
        authorDic['number_of_publications'] = nPublications
        authorDic['number_of_international_pubs'] = authorInternationalCollabPubsCount
        authorDic['pubs_per_year'] = sortedPubsPerYear
        authorDic['collabs_per_year'] = sortedCollabsPerYear
        authorDic['pubTypesCount'] = sortedPubTypeDic
        authorDic['pubAreaCount'] = sortedPubAreaDic
        authorDic['student_collabs_per_year'] = sortedStudentCollabsPerYear        
        authorDic['number_of_student_collabs'] = authorStudentCollabPubsCount
        authorType = author['type']
        unicodedata.normalize('NFKD', authorType).encode('ascii', 'ignore')  
        authorDic['type'] = str(authorType)
        
        previousAdvisorCMU = author['previous_cmu_advisor']
        advisorCMU = author['cmu_advisor']
        previousAdvisorPT = author['previous_pt_advisor']
        advisorPT = author['pt_advisor']
        
        previousCMUAdvisors = previousAdvisorCMU.split('/')
        CMUAdvisors = advisorCMU.split('/')
        previousPTAdvisors = previousAdvisorPT.split('/')
        PTAdvisors = advisorPT.split('/')        
        
        previousCMUAdvisorsList = []
        for j in range(len(previousCMUAdvisors)):
            advisorName = previousCMUAdvisors[j]
            unicodedata.normalize('NFKD', advisorName).encode('ascii', 'ignore')
            
            previousCMUAdvisorsList.append(advisorName)                
        
        CMUAdvisorsList = []
        for j in range(len(CMUAdvisors)):
            advisorName = CMUAdvisors[j]
            unicodedata.normalize('NFKD', advisorName).encode('ascii', 'ignore')
            
            CMUAdvisorsList.append(advisorName)
        
        authorDic['previous_cmu_advisor'] = previousCMUAdvisorsList
        authorDic['cmu_advisor'] = CMUAdvisorsList        
        
        previousPTAdvisorsList = []
        for j in range(len(previousPTAdvisors)):
            advisorName = previousPTAdvisors[j]
            unicodedata.normalize('NFKD', advisorName).encode('ascii', 'ignore')
            
            previousPTAdvisorsList.append(advisorName) 
        
        PTAdvisorsList = []    
        for j in range(len(PTAdvisors)):
            advisorName = PTAdvisors[j]
            unicodedata.normalize('NFKD', advisorName).encode('ascii', 'ignore')
            
            PTAdvisorsList.append(advisorName)
        
        authorDic['previous_pt_advisor'] = previousPTAdvisorsList 
        authorDic['pt_advisor'] = PTAdvisorsList        
        
        authorDic['start_research_year'] = int(author['start_research_year'])
        authorDic['end_research_year'] = int(author['end_research_year'])
        
        if(author['graduation_year'] != 'ongoing'):
            authorDic['graduation_year'] = int(author['graduation_year'])
        else:
            authorDic['graduation_year'] = str(author['graduation_year'])
        
        authorStatus = author['status']
        unicodedata.normalize('NFKD', authorStatus).encode('ascii', 'ignore') 
        authorDic['status'] = str(authorStatus)
        
        authorScholarLink = author['google_scholar_link']
        unicodedata.normalize('NFKD', authorScholarLink).encode('ascii', 'ignore')        
        authorDic['google_scholar_link'] = str(authorScholarLink)
        
        authorScholarPicture = author['picture']
        unicodedata.normalize('NFKD', authorScholarPicture).encode('ascii', 'ignore')        
        authorDic['picture'] = str(authorScholarPicture)       
        authorDic['publications'] = publicationsList
    
        authorInfoList.append(authorDic)
    
    cmuDic['authors'] = authorInfoList    
    cmuDic['publications'] = cmuPubsList
    
    dataDict = {
        'CMUPortugal': cmuDic
    } 
    with open("../../platform/data_files/authorsData.js", "w") as info:
        json.dump(dataDict, info, indent=2)
    
    line_pre_adder("../../platform/data_files/authorsData.js", "var CMUData = ")
    
    f = open("../../platform/data_files/authorsData.js", "a")
    f.writelines(["\nfunction getData() {", "\n\treturn CMUData;", "\n}"])
    f.close()    

def find_missing_years(lst, start, end):
    return sorted(set(range(start, end + 1)).difference(lst))

def line_pre_adder(filename, line_to_prepend):
    f = fileinput.input(filename, inplace=1)
    for xline in f:
        if f.isfirstline():
            print(line_to_prepend.rstrip('\r\n') + '\n' + xline)
        else:
            print(xline)
            
def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    only_ascii = nfkd_form.encode('ASCII', 'ignore')
    return only_ascii

def isin(a, b):
    a2 = remove_accents(a)
    b2 = remove_accents(b)
    
    a3 = a2.lower()
    b3 = b2.lower()
    
    return not Counter(a3) - Counter(b3)

def check_value_exist(author, title, linksTemp):
    for pub in linksTemp:
        if(pub['author'] == author and pub['title'] == title):
            return True
    return False

def getPubTypeBackupInfo(fillPubTypeFlag):
    isFile = os.path.isfile('../data/linkscraper_output/bars.json')
    if(not isFile):
        with open("../data/linkscraper_output/bars.json", "w") as info:
            json.dump([], info, indent=2)        
    
    jsonFile = open('../data/linkscraper_output/bars.json')
    bars = json.load(jsonFile)
    
    jsonFile2 = open('../data/linkscraper_output/barsTemp.json')
    barsTemp = json.load(jsonFile2)
    
    n = 0
    for publication in barsTemp:
        pubTitle = publication['title']
        unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')        
        if(publication['pub_type'] == ""):
            print("No type: " + pubTitle + ", " + "noTypeIndex: " + str(n + 1))
            n += 1            
            for pub in bars:                       
                if(publication['author'] == pub['author'] and publication['title'] == pub['title']):
                    if(pub['pub_type'] != ""):
                        publication['pub_type'] = pub['pub_type']
                    
                    publication['affiliation'] = pub['affiliation']
                        
    if(fillPubTypeFlag == 1):
        n = 0
        for publication in barsTemp:
            try:
                pubTitle = publication['title']
                unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')              
                if(publication['pub_type'] == ""):
                    print("Scraper no type: " + pubTitle + ", " + "noTypeIndex: " + str(n + 1))
                    n += 1                 
                    pubTitle = publication['title']
                    unicodedata.normalize('NFKD', pubTitle).encode('ascii', 'ignore')
                    publicationToFill = scholarly.search_single_pub(str(pubTitle))
                    if('bib' in publicationToFill):
                        scholarly.fill(publicationToFill, sections=['bib'])
                        if('pub_type' in publicationToFill['bib']):
                            publication['pub_type'] = publicationToFill['bib']['pub_type']
            except:
                pass
                        
    with open("../data/linkscraper_output/bars.json", "w") as info:
        json.dump(barsTemp, info, indent=2)    
                    
def getBarsBackupInfo():
    isFile = os.path.isfile('../data/linkscraper_output/bars.json')
    if(not isFile):
        with open("../data/linkscraper_output/bars.json", "w") as info:
            json.dump([], info, indent=2)        
    
    jsonFile = open('../data/linkscraper_output/bars.json')
    bars = json.load(jsonFile)
    
    jsonFile2 = open('../data/linkscraper_output/barsTemp.json')
    barsTemp = json.load(jsonFile2)
    
    isFile2 = os.path.isfile('../data/linkscraper_output/deletedPublications.json')
    if(not isFile2):
        with open("../data/linkscraper_output/deletedPublications.json", "w") as info:
            json.dump([], info, indent=2) 
    
    jsonFile3 = open('../data/linkscraper_output/deletedPublications.json')
    deletedPubs = json.load(jsonFile3)
       
    for publication in bars:
        if((not check_value_exist(publication['author'], publication['title'], barsTemp)) and (publication['title'] not in deletedPubs)):
            barsTemp.append(publication)
    
    sortedBarsTemp = sorted(barsTemp, key=lambda k: k['author'])
    
    with open("../data/linkscraper_output/barsTemp.json", "w") as info:
        json.dump(sortedBarsTemp, info, indent=2)
                        
def main():
    args = [
        0, #0: sys.argv[1] scrapeDataFlag
        1, #1: sys.argv[2] writeDataFlag
        0, #2: sys.argv[3] fillPubTypeFlag      
        1, #3: sys.argv[4] writeExcelFlag
    ]
             
    if(len(sys.argv) == 5):
        argFlagsNames = ['scrapeDataFlag', 'writeDataFlag', 'fillPubTypeFlag', 'writeExcelFlag']
        for i in range(1, len(sys.argv)):
            if(int(sys.argv[i]) != 0 and int(sys.argv[i]) != 1):
                print("Input Error: " + "Must only use either int 0 or int 1 values at " + "argv[" + str(i) + "]" + " (" + argFlagsNames[i-1] + ")")
                exit(1)
            else:
                args[i-1] = int(sys.argv[i])
                print(argFlagsNames[i-1] + ": " + str(args[i-1]))
    
    elif(len(sys.argv) != 1 and len(sys.argv) != 5):
        print("Input Error: " + "Must use 0 or 4 args ('scrapeDataFlag', 'writeDataFlag', 'fillPubTypeFlag', 'writeExcelFlag')")
        exit(1)
    
    if(args[0] == 1):        
        process = subprocess.Popen('scrapy crawl scholarProfileLinks -O ../data/linkscraper_output/links.json', shell=True)
        process.wait()
        
        process = subprocess.Popen('scrapy crawl scholarProfileBars -O ../data/linkscraper_output/barsTemp.json', shell=True)
        process.wait()
                
    if(args[1] == 1):
        if(args[2] == 1):
            
            jsonFile = open('../data/scraperAPIKey.json')
            data = json.load(jsonFile)            
            
            logIn(data['key'])
        
        getBarsBackupInfo()
        
        getPubTypeBackupInfo(args[2])
        
        isFile = os.path.isfile('../data/linkscraper_output/bars.json')
        if(isFile):        
            findPhDAuthors()
        else:
            print("Error: missing bars.json file")
            exit(1)            
        
    if(args[3] == 1):
        isFile = os.path.isfile('../data/linkscraper_output/bars.json')
        if(isFile):
            workbook = xlsxwriter.Workbook('../../platform/data_files/authorsDataExcel.xlsx')
            printExcelSheet1(workbook)
            printExcelSheet2(workbook)
            printExcelSheet3(workbook)
            printExcelSheet4(workbook)
            printExcelSheet5(workbook)
            printExcelSheet6(workbook)
            printExcelSheet7(workbook)
            printExcelSheet8(workbook)
            printExcelSheet9(workbook)
            printExcelSheet10(workbook)
            printExcelSheet11(workbook)
            printExcelSheet12(workbook)
            printExcelSheet13(workbook)
            printExcelSheet14(workbook)
            printExcelSheet15(workbook)
            printExcelSheet16(workbook)  
            printExcelSheet17(workbook)
            printExcelSheet18(workbook)
            workbook.close()
            
            printJsonFile1()
        else:
            print("Error: missing authorsInfoList.json file")
            exit(1)

    
if __name__ == "__main__":
    main()