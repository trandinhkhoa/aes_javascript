// AES-128 implementation

const R = 11;   // 11 round
const N = 4;     // input message is divided into block of 4x4 bytes

// S-box
const S =
[
    0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76,
    0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0,
    0xB7, 0xFD, 0x93, 0x26, 0x36, 0x3F, 0xF7, 0xCC, 0x34, 0xA5, 0xE5, 0xF1, 0x71, 0xD8, 0x31, 0x15,
    0x04, 0xC7, 0x23, 0xC3, 0x18, 0x96, 0x05, 0x9A, 0x07, 0x12, 0x80, 0xE2, 0xEB, 0x27, 0xB2, 0x75,
    0x09, 0x83, 0x2C, 0x1A, 0x1B, 0x6E, 0x5A, 0xA0, 0x52, 0x3B, 0xD6, 0xB3, 0x29, 0xE3, 0x2F, 0x84,
    0x53, 0xD1, 0x00, 0xED, 0x20, 0xFC, 0xB1, 0x5B, 0x6A, 0xCB, 0xBE, 0x39, 0x4A, 0x4C, 0x58, 0xCF,
    0xD0, 0xEF, 0xAA, 0xFB, 0x43, 0x4D, 0x33, 0x85, 0x45, 0xF9, 0x02, 0x7F, 0x50, 0x3C, 0x9F, 0xA8,
    0x51, 0xA3, 0x40, 0x8F, 0x92, 0x9D, 0x38, 0xF5, 0xBC, 0xB6, 0xDA, 0x21, 0x10, 0xFF, 0xF3, 0xD2,
    0xCD, 0x0C, 0x13, 0xEC, 0x5F, 0x97, 0x44, 0x17, 0xC4, 0xA7, 0x7E, 0x3D, 0x64, 0x5D, 0x19, 0x73,
    0x60, 0x81, 0x4F, 0xDC, 0x22, 0x2A, 0x90, 0x88, 0x46, 0xEE, 0xB8, 0x14, 0xDE, 0x5E, 0x0B, 0xDB,
    0xE0, 0x32, 0x3A, 0x0A, 0x49, 0x06, 0x24, 0x5C, 0xC2, 0xD3, 0xAC, 0x62, 0x91, 0x95, 0xE4, 0x79,
    0xE7, 0xC8, 0x37, 0x6D, 0x8D, 0xD5, 0x4E, 0xA9, 0x6C, 0x56, 0xF4, 0xEA, 0x65, 0x7A, 0xAE, 0x08,
    0xBA, 0x78, 0x25, 0x2E, 0x1C, 0xA6, 0xB4, 0xC6, 0xE8, 0xDD, 0x74, 0x1F, 0x4B, 0xBD, 0x8B, 0x8A,
    0x70, 0x3E, 0xB5, 0x66, 0x48, 0x03, 0xF6, 0x0E, 0x61, 0x35, 0x57, 0xB9, 0x86, 0xC1, 0x1D, 0x9E,
    0xE1, 0xF8, 0x98, 0x11, 0x69, 0xD9, 0x8E, 0x94, 0x9B, 0x1E, 0x87, 0xE9, 0xCE, 0x55, 0x28, 0xDF,
    0x8C, 0xA1, 0x89, 0x0D, 0xBF, 0xE6, 0x42, 0x68, 0x41, 0x99, 0x2D, 0x0F, 0xB0, 0x54, 0xBB, 0x16
]

// inverse S-box for Decryption
const S_i =
[
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];

// round constant for Rijndael key scheduling
const rc = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36];

// Input: 32-bit word w
// Output: RotWord(SubWord(w))
// For S-box  (SubWord) and Circular Shift Left (Rot) steps of Key Scheduling
function rot_sub(w){
    // S-box
    first = (w >> 24) & 0xFF;
    second = (w >> 16) & 0xFF;
    third = (w >> 8) & 0xFF;
    fourth = w & 0xFF;
    first =  S[((first >> 4) & 0xF) * 16 + (first & 0xF)];
    second =  S[((second >> 4) & 0xF) * 16 + (second & 0xF)];
    third =  S[((third >> 4) & 0xF) * 16 + (third & 0xF)];
    fourth =  S[((fourth >> 4) & 0xF) * 16 + (fourth & 0xF)];
    // Circular shift left 1
    new_w = (second << 24) ^ (third << 16) ^ (fourth << 8) ^ (first);
    new_w = new_w >>> 0;
    return new_w;
}

