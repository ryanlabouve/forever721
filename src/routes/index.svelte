<script lang="ts">
	import { ethers } from 'ethers';
	import Web3Modal from 'web3modal';
	import { onMount } from 'svelte';
	import { env } from '$lib/constants';

	import Button from '$lib/ui/button.svelte';

	let contractAddress: string = '0x8943c7bac1914c9a7aba750bf2b6b09fd21037e0';
	let contractABI: string = '';
	let web3Modal;
	let instance;
	let provider;
	let signer;

	const providerOptions = {
		/* See Provider Options Section */
	};

	onMount(() => {
		web3Modal = new Web3Modal({
			network: 'mainnet', // optional
			cacheProvider: true, // optional
			providerOptions // required
		});

		// getABI();
	});

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

	async function connectWallet() {
		instance = await web3Modal.connect();
		provider = new ethers.providers.Web3Provider(instance);

		signer = provider.getSigner();

		let lastBLockNumber = await provider.getBlockNumber();
		let balance = await provider.getBalance('ryanlabouve.eth');

		let contract = new ethers.Contract(contractAddress, contractABI, provider);
		let uri = await contract.tokenURI(1); // 1 is just the id of dis token
		debugger;
	}

	function debugModal() {
		let a = web3Modal;
		debugger;
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="max-w-3xl m-auto px-3" />
<div class="bg-pink-300 py-8">
	<div class="max-w-3xl m-auto px-3 ">
		<div class="text-2xl text-white">DEBUG</div>
		<Button onClick={() => connectWallet()}>Connect Wallet and get tokenuri</Button>
		<Button onClick={() => debugModal()}>Debug Modal</Button>
	</div>
</div>
