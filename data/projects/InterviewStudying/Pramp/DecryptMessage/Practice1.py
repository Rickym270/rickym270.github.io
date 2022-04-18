#!/usr/bin/python3
message1 = "dnotq" # crime
message2 = "flgxswdliefy" # encyclopedia

# decrypt first char by 1 and the following
def decrypt_msg(char, rotational_factor):
    if char.islower():
        uni_char = ord(char) - ord("a")
        shifted_char = (uni_char - rotational_factor) % 26
        return chr(shifted_char + ord("a"))


def decrypt(msg):
    decrypted_message = ""
    prev = ""
    for i in range(len(msg)):
        if i == 0:
            new_char = decrypt_msg(msg[i], 1)
        else:
            new_char = decrypt_msg(msg[i], ord(prev))

        prev = msg[i]
        decrypted_message += new_char
    return decrypted_message


if __name__ == "__main__":
    print(decrypt(message1))
    print(decrypt(message2))