// Input: string str
// Output: array of 4 32-bits words
// Split string into array of shorter words
function stringToWord(str){
    K_byte = [];
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      K_byte = K_byte.concat([code]);
    }
    K = [];
    j = 0;
    for (var i = 0; i < K_byte.length; i=i+4){
         K[j] = (K_byte[i] << 24) ^ (K_byte[i+1] << 16) ^ (K_byte[i+2] << 8) ^ (K_byte[i+3]);
        j++;
    }
    return K;
}

// Input: original key
// Output: 11x4 matrix; each row is a round key
// Rijndael Key Scheduling
function key_expansion(key){
    // Convert key (string) to K_byte (byte array)

    // Convert K_byte to K (array of 32-bit words)
    K = stringToWord(key);

    // W: array of 32-bits words of the expanded key
    W = [];
    for (var i = 0; i <= 4*R-1; i++){
        if (i < N)
            W[i] = K[i];
        else if ((i >= N) && ((i % N) == 0)){
            g = rot_sub(W[i-1]);
            W[i] = (W[i-N] ^ g ^ (rc[parseInt(i/N)] << 24)) >>> 0;
        } else
            W[i] = (W[i-N] ^ W[i-1]) >>> 0;
    }

    // round_key: matrix of 32-bit words
    var round_key = [];
    for (var i = 0; i < 4*R-1; i = i+4){
        round_key.push([W[i], W[i+1], W[i+2], W[i+3]]);
    }
    return round_key;
}

// Multiply by 2 in Rijndael's  Galois field. used for MixColumn step
// Input:  a byte
function mul_by_2(b){
    var r = b;
    var h;
    if ((b >> 7) == 1){
        h = 255;
    } else{
        h = 0;
    }
    r = (r << 1) & (0xff);
    h = h & 0x1B;
    r = r ^ h;
    return r;
}

// MixColumn Step
// Input: a column in the 4x4 matrix that represent a block of the message
function MixColumn(b){
    var d = [];
    d[0] =  mul_by_2(b[0]) ^ (mul_by_2(b[1]) ^ b[1]) ^ b[2] ^ b[3];
    d[1] =  b[0] ^ mul_by_2(b[1]) ^ (mul_by_2(b[2]) ^ b[2]) ^ b[3];
    d[2] =  b[0] ^ b[1] ^ mul_by_2(b[2]) ^ (mul_by_2(b[3]) ^ b[3]);
    d[3] =  (mul_by_2(b[0]) ^ b[0]) ^ b[1] ^ b[2] ^ mul_by_2(b[3]);
    return d;
}

// Multiply by 9 in Rijndael's  Galois field. used for InverseMixColumn step
// Input:  a byte
function mul_by_9(b){
    x = mul_by_2(mul_by_2(mul_by_2(b))) ^ b;
    return x;
}

// Multiply by 11 in Rijndael's  Galois field. used for InverseMixColumn step
// Input:  a byte
function mul_by_11(b){
    x = mul_by_2(mul_by_2(mul_by_2(b)) ^ b) ^ b;
    return x;
}

// Multiply by 13 in Rijndael's  Galois field. used for InverseMixColumn step
// Input:  a byte
function mul_by_13(b){
    x = mul_by_2(mul_by_2(mul_by_2(b) ^ b)) ^ b;
    return x;
}

// Multiply by 13 in Rijndael's  Galois field. used for InverseMixColumn step
// Input:  a byte
function mul_by_14(b){
    x = mul_by_2(mul_by_2(mul_by_2(b) ^ b) ^ b);
    return x;
}

//InverseMixColumn Step during decryption
function InverseMixColumn(b){
    // x×9=(((x×2)×2)×2)+x
    // x×11=((((x×2)×2)+x)×2)+x
    // x×13=((((x×2)+x)×2)×2)+x
    // x×14=((((x×2)+x)×2)+x)×2
    var d = [];
    d[0] = mul_by_14(b[0]) ^ mul_by_11(b[1]) ^ mul_by_13(b[2]) ^ mul_by_9(b[3]);
    d[1] = mul_by_9(b[0]) ^ mul_by_14(b[1]) ^ mul_by_11(b[2]) ^ mul_by_13(b[3]);
    d[2] = mul_by_13(b[0]) ^ mul_by_9(b[1]) ^ mul_by_14(b[2]) ^ mul_by_11(b[3]);
    d[3] = mul_by_11(b[0]) ^ mul_by_13(b[1]) ^ mul_by_9(b[2]) ^ mul_by_14(b[3]);
    return d;
}

