import { isBase64,
  evaluateNft,
  NftEvaluation,
  ImageGrade,
  UriType,
  ImageLocation } from './functions';

// lazy lions
// source: https://etherscan.io/address/0x8943c7bac1914c9a7aba750bf2b6b09fd21037e0
const g_lazy_lions_label = "LAZY LIONS";

// ALPACADABRA
const g_alpacadabra_label = "ALPACADABRA";
// source: https://etherscan.io/address/0x3db5463a9e2d04334192c6f2dd4b72def4751a61

// Devs for revolution
// source: https://etherscan.io/address/0x25ed58c027921e14d86380ea2646e3a1b5c55a8b
const g_devs_for_revolution_label = "DEVS FOR REVOLUTION";

// // TODO: hashmasks does store metadata on-chain but does not use URI
// // Hashmasks
// // source: https://etherscan.io/address/0xC2C747E0F7004F9E8817Db2ca4997657a7746928
// // token id = 431
// const g_hashmask_label = "Hashmasks";

const g_lazy_lions_metadata = {
  "name": "#6646",
  "description": "Lazy Lions",
  "external_url": "https://www.lazylionsnft.com/",
  "image": "ipfs://QmZ4JzdgUf6CiWVe3KJCwm7SckWLM2maNwpw54SbyKX943",
}
const g_lazy_lions_expected_evaluation =
    new NftEvaluation(
        ImageGrade.Red,
        UriType.PrivateServer,
        ImageLocation.PrivateServer,
        g_lazy_lions_metadata
    );

const g_alpacadabra_metadata = {
  "name": "ALPACADABRA #487",
  "image": "ipfs://QmVBfEV4M9pCNoZsYNn4Ku27PpxVuAtGneuLYCGirMhDpU"
}
const g_alpacadabra_evaluation =
    new NftEvaluation(
        ImageGrade.Green,
        UriType.IpfsLink,
        ImageLocation.Ipfs,
        g_alpacadabra_metadata
    );

const g_devs_for_revs_metadata = {"name": "Dev #3364"}
const g_devs_for_revs_evaluation =
    new NftEvaluation(
        ImageGrade.Green,
        UriType.OnChain,
        ImageLocation.InMetadata,
        g_devs_for_revs_metadata
    );


