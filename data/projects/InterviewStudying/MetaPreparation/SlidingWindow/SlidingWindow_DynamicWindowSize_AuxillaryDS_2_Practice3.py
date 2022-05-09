'''
    DYNAMIC SIZED WINDOW + AUXILLARY DS
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Return longest subtring length with K distinct characters
    [A, A, A, H, H, I, B ,C], K = 2
'''

# Return 5
def longestDistinctSubstring(array, k):
    # TODO: Keep track of longestSubstringLength, windowStart, frequencyMap
    windowStart = 0
    longestSubstringLength = 0
    frequencyMap = {}

    # TODO: Populate the frequency map
    for windowEnd in range(len(array)):
        rightChar = array[windowEnd]
        if rightChar not in frequencyMap:
            frequencyMap[rightChar] = 0
        frequencyMap[rightChar] += 1

        # TODO: Iterate again while there are < k elements
        while len(frequencyMap) > k:
            leftChar = array[windowStart]
            # TODO: If no frequency, remove char
            frequencyMap[leftChar] -= 1
            if frequencyMap[leftChar] == 0:
                frequencyMap.pop(leftChar, None)
            windowStart += 1
        longestSubstringLength = max(longestSubstringLength, windowEnd - windowStart + 1)
    return longestSubstringLength

if __name__ == "__main__":
    print(longestDistinctSubstring(["A", "A", "A", "H", "H", "I", "B", "C"], 2))
