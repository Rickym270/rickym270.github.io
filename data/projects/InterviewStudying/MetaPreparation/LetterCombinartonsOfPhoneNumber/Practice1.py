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

    def backtracking(i, current_string):
        # TODO: Account for base case where len(digits) == len(current_string)
        if len(digits) == len(current_string):
            res.append(current_string)
            return

        # TODO: Else, Iterate through the chars that map to that digit
        for char in digit_to_char[digits[i]]:
            # TODO: Recursively call backtracking
            backtracking(i + 1, current_string + char)

    # TODO: If digits exists, call recursive function
    if digits:
        backtracking(0, "")

    # TODO: Return res
    return res


if __name__ == "__main__":
    for problem_num, problem in enumerate(problems):
        print("{}: {}".format(problem_num, problem[0]))
        print(letterCombinations(problem[0]))
        print("\n\n")
