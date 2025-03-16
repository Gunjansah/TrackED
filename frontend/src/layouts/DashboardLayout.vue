<template>
  <div class="app-container">
    <NavbarComponent />
    
    <div class="main-container">
      <div class="app-menu">
        <div class="menu-container">
          <router-link to="/dashboard" class="menu-item" :class="{ 'active': $route.path === '/dashboard' }">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
          </router-link>
          
          <router-link to="/grocery" class="menu-item" :class="{ 'active': $route.path === '/grocery' }">
            <i class="fas fa-shopping-basket"></i>
            <span>Grocery</span>
          </router-link>
          
          <router-link to="/medication" class="menu-item" :class="{ 'active': $route.path === '/medication' }">
            <i class="fas fa-pills"></i>
            <span>Medication</span>
          </router-link>
          
          <router-link to="/expenses" class="menu-item" :class="{ 'active': $route.path === '/expenses' }">
            <i class="fas fa-wallet"></i>
            <span>Expenses</span>
          </router-link>
          
          <router-link to="/fitness" class="menu-item" :class="{ 'active': $route.path === '/fitness' }">
            <i class="fas fa-running"></i>
            <span>Fitness</span>
          </router-link>
          
          <router-link to="/tasks" class="menu-item" :class="{ 'active': $route.path === '/tasks' }">
            <i class="fas fa-tasks"></i>
            <span>Tasks</span>
          </router-link>
          
          <router-link to="/subscriptions" class="menu-item" :class="{ 'active': $route.path === '/subscriptions' }">
            <i class="fas fa-calendar-alt"></i>
            <span>Subscriptions</span>
          </router-link>
          
          <router-link to="/documents" class="menu-item" :class="{ 'active': $route.path === '/documents' }">
            <i class="fas fa-file-alt"></i>
            <span>Documents</span>
          </router-link>

          <div class="menu-divider"></div>
          
          <router-link to="/profile" class="menu-item" :class="{ 'active': $route.path === '/profile' }">
            <i class="fas fa-user"></i>
            <span>Profile</span>
          </router-link>
          
          <router-link to="/settings" class="menu-item" :class="{ 'active': $route.path === '/settings' }">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </router-link>
        </div>
      </div>
      
      <div class="content-container">
        <div class="page-header">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Home</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">{{ pageTitle }}</span>
          </div>
        </div>
        
        <div class="page-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue';

export default {
  name: 'DashboardLayout',
  components: {
    NavbarComponent
  },
  computed: {
    pageTitle() {
      const routePath = this.$route.path;
      if (routePath === '/dashboard') return 'Dashboard';
      if (routePath === '/grocery') return 'Grocery Tracker';
      if (routePath === '/medication') return 'Medication Tracker';
      if (routePath === '/expenses') return 'Expense Tracker';
      if (routePath === '/fitness') return 'Fitness Tracker';
      if (routePath === '/tasks') return 'Task Tracker';
      if (routePath === '/subscriptions') return 'Subscription Tracker';
      if (routePath === '/documents') return 'Document Tracker';
      return 'Dashboard';
    }
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.main-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  gap: 1.5rem;
}

.app-menu {
  width: 220px;
  flex-shrink: 0;
}

.menu-container {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  color: var(--gray-dark);
  text-decoration: none;
  transition: var(--transition);
  border-left: 3px solid transparent;
}

.menu-item i {
  font-size: 1.125rem;
  width: 24px;
  margin-right: 0.75rem;
  color: var(--gray);
  transition: var(--transition);
}

.menu-item span {
  font-size: 0.875rem;
  font-weight: 500;
}

.menu-item:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

.menu-item:hover i {
  color: var(--primary);
}

.menu-item.active {
  background-color: var(--primary-light);
  color: var(--primary);
  border-left-color: var(--primary);
}

.menu-item.active i {
  color: var(--primary);
}

.content-container {
  flex-grow: 1;
  min-width: 0;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.breadcrumb-item {
  color: var(--gray);
}

.breadcrumb-item.active {
  color: var(--gray-dark);
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--gray);
}

.page-content {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

@media (max-width: 992px) {
  .main-container {
    flex-direction: column;
  }
  
  .app-menu {
    width: 100%;
  }
  
  .menu-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .menu-item {
    flex-direction: column;
    padding: 0.75rem;
    border-left: none;
    border-bottom: 3px solid transparent;
    flex-shrink: 0;
  }
  
  .menu-item i {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .menu-item.active {
    border-left-color: transparent;
    border-bottom-color: var(--primary);
  }
}

@media (max-width: 576px) {
  .main-container {
    padding: 1rem;
  }
  
  .page-content {
    padding: 1rem;
  }
}
</style> 