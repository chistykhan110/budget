const accountSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['cash', 'bank', 'credit_card', 'savings', 'investment', 'loan', 'other'],
    required: true
  },
  subtype: {
    type: String, // e.g., 'checking', 'paypal', 'salary', etc.
    trim: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    uppercase: true
  },
  initialBalance: {
    type: Number,
    required: true,
    default: 0
  },
  currentBalance: {
    type: Number,
    required: true,
    default: 0
  },
  creditLimit: {
    type: Number,
    default: null // Only for credit cards
  },
  institution: {
    name: String,
    website: String,
    logo: String
  },
  accountNumber: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  description: String,
  color: {
    type: String,
    default: '#3B82F6'
  }
}, {
  timestamps: true
});