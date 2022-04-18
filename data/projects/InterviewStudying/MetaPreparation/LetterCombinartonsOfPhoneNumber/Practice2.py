#!/usr/bin/python3
problems = [
    ["23"],
    [""],
    ["2"]
]
# TIME: O(n*4n)

def letterCombinations(digits):
    # TODO: Hard code a map
    #           NOTE: This is done because we have cases were the chars a number
    #                   maps to isn't consistent. Ex. 7 has 4 chars, not 3
    digit_to_char = {
        "2": "abc",
        "3": "def",
        "4": "ghi",
        "5": "jkl",
        "6": "mno",
        "7": "pqrs",
        "8": "tuv",
        "9": "wxyz"
    }

    # TODO: Return res
    res = []

    # TODO: Since we are backtracking, add a nested function
    def backtracking(i, current_string):
        # TODO: Check if we're done iterating
        if len(current_string) == len(digits):
            res.append(current_string)
            return

        # TODO: Iterate through every char and recursively call backtracking
        for char in digit_to_char[digits[i]]:
            backtracking(i+1, current_string+char)

    # TODO: Check if digits exist so that backtracking function is called
    if digits:
        backtracking(0, "")

    return res

if __name__ == "__main__":
    for problem_num, problem in enumerate(problems):
        print("{}: {}".format(problem_num, problem[0]))
        print(letterCombinations(problem[0]))
        print("\n\n")
