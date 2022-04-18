#!/usr/bin/python3
'''
    Given the root to a binary tree, implement serialize(root),
    which serializes the tree into a string, and deserialize(s),
    which deserializes the string back into the tree.

    For example, given the following Node class

    class Node:
        def __init__(self, val, left=None, right=None):
            self.val = val
            self.left = left
            self.right = right
    The following test should pass:

    node = Node('root', Node('left', Node('left.left')),
            Node('right'))
    assert deserialize(serialize(node)).left.left.val == 'left.left'
'''

class Node:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def serialize(node, current_string = ""):
    # TODO: Create a nested function to handle the serialization
    def do_it(node):
        # TODO: Check if node is existent
        if node:
            # TODO: Add current value into the res
            res.append(str(node.val))
            # TODO: Iterate left and right
            do_it(node.left)
            do_it(node.right)
        else:
            res.append("#")

    # TODO: Define res
    res = []
    # TODO: Call nested function
    do_it(node)

    # TODO: Return as string
    return ' '.join(res)

    # # TODO: Nested function
    # def do_it(node):
    #     if node:
    #         res.append(str(node.val))
    #         # TODO: Iterate through left and right
    #         do_it(node.left)
    #         do_it(node.right)
    #     else:
    #         res.append("#")
    # res = []
    # # TODO: Call nested function
    # do_it(node)
    # return ' '.join(res)


def deserialize(serialized_node):
    pass

if __name__ == "__main__":
    node = Node('root', Node('left', Node('left.left')),
                Node('right'))
    print(deserialize(serialize(node)).left.left.val == 'left.left')
    # assert deserialize(serialize(node)).left.left.val == 'left.left'
