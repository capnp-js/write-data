/* @flow */

import type { Int64 } from "@capnp-js/int64";

import { inject } from "@capnp-js/int64";

/* Unsigned integer types. */
type uint = number;
type u3 = 0x00 | 0x01 | 0x02 | 0x03 | 0x04 | 0x05 | 0x06 | 0x07;
type u32 = number;

/* Signed integer types. */
type i32 = number;

/* Floating point types. */
type f32 = number;
type f64 = number;

export function bit(value: boolean, bytes: Uint8Array, position: uint, bitPosition: u3): void {
  /* Before I set the bit with an `|` operator, I need to zero it out. */
  bytes[position] = bytes[position] & ~(0x01 << bitPosition);

  if (value) {
    bytes[position] = bytes[position] | (0x01 << bitPosition);
  }
}

export function int8(value: i32, bytes: Uint8Array, position: uint): void {
  bytes[position] = value;
}

export function int16(value: i32, bytes: Uint8Array, position: uint): void {
  bytes[position] = value;
  value >>= 8;
  bytes[++position] = value;
}

export function int32(value: i32, bytes: Uint8Array, position: uint): void {
  bytes[position] = value;
  value >>= 8;
  bytes[++position] = value;
  value >>= 8;
  bytes[++position] = value;
  value >>= 8;
  bytes[++position] = value;
}

export function uint8(value: u32, bytes: Uint8Array, position: uint): void {
  int8(value, bytes, position);
}

export function uint16(value: u32, bytes: Uint8Array, position: uint): void {
  int16(value, bytes, position);
}

export function uint32(value: u32, bytes: Uint8Array, position: uint): void {
  int32(value, bytes, position);
}

const buffer = new ArrayBuffer(8);
const i32View = new Int32Array(buffer);
const u8View = new Int8Array(buffer);
i32View[0] = 1;
const leMachine = u8View[0] === 1;

const f32View = new Float32Array(buffer);
const f64View = new Float64Array(buffer);

function leMachineFloat32(value: f32): i32 {
  f32View[0] = value;
  return i32View[0];
}

function beMachineFloat32(value: f32): i32 {
  f32View[0] = value;

  let bytes = u8View[0] << 24;
  bytes |= u8View[1] << 16;
  bytes |= u8View[2] << 8;
  bytes |= u8View[3];

  return bytes;
}

export const float32: (value: f32) => i32 = leMachine ? leMachineFloat32 : beMachineFloat32;

function leMachineFloat64(value: f64): Int64 {
  f64View[0] = value;

  return inject(i32View[1], i32View[0]);
}

function beMachineFloat64(value: f64): Int64 {
  f64View[0] = value;

  let hi = u8View[0] << 24;
  hi |= u8View[1] << 16;
  hi |= u8View[2] << 8;
  hi |= u8View[3];

  let lo = u8View[4] << 24;
  lo |= u8View[5] << 16;
  lo |= u8View[6] << 8;
  lo |= u8View[7];

  return inject(hi, lo);
}

export const float64: (value: f64) => Int64 = leMachine ? leMachineFloat64 : beMachineFloat64;
