#!/usr/bin/python3
string1 = "All-convoYs-9-be:Alert1."
rotational_factor = 4

def encrypt(input, rotation_factor):
    encryption = ""
    for i in range(len(input)):
        char = input[i]
        if char.isupper():
            char_idx = ord(char) - ord("A")
            shifted_idx = (char_idx + rotation_factor) % 26
            new_char = chr(shifted_idx + ord("A"))
            encryption += new_char
        elif char.islower():
            char_idx = ord(char) - ord("a")
            shifted_idx = (char_idx + rotation_factor) % 26
            new_char = chr(shifted_idx + ord("a"))
            encryption += new_char
        elif char.isdigit():
            shifted_idx = (int(char) + rotation_factor) % 10
            encryption += str(shifted_idx)
        else:
            encryption += char
    return encryption

if __name__ == "__main__":
    print(encrypt(string1, rotational_factor))