'''
    DYNAMIC SIZED WINDOW + AUXILLARY DS
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Return longest subtring length with K distinct characters
    [A, A, A, H, H, I, B ,C], K = 2
'''

# Return 5
def longestDistinctSubstring(array, k):
    # TODO: Initialize frequencyMap, windowStart and longestSubstringLength
    windowStart = 0
    longestSubstringLength = 0
    frequencyMap = {}

    # TODO: Populate frequency map
    for windowEnd in range(len(array)):
        rightChar = array[windowEnd]
        if rightChar not in frequencyMap:
            frequencyMap[rightChar] = 0
        frequencyMap[rightChar] += 1

        # TODO: While creating the frequency map, if there are more than 2 elements, run the following
        while len(frequencyMap) > k:
            leftChar = array[windowStart]
            # TODO: Since we are accounting for leftChar, subtract 1 which reduces the chars frequency
            frequencyMap[leftChar] -= 1
            # TODO: If the frequency is zero, remove the entry. We no longer care about this value
            if frequencyMap[leftChar] == 0:
                frequencyMap.pop(leftChar, None)
            windowStart += 1
        longestSubstringLength = max(longestSubstringLength, windowEnd - windowStart + 1)
    return longestSubstringLength

if __name__ == "__main__":
    print(longestDistinctSubstring(["A", "A", "A", "H", "H", "I", "B", "C"], 2))
