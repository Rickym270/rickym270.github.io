#!/usr/bin/python3
problems = [[
    "barfoothefoobarman", ["foo", "bar"]    # Returns [0,9]
    ]
]

def continuousSubstrings(s, words):
    # TODO: Return indices
    indices = []
    # TODO: Init word map
    word_map = {}

    # TODO: Check base case to see if s or words exist
    if s is None or len(s) == 0 or words is None or len(words) == 0:
        return indices

    # TODO: Populate word map
    for word in words:
        if word not in word_map:
            word_map[word] = 1
        else:
            word_map[word] += 1

    # TODO: Calculate length of word and total length of words
    word_length = len(words[0])
    total_word_length = word_length * len(words)

    # TODO: Iterate through a substring of words
    for i in range(0, len(s) - total_word_length + 1):
        current = s[i : i + total_word_length]
        # TODO: init substring index, substring_map and j
        substring_map = {}
        index = 0
        j = 0

        while index < len(words):
            part = current[j: j+word_length]
            if part not in substring_map:
                substring_map[part] = 1
            else:
                substring_map[part] += 1

            # TODO: Increment indices
            index += 1
            j += word_length

        if substring_map == word_map:
            indices.append(i)
    return indices

if __name__ == "__main__":
    for index, problem_set in enumerate(problems):
        string = problem_set[0]
        words = problem_set[1]
        print("{}: {}, {}".format(index+1, string, words))
        print(continuousSubstrings(string, words))
        print("\n\n")
        # for num, problem in enumerate(problem_set):
        #     print("{}: {}".format(num, problem))
        #     print(continuousSubstrings(problem[0], problem[1]))
        #     print("\n\n")
