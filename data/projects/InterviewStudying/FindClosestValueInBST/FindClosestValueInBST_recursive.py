#!/usr/bin/python3
# NOTE: RECURSIVE SOLUTION
# This is the class of the input tree. Do not edit.
class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def findClosestValueInBST(tree, target):
    # TODO: Create a variable to store the closest candidate to target
    #       float("inf") is the same as infinity 
    return findClosestValueInBSTHelper(tree, target, float("inf"))

def findClosestValueInBSTHelper(tree, target, closest):
    # NOTE: We need to establish a case where this function isn't called
    #       anymore
    if tree is None:
        # NOTE: We are at a leaf so return the closest
        return closest

    # NOTE: IF distance to target from closest is greater than the 
    #       distance to target from the current value, update the
    #       closest value to the current tree valu
    if abs(target - closest) > abs( target - tree.value):
        closest = tree.value
    # NOTE: Now compare the closest value to the target value to decide
    #   `   which subtree we are going to be following
    if target < tree.value:
        return findClosestValue(tree.left, target, closest)
    elif target > tree.value:
        return findClostsValue(tree.right, target, closest)
    else:
        return closest

    pass

if __name__ == "__main__":
    print(findClosestValueInBST(tree, tar:wget))
