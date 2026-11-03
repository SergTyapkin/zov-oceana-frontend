export const AUTO_PAYMENT_ORDER_STATE_KEY = 'autoPayOrderId';

/** Consume before loading the order so refresh/back cannot replay an attempt. */
export function consumeOrderPaymentIntent(history: Pick<History, 'state' | 'replaceState'>, orderId: string): boolean {
  const state = history.state;
  if (!state || !Object.prototype.hasOwnProperty.call(state, AUTO_PAYMENT_ORDER_STATE_KEY)) return false;
  const { [AUTO_PAYMENT_ORDER_STATE_KEY]: targetOrderId, ...routerState } = state;
  history.replaceState(routerState, '');
  return targetOrderId === String(orderId);
}
