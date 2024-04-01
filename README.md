# zk-mastermind-circom

*Mastermind* Game Verifier in Circom.

## Overview

This Circom program implements a zero-knowledge proof (ZKP) for verifying a solution to the Mastermind game without revealing the solution itself. The program uses cryptographic hashing and zk-SNARKs to prove that the player has correctly guessed the number of exact and near matches (black and white pegs) of a hidden solution.

## Prerequisites

- Circom 2.0.0 or higher

## Files and Directories

- mastermind_sha256.circom: Contains the SHA-256 hashing logic for the solution.
- comparators.circom: Imported from circomlib, used for equality and greater-than checks.
- bitify.circom: Imported from circomlib, used for bit-level operations.

## Inputs and Outputs

### Public Inputs

- pubGuessA, pubGuessB, pubGuessC, pubGuessD: The player's guesses for the puzzle.
- pubNumBlacks: The number of exact matches (black pegs) claimed by the prover.
- pubNumWhites: The number of near matches (white pegs) claimed by the prover.
- pubSolnHash: The hash of the solution, used for verification.

### Private Inputs

- privSolnA, privSolnB, privSolnC, privSolnD: The actual solution to the puzzle (hidden).
- privSalt: A salt used in hashing the solution for additional security.

### Outputs

- solnHashOut: The computed hash of the solution, compared against pubSolnHash for verification.

## Functionality

### Counting Black Pegs

The program compares each guess element with the corresponding solution element.
If they match, the black peg count (nb) is incremented.

### Counting White Pegs

- The program checks for matching elements between guesses and solution, excluding already matched pairs.
- For each potential match (excluding exact matches), if a guess element matches any solution element, the white peg count (nw) is incremented.

## ZK Proof

- The program ensures the counts of black and white pegs (pubNumBlacks and pubNumWhites) match the computed values (nb and nw).
- It uses SHA-256 hashing (via mastermind_sha256.circom) to verify the solution against the public solution hash (pubSolnHash).

## Appendix: Dapp repositories

The relevant repositories of the mastermind Dapp are as follows: 

1. [zk-mastermind-webdapp:](https://github.com/Modulo-P/zk-mastermind-webapp) Frontend application of the Mastermind Dapp.
2. [zk-mastermind-backend:](https://github.com/Modulo-P/zk-mastermind-backend) Backend application of the Mastermind Dapp.
3. [zk-mastermind-backend-onchain:](https://github.com/Modulo-P/zk-mastermind-backend-onchain) Hada mint contrat of the Mastermind Dapp.
4. [zk-mastermind-docker:](https://github.com/Modulo-P/zk-mastermind-docker) Docker container with the Kupo, Hydra and Cardano node components of the Dapp.
5. [zk-mastermind-circom:](https://github.com/Modulo-P/zk-mastermind-circom) Circom circuits of the mastermind Dapp.
6. [zk-mastermind-plutus:](https://github.com/Modulo-P/zk-mastermind-plutus) PlutusTx validator that implements the logic of the game.
7. [zk-mastermind-aiken:](https://github.com/Modulo-P/zk-mastermind-aiken) Aiken validator that implements the logic of the game.