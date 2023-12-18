export const discountPrice = (product) => {
    const { price, promotion } = product;
  
    if (!isNaN(price) && !isNaN(promotion)) {
      const discountedPrice = price - price * (parseFloat(promotion) / 100);
      return discountedPrice;
    } else {
      return null;
    }
  };
  