//SubBytes step during Encryption
//Input: Matrix NxN A  (N=4 AES-128)
function SubByte(A){
    new_A = A.slice();
    for (var i = 0; i < N; i++){
        for (var j = 0; j < N; j++){
            new_A[i][j] =  S[((A[i][j] >> 4) & 0xF) * 16 + (A[i][j] & 0xF)];
        }
    }
    return new_A;
}

//InverseSubBytes step during Decryption
//Input: Matrix NxN A  (N=4 AES-128)
function InverseSubByte(A){
    new_A = A.slice();
    for (var i = 0; i < N; i++){
        for (var j = 0; j < N; j++){
            new_A[i][j] =  S_i[((A[i][j] >> 4) & 0xF) * 16 + (A[i][j] & 0xF)];
        }
    }
    return new_A;
}

//ShiftRow step during Encryption
//Input: Matrix NxN A  (N=4 AES-128)
function ShiftRow(A){
    new_A = A.slice();
    for (var i = 0; i < N; i++){
        new_A[i] = new_A[i].slice(i,N).concat(new_A[i].slice(0,i));
    }
    return new_A;
}

//InverseShiftRow step during Decryption
//Input: Matrix NxN A  (N=4 AES-128)
function InverseShiftRow(A){
    new_A = A.slice();
    for (var i = 0; i < N; i++){
        new_A[i] = new_A[i].slice(N-i,N).concat(new_A[i].slice(0,N-i));
    }
    return new_A;
}

//Print a matrix in hex
//Input: Matrix NxN A  (N=4 AES-128)
function print_matrix(A){
    for (var i = 0; i < N; i++){
        console.log(A[i][0].toString(16), '\t', A[i][1].toString(16), '\t', A[i][2].toString(16), '\t', A[i][3].toString(16));
    }
}

// ENCRYPTION of a single block of the message
// Input: matrix NxN A representing a single block
//        key is the original cipher key 
function encryption(matrix, key){
    // copy to new matrix A to avoid modifying the parameter
    var A = [];
    for (var i = 0; i < matrix.length; i++){
        A.push(matrix[i].slice());
    }
    // Key expansion
    round_key_matrix = key_expansion(key);

    // Initial round
    for (var i = 0; i < 4; i++){
        A[0][i] = A[0][i] ^ ((round_key_matrix[0][i] >> 24) & 0xFF) ;
        A[1][i] = A[1][i] ^ ((round_key_matrix[0][i] >> 16) & 0xFF) ;
        A[2][i] = A[2][i] ^ ((round_key_matrix[0][i] >> 8) & 0xFF) ;
        A[3][i] = A[3][i] ^ ((round_key_matrix[0][i] ) & 0xFF) ;
    }

    // Next 9 rounds
    for (var round = 1; round < R-1; round++){
        // SubByte
        A = SubByte(A);
        // ShiftRow
        A = ShiftRow(A);
        // MixColumn
        for (var i = 0; i < 4; i++){
            column = [A[0][i], A[1][i], A[2][i], A[3][i]];
            new_column = MixColumn(column);
            A[0][i] = new_column[0];
            A[1][i] = new_column[1];
            A[2][i] = new_column[2];
            A[3][i] = new_column[3];
        }

        // Add Round Key
        for (var i = 0; i < 4; i++){
            A[0][i] = A[0][i] ^ ((round_key_matrix[round][i] >> 24) & 0xFF) ;
            A[1][i] = A[1][i] ^ ((round_key_matrix[round][i] >> 16) & 0xFF) ;
            A[2][i] = A[2][i] ^ ((round_key_matrix[round][i] >> 8) & 0xFF) ;
            A[3][i] = A[3][i] ^ ((round_key_matrix[round][i] ) & 0xFF) ;
        }
    }
    // Last Round
    // SubByte
    A = SubByte(A);
    // Shift Row
    A = ShiftRow(A);
    // Add Round Key
    for (var i = 0; i < 4; i++){
        A[0][i] = A[0][i] ^ ((round_key_matrix[round][i] >> 24) & 0xFF) ;
        A[1][i] = A[1][i] ^ ((round_key_matrix[round][i] >> 16) & 0xFF) ;
        A[2][i] = A[2][i] ^ ((round_key_matrix[round][i] >> 8) & 0xFF) ;
        A[3][i] = A[3][i] ^ ((round_key_matrix[round][i] ) & 0xFF) ;
    }
    return A;
}


