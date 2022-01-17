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
	<title>NFTrusty</title>
</svelte:head>

<div class="max-w-4xl m-auto px-3 my-8">
	<div class="grid grid-cols-2 gap-4">
		<div class="flex flex-col justify-center">
			<div class="text-3xl heading">What's in your NFT? Let's find out.</div>
			<div class="mb-4">
				When you buy NFTs you are buying the metadata. Learn what's in it and what you can do to
				improve it.
			</div>
			<div>
				<Button>Connect Wallet</Button>
			</div>
		</div>
		<div>
			<img
				class=""
				style="transform: perspective(1500px) rotateY(-35deg);"
				src="/images/badhero.png"
				alt=" Bad hero"
			/>
		</div>
	</div>
</div>

<div class="bg-zinc-700 text-white py-8">
	<div class="max-w-4xl m-auto px-3 my-8">
		<div class="heading text-5xl">Scan an NFT</div>
	</div>
</div>

<div class="bg-zinc-200  py-8">
	<div class="max-w-4xl m-auto px-3 my-8">
		<div class="heading text-5xl">Learn More</div>
	</div>
</div>

<div class="bg-pink-300 py-8">
	<div class="max-w-3xl m-auto px-3 ">
		<div class="text-2xl text-white">DEBUG</div>
		<Button onClick={() => connectWallet()}>Connect Wallet and get tokenuri</Button>
		<Button onClick={() => debugModal()}>Debug Modal</Button>
	</div>
</div>

<div class="py-8">
	<div class="max-w-4xl m-auto px-3 my-8">
		<footer class="bg-white">
			<div class="mb-4 ">
				<p class="text-center text-base text-gray-400">
					&copy; 2022. No rights reserved. Go protect your NFTs
				</p>
			</div>
			<div class="flex justify-center space-x-6 ">
				<a href="#" class="text-gray-400 hover:text-gray-500">
					<span class="sr-only">GitHub</span>
					<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
			</div>
		</footer>
	</div>
</div>
