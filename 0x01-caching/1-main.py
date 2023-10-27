#!/usr/bin/python3

""" 1-main """
FIFOCache = __import__('1-fifo_cache').FIFOCache
BaseCaching = __import__('base_caching').BaseCaching

print("max:", BaseCaching.MAX_ITEMS)

BaseCaching.MAX_ITEMS = 1
my_cache = FIFOCache()
my_cache.put("A", "Hello")
my_cache.put("B", "World")
my_cache.put("C", "Holberton")
my_cache.put("D", "School")
my_cache.print_cache()
my_cache.put("E", "Battery")
my_cache.print_cache()
my_cache.put("C", "Street")
my_cache.print_cache()
my_cache.put("F", "Mission")
my_cache.print_cache()
