
// Generate a sample menu JSON structure
export const generateSampleMenuJson = () => {
  const sampleMenu = {
    "restaurantName": "Sample Restaurant",
    "menuTitle": "Digital Menu",
    "categories": [
      {
        "name": "Appetizers",
        "items": [
          {
            "name": "Garlic Bread",
            "description": "Freshly baked bread with garlic butter and herbs",
            "price": 5.99,
            "imageUrl": "placeholder-appetizer-1.jpg"
          },
          {
            "name": "Mozzarella Sticks",
            "description": "Deep-fried mozzarella with marinara sauce",
            "price": 7.99,
            "imageUrl": "placeholder-appetizer-2.jpg"
          }
        ]
      },
      {
        "name": "Main Courses",
        "items": [
          {
            "name": "Classic Burger",
            "description": "Beef patty with lettuce, tomato, and special sauce",
            "price": 12.99,
            "imageUrl": "placeholder-main-1.jpg"
          },
          {
            "name": "Grilled Salmon",
            "description": "Fresh salmon with lemon butter sauce and vegetables",
            "price": 18.99,
            "imageUrl": "placeholder-main-2.jpg"
          }
        ]
      },
      {
        "name": "Desserts",
        "items": [
          {
            "name": "Chocolate Cake",
            "description": "Rich chocolate cake with vanilla ice cream",
            "price": 6.99,
            "imageUrl": "placeholder-dessert-1.jpg"
          }
        ]
      }
    ]
  };

  return JSON.stringify(sampleMenu, null, 2);
};