// DECRYPTION of a single block of the message
// Input: matrix NxN A representing a single block
//        key is the original cipher key 
function decryption(A, key){
    console.log('-----Decrypt----');
    round_key_matrix = key_expansion(key);

    // AddRoundKey(State, ExpandedKey[10]);
    for (var i = 0; i < 4; i++){
        A[0][i] = A[0][i] ^ ((round_key_matrix[10][i] >> 24) & 0xFF) ;
        A[1][i] = A[1][i] ^ ((round_key_matrix[10][i] >> 16) & 0xFF) ;
        A[2][i] = A[2][i] ^ ((round_key_matrix[10][i] >> 8) & 0xFF) ;
        A[3][i] = A[3][i] ^ ((round_key_matrix[10][i] ) & 0xFF) ;
    }
    // InverseShiftRow
    A = InverseShiftRow(A);

    // InverseSubByte
    A = InverseSubByte(A);

    // Next 9 rounds
    for (var round = R-2; round > 0; round--){
        // AddRoundKey(State, ExpandedKey[10]);
        for (var i = 0; i < 4; i++){
            A[0][i] = A[0][i] ^ ((round_key_matrix[round][i] >> 24) & 0xFF) ;
            A[1][i] = A[1][i] ^ ((round_key_matrix[round][i] >> 16) & 0xFF) ;
            A[2][i] = A[2][i] ^ ((round_key_matrix[round][i] >> 8) & 0xFF) ;
            A[3][i] = A[3][i] ^ ((round_key_matrix[round][i] ) & 0xFF) ;
        }
        // InverseMixColumn
        for (var i = 0; i < 4; i++){
            column = [A[0][i], A[1][i], A[2][i], A[3][i]];
            new_column = InverseMixColumn(column);
            A[0][i] = new_column[0];
            A[1][i] = new_column[1];
            A[2][i] = new_column[2];
            A[3][i] = new_column[3];
        }
        // InverseShiftRow
        A = InverseShiftRow(A);
        //InverseSubBytes
        A = InverseSubByte(A);
    }
    // Last Round
    for (var i = 0; i < 4; i++){
        A[0][i] = A[0][i] ^ ((round_key_matrix[0][i] >> 24) & 0xFF) ;
        A[1][i] = A[1][i] ^ ((round_key_matrix[0][i] >> 16) & 0xFF) ;
        A[2][i] = A[2][i] ^ ((round_key_matrix[0][i] >> 8) & 0xFF) ;
        A[3][i] = A[3][i] ^ ((round_key_matrix[0][i] ) & 0xFF) ;
    }
    return A;
}

// Input: A: array of bytes
// Convert byteArray To String
function byteArrayToString(A){
    var str = "";
    for (var i = 0; i < A.length; i++){
            str = str.concat(String.fromCharCode(A[i]));
    }
    return str;
}

// Input: A: array of bytes
// printing an array in hex, for debugging
function printArray(A){
    str = "";
    for (var i = 0; i < A.length; i++){
        if ((i % 2 == 0) && (i != 0)){
            str = str.concat(" ")
            str = str.concat(A[i].toString(16))
        } else {
            str = str.concat(A[i].toString(16))
        }
    }
    console.log(str);
}

// Convert array to matrix, for debugging
function arrayToMatrix(array, size){
    A = [];
    index = 0;
    for (var i = 0; i < size; i++){
        row = [];
        for (var j = 0; j < size; j++){
            row[j] = array[index]; 
            index++;
        }
        A.push(row);
    }
    return A;
}

// Convert matrix to array. Convert from 2-D array representation of each block to 1-D, so later all the ciphered/deciphered blocks can be concatenated together into final output 
// Input: matrix NxN A
function matrixToArray(A){
    index = 0;
    array = [];
    for (var i = 0; i < A.length; i ++){
        for (var j = 0; j < A[i].length; j++){
            array[index] = A[j][i];
            index++;
        }
    }
    return array;
}

// for debugging
function stringToMatrix(plain_text){
    words = stringToWord(plain_text);
    var A = [];
    for (var i = 0; i < words.length; i++){
        A.push([(words[0] >> (24 - (i*8))) & 0xFF, (words[1] >> (24 - (i*8))) & 0xFF, (words[2] >> (24 - (i*8))) & 0xFF, (words[3] >> (24 - (i*8))) & 0xFF]);
    }
    return A;
}

