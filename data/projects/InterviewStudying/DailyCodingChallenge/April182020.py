#!/usr/bin/python3
'''
    An XOR linked list is a more memory efficient doubly linked list. Instead of each node holding next and prev
    fields, it holds a field named both, which is an XOR of the next node and the previous node. Implement an XOR
    linked list;

    It has an add(element) which adds the element to the end, and a get(index) which returns the node
    at index.

    If using a language that has no pointers (such as Python), you can assume you have access to get_pointer and
    dereference_pointer functions that converts between nodes and memory addresses.
'''

# TODO: Define node class
import ctypes


class Node:
    def __init__(self, value):
        self.val = value
        self.npx = 0

# TODO: Define XOR linked list
class XORLinkedList:
    def __init__(self):
        # TODO: Define head, tail and node list
        self.head = None
        self.tail = None
        self.__nodes = []

    def insert_at_end(self, value):
        # TODO: Create a node
        node = Node(value)

        # TODO: If this head is None
        if self.head is None:
            self.head = node
            self.tail = node
        else:
            # TODO: Insert at end
            self.tail.npx = id(node) ^ self.tail.npx
            self.tail = node
            node.npx = id(self.tail)
        self.__nodes.append(node)

    def print_by_index(self, idx):
        # TODO: Track previous id
        prev_id = 0
        # TODO: Save current head
        node = self.head
        # TODO: Iterate in range of idx
        for _ in range(idx):
            # TODO: Save next npx into a var
            next_npx = id(node) ^ prev_id

            # TODO: if next_npx
            if next_npx:
                # TODO: If there is a next, same the new prev_id as current node
                prev_id = id(node)
                node = self.__type_cast(next_npx)

    def __type_cast(self, id):
        # TODO: Casts id into python object and returns its value
        return ctypes.cast(id, ctypes.py_object).value






# # TODO: Define a Node class
# class Node(object):
#     def __init__(self, value):
#         self.val = value
#         self.npx = 0
#
# class XORLinkedList:
#     def __init__(self):
#         # TODO: Create head, tail, __nodes
#         self.head = None
#         self.tail = None
#         self.__nodes = []
#
#     def insert_beginning(self, value):
#         node = Node(value)
#         # TODO: If head doesn't exist
#         if self.head is None:
#             self.head = node
#             self.tail = node
#         else:
#             # TODO: XOR current and head
#             #           Remember we are dealing with id's so that is whatever is at head, npx
#             self.head.npx = id(node) ^ self.head.npx
#             node.npx = id(self.head)
#             self.tail = node
#         self.__nodes.append(node)
