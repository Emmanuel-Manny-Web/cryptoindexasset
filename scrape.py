
"""
from bs4 import BeautifulSoup
import requests


source = requests.get('https://web.archive.org/web/20030403211953/http://www.jcntv.com/images/english.jpg').text

code = BeautifulSoup(source, 'lxml')

# print(code.prettify())

# Prettify to help format the html code
formatted_code = code.prettify()

# Writes scraped website to an existing file
f = open("jcntv/original_scrape/click_to_enlarge_church_schedule.html", "w", encoding="utf-8")
f.write(formatted_code)
f.close()



"""



from bs4 import BeautifulSoup
import requests

source = requests.get('https://www.cryptoindexmarkets.com/').text

code = BeautifulSoup(source, 'lxml')

# print(code.prettify())

# Prettify to help format the html code
formatted_code = code.prettify()

# Writes scraped website to an existing file
# f = open("click_to_enlarge_church_schedule.html", "w", encoding="utf-8")
f = open("original_scrape/index.html", "w+", encoding="utf-8")
f.write(formatted_code)
f.close()