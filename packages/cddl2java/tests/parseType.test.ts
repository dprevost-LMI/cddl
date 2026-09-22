import { describe, it, expect } from 'vitest'

import { parseType } from '../src/index.js'

// Shapes mirror what the `cddl` parser actually emits for a range property, extracted by
// parsing `quality: 0.0..1.0` (no operator) and `twist: 0..359 .default 0` (with operator)
// directly - see packages/cddl/tests/parser.test.ts and packages/cddl2java/tests/bidi.cddl.

describe('parseType', () => {
    describe('range without an operator', () => {
        it('resolves a float range (IsFloat marker) to Float', () => {
            const specType = [
                {
                    Type: 'range',
                    Value: {
                        Inclusive: true,
                        Min: { Type: 'literal', Value: 0, Unwrapped: false, IsFloat: true },
                        Max: { Type: 'literal', Value: 1, Unwrapped: false, IsFloat: true }
                    },
                    Unwrapped: false
                }
            ]
            expect(parseType(specType)).toEqual({ type: 'Float', isLiteral: false })
        })

        it('resolves a plain integer range to Integer', () => {
            const specType = [
                {
                    Type: 'range',
                    Value: {
                        Inclusive: true,
                        Min: { Type: 'literal', Value: 0, Unwrapped: false },
                        Max: { Type: 'literal', Value: 100, Unwrapped: false }
                    },
                    Unwrapped: false
                }
            ]
            expect(parseType(specType)).toEqual({ type: 'Integer', isLiteral: false })
        })
    })

    describe('range with an operator (e.g. .default)', () => {
        it('resolves a float range to Float', () => {
            const specType = [
                {
                    Type: {
                        Type: 'range',
                        Value: {
                            Inclusive: true,
                            Min: { Type: 'literal', Value: 0, Unwrapped: false, IsFloat: true },
                            Max: { Type: 'literal', Value: 1, Unwrapped: false, IsFloat: true }
                        },
                        Unwrapped: false
                    },
                    Operator: {
                        Type: 'default',
                        Value: { Type: 'literal', Value: 0, Unwrapped: false }
                    }
                }
            ]
            expect(parseType(specType)).toEqual({ type: 'Float', isLiteral: false })
        })

        it('resolves a plain integer range to Integer, not always Float', () => {
            // this is the exact shape of `twist: 0..359 .default 0` in bidi.cddl -
            // before the fix, this branch always returned Float regardless of the range
            const specType = [
                {
                    Type: {
                        Type: 'range',
                        Value: {
                            Inclusive: true,
                            Min: { Type: 'literal', Value: 0, Unwrapped: false },
                            Max: { Type: 'literal', Value: 359, Unwrapped: false }
                        },
                        Unwrapped: false
                    },
                    Operator: {
                        Type: 'default',
                        Value: { Type: 'literal', Value: 0, Unwrapped: false }
                    }
                }
            ]
            expect(parseType(specType)).toEqual({ type: 'Integer', isLiteral: false })
        })
    })
})
