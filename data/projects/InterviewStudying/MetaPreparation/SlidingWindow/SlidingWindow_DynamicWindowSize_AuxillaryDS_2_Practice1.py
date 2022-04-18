'''
    DYNAMIC SIZED WINDOW + AUXILLARY DS
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Return longest subtring length with K distinct characters
    [A, A, A, H, H, I, B ,C], K = 2
'''

# Return 5
def longestDistinctSubstring(array, k):
    # TODO: Initialize vars for windowStart, longestSubstring, frequencyMap
    windowStart = 0
    longestSubstring = 0
    frequencyMap = {}
    # TODO: Populate frequency map
    for windowEnd in range(len(array)):
        rightChar = array[windowEnd]
        if rightChar not in frequencyMap:
            frequencyMap[rightChar] = 0
        frequencyMap[rightChar] += 1

        #TODO: Iterate through the array while len of frequencyMap > k
        while len(frequencyMap) > k:
            #TODO: Initialize vars to keep track of leftChar
            leftChar = array[windowStart]
            # TODO: Since the current char, leftChar is accounted for, subtract it from
            #           the frequency map
            frequencyMap[leftChar] -= 1
            # TODO: If more than k chars, remove the extra char
            if frequencyMap[leftChar] == 0:
                frequencyMap.pop(leftChar, None)
            windowStart += 1
        longestSubstring = max(longestSubstring, windowEnd - windowStart + 1
                               )
    return longestSubstring

if __name__ == "__main__":
    print(longestDistinctSubstring(["A", "A", "A", "H", "H", "I", "B", "C"], 2))
