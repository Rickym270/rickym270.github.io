#!/usr/bin/python3
'''
    This was presented to me on my daily coding challenges:
	Implement an autocomplete system. That is, given a query string s and a set of
	all possible query strings, return all strings in the set that have s as a prefix.

	For example, given the query string de and the set of strings [dog, deer, deal],
	return [deer, deal].
	Hint: Try preprocessing the dictionary into a more efficient data structure to
	speed up queries.

    apple aaplication
        a
        |
        p
        |
        p
        |
        l
       / \
      e   i
           \
            c
             \
              a
               \
                t
                 \
'''

# TODO: Define the base node
class Node:
    def __init__(self):
        # TODO: Define the neighbors
        self.children = []
        self.is_end = False

# TODO: Define the tree structure
class Trie:
    def __init__(self):
        # TODO: Define the initial node
        self.root = Node()

    def form_trie(self, arr):
        # TODO: Form a trie from the given arr
        for entry in arr:
            # TODO: Check if the entry is within self.root
            if entry not in self.root:
                self.insert(entry)

    def insert(self, val):
        # TODO: Since we are inserting, create a reference to
        #           current node
        node = self.root

        # TODO: Iterate through the val
        for char in val:
            # TODO: Check if char is in the nodes children
            if char not in node.children:
                # TODO: Create a new node at the child
                node.children[char] = Node()
            # TODO: Equate the node to the new node with the
            #           newly inserted node
            node = node.children[char]
        # TODO: For all we know, we are at the end of the word
        node.is_end = True

    def find_suggestion(self, word):
        # TODO: Create a reference to the current node
        node = self.root

        # TODO: Iterate through each char of word
        for char in word:
            # TODO: If char doesn't exist
            if not node.children[char]:
                # TODO: No node was found, return 0
                return 0
            # TODO: Travel down the trie
            node = node.children[char]

        # TODO: Check if the node has any children
        if not node.children:
            return -1
        # TODO: Recursively find the suggestion
        self.recursive_suggestion(node, word)
        return 1

    def recursive_suggestion(self, node, word):
        # TODO: If we are at the end, return the value given
        if node.is_end:
            return word

        for n, v in node.children.items():
            # TODO: Call the function again
            self.recursive_suggestion(n, word + v)
