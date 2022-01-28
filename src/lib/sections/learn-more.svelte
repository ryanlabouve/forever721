<script lang="ts">
	import InfoCard from '$lib/ui/info-card.svelte';
	let metaData = [
		{
			label: 'Good',
			color: 'green',
			illo: '',
			heading: 'All meta data on chain',
			exampleLink: 'https://opensea.io/assets/0x25ed58c027921e14d86380ea2646e3a1b5c55a8b/5056',
			exampleLabel: 'Devs for the Revolution',
			description:
				'This is the best option that ensures all of your data is immutable and permanent.'
		},
		{
			label: 'Okay',
			color: 'yellow',
			illo: '',
			heading: 'Meta data stored on IPFS',
			example: '',
			description:
				'This provides a durable and distributed version of your meta data. Mostly good, but there are some risks.'
		},
		{
			label: 'Sketchy',
			color: 'red',
			illo: '',
			heading: 'Data stored on personal server',
			example: '',
			description:
				'High risk. One month of someone forgetting to pay their AWS bill and your NFT is gone.'
		}
	];

	let storage = [
		{
			label: 'Good',
			color: 'green',
			illo: '',
			heading: 'All storage on chain',
			exampleLink: 'https://opensea.io/assets/0x25ed58c027921e14d86380ea2646e3a1b5c55a8b/5056',
			exampleLabel: 'Devs for the Revolution',
			description:
				'The physical bits of the NFT are also on chain. This is typically cost-prohibitive, but the absolute best'
		},
		{
			label: 'Okay',
			color: 'yellow',
			illo: '',
			heading: 'Image stored on IPFS',
			example: '',
			description:
				'This provides a durable and distributed version of your meta data. Mostly good, but there are some risks.'
		},
		{
			label: 'Sketchy',
			color: 'red',
			illo: '',
			heading: 'Image on personal server',
			example: '',
			description:
				'High risk. One month of someone forgetting to pay their AWS bill and your NFT is gone.'
		}
	];
</script>

<div class="bg-zinc-200  py-8">
	<img class="xl:float-right  m-auto " style="max-width: 800px;" src="/images/protect.png" />
	<div class="max-w-4xl m-auto px-3 my-8 prose">
		<div class="heading text-5xl mb-3">Learn More</div>
		<div>
			<div class="mb-4">
				<div class="text-xl">Why did we make this?</div>
				<div>
					<div>↳ Help people new to NFTs understand what they are buying</div>
					<div>↳ Provide an accessible technical view of your NFT collection</div>
					<div>↳ Provide an easy backup solution to improve NFT durability and snapshot an NFT at a point in time.</div>
				</div>
			</div>
			<blockquote>
				When you are buying an NFT, the meaning is in the metadata. Ensuring the metadata is stored
				immutably and durably is key to enjoying your NFTs for years to come. 
			</blockquote>
			<div class="mb-4">
				<div class="text-xl">What is a Memento?</div>
				<div>
					<div>↳ A memento is a snapshot of your NFT, and is itself an NFT viewable in your wallet.</div>
					<div>↳ If the original NFT's metadata is lost or changed, the Memento is a backup using IPFS storage. </div>
					<div>↳ For dynamic NFTs, or NFTs that you later sell, it's a memory of what the NFT looked like. </div>
				</div>
			</div>
			<h3>What makes an NFT durable?</h3>
			<h4>
				<a href="https://opensea.io/blog/guides/non-fungible-tokens/#On-chain_vs_off-chain"
					>Metadata</a
				>
			</h4>
			<div class="grid grid-cols-3 gap-3">
				{#each metaData as d}
					<InfoCard {...d} />
				{/each}
			</div>
			<h4>
				<a href="https://opensea.io/blog/guides/non-fungible-tokens/#Off-chain_storage_solutions">
					Storage
				</a>
			</h4>
			<div class="grid grid-cols-3 gap-3">
				{#each storage as d}
					<InfoCard {...d} />
				{/each}
			</div>

			<h3>References</h3>
			<div>
				<div>
					<a href="https://newsletter.banklesshq.com/p/the-first-100m-in-nfts">
						https://newsletter.banklesshq.com/p/the-first-100m-in-nfts
					</a>
				</div>
				<div>
					<a href="https://future.a16z.com/nfts-thousand-true-fans/"
						>https://future.a16z.com/nfts-thousand-true-fans/</a
					>
				</div>
				<div>
					<a href="https://andrewsteinwold.substack.com/p/-quick-overview-of-the-nft-ecosystem"
						>https://andrewsteinwold.substack.com/p/-quick-overview-of-the-nft-ecosystem</a
					>
				</div>
				<div>
					<a
						href="https://linda.mirror.xyz/df649d61efb92c910464a4e74ae213c4cab150b9cbcc4b7fb6090fc77881a95d"
					>
						https://linda.mirror.xyz/df649d61efb92c910464a4e74ae213c4cab150b9cbcc4b7fb6090fc77881a95d
					</a>
				</div>
				<div>
					<a href="https://justincone.com/posts/nft-skeptics-guide/">
						https://justincone.com/posts/nft-skeptics-guide/
					</a>
				</div>
				<div>
					<a href="https://opensea.io/blog/guides/non-fungible-tokens/"
						>https://opensea.io/blog/guides/non-fungible-tokens/</a
					>
				</div>
				<div>
					<a href="https://tofunft.com/tools/validator">https://tofunft.com/tools/validator</a>
				</div>
			</div>
		</div>
	</div>
</div>
