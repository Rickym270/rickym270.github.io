#!/usr/bin/python3
problems = [
    ["23"],
    [""],
    ["2"]
]
# TIME: O(n*4n)

def letterCombinations(digits):
    # TODO: Return result - Going to hold the potential combinations
    res = []
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

    # TODO: Create a nested function so we don't have to provide the vars
    #           again
    # TODO: Pass in i that will tell the current string we are iterating
    #           through
    #       Pass in current string that we are building
    def backtracking(i, current_string):
        # TODO: If the current_string is equal to the number of digits
        #           This means we have been able to take every single digit
        #               and mapped it to a character
        if len(current_string) == len(digits):
            res.append(current_string)
            return
        # TODO: This runs if we haven't finished building the current string
        for char in digit_to_char[digits[i]]:
            backtracking(i+1, current_string + char)

    # TODO: We only call the backtracking method if digits is not empty
    if digits:
        backtracking(0, "")

    return res

if __name__ == "__main__":
    for problem_num, problem in enumerate(problems):
        print("{}: {}".format(problem_num, problem[0]))
        print(letterCombinations(problem[0]))
        print("\n\n")
