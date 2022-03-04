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
    inorder_successor = None

    # TODO: Return node with min key in the right subtree
    if inputNode.right != None:
        findMinKey(inputNode.right)

    # TODO: Save child and parent node
    ancestor = inputNode.parent
    child = inputNode

    # TODO: Travel up using parent pointer UNTIL you see the child == the right of the parent
    #           when you see there is a right child since right contains the greater key and we
    #           are looking for the smallest greatest key
    while ancestor != None and child == ancestor.right:
        inorder_successor = ancestor
        ancestor = child.parent
    return inorder_successor

def findMinKey(inputNode):
    while inputNode.right != None:
        if inputNode.left != None:
            inputNode = inputNode.left

    return inputNode

