#!/usr/bin/python3
'''
    In a Binary Search Tree (BST), an Inorder Successor of a node is defined as the node with the smallest key greater
    than the key of the input node
                20
               /  \
              9    25
            /   \
           5    12
               /  \
              11  14
    Inorder Succession of 9 = 11
    In order succession of 14 = 20
'''

def findInOrderSuccessor(inputNode, target):
    # TODO: Init Inorder_successor to None
    inorder_successor = None

    # TODO: Find the smallest key in right subtree
    #           We want greatest so focus on those
    if inputNode.right != None:
        findMinKey(inputNode.right)

    # TODO: Save the ancestor and child
    ancestor = inputNode.parent
    child = inputNode

    # TODO: While we are in the right subtree
    while ancestor != None and child == ancestor.right:
        # TODO: inorder
        inorder_successor = ancestor
        ancestor = child.parent
    return inorder_successor0


def findMinKey(node):
    # TODO: While there is a number greater, iterate through it
    while node.right != None:
        if node.left != None:
            node = node.left5
    return node
