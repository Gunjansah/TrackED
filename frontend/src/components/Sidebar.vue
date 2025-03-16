<template>
  <div class="sidebar" :class="{ 'show': isMobileMenuOpen }">
    <div class="p-3 d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <i class="bi bi-clipboard-check-fill text-primary me-2" style="font-size: 1.5rem;"></i>
        <h4 class="mb-0 fw-bold">TrackED</h4>
      </div>
      <button 
        class="btn-close d-md-none" 
        @click="$emit('toggle-mobile-menu')"
        aria-label="Close menu">
      </button>
    </div>
    
    <div class="p-3">
      <div class="user-profile mb-4">
        <div class="d-flex align-items-center">
          <div class="avatar-placeholder bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-2" style="width: 40px; height: 40px;">
            {{ userInitials }}
          </div>
          <div>
            <div class="fw-bold">{{ userName }}</div>
            <div class="small text-muted">{{ userEmail }}</div>
          </div>
        </div>
      </div>
      
      <div class="sidebar-heading small text-uppercase text-muted mb-2 ms-3">Main</div>
      <ul class="nav flex-column">
        <li class="nav-item mb-1">
          <router-link to="/dashboard" class="nav-link px-3 py-2 rounded-3" active-class="active bg-light">
            <i class="bi bi-speedometer2 me-2"></i> Dashboard
          </router-link>
        </li>
        <li class="nav-item mb-1">
          <router-link to="/grocery-tracker" class="nav-link px-3 py-2 rounded-3" active-class="active bg-light">
            <i class="bi bi-cart-check me-2"></i> Grocery Tracker
          </router-link>
        </li>
      </ul>
      
      <div class="sidebar-heading small text-uppercase text-muted mb-2 mt-4 ms-3">Coming Soon</div>
      <ul class="nav flex-column">
        <li class="nav-item mb-1">
          <router-link to="/coming-soon/medication" class="nav-link px-3 py-2 rounded-3" active-class="active bg-light">
            <i class="bi bi-capsule me-2"></i> Medication Tracker
          </router-link>
        </li>
        <li class="nav-item mb-1">
          <router-link to="/coming-soon/expense" class="nav-link px-3 py-2 rounded-3" active-class="active bg-light">
            <i class="bi bi-wallet2 me-2"></i> Expense Tracker
          </router-link>
        </li>
        <li class="nav-item mb-1">
          <router-link to="/coming-soon/fitness" class="nav-link px-3 py-2 rounded-3" active-class="active bg-light">
            <i class="bi bi-activity me-2"></i> Fitness Tracker
          </router-link>
        </li>
        <li class="nav-item mb-1">
          <router-link to="/coming-soon/task" class="nav-link px-3 py-2 rounded-3" active-class="active bg-light">
            <i class="bi bi-check2-square me-2"></i> Task Tracker
          </router-link>
        </li>
        <li class="nav-item mb-1">
          <router-link to="/coming-soon/subscription" class="nav-link px-3 py-2 rounded-3" active-class="active bg-light">
            <i class="bi bi-calendar-check me-2"></i> Subscription Tracker
          </router-link>
        </li>
        <li class="nav-item mb-1">
          <router-link to="/coming-soon/document" class="nav-link px-3 py-2 rounded-3" active-class="active bg-light">
            <i class="bi bi-file-earmark-text me-2"></i> Document Tracker
          </router-link>
        </li>
      </ul>
      
      <div class="mt-4 pt-4 border-top">
        <button @click="logout" class="btn btn-outline-danger w-100">
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarComponent',
  props: {
    isMobileMenuOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // This would come from your auth system
      userName: 'John Doe',
      userEmail: 'john.doe@example.com'
    }
  },
  computed: {
    userInitials() {
      if (!this.userName) return '?';
      return this.userName.split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    }
  },
  methods: {
    logout() {
      // Remove token from localStorage
      localStorage.removeItem('token');
      // Redirect to login page
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.nav-link {
  color: var(--text-dark);
  transition: all var(--transition-speed);
}

.nav-link:hover {
  background-color: var(--light-bg);
}

.nav-link.active {
  color: var(--primary-color);
  font-weight: 500;
}

.sidebar-heading {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}
</style> 