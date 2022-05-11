#!/usr/bin/python3
# TODO: Implement push, pop/delete

class myArray(object):
    def __init__(self):
        self.length = 0
        self.array = []

    def push(self, value):
        # TODO: Add to the end of the array
        self.array[-1] = value
        self.length += 1

    def delete(self, idx):
        # TODO: Delete
        # Save current item to be deleted
        last_item = self.array[self.length - 1]

        # TODO: We have to shift the items
        self.shift_items(idx)

    def shift_items(self, idx):
        # TODO: Iterate through the items starting at item to be
        #           removed
        for i in range(idx, self.length - 1):
            self.array[i] = self.array[i+1]

        self.length -= 1