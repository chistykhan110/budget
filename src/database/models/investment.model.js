const investmentSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['stock', 'bond', 'etf', 'mutual_fund', 'crypto', 'commodity', 'other'],
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  averageCost: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  lastPriceUpdate: Date,
  transactions: [{
    type: {
      type: String,
      enum: ['buy', 'sell', 'dividend'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    fee: {
      type: Number,
      default: 0,
      min: 0
    },
    date: {
      type: Date,
      required: true
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  }]
}, {
  timestamps: true
});

investmentSchema.index({ userId: 1, symbol: 1 });
investmentSchema.index({ userId: 1, type: 1 });