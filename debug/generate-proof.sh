#! /bin/bash

node ./mastermind_js/generate_witness.js mastermind.wasm input.json  witness.wtns

snarkjs groth16 prove mastermind.pk witness.wtns proof.json public.json