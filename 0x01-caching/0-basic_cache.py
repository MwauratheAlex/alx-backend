#!/usr/bin/python3
"""BasicCache module"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """Implements a basic caching system"""
    def __init__(self):
        super().__init__()

    def put(self, key, item):
        """ Add an item in the cache"""
        if (key is not None) and (item is not None):
            self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key"""
        return self.cache_data.get(key, None)
