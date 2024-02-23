#!/usr/bin/env python3
"""LFUCache module"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """LFU caching system"""

    def __init__(self):
        super().__init__()
        self.key_use_frequecy = {}
        self.min_frequecy_key = {}
        self.access_order = []

    def put(self, key, item):
        """Add item to cache"""
        if not (key and item):
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            self.key_use_frequecy[key] += 1
            self.access_order.remove(key)
            self.access_order.insert(0, key)
            return

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            min_freq = min(self.key_use_frequecy.values())
            min_freq_keys = [
                k for k, v in self.key_use_frequecy.items()
                if v == min_freq
            ]
            discard_key = ""
            while True:
                discard_key = self.access_order.pop()
                self.access_order.insert(0, discard_key)
                if discard_key in min_freq_keys:
                    break
            del self.cache_data[discard_key]
            del self.key_use_frequecy[discard_key]
            print(f"DISCARD: {discard_key}")

        self.key_use_frequecy[key] = 1
        self.cache_data[key] = item
        self.access_order.insert(0, key)

    def get(self, key):
        """Get item from cache"""
        if key in self.cache_data:
            self.key_use_frequecy[key] += 1
            self.access_order.remove(key)
            self.access_order.insert(0, key)
            return self.cache_data[key]
        return None
