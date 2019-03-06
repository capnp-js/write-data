/* @flow */

import * as assert from "assert";
import * as decode from "@capnp-js/read-data";
import { describe, it } from "mocha";
import { create, get, set } from "@capnp-js/bytes";

import * as encode from "../../src/index";

describe("bit", function () {
  const b = create(1);
  set(0, 0, b);

  it("sets one bit at a time within a byte", function () {
    encode.bit(true, b, 0, 0);
    assert.equal(get(0, b), 0x01);

    encode.bit(true, b, 0, 1);
    assert.equal(get(0, b), 0x03);

    encode.bit(true, b, 0, 7);
    assert.equal(get(0, b), 0x83);
  });
});

describe("int8", function () {
  const b = create(4);

  it("encodes -1 correctly", function () {
    encode.int8(-1, b, 0);
    assert.equal(decode.int8(b, 0), -1);
  });

  it("encodes -92 correctly", function () {
    encode.int8(-92, b, 1);
    assert.equal(decode.int8(b, 1), -92);
  });

  it("encodes 95 correctly", function () {
    encode.int8(95, b, 2);
    assert.equal(decode.int8(b, 2), 95);
  });

  it("encodes -128 correctly", function () {
    encode.int8(-128, b, 3);
    assert.equal(decode.int8(b, 3), -128);
  });
});

describe("int16", function () {
  const b = create(8);

  it("encodes -30913 correctly", function () {
    encode.int16(-30913, b, 0);
    assert.equal(decode.int16(b, 0), -30913);
  });

  it("encodes -3288 correctly", function () {
    encode.int16(-3288, b, 2);
    assert.equal(decode.int16(b, 2), -3288);
  });

  it("encodes 32311 correctly", function () {
    encode.int16(32311, b, 4);
    assert.equal(decode.int16(b, 4), 32311);
  });

  it("encodes 7816 correctly", function () {
    encode.int16(7816, b, 6);
    assert.equal(decode.int16(b, 6), 7816);
  });
});

describe("int32", function () {
  const b = create(16);

  it("encodes -752923624 correctly", function () {
    encode.int32(-752923624, b, 0);
    assert.equal(decode.int32(b, 0), -752923624);
  });

  it("encodes -1310517252 correctly", function () {
    encode.int32(-1310517252, b, 4);
    assert.equal(decode.int32(b, 4), -1310517252);
  });

  it("encodes 1377815832 correctly", function () {
    encode.int32(1377815832, b, 8);
    assert.equal(decode.int32(b, 8), 1377815832);
  });

  it("encodes 467873626 correctly", function () {
    encode.int32(467873626, b, 12);
    assert.equal(decode.int32(b, 12), 467873626);
  });
});

describe("uint8", function () {
  const b = create(4);

  it("encodes 255 correctly", function () {
    encode.uint8(255, b, 0);
    assert.equal(decode.uint8(b, 0), 255);
  });

  it("encodes 164 correctly", function () {
    encode.uint8(164, b, 1);
    assert.equal(decode.uint8(b, 1), 164);
  });

  it("encodes 95 correctly", function () {
    encode.uint8(95, b, 2);
    assert.equal(decode.uint8(b, 2), 95);
  });

  it("encodes 128 correctly", function () {
    encode.uint8(128, b, 3);
    assert.equal(decode.uint8(b, 3), 128);
  });
});

describe("uint16", function () {
  const b = create(8);

  it("encodes 34623 correctly", function () {
    encode.uint16(34623, b, 0);
    assert.equal(decode.uint16(b, 0), 34623);
  });

  it("encodes 62248 correctly", function () {
    encode.uint16(62248, b, 2);
    assert.equal(decode.uint16(b, 2), 62248);
  });

  it("encodes 32311 correctly", function () {
    encode.uint16(32311, b, 4);
    assert.equal(decode.uint16(b, 4), 32311);
  });

  it("encodes 7816 correctly", function () {
    encode.uint16(7816, b, 6);
    assert.equal(decode.uint16(b, 6), 7816);
  });
});

describe("float32", function () {
  const epsilon = Math.pow(2, -24);

  it("encodes 25622.3 within float 32 epsilon", function () {
    const v = 25622.3;
    assert.ok(Math.abs(v - decode.float32(encode.float32(v))) < Math.abs(v*epsilon));
  });

  it("encodes -0.00000128198 within float 32 epsilon", function () {
    const v = -0.00000128198;
    assert.ok(Math.abs(v - decode.float32(encode.float32(v))) < Math.abs(v*epsilon));
  });

  it("encodes NaN correctly", function () {
    assert.ok(Number.isNaN(decode.float32(encode.float32(NaN))));
  });

  it("encodes Infinity correctly", function () {
    const v = Infinity;
    assert.equal(decode.float32(encode.float32(v)), v);
  });

  it("encodes -Infinity correctly", function () {
    const v = -Infinity;
    assert.equal(decode.float32(encode.float32(v)), v);
  });
});

describe("float64", function () {
  const epsilon = Math.pow(2, -53);

  it("encodes 10987.11729817261 within float 64 epsilon", function () {
    const v = 10987.11729817261;
    const bytes = encode.float64(v);
    assert.ok(Math.abs(v - decode.float64(bytes)) < Math.abs(v*epsilon));
  });

  it("encodes -0.00981718769187 within float 64 epsilon", function () {
    const v = -0.00981718769187;
    const bytes = encode.float64(v);
    assert.ok(Math.abs(v - decode.float64(bytes)) < Math.abs(v*epsilon));
  });

  it("encodes NaN correctly", function () {
    const bytes = encode.float64(NaN);
    assert.ok(Number.isNaN(decode.float64(bytes)));
  });

  it("encodes Infinity correctly", function () {
    const v = Infinity;
    const bytes = encode.float64(v);
    assert.equal(decode.float64(bytes), v);
  });

  it("encodes -Infinity correctly", function () {
    const v = -Infinity;
    const bytes = encode.float64(v);
    assert.equal(decode.float64(bytes), v);
  });
});
