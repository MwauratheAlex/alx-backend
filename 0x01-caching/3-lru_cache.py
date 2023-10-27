#!/usr/bin/python3
"""LRUCache module"""
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """Implements LRU caching system"""
    def __init__(self):
        """Initialize"""
        super().__init__()
        self.access_order = []

    def put(self, key, item):
        """ Add an item in the cache"""
        if key is None or item is None:
            return
        if key in self.cache_data:
            self.cache_data[key] = item
            self.access_order.remove(key)
            self.access_order.insert(0, key)
        else:
            if len(self.access_order) >= BaseCaching.MAX_ITEMS:
                least_recent_key = self.access_order.pop()
                del self.cache_data[least_recent_key]
                print("DISCARD: {}".format(least_recent_key))
            self.cache_data[key] = item
            self.access_order.insert(0, key)

    def get(self, key):
        """ Get an item by key"""
        if key in self.cache_data:
            self.access_order.remove(key)
            self.access_order.insert(0, key)
            return self.cache_data[key]
        return None
