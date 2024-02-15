pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/bitify.circom";


template ConcatGuesses() {

    signal input privSolnA;
    signal input privSolnB;
    signal input privSolnC;
    signal input privSolnD;

    signal input privSalt;

    var guesses[4] = [privSolnA, privSolnB, privSolnC, privSolnD];
    component bitConverter[4];

    component concatenatedBits = Bits2Num(160);

    for (var i = 0; i < 4; i++) {
        bitConverter[i] = Num2Bits(8);
        bitConverter[i].in <== guesses[i];
        for (var j = 7; j >= 0 ;j--) {
            concatenatedBits.in[i*8+j] <== bitConverter[i].out[7 - j];
        }
    }

    component bitConverterSalt = Num2Bits(128);
    bitConverterSalt.in <== privSalt;
    for (var i = 0; i < 128; i++) {
        concatenatedBits.in[32+i] <== bitConverterSalt.out[i];
    }

    signal output out[160] <== concatenatedBits.in;
}
