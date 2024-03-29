#!/usr/bin/python3
'''
    One simple way to encrypt a string is to "rotate" every alphanumeric character by a certain amount.
    Rotating a character means replacing it with another character that is a certain number of steps away in
    normal alphabetic or numerical order.
    For example, if the string "Zebra-493?" is rotated 3 places, the resulting string is "Cheud-726?". Every
    alphabetic character is replaced with the character 3 letters higher (wrapping around from Z to A), and
    every numeric character replaced with the character 3 digits higher (wrapping around from 9 to 0).
    Note that the non-alphanumeric characters remain unchanged.
    Given a string and a rotation factor, return an encrypted string.
'''
string = "All-convoYs-9-be:Alert1."
# ANS: Epp-gsrzsCw-3-fi:Epivx5.
rotational_factor = 4

def rotationalCipher(input, rotation_factor):
    # TODO: Return encrypter msg
    encrypted_msg = ""

    # TODO: Iterate through input chars
    for char in input:
        if char.islower():
            uni_char = ord(char) - ord("a")
            shifted_char = (uni_char + rotation_factor) % 26
            new_char = chr(shifted_char + ord("a"))
            encrypted_msg += new_char
        elif char.isupper():
            uni_char = ord(char) - ord("A")
            shifted_char = (uni_char + rotation_factor) % 26
            new_char = chr(shifted_char + ord("A"))
            encrypted_msg += new_char
        elif char.isdigit():
            shifted_char = (int(char) + rotation_factor) % 10
            new_char = shifted_char
            encrypted_msg += str(new_char)
        else:
            encrypted_msg += char

    return encrypted_msg



def printString(string):
  print('[\"', string, '\"]', sep='', end='')

test_case_number = 1

def check(expected, output):
  global test_case_number
  result = False
  if expected == output:
    result = True
  rightTick = '\u2713'
  wrongTick = '\u2717'
  if result:
    print(rightTick, 'Test #', test_case_number, sep='')
  else:
    print(wrongTick, 'Test #', test_case_number, ': Expected ', sep='', end='')
    printString(expected)
    print(' Your output: ', end='')
    printString(output)
    print()
  test_case_number += 1

if __name__ == "__main__":
  input_1 = "All-convoYs-9-be:Alert1."
  rotation_factor_1 = 4
  expected_1 = "Epp-gsrzsCw-3-fi:Epivx5."
  output_1 = rotationalCipher(input_1, rotation_factor_1)
  check(expected_1, output_1)

  input_2 = "abcdZXYzxy-999.@"
  rotation_factor_2 = 200
  expected_2 = "stuvRPQrpq-999.@"
  output_2 = rotationalCipher(input_2, rotation_factor_2)
  check(expected_2, output_2)

  # Add your own test cases here
