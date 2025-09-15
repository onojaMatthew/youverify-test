const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${randomString}`.toUpperCase();
};

export { generateOrderId };