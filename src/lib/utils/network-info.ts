import type { Network } from "$lib/types"

const chainIdToNetwork = (chainId: string): Network => {
  const knownNetworks = {
    ["0x1"]: {
      name: "Ethereum Mainnet",
      nickname: "main",
      color: "#2BB6AE",
      id: "0x1"
    },
    ["0x3"]: {
      name: "Ropsten Test Network",
      nickname: "ropsten",
      color: "#FE4B8E",
      id: "0x3"
    },
    ["0x4"]: {
      name: "Rinkeby Test Network",
      nickname: "rinkeby",
      color: "#F6C344",
      id: "0x4"
    },
    ["0x42"]: {
      name: "Kovan Test Network",
      nickname: "kovan",
      color: "#9064FF",
      id: "0x42"
    },
    ["0x5"]: {
      name: "Goerli Test Network",
      nickname: "goerli",
      color: "#2F9AF2",
      id: "0x5"
    },
    ["0x61"]: {
      name: "Ethereum Classic Mainnet",
      nickname: "classic",
      color: "#CCC",
      id: "0x61"
    },
  }

  const unknownNetwork: Network = {
    name: "Unknown Network",
    nickname: "unknown",
    color: "#ccc",
    id: "0"
  };

  return knownNetworks[chainId] || unknownNetwork;
}

export { chainIdToNetwork }