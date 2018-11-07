### AES-128 implementatin with CTR mode of operation

This AES implementation is not intended for practical use, I did it to understand the algorithm better. You can use `openssl` to check the result.

**Note**: 
- Use "\" to escape the space character (.e.g "hello World" is "hello\ World") 
- This implementation currently only works with ASCII character (a..zA..z0..9)

**TODO**:
- Other mode of operations

```
nodejs aes.js [password] [plaintext]
```

Example:
```
nodejs aes.js alice\ 432 quick\ brown\ fox\ jumped\ over\ the\ lazy\ dog
```

Output:
```
        -------------   CIPHER TEXT     -------------
b460 b967 faf dd11 344a ef99 42d4 7cd2 b17a 17e4 886c 3130 2938 d124 eeec 96f7 653f fecb 8043 9cf9
        -------------   DECIPHER TEXT   -------------
quick brown fox jumped over the lazy dog
```
