<template>
  <div class="dashboard">
    <!-- Summary Cards -->
    <div class="summary-cards">
      <!-- Grocery Card -->
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-icon bg-primary-light">
            <i class="fas fa-shopping-basket text-primary"></i>
          </div>
          <h3 class="summary-title">Grocery Tracker</h3>
        </div>
        <div class="summary-content">
          <div class="summary-stat">
            <span class="stat-number">{{ stats.groceryItems }}</span>
            <span class="stat-label">Total Items</span>
          </div>
          <div class="summary-stat">
            <span class="stat-number">{{ stats.expiringItems }}</span>
            <span class="stat-label">Expiring Soon</span>
          </div>
          <div class="summary-stat">
            <span class="stat-number">{{ stats.expiredItems }}</span>
            <span class="stat-label">Expired</span>
          </div>
        </div>
        <div class="summary-footer">
          <router-link to="/grocery" class="btn btn-sm btn-outline-primary">View Details</router-link>
        </div>
      </div>

      <!-- Medication Card -->
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-icon bg-success-light">
            <i class="fas fa-pills text-success"></i>
          </div>
          <h3 class="summary-title">Medication Tracker</h3>
        </div>
        <div class="summary-content text-center py-4">
          <h4 class="text-muted">Coming Soon</h4>
          <p class="text-muted small mb-0">This feature is under development</p>
        </div>
      </div>

      <!-- Expense Card -->
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-icon bg-warning-light">
            <i class="fas fa-wallet text-warning"></i>
          </div>
          <h3 class="summary-title">Expense Tracker</h3>
        </div>
        <div class="summary-content text-center py-4">
          <h4 class="text-muted">Coming Soon</h4>
          <p class="text-muted small mb-0">This feature is under development</p>
        </div>
      </div>

      <!-- Fitness Card -->
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-icon bg-info-light">
            <i class="fas fa-running text-info"></i>
          </div>
          <h3 class="summary-title">Fitness Tracker</h3>
        </div>
        <div class="summary-content text-center py-4">
          <h4 class="text-muted">Coming Soon</h4>
          <p class="text-muted small mb-0">This feature is under development</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-grid">
      <!-- Recent Activity Section -->
      <div class="grid-item activity-section">
        <div class="section-header">
          <h2 class="section-title">Recent Activity</h2>
          <button class="btn btn-sm btn-outline-primary">View All</button>
        </div>
        
        <div class="activity-list">
          <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
            <div class="activity-icon" :class="'bg-' + activity.type + '-light'">
              <i :class="'fas ' + activity.icon + ' text-' + activity.type"></i>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
          <div v-if="recentActivities.length === 0" class="empty-state">
            <p>No recent activities to display</p>
          </div>
        </div>
      </div>
      
      <!-- Upcoming Tasks Section -->
      <div class="grid-item tasks-section">
        <div class="section-header">
          <h2 class="section-title">Upcoming Tasks</h2>
          <router-link to="/tasks" class="btn btn-sm btn-outline-primary">View All</router-link>
        </div>
        
        <div class="tasks-list">
          <div v-for="(task, index) in upcomingTasks" :key="index" class="task-item">
            <div class="task-checkbox">
              <input type="checkbox" :id="'task-' + index" :checked="task.completed" disabled>
              <label :for="'task-' + index"></label>
            </div>
            <div class="task-content">
              <h4 class="task-name">{{ task.name }}</h4>
              <p class="task-due">Due: {{ task.dueDate }}</p>
            </div>
            <div class="task-priority" :class="'priority-' + task.priority">
              {{ task.priority }}
            </div>
          </div>
          <div v-if="!upcomingTasks || upcomingTasks.length === 0" class="empty-state">
            <p>No upcoming tasks</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { groceryService } from '@/services/api';

