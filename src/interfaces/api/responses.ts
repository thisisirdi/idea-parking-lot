import { NextResponse } from "next/server";

import { toErrorPayload } from "@/src/lib/errors";

export function ok<T>(data: T) {
  return NextResponse.json({ data }, { status: 200 });
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function fromError(error: unknown) {
  const payload = toErrorPayload(error);
  return NextResponse.json(payload.body, { status: payload.status });
}
