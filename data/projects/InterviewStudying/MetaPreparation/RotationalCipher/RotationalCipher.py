#!/usr/bin/python3
string1 = "All-convoYs-9-be:Alert1."
rotational_factor = 4

def encrypt(input, rotation_factor):
    encryption = ""
    for i in range(len(input)):
        char = input[i]
        if char.isupper():
            char_unicode = ord(char)
            # NOTE: Since uppercase, get the index
            char_idx = ord(char) - ord("A")
            
            #TODO: Perform the shift
            new_idx = (char_idx + rotation_factor) % 26

            # TODO: Convert to new char
            new_unicode = new_idx + ord("A")
            # TODO: Get new string
            new_char = chr(new_unicode)

            # TODO: Append to new string
            encryption += new_char
        elif char.islower():
            char_idx = ord(char) - ord("a")
            new_idx = (char_idx + rotation_factor) % 26
            new_unicode = new_idx + ord("a")
            new_char = chr(new_unicode)
            encryption += new_char
        elif char.isdigit():
            c_new = (int(char) + rotation_factor) % 10
            encryption += str(c_new)
        else:
            encryption += char
    return encryption

if __name__ == "__main__":
    print(encrypt(string1, rotational_factor))