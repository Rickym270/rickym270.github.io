#!/usr/bin/python3
problems = [[
    "barfoothefoobarman", ["foo", "bar"]    # Returns [0,9]
    ]
]

def continuousSubstrings(s, words):
    #TODO: Return indices
    indices = []
    # TODO: Word map
    word_count = {}

    # TODO: Check if vars exist
    if s is None or len(s) == 0 or words is None or len(words) == 0:
        return indices
    # TODO: Populate a word map
    for word in words:
        if word not in word_count:
            word_count[word] = 1
        else:
            word_count[word] += 1

    # TODO: Get length of word and length of words
    word_length = len(words[0])
    # TODO: Get length of all chars in words
    word_array_length = word_length * len(words)
    # TODO: Loop through for each char in string
    for i in range(0, len(s) - word_array_length + 1):
        # TODO: Get current substring
        # NOTE: This slices the word from the current position toi the position i + word_array_length
        current = s[i: i + word_array_length]
        # TODO: Store the count of each word in the array
        word_map = {}
        index = 0
        j = 0

        # TODO: Create of a wordmap of th e words seen in the substring
        while index < len(words):
            # NOTE: From the current substring, extract the current word
            #           (based on length)
            part = current[j: j + word_length]
            if part in word_map:
                word_map[part] += 1
            else:
                word_map[part] = 1
            # TODO: Update the index vars
            j += word_length
            index += 1

        if word_map == word_count:
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
