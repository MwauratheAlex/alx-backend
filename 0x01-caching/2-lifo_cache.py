#!/usr/bin/python3
""""LIFO Caching module"""

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """implements a LIFO Caching system"""

    def __init__(self):
        """Initialize"""
        super().__init__()
        self.keys = []

    def put(self, key, item):
        """ Add an item in the cache"""
        if key is None or item is None:
            return
        if key in self.cache_data:
            self.cache_data[key] = item
        else:
            if len(self.keys) >= BaseCaching.MAX_ITEMS:
                newest_key = self.keys.pop()
                del self.cache_data[newest_key]
                print("DISCARD: {}".format(newest_key))
            self.cache_data[key] = item
            self.keys.append(key)

    def get(self, key):
        """ Get an item by key"""
        return self.cache_data.get(key, None)
