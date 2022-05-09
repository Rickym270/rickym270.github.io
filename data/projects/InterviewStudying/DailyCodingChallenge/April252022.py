#!/usr/bin/python3
'''
    Given an integer k and a string s, find the length of the longest
    substring that contains at most k distinct characters.

    For example, given s = "abcba" and k = 2, the longest substring
    with k distinct characters is "bcb".
'''
s = "abcba"
k = 2

def find_distinct(s, k):
    start = 0
    end = len(s)

    while start < end:
        windowStart = 0
        windowEnd = window


if __name__=="__main__":
    print(find_distinct(s, k))
