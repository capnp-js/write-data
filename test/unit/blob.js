/* @flow */

import test from "ava";

import * as decode from "@capnp-js/read-data";

import * as encode from "../../src/index";

test("`bit`", t => {
  const b = new Uint8Array(1);
  b[0] = 0;

  encode.bit(true, b, 0, 0);
  encode.bit(true, b, 0, 1);
  encode.bit(true, b, 0, 7);

  t.is(b[0], 0x83);
});

test("`int8`", t => {
  t.plan(4);

  const b = new Uint8Array(4);

  encode.int8(-1, b, 0);
  t.is(decode.int8(b, 0), -1);

  encode.int8(-92, b, 1);
  t.is(decode.int8(b, 1), -92);

  encode.int8(95, b, 2);
  t.is(decode.int8(b, 2), 95);

  encode.int8(-128, b, 3);
  t.is(decode.int8(b, 3), -128);
});

test("`int16`", t => {
  t.plan(4);

  const b = new Uint8Array(8);

  encode.int16(-30913, b, 0);
  t.is(decode.int16(b, 0), -30913);

  encode.int16(-3288, b, 2);
  t.is(decode.int16(b, 2), -3288);

  encode.int16(32311, b, 4);
  t.is(decode.int16(b, 4), 32311);

  encode.int16(7816, b, 6);
  t.is(decode.int16(b, 6), 7816);
});

test("`int32`", t => {
  t.plan(4);

  const b = new Uint8Array(16);

  encode.int32(-752923624, b, 0);
  t.is(decode.int32(b, 0), -752923624);

  encode.int32(-1310517252, b, 4);
  t.is(decode.int32(b, 4), -1310517252);

  encode.int32(1377815832, b, 8);
  t.is(decode.int32(b, 8), 1377815832);

  encode.int32(467873626, b, 12);
  t.is(decode.int32(b, 12), 467873626);
});

test("`uint8`", t => {
  t.plan(4);

  const b = new Uint8Array(4);

  encode.uint8(255, b, 0);
  t.is(decode.uint8(b, 0), 255);

  encode.uint8(164, b, 1);
  t.is(decode.uint8(b, 1), 164);

  encode.uint8(95, b, 2);
  t.is(decode.uint8(b, 2), 95);

  encode.uint8(128, b, 3);
  t.is(decode.uint8(b, 3), 128);
});

test("`uint16`", t => {
  t.plan(4);

  const b = new Uint8Array(8);

  encode.uint16(34623, b, 0);
  t.is(decode.uint16(b, 0), 34623);

  encode.uint16(62248, b, 2);
  t.is(decode.uint16(b, 2), 62248);

  encode.uint16(32311, b, 4);
  t.is(decode.uint16(b, 4), 32311);

  encode.uint16(7816, b, 6);
  t.is(decode.uint16(b, 6), 7816);
});

test("`float32`", t => {
  t.plan(5);

  const epsilon = Math.pow(2, -24);

  const v1 = 25622.3;
  t.true(Math.abs(v1 - decode.float32(encode.float32(v1))) < Math.abs(v1*epsilon));

  const v2 = -0.00000128198;
  t.true(Math.abs(v2 - decode.float32(encode.float32(v2))) < Math.abs(v2*epsilon));

  const v3 = NaN;
  t.is(decode.float32(encode.float32(v3)), v3);

  const v4 = Infinity;
  t.is(decode.float32(encode.float32(v4)), v4);

  const v5 = -Infinity;
  t.is(decode.float32(encode.float32(v5)), v5);
});

test("`float64`", t => {
  t.plan(5);

  const epsilon = Math.pow(2, -53);

  const v1 = 10987.11729817261;
  const bytes1 = encode.float64(v1);
  t.true(Math.abs(v1 - decode.float64(bytes1)) < Math.abs(v1*epsilon));

  const v2 = -0.00981718769187;
  const bytes2 = encode.float64(v2);
  t.true(Math.abs(v2 - decode.float64(bytes2)) < Math.abs(v2*epsilon));

  const v3 = NaN;
  const bytes3 = encode.float64(v3);
  t.is(decode.float64(bytes3), v3);

  const v4 = Infinity;
  const bytes4 = encode.float64(v4);
  t.is(decode.float64(bytes4), v4);

  const v5 = -Infinity;
  const bytes5 = encode.float64(v5);
  t.is(decode.float64(bytes5), v5);
});
