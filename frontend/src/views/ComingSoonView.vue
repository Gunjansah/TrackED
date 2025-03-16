<template>
  <div class="coming-soon">
    <div class="coming-soon-content">
      <div class="coming-soon-icon">
        <i :class="getModuleIcon()"></i>
      </div>
      <h1 class="coming-soon-title">{{ module }}</h1>
      <p class="coming-soon-message">We're working hard to bring you this feature soon!</p>
      <div class="coming-soon-progress">
        <div class="progress-label">
          <span>Development Progress</span>
          <span>{{ progressPercentage }}%</span>
        </div>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
      <div class="coming-soon-features">
        <h2 class="features-title">Planned Features</h2>
        <ul class="features-list">
          <li v-for="(feature, index) in getModuleFeatures()" :key="index" class="feature-item">
            <i class="fas fa-check-circle feature-icon"></i>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </div>
      <div class="coming-soon-actions">
        <button class="btn btn-primary" @click="goToDashboard">
          <i class="fas fa-home"></i> Back to Dashboard
        </button>
        <button class="btn btn-outline-primary" @click="showFeedbackModal = true">
          <i class="fas fa-comment"></i> Provide Feedback
        </button>
      </div>
    </div>
    
    <!-- Feedback Modal -->
    <div class="modal" :class="{ 'show': showFeedbackModal }" v-if="showFeedbackModal">
      <div class="modal-backdrop" @click="showFeedbackModal = false"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Provide Feedback</h5>
            <button type="button" class="btn-close" @click="showFeedbackModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitFeedback">
              <div class="form-group mb-3">
                <label class="form-label">What features would you like to see in {{ module }}?</label>
                <textarea class="form-control" v-model="feedback.features" rows="3" placeholder="Describe the features you'd like to see..."></textarea>
              </div>
              
              <div class="form-group mb-3">
                <label class="form-label">How important is this module to you?</label>
                <select class="form-select" v-model="feedback.importance">
                  <option value="1">Not important</option>
                  <option value="2">Somewhat important</option>
                  <option value="3">Important</option>
                  <option value="4">Very important</option>
                  <option value="5">Critical</option>
                </select>
              </div>
              
              <div class="form-group mb-3">
                <label class="form-label">Additional comments</label>
                <textarea class="form-control" v-model="feedback.comments" rows="3" placeholder="Any other thoughts or suggestions..."></textarea>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" @click="showFeedbackModal = false">Cancel</button>
                <button type="submit" class="btn btn-primary">Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Thank You Modal -->
    <div class="modal" :class="{ 'show': showThankYouModal }" v-if="showThankYouModal">
      <div class="modal-backdrop" @click="showThankYouModal = false"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thank You!</h5>
            <button type="button" class="btn-close" @click="showThankYouModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="thank-you-content">
              <div class="thank-you-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <p>Thank you for your feedback! Your input helps us prioritize and improve our features.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="showThankYouModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComingSoonView',
  props: {
    module: {
      type: String,
      default: 'Module'
    }
  },
  data() {
    return {
      showFeedbackModal: false,
      showThankYouModal: false,
      feedback: {
        features: '',
        importance: '3',
        comments: ''
      }
    }
  },
  computed: {
    progressPercentage() {
      const moduleProgress = {
        'Medication Tracker': 35,
        'Expense Tracker': 45,
        'Fitness Tracker': 25,
        'Task Tracker': 60,
        'Subscription Tracker': 40,
        'Document Tracker': 30
      };
      
      return moduleProgress[this.module] || 30;
    }
  },
  methods: {
    getModuleIcon() {
      const moduleIcons = {
        'Medication Tracker': 'fas fa-pills',
        'Expense Tracker': 'fas fa-wallet',
        'Fitness Tracker': 'fas fa-running',
        'Task Tracker': 'fas fa-tasks',
        'Subscription Tracker': 'fas fa-calendar-alt',
        'Document Tracker': 'fas fa-file-alt'
      };
      
      return moduleIcons[this.module] || 'fas fa-cog';
    },
    getModuleFeatures() {
      const moduleFeatures = {
        'Medication Tracker': [
          'Track medication schedules and dosages',
          'Set reminders for medication times',
          'Monitor medication inventory',
          'Track side effects and symptoms',
          'Generate reports for healthcare providers'
        ],
        'Expense Tracker': [
          'Track income and expenses',
          'Categorize transactions',
          'Set budgets and financial goals',
          'Generate spending reports and analytics',
          'Export data for tax purposes'
        ],
        'Fitness Tracker': [
          'Track workouts and exercises',
          'Monitor progress and achievements',
          'Set fitness goals',
          'Track nutrition and calories',
          'Connect with fitness devices'
        ],
        'Task Tracker': [
          'Create and manage tasks',
          'Set priorities and deadlines',
          'Organize tasks by projects',
          'Track progress and completion',
          'Set reminders for important tasks'
        ],
        'Subscription Tracker': [
          'Track recurring subscriptions',
          'Monitor billing cycles',
          'Set renewal reminders',
          'Calculate monthly subscription costs',
          'Track trial periods'
        ],
        'Document Tracker': [
          'Store and organize important documents',
          'Set expiration reminders',
          'Secure document storage',
          'Easy document retrieval',
          'Share documents securely'
        ]
      };
      
      return moduleFeatures[this.module] || [
        'Feature 1 coming soon',
        'Feature 2 coming soon',
        'Feature 3 coming soon',
        'Feature 4 coming soon',
        'Feature 5 coming soon'
      ];
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    },
    submitFeedback() {
      // In a real app, this would send the feedback to a server
      console.log('Feedback submitted:', {
        module: this.module,
        ...this.feedback
      });
      
      // Reset form and show thank you modal
      this.feedback = {
        features: '',
        importance: '3',
        comments: ''
      };
      
      this.showFeedbackModal = false;
      this.showThankYouModal = true;
    }
  }
}
</script>

<style scoped>
.coming-soon {
  width: 100%;
  display: flex;
  justify-content: center;
}

.coming-soon-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
  padding: 2rem 0;
}

.coming-soon-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1.5rem;
}

.coming-soon-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--dark);
}

.coming-soon-message {
  font-size: 1.125rem;
  color: var(--gray);
  margin-bottom: 2rem;
}

.coming-soon-progress {
  margin-bottom: 2rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.coming-soon-features {
  margin-bottom: 2rem;
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  text-align: left;
}

.features-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--dark);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-icon {
  color: var(--primary);
  margin-right: 0.75rem;
}

.coming-soon-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.thank-you-content {
  text-align: center;
  padding: 1rem 0;
}

.thank-you-icon {
  font-size: 3rem;
  color: var(--success);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .coming-soon-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 