#!/usr/bin/python3
'''
    Given a root of a Binary Search Tree (BST) and a number num, implement an efficient function findLargestSmallerKey
    that finds the largest key in the tree that is smaller than num. If such a number doesn't exist, return -1. Assume
    that all keys in the tree are nonnegative.

    BALANCED TREE:
        Time: O(nlog(n))
        Space: O(1)

    UNBALANCED:
        Time: O(n)
        Space: O(1)
'''

def findLargestSmallerKey(rootNode, target):
    # TODO: Init result to -1
    result = -1


    while rootNode != None:
        # TODO: If current value is less than the number we want
        #           traverse right since we want a "greater" value
        if rootNode.value < target:
            child = rootNode.value
            ancestor = rootNode.right
        # TODO: Else traverse left
        else:
            rootNode = rootNode.left
