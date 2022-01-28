<script lang="ts">
	export let url;
</script>

<svg
	width="1205"
	height="904"
	viewBox="0 0 1205 904"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g clip-path="url(#clip0_7_73)">
		<rect width="1205" height="904" fill="white" />
		<rect width="1205" height="904" fill="url(#paint0_linear_7_73)" />
		<g filter="url(#filter0_d_7_73)">
			<rect x="176" y="70" width="854" height="783" fill="white" />
		</g>
		<image x="225" y="108" width="756" height="641" href={url} />
	</g>
	<defs>
		<filter
			id="filter0_d_7_73"
			x="132"
			y="40"
			width="942"
			height="871"
			filterUnits="userSpaceOnUse"
			color-interpolation-filters="sRGB"
		>
			<feFlood flood-opacity="0" result="BackgroundImageFix" />
			<feColorMatrix
				in="SourceAlpha"
				type="matrix"
				values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				result="hardAlpha"
			/>
			<feMorphology
				radius="20"
				operator="dilate"
				in="SourceAlpha"
				result="effect1_dropShadow_7_73"
			/>
			<feOffset dy="14" />
			<feGaussianBlur stdDeviation="12" />
			<feComposite in2="hardAlpha" operator="out" />
			<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
			<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7_73" />
			<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7_73" result="shape" />
		</filter>
		<linearGradient
			id="paint0_linear_7_73"
			x1="685"
			y1="1138"
			x2="685"
			y2="-272.5"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#FD98AB" />
			<stop offset="1" stop-color="#8CFFE3" />
		</linearGradient>
		<clipPath id="clip0_7_73">
			<rect width="1205" height="904" fill="white" />
		</clipPath>
	</defs>
</svg>
