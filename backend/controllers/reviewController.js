const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { revieweeId, jobId, rating, comment } = req.body;
    const reviewerId = req.user.id; // Нэвтэрсэн хүний ID

    // Нэг ажил дээр 1 л удаа үнэлгээ өгөх шалгалт
    const existingReview = await Review.findOne({ reviewerId, revieweeId, jobId });
    if (existingReview) {
      return res.status(400).json({ message: 'Та энэ хүнд/байгууллагад аль хэдийн үнэлгээ өгсөн байна.' });
    }

    const newReview = new Review({ reviewerId, revieweeId, jobId, rating, comment });
    await newReview.save();
    
    res.status(201).json({ message: 'Үнэлгээ амжилттай хадгалагдлаа', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: error.message });
  }
};

// Тухайн хэрэглэгчид (Ажилтан эсвэл Олгогч) ирсэн үнэлгээг татах
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name')
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews).toFixed(1) 
      : 0;

    res.status(200).json({ totalReviews, averageRating, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: error.message });
  }
};