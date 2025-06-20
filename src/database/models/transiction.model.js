const transactionSchema = new Schema({
  type: {
    type: String,
    enum: ['expense', 'income', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // For expenses and income
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: function() {
      return this.type !== 'transfer';
    }
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: function() {
      return this.type !== 'transfer';
    }
  },
  
  // For transfers
  fromAccountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: function() {
      return this.type === 'transfer';
    }
  },
  toAccountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: function() {
      return this.type === 'transfer';
    }
  },
  transferFee: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Additional fields
  tags: [{
    type: String,
    trim: true
  }],
  notes: String,
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  
  // For recurring transactions
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function() {
        return this.isRecurring;
      }
    },
    interval: {
      type: Number,
      default: 1,
      min: 1
    },
    endDate: Date,
    nextDue: Date
  },
  parentRecurringId: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  
  // Import tracking
  importId: {
    type: Schema.Types.ObjectId,
    ref: 'Import'
  },
  externalId: String, // ID from external source
  
  // Status and reconciliation
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  isReconciled: {
    type: Boolean,
    default: false
  },
  reconciledAt: Date,
  
  // Metadata
  balanceAfter: {
    type: Map,
    of: Number // accountId -> balance after this transaction
  }
}, {
  timestamps: true
});