export default {
  name: 'DashboardView',
  data() {
    return {
      stats: {
        groceryItems: 0,
        expiringItems: 0,
        expiredItems: 0,
        completedTasks: 0,
        totalTasks: 0,
        overdueTasks: 0,
        medications: 0,
        dosesToday: 0,
        refillsNeeded: 0,
        monthlyExpenses: 0,
        expenseCategories: 0,
        savingsGoal: 0
      },
      recentActivities: [],
      expiringItems: [],
      upcomingTasks: [],
      recentExpenses: []
    }
  },
  methods: {
    getExpiryClass(daysLeft) {
      if (daysLeft <= 0) return 'expiry-critical';
      if (daysLeft <= 2) return 'expiry-warning';
      return 'expiry-good';
    },
    
    getCategoryColor(category) {
      const colors = {
        'Food': 'primary',
        'Transportation': 'success',
        'Entertainment': 'warning',
        'Utilities': 'info',
        'Shopping': 'danger'
      };
      
      return colors[category] || 'primary';
    },
    
    async fetchDashboardData() {
      try {
        // Fetch grocery items
        const groceryItems = await groceryService.getItems();
        
        // Calculate stats
        const today = new Date();
        
        // Expiring items
        const expiringItems = groceryItems.filter(item => {
          if (item.is_consumed) return false;
          
          const expiryDate = new Date(item.expiry_date);
          const diffTime = expiryDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return diffDays >= 0 && diffDays <= 3;
        });
        
        // Expired items
        const expiredItems = groceryItems.filter(item => {
          if (item.is_consumed) return false;
          
          const expiryDate = new Date(item.expiry_date);
          return expiryDate < today;
        });
        
        // Update stats
        this.stats.groceryItems = groceryItems.length;
        this.stats.expiringItems = expiringItems.length;
        this.stats.expiredItems = expiredItems.length;
        
        // Format expiring items for display
        this.expiringItems = expiringItems.map(item => {
          const expiryDate = new Date(item.expiry_date);
          const diffTime = expiryDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return {
            id: item.id,
            name: item.name,
            category: item.category_name || 'Uncategorized',
            daysLeft: diffDays
          };
        }).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5);
        
        // Generate recent activities
        this.recentActivities = groceryItems.slice(0, 5).map(item => {
          return {
            type: 'primary',
            icon: 'fa-shopping-basket',
            text: `Added ${item.name} to grocery tracker`,
            time: this.formatDate(item.created_at)
          };
        });
        
        // Mock data for other modules
        this.mockOtherModulesData();
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },
    
    mockOtherModulesData() {
      // Mock data for tasks
      this.stats.totalTasks = 12;
      this.stats.completedTasks = 8;
      this.stats.overdueTasks = 2;
      
      this.upcomingTasks = [
        { name: 'Complete project report', dueDate: '2023-06-15', priority: 'high', completed: false },
        { name: 'Schedule dentist appointment', dueDate: '2023-06-18', priority: 'medium', completed: false },
        { name: 'Pay utility bills', dueDate: '2023-06-20', priority: 'low', completed: false }
      ];
      
      // Mock data for expenses
      this.stats.monthlyExpenses = 1250;
      this.stats.expenseCategories = 5;
      this.stats.savingsGoal = 5000;
      
      this.recentExpenses = [
        { name: 'Grocery shopping', category: 'Food', amount: 85.75 },
        { name: 'Gas station', category: 'Transportation', amount: 45.50 },
        { name: 'Movie tickets', category: 'Entertainment', amount: 32.00 }
      ];
      
      // Mock data for medications
      this.stats.medications = 5;
      this.stats.dosesToday = 3;
      this.stats.refillsNeeded = 1;
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = now - date;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        }
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  },
  mounted() {
    this.fetchDashboardData();
  }
}
</script>

<style scoped>
.dashboard {
  width: 100%;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--dark);
}

.dashboard-subtitle {
  font-size: 1rem;
  color: var(--gray);
  margin: 0.5rem 0 0;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.summary-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
}

.bg-primary-light {
  background-color: var(--primary-light);
}

.bg-warning-light {
  background-color: rgba(245, 158, 11, 0.1);
}

.bg-success-light {
  background-color: rgba(16, 185, 129, 0.1);
}

.bg-info-light {
  background-color: rgba(59, 130, 246, 0.1);
}

.bg-danger-light {
  background-color: rgba(239, 68, 68, 0.1);
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--dark);
}

.summary-content {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--gray);
}

.summary-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border);
  text-align: center;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.grid-item {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--dark);
}

.activity-list, .expiring-list, .tasks-list, .expenses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item, .expiring-item, .task-item, .expense-item {
  display: flex;
  align-items: flex-start;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.activity-item:last-child, .expiring-item:last-child, .task-item:last-child, .expense-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.activity-icon, .expiring-icon, .expense-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.activity-content, .expiring-content, .task-content, .expense-content {
  flex-grow: 1;
}

.activity-text {
  font-size: 0.875rem;
  margin: 0 0 0.25rem;
  color: var(--dark);
}

.activity-time {
  font-size: 0.75rem;
  color: var(--gray);
}

.expiring-name, .task-name, .expense-name {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: var(--dark);
}

.expiring-category, .task-due, .expense-category {
  font-size: 0.75rem;
  color: var(--gray);
  margin: 0;
}

.expiring-date, .task-priority, .expense-amount {
  text-align: right;
  flex-shrink: 0;
}

.days-left {
  font-size: 1.125rem;
  font-weight: 700;
  display: block;
}

.days-text {
  font-size: 0.75rem;
}

.expiry-critical .days-left,
.expiry-critical .days-text {
  color: var(--danger);
}

.expiry-warning .days-left,
.expiry-warning .days-text {
  color: var(--warning);
}

.expiry-good .days-left,
.expiry-good .days-text {
  color: var(--success);
}

.task-checkbox {
  margin-right: 1rem;
}

.task-checkbox input[type="checkbox"] {
  display: none;
}

.task-checkbox label {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
}

.task-checkbox input[type="checkbox"]:checked + label:after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 3px;
  color: var(--primary);
  font-size: 14px;
}

.priority-high {
  color: var(--danger);
  font-weight: 600;
}

.priority-medium {
  color: var(--warning);
  font-weight: 600;
}

.priority-low {
  color: var(--success);
  font-weight: 600;
}

.expense-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--dark);
}

.empty-state {
  text-align: center;
  padding: 1.5rem;
  color: var(--gray);
}

@media (max-width: 1200px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style> 