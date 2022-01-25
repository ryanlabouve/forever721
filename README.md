# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte);

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
```

> Note: the `@next` is temporary

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.

## Env vars

Envs are handled by https://direnv.net/

`.envrc`

https://etherscan.io/myapikey

Note: ENVs need to start with `VITE_` to be sent to the frontend.

```
export VITE_ETHERSCAN_KEY="datkey"
```

## Tasks
* Get collection of NFTs

  * [x] Connect wallet
  * [x] Get current Wallet address
  * [x] (Bonus) Get ENS for current address 
    ```js
      await provider.lookupAddress("0x5555763613a12D8F3e73be831DFf8598089d3dCa");
    ```
  * [x] Query opensea for NFTs on current address
  * [ ] Make it pretty

## Designs
https://www.figma.com/file/KgKoOQtHUaCgBrSPzqV4wm/Untitled?node-id=3%3A104
https://heroicons.dev/?query=lock
https://3dtransforms.desandro.com/perspective
https://fonts.google.com/specimen/Fira+Sans?query=fira+sans
https://fonts.google.com/specimen/Fira+Sans+Extra+Condensed?query=conden
https://tailwindcss.com/docs/customizing-colors