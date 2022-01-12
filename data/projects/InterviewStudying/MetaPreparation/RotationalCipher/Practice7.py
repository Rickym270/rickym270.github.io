#!/usr/bin/python3
string = "All-convoYs-9-be:Alert1."
# ANS: Epp-gsrzsCw-3-fi:Epivx5.
rotational_factor = 4

def encrypt(input, rotation_factor):
    encrypted_msg = ""
    for i in range(len(input)):
        char = input[i]
        if char.isupper():
            char_idx = ord(char) - ord("A")
            shifted_idx = (char_idx + rotation_factor) % 26
            new_char = chr(shifted_idx + ord("A"))
            encrypted_msg += new_char
        elif char.islower():
            char_idx = ord(char) - ord("a")
            shifted_idx = (char_idx + rotation_factor) % 26
            new_char = chr(shifted_idx + ord("a"))
            encrypted_msg += new_char
        elif char.isdigit():
            shifted_idx = (int(char) + rotation_factor) % 10
            encrypted_msg += str(shifted_idx)
        else:
            encrypted_msg += char

    return encrypted_msg


if __name__ == "__main__":
    print(encrypt(string, rotational_factor))