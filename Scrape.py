from playwright.sync_api import sync_playwright
from typing import Dict
import jmespath

def getTweetContents(data: Dict) -> Dict:
   result = jmespath.search(
      """{
      text: legacy.full_text
   }""",
      data
   )
   return result

def scrape(url: str) -> dict:
   _xhr_calls = []

   def interceptResponse(response):
      if response.request.resource_type == "xhr":
         _xhr_calls.append(response)
      return response

   with sync_playwright() as pw:
      browser = pw.chromium.launch(headless=True)
      context = browser.new_context(viewport={"width": 1920, "height": 1080})
      page = context.new_page()

      page.on("response", interceptResponse)
      page.goto(url)
      page.wait_for_selector("[data-testid='tweet']")
      tweet_calls = [f for f in _xhr_calls if "TweetResultByRestId" in f.url]
      for xhr in tweet_calls:
         data = xhr.json()
         return data['data']['tweetResult']['result']
   

if __name__ == '__main__':  
   data = scrape('https://twitter.com/hashtag/Python')
   result = getTweetContents(data)
   print(result['text'])