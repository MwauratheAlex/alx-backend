#!/usr/bin/env python3
"""This module contains the function index_range and the class Server"""
import csv
import math
from typing import Tuple, List, Dict


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    returns a tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list
    for those particular pagination parameters.
    """
    end_idx = page * page_size
    start_idx = end_idx - page_size

    return (start_idx, end_idx)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        paginates  self.__dataset
        and return the appropriate page of the dataset
        (i.e. the correct list of rows).
        """
        assert (type(page) == int and page > 0)
        assert (type(page_size) == int and page_size > 0)

        indexes = index_range(page, page_size)
        start_idx = indexes[0]
        end_idx = indexes[1]

        if end_idx >= len(self.dataset()):
            return []

        return self.dataset()[start_idx: end_idx]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """
        Fetches data and returns a dictionary containing
        various details about pagination and the data itself.

        Returns:
            Dictionary containing the following key-value pairs:
            - 'page_size': the length of the returned dataset page
            - 'page': the current page number
            - 'data': the dataset page
            - 'next_page': number of the next page, None if no next page
            - 'prev_page': number of the previous page,
                None if no previous page
            - 'total_pages': the total number of pages in the dataset
        """

        data = self.get_page(page, page_size)
        start, end = index_range(page, page_size)

        return {
                "page_size": len(data),
                "page": page,
                "data": data,
                "next_page": (page + 1) if end < len(self.dataset()) else None,
                "prev_page": (page - 1) if start > 0 else None,
                "total_pages": math.ceil(len(self.dataset()) / page_size)
                }
