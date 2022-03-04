'''
    DYNAMIC SIZED WINDOW + AUXILLARY DS
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Return longest subtring length with K distinct characters
    [A, A, A, H, H, I, B ,C], K = 2
'''

# Return 5
def longestDistinctSubstring(array, k):
    #TODO: Create frequency map, longestSubstring and windowStart
    windowStart = 0
    longestSubstring = 0
    frequencyMap = {}

    # TODO: Create a frequency map
    for windowEnd in range(len(array)):
        rightChar = array[windowEnd]
        if rightChar not in frequencyMap:
            frequencyMap[rightChar] = 0
        frequencyMap[rightChar] += 1
        # TODO: Iterate through the array while there are less than k distinct chars
        while len(frequencyMap) > k:
            # TODO: Get left char
            leftChar = array[windowStart]
            # TODO: Since we've accounted for leftChar, reduce it's frequency
            frequencyMap[leftChar] -= 1
            # TODO: If frequency of char has been reduced to 0, remove it
            if frequencyMap[leftChar] == 0:
                frequencyMap.pop(leftChar, None)
            # TODO: Increment window start
            windowStart += 1
        longestSubstring = max(longestSubstring, windowEnd - windowStart + 1)
    return longestSubstring



if __name__ == "__main__":
    print(longestDistinctSubstring(["A", "A", "A", "H", "H", "I", "B", "C"], 2))
