function generatePromotionCode(prefix = 'SALE', length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';

  for (let i = 0; i < length; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}-${randomPart}`;
}

export default generatePromotionCode;