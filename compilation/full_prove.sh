#!/bin/bash

CIRCUIT_NAME="mastermind"
CIRCUIT_PATH="../circuits/$CIRCUIT_NAME.circom"

OUTPUT_PATH="${1:-mastermind/}"

if [ -n "$OUTPUT_PATH" ]; then
    mkdir -p $OUTPUT_PATH
fi

echo "[Setup](01/04): Generate witness"
node ${OUTPUT_PATH}${CIRCUIT_NAME}_js/generate_witness.js ${OUTPUT_PATH}${CIRCUIT_NAME}_js/mastermind.wasm mastermind.input.json  ${OUTPUT_PATH}witness.wtns

echo "[Setup](02/04): Check witness"
snarkjs wtns check ${OUTPUT_PATH}$CIRCUIT_NAME.r1cs  ${OUTPUT_PATH}witness.wtns

echo "[Proof](03/04): Create the proof"
snarkjs groth16 prove ${OUTPUT_PATH}${CIRCUIT_NAME}_final.zkey ${OUTPUT_PATH}witness.wtns ${OUTPUT_PATH}proof.json ${OUTPUT_PATH}public.json

echo "[Verification](04/04): Verify the proof"
snarkjs groth16 verify ${OUTPUT_PATH}verification_key.json ${OUTPUT_PATH}public.json ${OUTPUT_PATH}proof.json