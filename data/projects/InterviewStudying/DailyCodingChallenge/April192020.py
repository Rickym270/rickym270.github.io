#!/usr/bin/python3
'''
    Given the mapping a = 1, b = 2, ... z = 26, and an encoded message, count the number of ways it can be decoded.

    For example, the message '111' would give 3, since it could be decoded as 'aaa', 'ka', and 'ak'.

    You can assume that the messages are decodable. For example, '001' is not allowed.
'''

char_map = {
    "a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8,
    "i": 9, "j": 10, "k": 11, "l": 12, "m": 13, "n": 14, "o": 15,
    "p": 16, "q": 17, "r": 18, "s": 19, "t": 20, "u": 21, "v": 22,
    "w": 23, "x": 34, "y": 25, "z": 26
}
msg = "111"

'''
This problem is recursive and can be broken into sub-problems. We start from the end of the given digit sequence. 
We initialize the total count of decodings as 0. We recur for two sub-problems. 
1) If the last digit is non-zero, recur for the remaining (n-1) digits and add the result to the total count. 
2) If the last two digits form a valid character (or smaller than 27), recur for remaining (n-2) digits and add the 
result to the total count.
'''
def count_decode(digits):
    # TODO: Save len of digits
    n = len(digits)
    # TODO: Create DS to hold counts
    count = [0] * (n+1)
    # TODO: Init beginning to current count
    count[0] = 1
    count[1] = 1

    # TODO Iterate from 2 - n + 1
    for i in range(2, n+1):
        # TODO: Reset current count
        count[i] = 0

        # TODO: Check if last digit is > 0
        if digits[i-1] > 0:
            count[i] = count[i-1]

        # TODO: Check if within bounds
        if count[i-2] == 1 or (count[i-2] == 2 and count[i-1] < 7):
            count[i] += count[i-2]

    return count[n]

if __name__ == "__main__":
    print(count_decode(msg))
