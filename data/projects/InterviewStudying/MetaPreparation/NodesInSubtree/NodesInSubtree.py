#!/usr/bin/python3

def count_of_nodes(root, queries, s):
    # TODO: Save tree to dictionary
    dictionary = {}

    # TODO: Define dfs function
    def dfs(root, dict_count):
        # TODO: Base-case check
        if not root:
            return
        if not root.children:
            dictionary[root.val] = s[root.val - 1] #?
            return

        # TODO: Iterate through the tree
        for child in root.children:
            # TODO: Recursively call dfs to iterate through it
            dfs(child, dict_count)
            dictionary[root.val] = dictionary[child.val]

    # TODO: Inital call to dfs
    dfs(root, dictionary)
    # TODO: Init res var
    res = []

    # TODO: Iterate through queries
    for q in queries:
        # TODO: Append the result of the queries in dictionary
        res.append(dictionary[q[0]].count(q[1]))

    return res
