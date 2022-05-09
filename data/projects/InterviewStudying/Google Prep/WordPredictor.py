#!/usr/bin/python3
data = [
    ["I", "am", "Sam"],
    ["Sam", "I", "am"],
    ["I", "like", 'green', 'eggs', 'and', 'ham']
]
word = "I"

# TODO: Find current char
def word_predictor(word):
    # TODO: Base case
    if not word or len(word) == 0:
        return None
    # TODO: Find the word after the char
    # TODO: Keep a hashmap of combinations
    seen = {}
    rel_word = -1
    next_word = -1
    # TODO: Iterate through data
    for dataset in data:
        # TODO: Check if word is present in dataset
        if word not in dataset:
            continue

        # TODO: Get index of current word
        rel_word = dataset.index(word)
        # TODO: Get next word
        if rel_word + 1 < len(data):
            next_word = rel_word + 1

        words = "{} {}".format(dataset[rel_word], dataset[next_word])

        # TODO: Populate the seen map
        if words not in seen:
            seen[words] = 1
        seen[words] += 1
    # TODO: Increment the count of the word after the inputed char O(n)
    return max(seen, key=seen.get).split()[-1]

if __name__ == "__main__":
    print(word_predictor(word))
