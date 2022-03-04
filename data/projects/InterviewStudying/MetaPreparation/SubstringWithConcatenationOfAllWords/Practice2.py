#!/usr/bin/python3
problems = [[
    "barfoothefoobarman", ["foo", "bar"]    # Returns [0,9]
    ]
]

def continuousSubstrings(s, words):
    # TODO: Init word map and indeces
    indices = []
    word_map = {}

    # TODO: Check edge case
    if s is None or len(s) == 0 or words is None or len(words) == 0:
        return indices

    # TODO: Create a word map of the current words
    for word in words:
        if word not in word_map:
            word_map[word] = 1
        else:
            word_map[word] += 1

    # TODO: Get word length and word lengths
    word_length = len(words[0])
    all_words_length = word_length * len(words)

    # TODO: Iterate through the array in chunks of all words that need to be
    #           found (from beginning to end of current substring)
    for i in range(0, len(s) - all_words_length + 1):
        current = s[i: i + all_words_length]
        # TODO: Init word map, index and second pointer
        substring_map = {}
        index = 0
        j = 0

        # TODO: Iterate through the substring as long as index is less than
        #           len of words
        while index < len(words):
            part = current[j: j+word_length]
            if part in substring_map:
                substring_map[part] += 1
            else:
                substring_map[part] = 1

            j += word_length
            index += 1

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
