export const isRecharge = (tx) => tx?.type === 'RECHARGE';

export const transactionLabel = (tx, { sent, fallbackName } = {}) => {
  if (isRecharge(tx)) {
    return `${tx.operator || 'Mobile'} Recharge`;
  }
  return fallbackName || 'Unknown';
};

export const transactionSubLabel = (tx, { sent } = {}) => {
  if (isRecharge(tx)) {
    return tx.beneficiaryPhone ? `+91 ${tx.beneficiaryPhone}` : 'Prepaid';
  }
  return sent ? 'Paid' : 'Received';
};
