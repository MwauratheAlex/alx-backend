#!/usr/bin/python3
"""FIFOCache module"""

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """Implements a FIFO Cache System"""
    def __init__(self):
        super().__init__()
        self.keys = []

    def put(self, key, item):
        """ Add an item in the cache"""
        if (key is None) or (item is None):
            return
        if key in self.cache_data:
            self.cache_data[key] = item
        else:
            if len(self.keys) >= BaseCaching.MAX_ITEMS:
                oldest_key = self.keys.pop(0)
                del self.cache_data[oldest_key]
                print("Discard: {}".format(oldest_key))
            self.keys.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key"""
        return self.cache_data.get(key, None)
