#!/usr/bin/python3
normal_string = "Ricky"

def reverse(string):
    backwards = []
    totalItems = len(string)

    for i in reversed(range(totalItems)):
        backwards.append(string[i])

    return ''.join(backwards)

if __name__ == "__main__":
    print(reverse(normal_string))