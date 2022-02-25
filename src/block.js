const crypto = require("crypto"); // Used for encryption algorithms; Built-in

// Define a SHA256 hash function from our crypto library

function SHA256(message) {

    return crypto

        .createHash("sha256") // Set the hashing algorithm to SHA256

        .update(message) // Update the hash with the message

        .digest("hex"); // Return the hash as a hexadecimal string

}

class Block {

    constructor(prevHash = "", transactions = []) {

        this.timestamp = Date.now(); // Set the timestamp to now

        this.transactions = transactions; // Transaction list

        this.hash = this.getHash(); // Current block's hash

        this.prevHash = prevHash; // Previous block's hash

        this.nonce = 0; // Some random value for mining purposes



        // Mine the block

        this.mine();

    }
    // Returns the hash of the current block

    getHash() {

        // Combine all transactions into strings

        let txStr = "";

        for (let i = 0; i < this.transactions.length; i++) {

            txStr += JSON.stringify(this.transactions[i]);

        }



        // Hash together...

        return SHA256(

            this.prevHash + // The previous hash,

                this.timestamp + // The timestamp of the block,

                txStr + // And all transactions,

                this.nonce // And let's toss in some random nonce for fun

        );

    }
    mine() {

        // Let's loop until our hash starts with a string 0...000

        //  The length of this string is set through difficulty (default: 1)

        let checkString = Array(global.difficulty + 1).join("0");



        let tries = 0;

        while (!this.hash.startsWith(checkString)) {

            // Increase the nonce so we get a whole different hash

            this.nonce++;



            // Recompute the entire hash

            this.hash = this.getHash();



            // Count our tries!

            tries++;

        }



        // Out of curiosity, let's see how many tries we took!

        console.log(`Block mined with ${tries} attempts. Hash: ${this.hash}`);

    }

    prettify() {

        // Add basic block parameters

        let blockStr = `<div><b>Block</b> #${this.hash}</div>`;

        blockStr += `<div><b>Timestamp:</b> ${this.timestamp}</div>`;

        blockStr += `<div><b>Previous Hash:</b> ${this.prevHash}</div>`;



        blockStr += "<div><b>Transactions:</b></div><div>";

        // Iterate through all transactions

        for (let i = 0; i < this.transactions.length; i++) {

            blockStr += "    " + this.transactions[i].prettify();

        }

        blockStr += "</div>";



        return blockStr;

    }

}
const Block = require("./block"); // Our class definition for a block



class Blockchain {

    constructor() {

        // Chain array contains all blocks in our copy of the blockchain

        this.chain = [new Block(Array(65).join("0"))]; // Create genesis block

    }
    getLastBlock() {

        return this.chain[this.chain.length - 1];

    }
    getChainLength() {

        return this.chain.length;

    }
    addBlock() {

        // Mine a new block with the previous block's hash

        let newBlock = new Block(this.getLastBlock().hash, global.transactions);



        // Let's add the new block to the chain, and make it immutable

        this.chain.push(Object.freeze(newBlock));

    }
    isChainValid(blockchain = this) {

        // Iterate over the chain, skipping the genesis block (i=1)

        for (let i = 1; i < blockchain.chain.length; i++) {

            const currentBlock = blockchain.chain[i];

            const prevBlock = blockchain.chain[i - 1];



            // Validate the current block's hash from the previous

            if (

                // Check the hash, which was mined

                currentBlock.hash !== currentBlock.getHash() ||

                // Check that the current block's prevHash matches

                prevBlock.hash !== currentBlock.prevHash

            ) {

                return false;

            }



            // Check the hash validity

            let checkString = Array(global.difficulty + 1).join("0");

            if (!currentBlock.hash.startsWith(checkString)) {

                return false;

            }

        }



        // At this point, all the blocks in the chain line up with hashes

        //  so the chain is valid

        return true;

    }
    replaceChain(newChain) {

        // Check the length of the new chain

        if (newChain.length <= this.chain.length) return;



        // Check that the new chain is valid

        if (!this.isChainValid(newChain)) return;



        // The new chain is valid, and longer, so let's replace ours

        this.chain = newChain;

    }
    prettify() {

        let chainStr = "";

        for (let i = 0; i < this.chain.length; i++) {

            chainStr += this.chain[i].prettify();

            chainStr += "<br><hr>";

        }

        return chainStr;

    }

}