#!/usr/bin/python3
problems = [[
    "barfoothefoobarman", ["foo", "bar"]    # Returns [0,9]
    ]
]

def continuousSubstrings(s, words):
    # TODO: Init word map and indeces
    indices = []
    word_map = {}

    # TODO: EDGE CASE: s and words are empty
    if s is None or len(s) == 0 or words is None or len(words) == 0:
        return indices

    # TODO: Populate the word map, based on the 'words'
    for word in words:
        if word not in word_map:
            word_map[word] = 1
        else:
            word_map[word] += 1

    # TODO: Get length of word and length of all words in word
    word_length = len(words[0])
    words_array_length = word_length * len(words)

    # TODO: Iterate in chunks
    for i in range(0, len(s) - words_array_length + 1):
        # TODO: Get current substring
        current = s[i: i + words_array_length]
        #TODO Init word map, index and second pointer
        substring_map = {}
        index = 0
        j = 0

        # TODO: Create wordmap of words in substring
        while index < len(words):
            part = current[j: j + word_length]
            if part in substring_map:
                substring_map[part] += 1
            else:
                substring_map[part] = 1

            # TODO: Since while loop, update index vars
            j += word_length
            index += 1

        # TODO: If word map is equal to the substring map, add current index to
        #           indeces
        if word_map == substring_map:
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