// lowercase hex representation (i.e. 'a' instead of 'A' for 0xA)
// Input: a string
// To be used in CTR mode of operation, where 
// cipher_text = AES(nonce,key) XOR plain_text
function nonceToMatrix(str){
    A = [];
    for (var i = 0; i < N; i++){
        A.push([0, 0, 0, 0]);
    }

    if (str.length < 16){
        for (var i = 0; i < (16 - str.length); i++){
            str = str.concat('0');
        }
    }

    index = 0;
    for (var i = 0; i < N; i++){
        for (var j = 0; j < N; j++){
            A[j][i] = parseInt(str[index] + str[index+1], 16);
            index = index + 2;
            if (index > (str.length-1)) break;
        }
    }
    return A;
}

// Split string into words of 16 characters
function splitText(str){
    index = 0;
    words = [];
    for (var i = 0; i < (str.length); i=i+16){
        words[index] = str.slice(i,i+16);
        index++;
    }
    return words;
}

// concatenate the 64-bit nonce and 64-bit counter
// Input: nonce: string form (e.g. numeircal value of nonce is 0xa3 then nonce ="a3"
//         counter_number: numerical form
function concat_nonce_counter(nonce, counter_number){
    zero_array = "";
    for (var z = 0; z < (16-(counter_number.toString(16).length)); z++){
        zero_array = zero_array.concat('0');
    }
    counter = zero_array.concat(counter_number.toString(16));
    // example: if nonce = 0xf0f1; counter_number=0x2 then nonce_concat = 000000000000f0f10000000000000002 is the input of AES CTR mode
    return nonce.concat(counter);
}

// ******* ENCRYPTION AND DECRYTION *******************8
// Currently there is only CTR mode of operation 
mode_of_operation = "CTR";
//
// Extract INPUT CIPHER KEY
key = process.argv[2];

// Extract INPUT plain text 
plain_text = process.argv[3];

// Split input to multiple blocks in case the plain_text is larger than 16 bytes
blocks = splitText(plain_text);

// According to NIST Recommendation - Appendix B, there are two valid approaches. I followed one; which is 64-bit nonce prepended to a 64-bit counter. 
// Pick a random nonce; 0xffffff does not have any meaning
nonce = Math.floor((Math.random() * 0xffffff) + 1).toString(16);

// Prepend nonce with zeros for easier manipulation
zero_array = "";
for (var z = 0; z < (16-(nonce.length)); z++){
    zero_array = zero_array.concat('0');
}
nonce = zero_array.concat(nonce);

if (mode_of_operation == "CTR"){
    // mode of operation CTR ENCRYPTION
    counter_number = 0x0;
    cipher_text = [];
    for (var k = 0; k < blocks.length; k++){
        plain_text = blocks[k];
        nonce_counter = concat_nonce_counter(nonce, counter_number);
        nonce_matrix = nonceToMatrix(nonce_counter);
        var E = encryption(nonce_matrix, key);
        var E_byte_array = matrixToArray(E);
        var cipher_block = [];
        for (var i = 0; i < plain_text.length; i++){
            cipher_block[i] = E_byte_array[i] ^ plain_text.charCodeAt(i); 
        }
        cipher_text = cipher_text.concat(cipher_block);
        // Increase the counter
        counter_number = counter_number + 1;
    }
    console.log("\t-------------\tCIPHER TEXT\t-------------");
    printArray(cipher_text);

    // mode of operation CTR DECRYPTION
    counter_number = 0x0;
    input = splitText(cipher_text);
    decipher_text = [];
    for (var x = 0; x < input.length; x++){
        input_block = input[x];
        nonce_counter = concat_nonce_counter(nonce, counter_number);
        nonce_matrix = nonceToMatrix(nonce_counter);
        var D = encryption(nonce_matrix, key);
        var D_byte_array = matrixToArray(D);
        var decipher_block = [];
        for (var i = 0; i < input_block.length; i++){
            decipher_block[i] = D_byte_array[i] ^ input_block[i]; 
        }
        decipher_text = decipher_text.concat(decipher_block);
        // Increase the counter
        counter_number = counter_number + 1;
    }
    console.log("\t-------------\tDECIPHER TEXT\t-------------");
    console.log(byteArrayToString(decipher_text));
} else {
    // TODO
    console.log('TODO OTHER MODE');
}
