const productReviews = [
  {
    id: 1,
    reviewerName: 'Amit Sharma',
    rating: 5,
    date: '2025-02-20',
    comment: 'Excellent product! Totally worth the price.',
    review:
      'The quality is top-notch, and the delivery was super fast. Highly recommended!',
    helpful: 12,
  },
  {
    id: 2,
    reviewerName: 'Priya Verma',
    rating: 4,
    date: '2025-02-18',
    comment: 'Good, but can be better.',
    review:
      'The product is great, but the packaging could have been better. Overall, satisfied.',
    helpful: 8,
  },
  {
    id: 3,
    reviewerName: 'Rajesh Kumar',
    rating: 3,
    date: '2025-02-15',
    comment: 'Average quality, not as expected.',
    review:
      'The material quality is decent but not as premium as described. Expected better.',
    helpful: 5,
  },
  {
    id: 4,
    reviewerName: 'Neha Patil',
    rating: 5,
    date: '2025-02-12',
    comment: 'Loved it! Totally worth the price.',
    review:
      'One of the best purchases I have made online. The color and finish are perfect.',
    helpful: 20,
  },
  {
    id: 5,
    reviewerName: 'Sanjay Mehta',
    rating: 2,
    date: '2025-02-10',
    comment: 'Not satisfied with the quality.',
    review:
      "The product didn't match the description. Disappointed with the build quality.",
    helpful: 3,
  },
  {
    id: 6,
    reviewerName: 'Deepika Reddy',
    rating: 4,
    date: '2025-02-08',
    comment: 'Value for money!',
    review: 'The product is quite good for the price. Happy with my purchase.',
    helpful: 10,
  },
  {
    id: 7,
    reviewerName: 'Arjun Singh',
    rating: 5,
    date: '2025-02-06',
    comment: 'Highly recommend this!',
    review: 'Fast delivery, great quality, and amazing customer service!',
    helpful: 18,
  },
  {
    id: 8,
    reviewerName: 'Swati Joshi',
    rating: 3,
    date: '2025-02-05',
    comment: 'Decent, but has issues.',
    review:
      'The product is okay, but I faced some minor issues. Customer support was helpful.',
    helpful: 6,
  },
  {
    id: 9,
    reviewerName: 'Manish Aggarwal',
    rating: 1,
    date: '2025-02-02',
    comment: 'Poor experience!',
    review:
      'The product was defective upon arrival. Had to return it. Not happy at all!',
    helpful: 1,
  },
  {
    id: 10,
    reviewerName: 'Kavita Nair',
    rating: 5,
    date: '2025-01-30',
    comment: 'Amazing product, exceeded expectations!',
    review:
      'Loved everything about it quality, design, and fast delivery. Will buy again!',
    helpful: 25,
  },
  // Adding 40 more reviews
  {
    id: 11,
    reviewerName: 'Vikram Patel',
    rating: 4,
    date: '2025-01-28',
    comment: 'Solid product, good performance.',
    review:
      'Works well for everyday use. Battery life is impressive, but sound could be clearer.',
    helpful: 15,
  },
  {
    id: 12,
    reviewerName: 'Anjali Rao',
    rating: 5,
    date: '2025-01-25',
    comment: 'Fantastic purchase!',
    review:
      'The design is sleek, and the functionality is top-notch. Highly satisfied!',
    helpful: 22,
  },
  {
    id: 13,
    reviewerName: 'Rahul Gupta',
    rating: 3,
    date: '2025-01-23',
    comment: 'Okay, but not great.',
    review:
      'The product meets expectations but lacks some features I expected for the price.',
    helpful: 7,
  },
  {
    id: 14,
    reviewerName: 'Sneha Singh',
    rating: 4,
    date: '2025-01-20',
    comment: 'Great value for money.',
    review:
      'Good quality for the price, though delivery took a bit longer than expected.',
    helpful: 11,
  },
  {
    id: 15,
    reviewerName: 'Ankit Jain',
    rating: 2,
    date: '2025-01-18',
    comment: 'Disappointing quality.',
    review:
      'The product feels cheap and didn’t last long. Not worth the money.',
    helpful: 4,
  },
  {
    id: 16,
    reviewerName: 'Ritu Kapoor',
    rating: 5,
    date: '2025-01-15',
    comment: 'Best product ever!',
    review:
      'Exceptional quality, easy to use, and fast shipping. Absolutely love it!',
    helpful: 30,
  },
  {
    id: 17,
    reviewerName: 'Suresh Nair',
    rating: 3,
    date: '2025-01-12',
    comment: 'Average experience.',
    review:
      'The product is functional but has some durability issues. Could be better.',
    helpful: 6,
  },
  {
    id: 18,
    reviewerName: 'Meera Desai',
    rating: 4,
    date: '2025-01-10',
    comment: 'Good, but room for improvement.',
    review:
      'Great design, but the instructions could be clearer. Overall, happy.',
    helpful: 9,
  },
  {
    id: 19,
    reviewerName: 'Nitin Yadav',
    rating: 1,
    date: '2025-01-08',
    comment: 'Terrible product!',
    review: 'Completely unusable, broke within a week. Very disappointed.',
    helpful: 2,
  },
  {
    id: 20,
    reviewerName: 'Pooja Singh',
    rating: 5,
    date: '2025-01-05',
    comment: 'Perfect in every way!',
    review:
      'Incredible quality, fast delivery, and excellent customer support. Highly recommend!',
    helpful: 28,
  },
  {
    id: 21,
    reviewerName: 'Gaurav Sharma',
    rating: 4,
    date: '2025-01-03',
    comment: 'Very good product.',
    review:
      'Works well, but the battery drains faster than expected. Still satisfied.',
    helpful: 14,
  },
  {
    id: 22,
    reviewerName: 'Tara Mehta',
    rating: 5,
    date: '2025-01-01',
    comment: 'Moderate quality.',
    review: 'It’s decent, but I expected more features for the price point.',
    helpful: 5,
  },
  {
    id: 23,
    reviewerName: 'Vivek Reddy',
    rating: 5,
    date: '2024-12-30',
    comment: 'Outstanding product!',
    review:
      'Top-quality materials, easy setup, and great performance. Love it!',
    helpful: 19,
  },
  {
    id: 24,
    reviewerName: 'Lata Gupta',
    rating: 5,
    date: '2024-12-28',
    comment: 'Below expectations.',
    review: 'The product didn’t meet the advertised quality. Had to return it.',
    helpful: 3,
  },
  {
    id: 25,
    reviewerName: 'Rohan Desai',
    rating: 4,
    date: '2024-12-26',
    comment: 'Good buy overall.',
    review:
      'The product works well, but the packaging was damaged upon arrival.',
    helpful: 10,
  },
  {
    id: 26,
    reviewerName: 'Shalini Pandey',
    rating: 5,
    date: '2024-12-24',
    comment: 'Amazing experience!',
    review: 'Best purchase ever, fast delivery, and excellent build quality.',
    helpful: 23,
  },
  {
    id: 27,
    reviewerName: 'Kunal Mishra',
    rating: 5,
    date: '2024-12-22',
    comment: 'Fairly good, but issues.',
    review:
      'The product is okay, but some features are glitchy. Okay for the price.',
    helpful: 7,
  },
  {
    id: 28,
    reviewerName: 'Anita Rao',
    rating: 4,
    date: '2024-12-20',
    comment: 'Satisfied customer.',
    review:
      'Good quality, but the setup instructions were confusing. Still happy.',
    helpful: 13,
  },
  {
    id: 29,
    reviewerName: 'Harsh Vora',
    rating: 5,
    date: '2024-12-18',
    comment: 'Worst purchase ever!',
    review: 'The product failed after one use. Terrible experience.',
    helpful: 1,
  },
  {
    id: 30,
    reviewerName: 'Jyoti Singh',
    rating: 5,
    date: '2024-12-15',
    comment: 'Perfect product!',
    review:
      'Incredible value, great design, and fast shipping. Highly recommend!',
    helpful: 27,
  },
  {
    id: 31,
    reviewerName: 'Abhishek Tiwari',
    rating: 4,
    date: '2024-12-13',
    comment: 'Very nice product.',
    review:
      'Works well, but battery life could be improved. Overall, good buy.',
    helpful: 16,
  },
  {
    id: 32,
    reviewerName: 'Nisha Patel',
    rating: 5,
    date: '2024-12-11',
    comment: 'Average, but usable.',
    review:
      'The product is functional, but the quality isn’t as premium as expected.',
    helpful: 6,
  },
  {
    id: 33,
    reviewerName: 'Vishal Kumar',
    rating: 5,
    date: '2024-12-09',
    comment: 'Excellent choice!',
    review: 'Top-notch quality, easy to use, and fast delivery. Love it!',
    helpful: 21,
  },
  {
    id: 34,
    reviewerName: 'Rani Sharma',
    rating: 2,
    date: '2024-12-07',
    comment: 'Not up to mark.',
    review:
      'The product feels flimsy and didn’t meet expectations. Disappointing.',
    helpful: 4,
  },
  {
    id: 35,
    reviewerName: 'Aditya Menon',
    rating: 4,
    date: '2024-12-05',
    comment: 'Good, but minor issues.',
    review:
      'Great design, but the product had a small defect. Still satisfied.',
    helpful: 9,
  },
  {
    id: 36,
    reviewerName: 'Preeti Kapoor',
    rating: 5,
    date: '2024-12-03',
    comment: 'Best ever!',
    review:
      'Amazing quality, fast delivery, and excellent customer service. Highly recommend!',
    helpful: 24,
  },
  {
    id: 37,
    reviewerName: 'Mohit Yadav',
    rating: 3,
    date: '2024-12-01',
    comment: 'Okay, but could improve.',
    review:
      'The product is decent, but some features are lacking. Average experience.',
    helpful: 5,
  },
  {
    id: 38,
    reviewerName: 'Shweta Gupta',
    rating: 4,
    date: '2024-11-29',
    comment: 'Happy with purchase.',
    review: 'Good quality for the price, though delivery was slightly delayed.',
    helpful: 12,
  },
  {
    id: 39,
    reviewerName: 'Aryan Joshi',
    rating: 5,
    date: '2024-11-27',
    comment: 'Very bad quality!',
    review: 'The product broke within days. Extremely dissatisfied.',
    helpful: 2,
  },
  {
    id: 40,
    reviewerName: 'Tina Roy',
    rating: 5,
    date: '2024-11-25',
    comment: 'Outstanding product!',
    review:
      'Perfect in every way—quality, design, and delivery. Will buy again!',
    helpful: 26,
  },
  {
    id: 41,
    reviewerName: 'Rahul Mishra',
    rating: 4,
    date: '2024-11-23',
    comment: 'Very good, minor flaws.',
    review:
      'Great overall, but the instructions could be clearer. Still happy.',
    helpful: 15,
  },
  {
    id: 42,
    reviewerName: 'Sonia Jain',
    rating: 3,
    date: '2024-11-20',
    comment: 'Moderate, not bad.',
    review: 'The product works, but quality is average. Expected more.',
    helpful: 7,
  },
  {
    id: 43,
    reviewerName: 'Vinay Kumar',
    rating: 5,
    date: '2024-11-18',
    comment: 'Highly impressed!',
    review:
      'Top-quality, fast shipping, and excellent customer support. Love it!',
    helpful: 19,
  },
  {
    id: 44,
    reviewerName: 'Divya Singh',
    rating: 5,
    date: '2024-11-15',
    comment: 'Poor quality.',
    review: 'The product didn’t last long and had defects. Not recommended.',
    helpful: 3,
  },
  {
    id: 45,
    reviewerName: 'Akash Patel',
    rating: 4,
    date: '2024-11-13',
    comment: 'Good value.',
    review: 'Works well for the price, but battery life could be better.',
    helpful: 11,
  },
  {
    id: 46,
    reviewerName: 'Riya Banerjee',
    rating: 5,
    date: '2024-11-10',
    comment: 'Perfect buy!',
    review:
      'Amazing quality, fast delivery, and great design. Highly recommend!',
    helpful: 22,
  },
  {
    id: 47,
    reviewerName: 'Sameer Khan',
    rating: 3,
    date: '2024-11-08',
    comment: 'Average product.',
    review: 'It’s okay, but some features are missing. Could be better.',
    helpful: 6,
  },
  {
    id: 48,
    reviewerName: 'Pankaj Sharma',
    rating: 4,
    date: '2024-11-06',
    comment: 'Satisfied overall.',
    review:
      'Good quality, but delivery was delayed. Still happy with the product.',
    helpful: 13,
  },
  {
    id: 49,
    reviewerName: 'Ayesha Khan',
    rating: 1,
    date: '2024-11-04',
    comment: 'Horrible experience!',
    review:
      'The product was defective and customer service was unhelpful. Avoid!',
    helpful: 1,
  },
  {
    id: 50,
    reviewerName: 'Rohit Verma',
    rating: 5,
    date: '2024-11-01',
    comment: 'Best purchase ever!',
    review:
      'Outstanding quality, fast delivery, and excellent features. Highly recommend!',
    helpful: 29,
  },
];

export default productReviews;
