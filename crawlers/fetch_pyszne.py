from bs4 import BeautifulSoup
import re    
import json, _jsonnet
import requests
import demjson
import time
import sys


def fetch_restaurant(entry):
  restaurant = {}

  restaurant["id"] = str( entry[0] )
  restaurant["minimal_order"] = str( entry[10] )
  restaurant["delivery_cost"] = str( entry[14] )
  restaurant["avgdeliverytime"] = str( entry[19] )
  restaurant["url"] = "https://www.pyszne.pl" + str( entry[30]["url"] )

  soup = BeautifulSoup(requests.get(restaurant["url"]).content, "html.parser")

  restaurants_data = json.loads(soup.find('script', type='application/ld+json').text)

  restaurant["name"] = restaurants_data["name"]
  restaurant["telephone"] = restaurants_data["telephone"]

  if ("address" in restaurants_data):
    restaurant["street"] = restaurants_data["address"]["streetAddress"]
    restaurant["city"] = restaurants_data["address"]["addressLocality"]
    restaurant["region"] = restaurants_data["address"]["addressRegion"]
    restaurant["postalCode"] = restaurants_data["address"]["postalCode"]
    restaurant["country"] = restaurants_data["address"]["addressCountry"]

  if ("aggregateRating" in restaurants_data):
    restaurant["rating"] = restaurants_data["aggregateRating"]["ratingValue"]
    restaurant["numberOfVotes"] = restaurants_data["aggregateRating"]["reviewCount"]
    restaurant["best_rating"] = restaurants_data["aggregateRating"]["bestRating"]

  if ("geo" in restaurants_data):
    restaurant["latitude"] = restaurants_data["geo"]["latitude"]
    restaurant["longitude"] = restaurants_data["geo"]["longitude"]

  restaurant["dishes"] = fetch_dishes(soup)

  return restaurant



def fetch_restaurant_all_from_url(url):
  restaurant = {}

  soup = BeautifulSoup(requests.get(url).content, "html.parser")

  restaurants_data = json.loads(soup.find('script', type='application/ld+json').text)

  restaurant["name"] = restaurants_data["name"]
  restaurant["telephone"] = restaurants_data["telephone"]
  restaurant["url"] = url

  if ("address" in restaurants_data):
    restaurant["street"] = restaurants_data["address"]["streetAddress"]
    restaurant["city"] = restaurants_data["address"]["addressLocality"]
    restaurant["region"] = restaurants_data["address"]["addressRegion"]
    restaurant["postalCode"] = restaurants_data["address"]["postalCode"]
    restaurant["country"] = restaurants_data["address"]["addressCountry"]

  if ("aggregateRating" in restaurants_data):
    restaurant["rating"] = restaurants_data["aggregateRating"]["ratingValue"]
    restaurant["numberOfVotes"] = restaurants_data["aggregateRating"]["reviewCount"]
    restaurant["bestRating"] = restaurants_data["aggregateRating"]["bestRating"]

  if ("geo" in restaurants_data):
    restaurant["latitude"] = restaurants_data["geo"]["latitude"]
    restaurant["longitude"] = restaurants_data["geo"]["longitude"]

  category_id_to_name = fetch_categories(soup)
  restaurant["dishes"] = fetch_dishes(soup, category_id_to_name)

  return restaurant



def fetch_categories(soup):
  category_id_to_name = {}
  category_li_id = soup.find('ul', {'class': 'menu-category-list'}).find_all("li")

  for el in category_li_id:
    cat_id = el.get("id")
    cat_value = el.find("a").text

    if cat_id.startswith("nc"):
      cat_id = cat_id[2:]

    category_id_to_name[cat_id] = cat_value

  return category_id_to_name



def fetch_dishes(soup, category_id_to_name):
  dishes_list = []

  meals = soup.find_all("div", { "class": "meal"})

  for meal_i, meal in enumerate(meals):
    dish = {}
    dish["productId"] = meal.find("input", {"name": "product"}).get("value")
    dish["name"] = meal.find("span", { "class": "meal-name" } ).text.strip()
    dish["price"] = meal.find("span", { "itemprop": "price"}).text.strip()

    dish["sidedishes"] = []

    #if (meal_i == 0):
    productId = dish["productId"]
    domid = meal.find("input", {"name": "domid"}).get("value")
    menucat = meal.find("input", {"name": "menucat"}).get("value")
    rest = meal.find("input", {"name": "rest"}).get("value")

    dish["category"] = category_id_to_name[menucat]

    dish["sidedishes"] = fetch_sidedishes(productId, domid, menucat, rest)

    dishes_list.append(dish)

  return dishes_list



def fetch_sidedishes(productId, domid, menucat, rest):
  sidedishes_list = []

  sidedishes_url = "https://www.pyszne.pl/xHttp/showSidedishes.php"
  
  sidedish_post_data = {
    "action": "add", 
    "product": productId, 
    "domid": domid, 
    "menucat": menucat, 
    "rest": rest
  }
  
  sidedish_soup = BeautifulSoup(requests.post(sidedishes_url, data = sidedish_post_data).content, "html.parser")

  for sidedish in sidedish_soup.find_all("div", {"class": "sidedish"}):
    for span in sidedish.find_all("span"):
      
      side_dish = {}
      
      span_text = span.text.strip()

      if (span_text):
        values = re.match(r'(.*)\((.*)\)', span_text)

        if (values):
          side_dish["name"] = values.group(1)
          side_dish["price"] = values.group(2)[1:]
        else:
          side_dish["name"] = span_text

        sidedishes_list.append(side_dish)

  return sidedishes_list


# 
# Program start
# 

if (len(sys.argv) == 2):
  restaurant = fetch_restaurant_all_from_url(sys.argv[1])

  restaurant_file_name = "restaurants/" + restaurant["name"].replace(" ", "_") + ".json"
  restaurant_file = open(restaurant_file_name, "w")

  restaurant_file.write(json.dumps(restaurant))

  restaurant_file.close()
  
  sys.exit(0)
else:
  all_restaurants_from_region_url = "https://www.pyszne.pl/restauracja-krakow-krakow-krowodrza-31-321"

  all_restaurants_soup = BeautifulSoup(requests.get(all_restaurants_from_region_url).content, "html.parser")

  script_text = all_restaurants_soup.find("script", text=re.compile("var\s+restaurants")).text.split("= ", 1)[1]
  restaurants_text = script_text[:script_text.find(";")].replace("\n", " ")

  restaurants_data = json.loads(_jsonnet.evaluate_snippet('snippet', restaurants_text))

  for restaurant_i, entry in enumerate(restaurants_data):
    print("Restaurant: " + str(entry[30]["url"]))

    restaurant = fetch_restaurant(entry)

    restaurant_file_name = "restaurants/" + restaurant["name"].replace(" ", "_") + ".json"
    restaurant_file = open(restaurant_file_name, "w")

    restaurant_file.write(json.dumps(restaurant))

    restaurant_file.close()
    
    time.sleep(1)


