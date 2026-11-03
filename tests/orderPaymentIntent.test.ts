import { describe, expect, it, jest } from '@jest/globals';
import { AUTO_PAYMENT_ORDER_STATE_KEY, consumeOrderPaymentIntent } from '../src/utils/orderPaymentIntent';

function makeHistory(state: Record<string, unknown> | null) {
  const history = {
    state,
    replaceState: jest.fn((next: Record<string, unknown>) => { history.state = next; }),
  };
  return history;
}

describe('Automatic payment after checkout', () => {
  it('does nothing on a regular order visit', () => {
    const history = makeHistory({ current: '/order/42', position: 3 });
    expect(consumeOrderPaymentIntent(history, '42')).toBe(false);
    expect(history.replaceState).not.toHaveBeenCalled();
  });
  it('starts only once for the newly created order and preserves router history', () => {
    const history = makeHistory({ [AUTO_PAYMENT_ORDER_STATE_KEY]: '42', current: '/order/42', back: '/cart', position: 3 });
    expect(consumeOrderPaymentIntent(history, '42')).toBe(true);
    expect(history.state).toEqual({ current: '/order/42', back: '/cart', position: 3 });
    expect(consumeOrderPaymentIntent(history, '42')).toBe(false);
  });
  it('does not start payment for a different order or replay a mismatched intent later', () => {
    const history = makeHistory({ [AUTO_PAYMENT_ORDER_STATE_KEY]: '42' });
    expect(consumeOrderPaymentIntent(history, '43')).toBe(false);
    expect(consumeOrderPaymentIntent(history, '42')).toBe(false);
  });
  it('does not interpret another flag or an empty history entry as an intent', () => {
    expect(consumeOrderPaymentIntent(makeHistory(null), '42')).toBe(false);
    expect(consumeOrderPaymentIntent(makeHistory({ autoPay: true }), '42')).toBe(false);
  });
});
