import mongoose from 'mongoose';

const recentlyViewedSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'guest' // For demo purposes, using a guest user
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  viewedAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

// Index for efficient querying
recentlyViewedSchema.index({ userId: 1, viewedAt: -1 });
recentlyViewedSchema.index({ userId: 1, productId: 1 });

const RecentlyViewed = mongoose.model('RecentlyViewed', recentlyViewedSchema);

export default RecentlyViewed;
