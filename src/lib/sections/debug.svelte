<script lang="ts">
	import { ethers } from 'ethers';
	import { readLS, writeLS } from '$lib/local-storage';
	import { user } from '$lib/stores/user';

	import defaultAbi from '$lib/defaultAbi';
	import dummyNftCollection from '$lib/dummyNftCollection';

	import Button from '$lib/ui/button.svelte';
	import { connectWallet } from '$lib/utils/connect-wallet';

	export let loadCollection = () => {};

	async function readNFT() {
		let randoNFT = dummyNftCollection[0];
		let saddness = new ethers.Contract(
			randoNFT.primary_asset_contracts[0].address,
			defaultAbi,
			$user.provider
		);

		let a = await saddness.tokenURI(5);
		debugger;
	}

	async function getABI() {
		let etherscanURL = `http://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${env.etherscanKey}`;
		try {
			let response = await fetch(etherscanURL);

			if (!response.ok) {
				throw 'Error calling etherscan';
			}

			let json = await response.json();
			contractABI = json.result;
		} catch (e) {
			console.error(e);
		}
	}

	async function tryDopp() {
		// Params:
		let walletAddress = $user.walletAddress;
		let dopContractAddress = '0x823CFCe3571e2f3E7897e5E6B1082170bfbFED2d';
		// Contract address
		let contractAddress = '0x6eee7ca9d7c541081ac35f8d995698f9a51ec89e';
		let tokenId = '1';

		// Doing:
		// Load ABI
		// Call dopp contract with params
		let dopAbi;
		let saddness = new ethers.Contract(dopContractAddress, dopAbi, $user.signer);
		let resultOfSadness = await saddness.snapshot(contractAddress, tokenId);
		let resultOfWaitingOnSadness = await resultOfSadness.wait();

		// let waitingOnSaddnessWorked = resultOfWaitingOnSadness.events.include(
		// 	(f) => f.event === 'SnapshotCreated'
		// );

		// resultOfWaitingOnSadness.to
		// resultOfWaitingOnSadness.transactionHash
		// new token id? resultOfWaitingOnSadness.events[0].args[2] ==> 0x02
		// new token id? resultOfWaitingOnSadness.events[0].tokenId ==> 0x02
		// new token id? resultOfWaitingOnSadness.events[1].args[1] ==> 0x02

		debugger;
		// Show a success by reacitng to Emit
	}

	let contractAddress: string = '0x8943c7bac1914c9a7aba750bf2b6b09fd21037e0';
	let contractABI: string = '';
</script>

<div class="bg-pink-300 py-8">
	<div class="max-w-3xl m-auto px-3 ">
		<div class="text-2xl text-white">DEBUG</div>
		<Button onClick={connectWallet}>Connect Wallet and get tokenuri</Button>
		<Button onClick={() => loadCollection()}>Load Collection</Button>
		<Button onClick={() => readNFT()}>Read metadata from NFT</Button>
		<Button onClick={() => tryDopp()}>Try to make a doppleganger</Button>
		<div>
			<input
				type="checkbox"
				checked={!!readLS('debugMode')}
				on:click={() => writeLS('debugMode', !readLS('debugMode'))}
			/>
			Debug Mode
		</div>
	</div>
</div>
