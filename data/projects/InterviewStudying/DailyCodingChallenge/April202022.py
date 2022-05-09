'''
    A unival tree (which stands for "universal value") is a tree where all nodes under it have the same value.
    Given the root to a binary tree, count the number of unival subtrees.
    For example, the following tree has 5 unival subtrees:

       0
      / \
     1   0
        / \
       1   0
      / \
     1   1
'''
# TODO: Define the Node
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.root = None

# TODO: Define a function that takes in a root and count
def count_unival_subtrees_helper(root, count):
    # TODO: Perform base check
    if not root:
        return 0

    left = count_unival_subtrees_helper(root.left, count)
    right = count_unival_subtrees_helper(root.right, count)

    # TODO: Check if unival
    if left and root.left.data != root.data:
        return False
    if right and root.right.data != root.data:
        return False

    count[0] += 1
    return True

# TODO: Define a function that takes in a root
def count_unival_subtrees(root):
    count = [0]
    if not root:
        return 0

    count_unival_subtrees_helper(root, count)
    return count[0]

class Node:
    def __init__(self, data):
        self.data = data
        self.right = None
        self.left = None

def count_unival_subtrees_helper(root, count):
    # TODO: Check root is not None
    if root is None:
        return 0

    # TODO: Search left and right
    left = count_unival_subtrees_helper(root.left, count)
    right = count_unival_subtrees_helper(root.right, count)

    # TODO Check if left or right exist
    if left == None or right == None:
        return False

    # TODO: Check left side matches current
    if left and root.left.data != root.data:
        return False
    if right and root.right.data != root.data:
        return False

    count[0] += 1
    return True

def count_unival_subtrees(root):
    # TODO: Start the count
    count = [0]
    # TODO: Call helper function
    count_unival_subtrees_helper(root, count)

    return count[0]


if __name__ == "__main__":
    """Let us construct the below tree
                5
              /   \
            4       5
           /  \      \
          4    4      5
    """
    root = Node(5)
    root.left = Node(4)
    root.right = Node(5)
    root.left.left = Node(4)
    root.left.right = Node(4)
    root.right.right = Node(5)
    count_unival_subtrees(root)
    print("Count of Single Valued Subtrees is", count_unival_subtrees(root))

