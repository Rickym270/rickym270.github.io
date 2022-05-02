#!/usr/bin/python3
string = "All-convoYs-9-be:Alert1."
# ANS: Epp-gsrzsCw-3-fi:Epivx5.
rotational_factor = 4

def encrypt(input, rotation_factor):
    encrypted_msg = ""

    for i in range(len(input)):
        char = input[i]

        # TODO: Capital Letters
        if char.isupper():
            char_idx = ord(char) - ord("A")
            shifted_index = (char_idx + rotation_factor) % 26
            new_char = chr(shifted_index + ord("A"))
            encrypted_msg += new_char
        # TODO: Lowercase Letters
        elif char.islower():
            char_idx = ord(char) - ord("a")
            shifted_index = (char_idx + rotation_factor) % 26
            new_char = chr(shifted_index + ord("a"))
            encrypted_msg += new_char
        # TODO: Numbers
        elif char.isdigit():
            shifted_index = (int(char) + rotation_factor) % 10
            new_char = str(shifted_index)
            encrypted_msg += new_char
        # TODO: Others
        else:
            encrypted_msg += char
    # TODO: Return encrypted msg
    return encrypted_msg

if __name__ == "__main__":
    print(encrypt(string, rotational_factor))
