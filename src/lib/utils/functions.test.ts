import { isBase64 } from './functions';

test('#isBase64', () => {
  expect(isBase64("not base64")).toBe(false);
});