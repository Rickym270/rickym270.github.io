#!/usr/bin/python3

'''
    Given a root of a Binary Search Tree (BST) and a number num, implement an efficient function findLargestSmallerKey
    that finds the largest key in the tree that is smaller than num. If such a number doesn't exist, return -1. Assume
    that all keys in the tree are nonnegative.
'''

def findLargestSmallerKey(rootNode, target):
    result = -1

    while rootNode != None:
        # TODO: Less than target, traverse right
        if rootNode.key < target:
            # TODO: Take advantage of the properties of a BST. The largest smallest element will be the first node
            #           in the left side of the tree.
            result = rootNode.key
            rootNode = rootNode.right
        else:
            # TODO: If node is greater than the number, go left
            rootNode = rootNode.left

    return result
