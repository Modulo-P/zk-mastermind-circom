const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const {
  bin2dec,
  dec2bitArray,
  bitArray2buffer,
  buffer2bitArray,
} = require("../src");
const exp = require("constants");

const assert = chai.assert;

describe("Testing bit array, number and buffer conversions", function () {
  it("Convert decimal to bit array", async function () {
    const expected = dec2bitArray(45, 16);

    const circuit = await wasm_tester(
      path.join(__dirname, "../circuits/bitify_num2bits.circom"),
      {}
    );

    const w = await circuit.calculateWitness({
      in: 45,
    });

    assert.deepEqual(expected, w.slice(1, 17));
  });

  it("Convert buffer to dec and back", async function () {
    const buffer = Buffer.alloc(2);

    for (var i = 0; i < 2; i++) {
      buffer.writeInt8(i + 32, i, 1);
    }

    // console.log("Buffer: ", buffer);

    const dec = bin2dec(buffer2bitArray(buffer));

    // console.log("Buffer to dec: ", dec);

    const circuit = await wasm_tester(
      path.join(__dirname, "../circuits/bitify_num2bits.circom"),
      {}
    );

    const w = await circuit.calculateWitness({
      in: dec,
    });

    const res = bitArray2buffer(w.slice(1, 17));

    //console.log("Dec to buffer: ", res);

    assert.deepEqual(buffer, res);
  });
});
