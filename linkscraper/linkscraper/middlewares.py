# Define here the models for your spider middleware
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
import random

from .settings import USER_AGENTS
from .settings import SEC_CH_UA

# useful for handling different item types with a single interface
from itemadapter import is_item, ItemAdapter

class ShowRequestHeadersMiddleware:
    def process_request(self, request, spider):
        print(f"Request Headers: {request.headers}")
    def process_response(self, request, response, spider):
        print(f"Response Headers: {response.headers}")
        return response

class ChangeHeadersMiddleware:
    def process_request(self, request, spider):
        user_agent = random.randint(0, 4)
        request.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        request.headers['Accept-Encoding'] = 'gzip, deflate, br'
        request.headers['Accept-Language'] = 'pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        
        if(user_agent != 4):
            request.headers['content-type'] = 'application/x-www-form-urlencoded'
            request.headers['Sec-Ch-Ua-Mobile'] = '?0'
        
        if(user_agent == 4):
            request.headers['Sec-Ch-Ua-Mobile'] = '?1'
            request.headers['sec-ch-ua-platform'] = '\"Android\"'
        
        if(user_agent != 1):
            request.headers['Sec-Ch-Ua'] = SEC_CH_UA[user_agent]
            request.headers['sec-ch-ua-platform'] = '\"Windows\"'
        
        request.headers['Sec-Fetch-Dest'] = 'empty'
        request.headers['Sec-Fetch-Mode'] = 'cors'
        request.headers['Sec-Fetch-Site'] = 'same-origin'
        
        if(user_agent == 0):
            request.headers['sec-gpc'] = '1'
            request.headers['Coockie'] = 'CONSENT=PENDING+923; SEARCH_SAMESITE=CgQI_pYB; SOCS=CAESHwgBEhJnd3NfMjAyMjExMjEtMF9SQzMaBXB0LVBUIAEaBgiAupqcBg; GSP=LM=1670281526:S=AJo9wjmu_aylkgVl; SID=SQi5wRWN04KtvDl3zlhIzFB8hgiRjx8FduYH8DPmPVkeVaau_hGrRhkfZeRL_c5czS1mBg.; __Secure-1PSID=SQi5wRWN04KtvDl3zlhIzFB8hgiRjx8FduYH8DPmPVkeVaauxA8WTfNnJq2YefCkTNwdAw.; __Secure-3PSID=SQi5wRWN04KtvDl3zlhIzFB8hgiRjx8FduYH8DPmPVkeVaau4-f-6HONJT1-BmJhNuECcw.; HSID=AZc6xWhc4nknTanmK; SSID=Anluf8np7NrAGZ2Yg; APISID=zldB3ZKHM2tGrmyj/ANGP7mWEGbsaPXSvz; SAPISID=cYFsDzEJZZIWeOcJ/AZUydrOQE0xgYocW5; __Secure-1PAPISID=cYFsDzEJZZIWeOcJ/AZUydrOQE0xgYocW5; __Secure-3PAPISID=cYFsDzEJZZIWeOcJ/AZUydrOQE0xgYocW5; NID=511=iCSah6Q7yyQqrUcU0nihirEh-MaltrUr8-cyn8Ubq4Vcdz18yCWfQxT46fiS51hfa-mifiPVxP6JU8L9w6YleSC9EyETWbEAl5fL0jvKDkJ1Fx2JNpGSNyDiwd-QkkE-kftBzFeJqJso6x9hOn4VhzOQrlmjoQPhVRYts8O96LH9U-IdeDhhW-hE_xcyPRb-8M2t7RBvysGROLXa9jWauWX-ZtPNa8JOHpvkE1uiNEO2AknR3ya2hs0ViQK1nj0okxfOhX61YNAovmEsuH2En1J0nUUAZfG86jl9Oj2kPD04zuxIoftuDWpSLaeskJhLP7J7UjzwOxz4Oz5bZC9SApgqNzZu2KZzgUa1KV57OQ; AEC=AakniGNKRtaR7fsZxb_aRoeMe8AUn4iEiGUBJtfqk4xH6If1BJ72b9BTMQ; 1P_JAR=2023-1-4-17; __Secure-ENID=9.SE=VdtzTj67TGElmXb9Wlum922IVbb4yeF-co4I83RsqUhIeXLe0ntrcbhqC4E4WFNZvFBRl1-Nu9nrnUWDpY5QOzm3e8hIV7TCg2A-8VmUR_nCO2MfZsYeEbltnYkwaGM6eK-pwBoD11eDZQW8iOUkRtvvYKjktDtpBswGatr7tYXlsoa0X0VvkWDj5KjEaXoUbZOdWhftGM7_GdWIqfR8AUJjHtfhYPpmsa9YW43Qkr2mO8lvwafWaF0nx6JpmwCtPCirEzv4wml2UhEhy0_Ax8ogVnvn_os8TeHuWCDYG3_B9G7jcnZWLtgc42LDkB1EWViiJFKN; SIDCC=AIKkIs2eK4zeUSvFG0rZBHytyHORNWKkY9L8K-sUMXCQq__KndVkUbuN7q1ZVTu5L56IItrjzg; __Secure-1PSIDCC=AIKkIs2SdqMb8r1UNzXHFMkEA9EcsVozYUbc5rr-rFJP1m887Gs7KLGLvvNkYdRPoXAcn1uh1A; __Secure-3PSIDCC=AIKkIs36E1WiHFsPV66RSpN7yfntRdgmcEe2kngn_c9cYhN1s94Cmif_YWtbIPt3YmNCqPXr2w'
        
        request.headers['DNT'] = '1'
        request.headers['Host'] = 'httpbin.org'
        
        if(user_agent == 3):
            request.headers['Coockie'] = 'NID=511=lG-QeAIZaMpAYK5ETZvfdUIq_d5Fxh_8RYUfLfQXh2y7rirMZlTi0Oiq2I08aG0KEIxtpyxRgP2GEBeRu8ThdWJRmJ5eZPAXidjp9_vzoxZAsGAFdT_OBtacawHm5nILVO9XI7A24NFN8ZLgTvthpQzOf76oh7HzutAG7FjH0U0'
        

        request.headers['Referer'] = 'https://scholar.google.com/'
        request.headers['User-Agent'] = USER_AGENTS[user_agent]
        

class LinkscraperSpiderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, or item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Request or item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)


class LinkscraperDownloaderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called
        return None

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.

        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        pass

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)