const g_nft_examples = {
  "LAZY LIONS": {
    "token_id": 6646,
    "base_uri": "https://metadata.lazylionsnft.com/api/lazylions/",
    "token_uri": "https://metadata.lazylionsnft.com/api/lazylions/6646",
    "expected_output": {
      "evaluation": g_lazy_lions_expected_evaluation,
      "metadata": g_lazy_lions_metadata
    },
  },
  "ALPACADABRA": {
    "token_id": 487,
    "base_uri": "ipfs://QmZBZjHSEmcYgFvSNQCwzfNsXwZdUBcjn3PA9pRojpFJQi/",
    "token_uri": "ipfs://QmZBZjHSEmcYgFvSNQCwzfNsXwZdUBcjn3PA9pRojpFJQi/487",
    "expected_output": {
      "evaluation": g_alpacadabra_evaluation,
      "metadata": g_alpacadabra_metadata
    }
  },
  "DEVS FOR REVOLUTION": {
    "token_id": 3364,
    "base_uri": "",
    "token_uri": "eyJuYW1lIjogIkRldiAjMzM2NCIsICJkZXNjcmlwdGlvbiI6ICJEZXZlbG9wZXJzIGFyb3VuZCB0aGUgd29ybGQgYXJlIHRpcmVkIG9mIHdvcmtpbmcgYW5kIGNvbnRyaWJ1dGluZyB0aGVpciB0aW1lIGFuZCBlZmZvcnQgdG8gZW5yaWNoIHRoZSB0b3AgMSUuIEpvaW4gdGhlIG1vdmVtZW50IHRoYXQgaXMgY29tbXVuaXR5IG93bmVkLCBidWlsZGluZyB0aGUgZnV0dXJlIGZyb20gdGhlIGJvdHRvbSB1cC4iLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUluaE5hVzVaVFdsdUlHMWxaWFFpSUhacFpYZENiM2c5SWpBZ01DQXpOVEFnTXpVd0lqNDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUJpYkdGamF6c2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURFMGNIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW5kb2FYUmxJaUF2UGp4MFpYaDBJSGc5SWpFd0lpQjVQU0l5TUNJZ1kyeGhjM005SW1KaGMyVWlQa3RoYkdrZ1RHbHVkWGc4TDNSbGVIUStQSFJsZUhRZ2VEMGlNVEFpSUhrOUlqUXdJaUJqYkdGemN6MGlZbUZ6WlNJK1JXMWhZM004TDNSbGVIUStQSFJsZUhRZ2VEMGlNVEFpSUhrOUlqWXdJaUJqYkdGemN6MGlZbUZ6WlNJK1RtRjJlU0JUZFdsMFBDOTBaWGgwUGp4MFpYaDBJSGc5SWpFd0lpQjVQU0k0TUNJZ1kyeGhjM005SW1KaGMyVWlQbEJJVUR3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlNVEF3SWlCamJHRnpjejBpWW1GelpTSStSVzUyYVhKdmJtMWxiblJoYkR3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlNVEl3SWlCamJHRnpjejBpWW1GelpTSStVbUZ0WVd4c1lXZzhMM1JsZUhRK1BIUmxlSFFnZUQwaU1UQWlJSGs5SWpFME1DSWdZMnhoYzNNOUltSmhjMlVpUGtScGRtVnlaMlZ1ZER3dmRHVjRkRDQ4ZEdWNGRDQjRQU0l4TUNJZ2VUMGlNVFl3SWlCamJHRnpjejBpWW1GelpTSStTbTl1UjI5c1pEd3ZkR1Y0ZEQ0OEwzTjJaejQ9In0=",
    "expected_output": {
      "evaluation": g_devs_for_revs_evaluation
    },
  },
}

describe("isBase64", function () {

  test('#isBase64', () => {
    expect(isBase64("not base64")).toBe(false);

    const expected_decoded = "Many hands make light work.";
    const expected_encoded = "TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu";
    expect(isBase64(expected_encoded)).toBe(true);
  });

  test('#isBase64#devs for revolution uri', () => {
    const token_uri = g_nft_examples[g_devs_for_revolution_label]["token_uri"]
    const realized = isBase64(token_uri);
    expect(realized).toEqual(true);
  });

});



describe("evaluateNft", function () {

  test('#evaluateNft', async () => {

    const all_nft_examples = [g_lazy_lions_label, g_alpacadabra_label, g_devs_for_revolution_label];
    // const all_nft_examples = [g_lazy_lions_label];

    for(let ex_index = 0; ex_index < all_nft_examples.length; ex_index++) {
      const nft_example = all_nft_examples[ex_index];
      const token_uri = g_nft_examples[nft_example]["token_uri"]

      // call
      const realized_evaluation = await evaluateNft(token_uri);

      // verify output - nft evaluation
      {
        const expected_evaluation =
            g_nft_examples[nft_example]["expected_output"]["evaluation"]
        expect(realized_evaluation.image_grade).toEqual(expected_evaluation.image_grade);
        expect(realized_evaluation.uri_type).toEqual(expected_evaluation.uri_type);
        expect(realized_evaluation.image_location).toEqual(expected_evaluation.image_location);

        // verify output - metadata
        const expected_metadata = expected_evaluation.nft_metadata;
        const realized_metadata = realized_evaluation.nft_metadata;

        // for the keys we have defined check that they align with what is in realized metadat
        for (const [key, value] of Object.entries(expected_metadata)) {
          expect(realized_metadata[key]).toEqual(value);
        }

        // special dispensation for nft = devs for revolution
        // ->  metadata.image = SVG format that is too long to evaluate here
        // --> just verify that it starts with the correct pattern
        if(nft_example == g_devs_for_revolution_label) {
          expect(realized_metadata.image.startsWith("data:image/svg+xml;base64,")).toEqual(true);
        }
      }
    }
  });
});
