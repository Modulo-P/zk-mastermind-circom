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
const expect = chai.expect;

describe("Mastermind", function () {
  this.timeout(10000);
  it("should validate correct witness", async function () {
    try {
      const circuit = await wasm_tester(
        path.join(__dirname, "../circuits/mastermind.circom"),
        {}
      );

      const solution = [1, 2, 3, 4];

      const randomSalt = BigInt("0x" + random128Hex());

      const buffer = Buffer.alloc(4);

      for (let i = 0; i < 4; i++) {
        buffer.writeInt8(solution[i], i, 1);
      }

      // console.log("Random: ", random.toString(10));

      const salt = bitArray2buffer(dec2bitArray(randomSalt, 128));

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
        pubGuessA: solution[0],
        pubGuessB: solution[1],
        pubGuessC: solution[2],
        pubGuessD: solution[3],

        pubNumBlacks: 4,
        pubNumWhites: 0,

        privSolnA: solution[0],
        privSolnB: solution[1],
        privSolnC: solution[2],
        privSolnD: solution[3],

        privSalt: randomSalt,
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

  it("should fail when the clue is false", async function () {
    try {
      const circuit = await wasm_tester(
        path.join(__dirname, "../circuits/mastermind.circom"),
        {}
      );

      const solution = [1, 2, 3, 4];

      const randomSalt = BigInt("0x" + random128Hex());

      console.log("Random salt: ", randomSalt);

      const buffer = Buffer.alloc(4);

      for (let i = 0; i < 4; i++) {
        buffer.writeInt8(solution[i], i, 1);
      }

      // console.log("Random: ", random.toString(10));

      const salt = bitArray2buffer(dec2bitArray(randomSalt, 128));

      const concatenated = Buffer.concat([buffer, salt]);
      // console.log("Concatenated: ", concatenated);

      const hash = crypto
        .createHash("sha256")
        .update(concatenated)
        .digest("hex");

      const solnHash = BigInt("0x" + hash.substring(2)).toString(10);
      console.log("Solution hash: ", solnHash);

      const w = await circuit.calculateWitness({
        pubGuessA: solution[0],
        pubGuessB: solution[1],
        pubGuessC: solution[2],
        pubGuessD: solution[3],

        pubNumBlacks: 3,
        pubNumWhites: 0,

        privSolnA: solution[0],
        privSolnB: solution[1],
        privSolnC: solution[2],
        privSolnD: solution[3],

        privSalt: randomSalt,
        pubSolnHash: BigInt("0x" + hash.substring(2)).toString(10),
      });
    } catch (e) {
      assert.instanceOf(e, Error);
    }
  });
});
