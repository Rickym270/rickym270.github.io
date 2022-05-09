'''
    DYNAMIC SIZED WINDOW + AUXILLARY DS
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Return longest subtring length with K distinct characters
    [A, A, A, H, H, I, B ,C], K = 2
'''

# Return 5
def longestDistinctSubstring(array, k):
    # TODO: Initialize vars
    window_start = 0
    longest_substring_length = 0
    frequency_map = {}

    # TODO: Populate frequency_map and iterate through list
    for window_end in range(len(array)):
        right_char = array[window_end]
        if right_char not in frequency_map:
            frequency_map[right_char] = 0
        frequency_map[right_char] += 1

        # TODO: Iterate through the array
        while len(frequency_map) > k:
            # TODO: Save left_char
            left_char = array[window_start]
            # TODO: Refuce amount of times left_char is seen
            frequency_map[left_char] -= 1
            # TODO: If frequency of left char == 0 then remove that item from frequency map
            if frequency_map[left_char] == 0:
                frequency_map.pop(left_char, None)
            # TODO: Increment the window_start
            window_start += 1
        # TODO: Calculate the longest substring length
        longest_substring_length = max(longest_substring_length, window_end - window_start + 1)
    return longest_substring_length


    #     # TODO: Iterate through array while len is less than k
    #      while len(frequency_map)
    #         # TODO: Create a left pointer
    #
    #         # TODO: Decrement amount of time we see lp in frequency_map
    #
    #         # TODO: If value at lp is not seen in frequency_map, pop it
    #
    #         # TODO: Increment window_start to go to the next element
    #
    #     # TODO: Find the max_substring_length
    #
    # # TODO: Return longest substring length




if __name__ == "__main__":
    print(longestDistinctSubstring(["A", "A", "A", "H", "H", "I", "B", "C"], 2))
