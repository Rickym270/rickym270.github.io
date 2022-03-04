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
    # TODO: Init res as -1
    result = -1

    while rootNode != None:
        if rootNode.value < target:
            result = rootNode.value
            rootNode = rootNode.right
        else:
            rootNode = rootNode.left

    return rootNode
