import json
from pathlib import Path
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware  # v7+

class ChainService:
    def __init__(self, rpc_url: str, abi_path: str, contract_address: str, chain_id: int, private_key: str, public_address: str):
        self.rpc_url = rpc_url
        self.abi_path = abi_path
        self.contract_address = Web3.to_checksum_address(contract_address) if contract_address else None
        self.chain_id = chain_id
        self.private_key = private_key
        self.public_address = Web3.to_checksum_address(public_address) if public_address else None
        self.w3: Web3 | None = None
        self.contract = None

    async def async_init(self):
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        # Optional for local chains; harmless if not POA
        self.w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
        abi = json.loads(Path(self.abi_path).read_text())
        if self.contract_address:
            self.contract = self.w3.eth.contract(address=self.contract_address, abi=abi)

    def log_event(self, event_type: str, details_json: str) -> str:
        if not self.contract or not self.w3:
            raise RuntimeError("Blockchain not initialized")
        nonce = self.w3.eth.get_transaction_count(self.public_address)
        fn = self.contract.functions.emitEvent(event_type, details_json)
        tx = fn.build_transaction({
            "chainId": self.chain_id,
            "from": self.public_address,
            "nonce": nonce,
            "gas": 500000,
            "maxFeePerGas": self.w3.to_wei('2', 'gwei'),
            "maxPriorityFeePerGas": self.w3.to_wei('1', 'gwei'),
        })
        signed = self.w3.eth.account.sign_transaction(tx, private_key=self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed.rawTransaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()
