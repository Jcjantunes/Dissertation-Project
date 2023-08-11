import re
import scrapy
from urllib.parse import urlencode
from urllib.parse import urlparse
import json
from datetime import datetime
import time
import random
import re

API_KEY = '0554895b418cba64e79764bdec219845'

def get_scraperapi_url(url, key):
    payload = {'api_key': key, 'url': url}
    proxy_url = 'http://api.scraperapi.com/?' + urlencode(payload)
    return proxy_url

class ScholarProfileSpider2(scrapy.Spider):
    name = 'scholarProfileBars'
    allowed_domains = ['scholar.google.com']

    def __init__(self):
        self.headers = [
            { 
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
                'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,pt-PT;q=0.8,pt;q=0.7',
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                'cache-control': 'max-age=0',
                'dnt': '1',
                'referer': "https://scholar.google.com/",
                'cookie': "CONSENT=PENDING+923; SOCS=CAESHwgBEhJnd3NfMjAyMjExMjEtMF9SQzMaBXB0LVBUIAEaBgiAupqcBg; GSP=LM=1670281526:S=AJo9wjmu_aylkgVl; SID=SQi5wc4QxpsP_7ksQ-hg6BzfQNWHweTlbkxmkGVq_di10j9f99Bwc6gmWjj77WTnFF4qDA.; __Secure-1PSID=SQi5wc4QxpsP_7ksQ-hg6BzfQNWHweTlbkxmkGVq_di10j9fpZJI2BlDshjWk1an9KlqZQ.; __Secure-3PSID=SQi5wc4QxpsP_7ksQ-hg6BzfQNWHweTlbkxmkGVq_di10j9fGmvUIvj-XrsSCxK-UtgHfg.; HSID=A9ruhIi7ADnvTtoJ3; SSID=AMzbRC0VfUXCGy-sE; APISID=AgxkG0SxwjpbMQax/AIdWTqNRpoyp-jEE6; SAPISID=0O1n7lX7pGW15NOT/ATV5ghUnzVRKgyrk4; __Secure-1PAPISID=0O1n7lX7pGW15NOT/ATV5ghUnzVRKgyrk4; __Secure-3PAPISID=0O1n7lX7pGW15NOT/ATV5ghUnzVRKgyrk4; SEARCH_SAMESITE=CgQIpJcB; AEC=ARSKqsJnm1GUWXE7mNP7NlwLivaF6xgUcL7nuxJrXkKglezYOrVQeUCSxQ; NID=511=p0XlQL_BeH7LUjjCzqONlFnYVaZ6W5B1wT_PH0zp42uwpLnCszGvCndrXZm7eXxc5vJOJw7iV7xx5Gklic5V9nNugeIfsYxq2AYnXT3LMxsj_xzgt3HxR6bJQDmigZnbZPxNthNQAZQ8OWEG93tEjLkju1IZXhP_Ik4LgMQd5xtTMUY8NFM2DdlICygnYUW_g33tOnewozi2f5LUaMBILge0IaW_hlzFhaJA3GLlcjhMvIs0H1OKp8wB25CbFRAfYO-2Q_p4I7h8sQXO3YTIiLPG4UkZNWInHrjZzXofXMt9pfkJUR4RA9AD_opa_ch0UMcc8_6-_NC2ELH4B0f2zcMMUgDSQo_5KVcKB88Hlg; 1P_JAR=2023-1-9-12; __Secure-ENID=9.SE=CbVbc7L8KGgbo4Hefh697AhdA0IArslgYEFZ3-AYEnIYDBcZE1UAffkeErRnmXq-wQIi4kVjPQGqe17SGHqDv7OtrCnAjeIelvRq8KYMFZ1-g8vtk04h7BMALpTNufxCGFwCk0NL2Pk3BgqfcYll8Gz1HpMY63q_FiwffyDuOZItDBwDvwNEFZQiXL1JD49yOdyi_u--vRziPuaE3CHeTDbuAffjI2VWIBGI2b_H0xhDqyrZgLFNckqwL2y896isPTIM-78T3JWfMVLW0QxCAOHATtELgCkAxAp2KPzpGsnrhPYq0LM6E3NYnWzvl4wWgiGWgnaT; SIDCC=AIKkIs06GjESnBR1sCdhbik8G69fnYQMg4c7uuLNyU9Ckt2gjPX2Bpk-ssrYMC86QCf1RNUY53A; __Secure-1PSIDCC=AIKkIs3reAYyrJKHQ2k-GDPuCnIdws2hQ2Wnc7Va-6Pg1fzE-3CZIXmznUIjEogR3A2i5qxHriY; __Secure-3PSIDCC=AIKkIs0mmumaxQG31y6s_uQ9WakWYWV5KbNmumtKoFbCblmzAhGzL2m8eLYAt6OKMEeYXWvveQ" 
            },
            {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
                'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,pt-PT;q=0.8,pt;q=0.7',
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                'cache-control': 'max-age=0',
                'dnt': '1',
                'referer': "https://scholar.google.com/",
                'cookie': "AEC=AakniGNn6cxJJLTiTTuq88fh0h4JOyvveqcNuM3QkR-tZF32UZPhff_PtrU; __Secure-ENID=9.SE=QRvYT6_QALX6YMeoXxaHjVpqfBfWfOiLSQyA8eXD5J6Q4cxnozeZ2Y-ygnswUdYx0GkXSzzczXXEFukuxxiKvFyzy4f40-9Mj39lpVzbZ0JFnZfNB8mlzfYUkXhERQ7pE7Nl8Y-4QzwLstrpQ7uwDjwVQ6wYkwEEDt_1KxVXzD8; CONSENT=PENDING+719; SOCS=CAESHwgCEhJnd3NfMjAyMjEyMDUtMF9SQzMaBXB0LVBUIAEaBgiAvcidBg" 
            },
            {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 OPR/94.0.0.0",
                'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,pt-PT;q=0.8,pt;q=0.7',
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Chromium\";v=\"108\", \"Opera\";v=\"94\", \"Not)A;Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                'cache-control': 'max-age=0',
                'dnt': '1',
                'referer': "https://scholar.google.com/",
                'cookie': "CONSENT=PENDING+822; SOCS=CAESHwgCEhJnd3NfMjAyMjEyMDUtMF9SQzMaBXB0LVBUIAEaBgiAvcidBg; AEC=AakniGPYHAjzwIWKbAWoiRyKMJpSX-OYp3e9MkQTBI_ahOBBUAhFsDUrcA; __Secure-ENID=9.SE=YwtLeJ68THAqh4_edb1ioe9K6pHSz0UyacFHbVcoZQ4tnwps79PxcI7WgThZc8V0D-yLgN8s9HEqTRkPkB8ouAAxokL8GGkgtdSPBYEPr76M6GJ-RasUpnwmP8BfHFB9QpNgOYk2TL50cxE3dE-v_hqU7PxrFL3XmZP9xh1259s"
            },
            {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54",
                'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,pt-PT;q=0.8,pt;q=0.7',
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108.0.5359.125\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                'cache-control': 'max-age=0',
                'dnt': '1',
                'referer': "https://scholar.google.com/",
                'cookie': "NID=511=qTJ3QdbW4nojiNn1exx89hdK5bzlA5lkjk1oeGzd7rD2SZ83a4uDW-PebQFvCjnxfO-ZNjUrPWShV0itatX8fN6YSfPIuYeeJcg3I-YyphU_x80u75yAI9WQ-79DYcE0jZTuHNDG-4ZTYwZkQLQvMoGrqTY-qdEmtKFZi4nVX98"
            },
            {
                "user-agent": "Mozilla/5.0 (Linux; Android 10; MAR-LX1A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36",
                'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,pt-PT;q=0.8,pt;q=0.7',
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                'cache-control': 'max-age=0',
                'dnt': '1',
                'referer': "https://scholar.google.com/",
                'cookie': "CONSENT=PENDING+923; SOCS=CAESHwgBEhJnd3NfMjAyMjExMjEtMF9SQzMaBXB0LVBUIAEaBgiAupqcBg; GSP=LM=1670281526:S=AJo9wjmu_aylkgVl; SID=SQi5wc4QxpsP_7ksQ-hg6BzfQNWHweTlbkxmkGVq_di10j9f99Bwc6gmWjj77WTnFF4qDA.; __Secure-1PSID=SQi5wc4QxpsP_7ksQ-hg6BzfQNWHweTlbkxmkGVq_di10j9fpZJI2BlDshjWk1an9KlqZQ.; __Secure-3PSID=SQi5wc4QxpsP_7ksQ-hg6BzfQNWHweTlbkxmkGVq_di10j9fGmvUIvj-XrsSCxK-UtgHfg.; HSID=A9ruhIi7ADnvTtoJ3; SSID=AMzbRC0VfUXCGy-sE; APISID=AgxkG0SxwjpbMQax/AIdWTqNRpoyp-jEE6; SAPISID=0O1n7lX7pGW15NOT/ATV5ghUnzVRKgyrk4; __Secure-1PAPISID=0O1n7lX7pGW15NOT/ATV5ghUnzVRKgyrk4; __Secure-3PAPISID=0O1n7lX7pGW15NOT/ATV5ghUnzVRKgyrk4; SEARCH_SAMESITE=CgQIpJcB; AEC=ARSKqsJnm1GUWXE7mNP7NlwLivaF6xgUcL7nuxJrXkKglezYOrVQeUCSxQ; NID=511=p0XlQL_BeH7LUjjCzqONlFnYVaZ6W5B1wT_PH0zp42uwpLnCszGvCndrXZm7eXxc5vJOJw7iV7xx5Gklic5V9nNugeIfsYxq2AYnXT3LMxsj_xzgt3HxR6bJQDmigZnbZPxNthNQAZQ8OWEG93tEjLkju1IZXhP_Ik4LgMQd5xtTMUY8NFM2DdlICygnYUW_g33tOnewozi2f5LUaMBILge0IaW_hlzFhaJA3GLlcjhMvIs0H1OKp8wB25CbFRAfYO-2Q_p4I7h8sQXO3YTIiLPG4UkZNWInHrjZzXofXMt9pfkJUR4RA9AD_opa_ch0UMcc8_6-_NC2ELH4B0f2zcMMUgDSQo_5KVcKB88Hlg; 1P_JAR=2023-1-9-12; __Secure-ENID=9.SE=CbVbc7L8KGgbo4Hefh697AhdA0IArslgYEFZ3-AYEnIYDBcZE1UAffkeErRnmXq-wQIi4kVjPQGqe17SGHqDv7OtrCnAjeIelvRq8KYMFZ1-g8vtk04h7BMALpTNufxCGFwCk0NL2Pk3BgqfcYll8Gz1HpMY63q_FiwffyDuOZItDBwDvwNEFZQiXL1JD49yOdyi_u--vRziPuaE3CHeTDbuAffjI2VWIBGI2b_H0xhDqyrZgLFNckqwL2y896isPTIM-78T3JWfMVLW0QxCAOHATtELgCkAxAp2KPzpGsnrhPYq0LM6E3NYnWzvl4wWgiGWgnaT; SIDCC=AIKkIs06GjESnBR1sCdhbik8G69fnYQMg4c7uuLNyU9Ckt2gjPX2Bpk-ssrYMC86QCf1RNUY53A; __Secure-1PSIDCC=AIKkIs3reAYyrJKHQ2k-GDPuCnIdws2hQ2Wnc7Va-6Pg1fzE-3CZIXmznUIjEogR3A2i5qxHriY; __Secure-3PSIDCC=AIKkIs0mmumaxQG31y6s_uQ9WakWYWV5KbNmumtKoFbCblmzAhGzL2m8eLYAt6OKMEeYXWvveQ"
            }
        ]

    def start_requests(self):

        jsonFile = open('../data/linkscraper_output/links.json')
        data = json.load(jsonFile)

        jsonFile2 = open('../data/scraperAPIKey.json')
        data2 = json.load(jsonFile2)

        sortedData = sorted(data, key=lambda d: d['index']) 
        for pub in sortedData:
            englishLink = pub['link'] + "&hl=en"

            if(data2['useScraperAPISpidersFlag'] == 1):
                yield scrapy.Request(url=get_scraperapi_url(englishLink, data2['key']), callback=self.parse, cb_kwargs={'publication': pub, 'pubLink': englishLink})

            else:
                yield scrapy.Request(url=englishLink, callback=self.parse, headers=self.headers[random.randint(0, 4)], cb_kwargs={'publication': pub, 'pubLink': englishLink})
            

    def parse(self, response, publication, pubLink):
        pub = {}   
        pub['author'] = publication['author']
        pub['affiliation'] = publication['affiliation']
        pub['start_research_year'] = publication['start_research_year']
        pub['end_research_year'] = publication['end_research_year']
        pub['graduation_year'] = publication['graduation_year']
        pub['status'] = publication['status']
        pub['google_scholar_link'] = publication['google_scholar_link']
        pub['previous_cmu_advisor'] = publication['previous_cmu_advisor']
        pub['cmu_advisor'] = publication['cmu_advisor']
        pub['previous_pt_advisor'] = publication['previous_pt_advisor']
        pub['pt_advisor'] = publication['pt_advisor']
        pub['type'] = publication['type']
        pub['research_area'] = publication['research_area']
        pub['research_area_acronym'] = publication['research_area_acronym']
        pub['title'] = publication['title']    
        pub['publication_year'] = publication['year']
        pub['authors'] = response.css('div.gsc_oci_value::text').get()
        
        bars = []
        years = []
        for bar in response.css('a.gsc_oci_g_a'):
            barLink = bar.attrib['href']
            result = re.search('yhi=(.*)', barLink)
            
            barYear = re.sub('yhi=', '', result.group())
            years.append(barYear)
            bars.append(bar.css('span.gsc_oci_g_al::text').get())

        pub['bars'] = bars
        pub['years'] = years
        
        pub_type = response.xpath('/html/body/div/div[7]/div[2]/div/div[2]/div[3]/div[1]/text()').extract()

        pub['pub_type'] = ''
        if(len(pub_type) != 0):
            if(pub_type[0] == 'Conference'):
                pub['pub_type'] = 'inproceedings'
            elif(pub_type[0] == "Journal"):
                pub['pub_type'] = 'article'
            elif(pub_type[0] == "Book"):
                pub['pub_type'] = 'incollection'

        pub['pub_link'] = ''
        pub['pub_DOI'] = ''
        pub_link = response.xpath('/html/body/div/div[7]/div[2]/div/div[1]/div[1]/div/a')
        if(len(pub_link) != 0):
            pub['pub_link'] = pub_link.attrib['href']
            
            pub_DOI = response.xpath('/html/body/div/div[7]/div[2]/div/div[1]/div[2]/a/@href').extract() 
            if(len(pub_DOI) != 0):
                pub['pub_DOI'] = pub_DOI[0]        
        else:
            pub_DOI = response.xpath('/html/body/div/div[7]/div[2]/div/div[1]/div/@href').extract() 
            if(len(pub_DOI) != 0):
                pub['pub_DOI'] = pub_DOI[0]
            else:
                pub_DOI = response.xpath('/html/body/div/div[7]/div[2]/div/div[1]/div/a/@href').extract() 
                if(len(pub_DOI) != 0):
                    pub['pub_DOI'] = pub_DOI[0]

        pub['pub_scholar_link'] = pubLink

        pub['image'] = publication['image']
        
        pub['index'] = publication['index']

        yield pub

