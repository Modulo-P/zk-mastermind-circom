const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const crypto = require("crypto");
const {
  bitArray2buffer,
  buffer2bitArray,
  bin2dec,
  dec2bitArray,
  random128Hex,
} = require("../src");

const assert = chai.assert;

describe("Mastermind SHA256", function () {
  this.timeout(10000);
  it("should return the correct hash", async function () {
    try {
      const circuit = await wasm_tester(
        path.join(__dirname, "../circuits/mastermind_sha256_test.circom"),
        {}
      );

      const buffer = Buffer.alloc(4);

      for (let i = 0; i < 4; i++) {
        buffer.writeInt8(i, i, 1);
      }

      const random = BigInt("0x" + random128Hex());

      // console.log("Random: ", random.toString(10));

      const salt = bitArray2buffer(dec2bitArray(random, 128));

      const concatenated = Buffer.concat([buffer, salt]);
      // console.log("Concatenated: ", concatenated);

      const hash = crypto
        .createHash("sha256")
        .update(concatenated)
        .digest("hex");

      // console.log("Hash: ", BigInt("0x" + hash).toString(10));
      // console.log("Hash hex: ", hash);
      // console.log("Hash buffer: ", Buffer.from(hash, "hex"));

      const w = await circuit.calculateWitness({
        privSolnA: 0,
        privSolnB: 1,
        privSolnC: 2,
        privSolnD: 3,
        privSalt: random,
        pubSolnHash: BigInt("0x" + hash.substring(2)).toString(10),
      });

      const hex = BigInt(w[1]).toString(16).padStart(62, "0");

      // console.log("Witness: ", w[1]);
      // console.log("Witness hex: ", hex);
      // console.log("Witness buffer: ", Buffer.from(hex, "hex"));

      await circuit.checkConstraints(w);

      assert.equal(hex, hash.substring(2));
    } catch (e) {
      console.log(e);
    }
  });

  it("should concatenate the guesses with the salt", async function () {
    const circuit = await wasm_tester(
      path.join(__dirname, "../circuits/concat_guesses_test.circom"),
      {}
    );

    const buffer = Buffer.alloc(4);

    for (let i = 0; i < 4; i++) {
      buffer.writeInt8(i, i, 1);
    }

    const random = 12345;

    const salt = bitArray2buffer(dec2bitArray(random, 128));

    const concatenated = Buffer.concat([buffer, salt]);
    // console.log("Concatenated: ", concatenated);

    const saltDec = bin2dec(buffer2bitArray(salt));
    // console.log("Salt: ", saltDec);

    // console.log("Buffer: ", buffer);

    const w = await circuit.calculateWitness({
      privSolnA: 0,
      privSolnB: 1,
      privSolnC: 2,
      privSolnD: 3,
      privSalt: random,
    });

    const result = bitArray2buffer(w.slice(1, 160));
    // console.log("Array ", w.slice(1, 160));
    // console.log("Result ", result);

    assert.isTrue(concatenated.equals(result));
  });
});
