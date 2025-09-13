# scripts/deploy_security_events.py
import json, os
from web3 import Web3

SOLIDITY_ABI = [
  {"inputs":[{"internalType":"string","name":"eventType","type":"string"},{"internalType":"string","name":"detailsJson","type":"string"}],"name":"emitEvent","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"anonymous":False,"inputs":[{"indexed":False,"internalType":"string","name":"eventType","type":"string"},{"indexed":False,"internalType":"string","name":"detailsJson","type":"string"}],"name":"SecurityEvent","type":"event"}
]

SOLIDITY_BYTECODE = "0x6080..."  # compile your contract and paste bytecode here

RPC = os.getenv("BLOCKCHAIN_RPC", "http://127.0.0.1:7545")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
PUBLIC_ADDRESS = os.getenv("PUBLIC_ADDRESS")
CHAIN_ID = int(os.getenv("CHAIN_ID", "1337"))

w3 = Web3(Web3.HTTPProvider(RPC))
acct = Web3.to_checksum_address(PUBLIC_ADDRESS)
nonce = w3.eth.get_transaction_count(acct)

Contract = w3.eth.contract(abi=SOLIDITY_ABI, bytecode=SOLIDITY_BYTECODE)
tx = Contract.constructor().build_transaction({
    "from": acct,
    "nonce": nonce,
    "chainId": CHAIN_ID,
    "gas": 2_000_000,
    "gasPrice": w3.eth.gas_price,
})
signed = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

print("ADDRESS", receipt.contractAddress)
with open("contracts/address.txt","w") as f: f.write(receipt.contractAddress)
with open("contracts/SecurityEvents.json","w") as f: json.dump(SOLIDITY_ABI, f)
