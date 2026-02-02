# ID - simple time-sortable ID generator

Generate time-sortable ID strings using high-precision timestamps and random bytes.

## Usage

```shell
npm i @steebchen/id
yarn add @steebchen/id
pnpm add @steebchen/id
bun add @steebchen/id
```

```typescript
import { id } from '@steebchen/id';

console.log(id()); // e.g., "000268cGxq69aAAzT2zw"
```

## Why use time-sortable IDs?

Time-sortable IDs combine the benefits of timestamps with unique identifiers:

- **Chronological ordering**: IDs sort naturally by creation time without needing a separate timestamp field
- **Debugging friendly**: You can visually see the relative age of an ID
- **Distributed system safe**: Generate IDs across multiple servers without coordination or collisions
- **B-tree friendly**: Sequential IDs improve database index performance (though random suffixes help prevent hotspots)
- **URL safe**: Base62 encoding (a-zA-Z0-9) works in URLs without escaping

Advantages of using these as primary keys:
- **No coordination needed**: Generate IDs anywhere (app servers, edge functions, client-side) without database round-trips
- **Natural ordering**: Recent records cluster together in indexes, improving cache locality for time-based queries
- **Publicly exposable**: Unlike sequential integers, these don't leak information about your data volume or growth rate
- **Merge-friendly**: Easy to merge databases or migrate data between systems without ID conflicts

Note that using more space efficient data types such as UUIDs might still be more performant especially on scale on databases.

## How it works

The ID generator creates 20-character strings that are guaranteed to be time-sortable:

- **14 characters**: High-precision timestamp (nanosecond resolution when available), encoded in base62
- **6 characters**: Cryptographically random bytes, encoded in base62
- **Character set**: `a-zA-Z0-9` (base62 encoding)
- **Lifespan**: The 14-character timestamp encoding supports dates for over 392 million years

The timestamp portion uses `process.hrtime.bigint()` for nanosecond precision when available (Node.js), ensuring unique timestamps even in tight loops. The random bytes provide additional uniqueness across different machines.

## Example

```typescript
import { id } from '@steebchen/id';

console.log(id()); // e.g., "00BpN8qJiMEeF4kWJlmvn"
console.log(id()); // e.g., "00BpN8qJiMEeGxYzAbCdE"
console.log(id()); // e.g., "00BpN8qJiMEfH2oPqRsTu"
```

IDs generated later will always sort after earlier ones:

```typescript
const ids = [id(), id(), id()];
console.log(ids); // Already sorted chronologically
ids.sort(); // Still in chronological order
```

## Random String Generation

The library also exports a `random()` function for generating random strings of a specified length:

```typescript
import { random } from '@steebchen/id';

console.log(random(8));  // e.g., "Kx9mPqL2"
console.log(random(16)); // e.g., "aB3dEf7HjKmN2pQr"
```

This is useful when you need random identifiers without the time-sortable prefix, such as for tokens, session IDs, or other cases where chronological ordering isn't needed.
