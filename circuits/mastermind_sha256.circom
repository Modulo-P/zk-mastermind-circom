pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/sha256/sha256.circom";
include "../node_modules/circomlib/circuits/bitify.circom";
include "./concat_guesses.circom";


template MastermindSha256() {

    signal input privSolnA;
    signal input privSolnB;
    signal input privSolnC;
    signal input privSolnD;

    signal input pubSolnHash;

    signal input privSalt;

    signal output hash;

    component concat = ConcatGuesses();

    concat.privSolnA <== privSolnA;
    concat.privSolnB <== privSolnB;
    concat.privSolnC <== privSolnC;
    concat.privSolnD <== privSolnD;
    concat.privSalt <== privSalt;

    component sha256 = Sha256(160);

    sha256.in <== concat.out;

    component decoder = Bits2Num(248);

    for (var i = 255; i > 7; i--) {
        decoder.in[255 - i] <== sha256.out[i];
    }

    hash <== decoder.out;

    hash === pubSolnHash;

}
