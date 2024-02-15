function buffer2bitArray(b) {
  const res = [];
  for (let i = 0; i < b.length; i++) {
    for (let j = 0; j < 8; j++) {
      res.push((b[i] >> (7 - j)) & 1);
    }
  }
  return res;
}

function bitArray2buffer(a) {
  const len = Math.floor((a.length - 1) / 8) + 1;
  const b = new Buffer.alloc(len);

  for (let i = 0; i < a.length; i++) {
    const p = Math.floor(i / 8);
    b[p] = b[p] | (Number(a[i]) << (7 - (i % 8)));
  }
  return b;
}

function dec2bitArray(dec, length) {
  const result = [];
  for (var i = 0; i < length; i++) {
    result.push((BigInt(dec) >> BigInt(i)) & BigInt(1));
  }

  return result;
}

function bin2dec(bin) {
  let result = 0;
  for (var i = 0; i < bin.length; i++) {
    result += bin[i] * 2 ** i;
  }

  return result;
}

function random128Hex() {
  function random16Hex() {
    return (0x10000 | (Math.random() * 0x10000)).toString(16).substr(1);
  }
  return (
    random16Hex() +
    random16Hex() +
    random16Hex() +
    random16Hex() +
    random16Hex() +
    random16Hex() +
    random16Hex() +
    random16Hex()
  );
}

module.exports = {
  buffer2bitArray,
  bitArray2buffer,
  dec2bitArray,
  bin2dec,
  random128Hex,
};
