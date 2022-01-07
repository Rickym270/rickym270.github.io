#!/usr/bin/python3
numList = [1,2,3,1]

def containsDuplicates(numList):
    num_set = set(numList)
    if len(numList) == len(num_set):
        return False
    return True

if __name__ == "__main__":
    print(containsDuplicates((numList)))