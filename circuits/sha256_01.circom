pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/sha256/sha256.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template CommitmentHasher() {
    signal input secret;

    component hasher = Sha256(8);
    component secretBits = Num2Bits(8);
    secretBits.in <== secret;

    for (var i = 0; i < 8; i++) {
        log(secretBits.out[i], "Secret bit");  // I add here for test
        hasher.in[i] <== secretBits.out[i];
    }

    component decoder = Bits2Num(256);

    for (var i = 255; i >= 0; i--) {
        decoder.in[255 - i] <== hasher.out[i];
    }

    log(decoder.out, "Decoder out");  // I add here for test



    for (var i = 248; i < 256; i++) {
        log(hasher.out[i], "Hasher out", i);  // I add here for test
    }
}

component main = CommitmentHasher();

