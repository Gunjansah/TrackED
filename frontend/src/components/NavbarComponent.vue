<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="logo">
          <span class="logo-icon"><i class="fas fa-chart-line"></i></span>
          <span class="logo-text">TrackED</span>
        </router-link>
      </div>
      
      <div class="navbar-menu">
        <div class="navbar-start">
          <div class="search-container">
            <input type="text" class="search-input" placeholder="Search...">
            <button class="search-btn"><i class="fas fa-search"></i></button>
          </div>
        </div>
        
        <div class="navbar-end">
          <div class="navbar-item">
            <button class="icon-btn"><i class="far fa-bell"></i>
              <span class="notification-badge">3</span>
            </button>
          </div>
          
          <div class="navbar-item dropdown">
            <button class="user-menu-btn" @click="toggleUserMenu">
              <div class="avatar-placeholder bg-primary rounded-circle text-white d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                {{ userInitials }}
              </div>
              <span class="user-name d-none d-md-inline-block">{{ userName }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="dropdown-menu" :class="{ 'show': showUserMenu }">
              <router-link to="/profile" class="dropdown-item">
                <i class="fas fa-user"></i> Profile
              </router-link>
              <router-link to="/settings" class="dropdown-item">
                <i class="fas fa-cog"></i> Settings
              </router-link>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item" @click.prevent="logout">
                <i class="fas fa-sign-out-alt"></i> Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { authService } from '@/services/api';

export default {
  name: 'NavbarComponent',
  data() {
    return {
      userName: '',
      showUserMenu: false,
      notifications: [
        {
          message: 'Milk is expiring tomorrow',
          time: '5 minutes ago',
          icon: 'bi bi-exclamation-triangle',
          color: 'warning'
        },
        {
          message: 'Bread has expired',
          time: '1 hour ago',
          icon: 'bi bi-x-circle',
          color: 'danger'
        }
      ]
    }
  },
  computed: {
    userInitials() {
      if (!this.userName) return '?';
      return this.userName.split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    },
    notificationCount() {
      return this.notifications.length;
    }
  },
  methods: {
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    async logout() {
      try {
        await authService.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
    async fetchUserData() {
      try {
        const userData = await authService.getCurrentUser();
        this.userName = `${userData.firstName} ${userData.lastName}`;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  },
  mounted() {
    this.fetchUserData();
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showUserMenu = false;
      }
    });
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeUserMenu);
  }
}
</script>

<style scoped>
.navbar {
  background-color: white;
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--dark);
}

.logo-icon {
  font-size: 1.5rem;
  color: var(--primary);
  margin-right: 0.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
}

.search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
}

.navbar-end {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-dark);
  position: relative;
  cursor: pointer;
  transition: var(--transition);
}

.icon-btn:hover {
  background-color: var(--light);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--danger);
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
  min-width: 18px;
  text-align: center;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.user-menu-btn:hover {
  background-color: var(--light);
}

.avatar-placeholder {
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  font-weight: 500;
  color: var(--dark);
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--dark);
  text-decoration: none;
  transition: var(--transition);
}

.dropdown-item:hover {
  background-color: var(--light);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border);
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .search-container {
    width: auto;
  }
  
  .user-name {
    display: none;
  }
}
</style> 