import urllib.request
import re
try:
    req = urllib.request.Request('https://dribbble.com/shots/2656347-Stock-forecasting-web-interface', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'property="og:image" content="([^"]+)"', html)
    if match:
        print("IMG_URL:", match.group(1))
    else:
        print("No image found")
except Exception as e:
    print(e)
