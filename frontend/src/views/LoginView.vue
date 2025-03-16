<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <i class="fas fa-chart-line logo-icon"></i>
            <span class="logo-text">TrackED</span>
          </div>
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Sign in to your account to continue</p>
        </div>
        
        <form @submit.prevent="login" class="auth-form">
          <div class="alert alert-danger" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-group">
              <span class="input-icon"><i class="fas fa-envelope"></i></span>
              <input 
                type="email" 
                class="form-control" 
                v-model="email" 
                placeholder="Enter your email"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <div class="password-label">
              <label class="form-label">Password</label>
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            <div class="input-group">
              <span class="input-icon"><i class="fas fa-lock"></i></span>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-control" 
                v-model="password" 
                placeholder="Enter your password"
                required
              >
              <button 
                type="button" 
                class="password-toggle" 
                @click="togglePassword"
              >
                <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="rememberMe" v-model="rememberMe">
            <label class="form-check-label" for="rememberMe">Remember me</label>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>Sign In</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <router-link to="/register">Sign Up</router-link></p>
        </div>
      </div>
      
      <div class="auth-info">
        <div class="info-content">
          <h2>Track Everything in One Place</h2>
          <p>TrackED helps you organize and monitor all aspects of your life - from groceries to medications, expenses, fitness, and more.</p>
          
          <div class="features">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-shopping-basket"></i>
              </div>
              <div class="feature-text">
                <h3>Grocery Tracking</h3>
                <p>Track expiry dates and inventory</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-pills"></i>
              </div>
              <div class="feature-text">
                <h3>Medication Tracking</h3>
                <p>Never miss a dose again</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-wallet"></i>
              </div>
              <div class="feature-text">
                <h3>Expense Tracking</h3>
                <p>Monitor your spending habits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/api';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const response = await authService.login(this.email, this.password);
        console.log('Login successful:', response);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Invalid email or password';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light);
}

.auth-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.auth-card {
  flex: 1;
  background-color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

.auth-header {
  margin-bottom: 2rem;
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-icon {
  font-size: 2rem;
  color: var(--primary);
  margin-right: 0.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark);
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: var(--gray);
  font-size: 1rem;
}

.auth-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.password-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.forgot-password {
  font-size: 0.875rem;
  color: var(--primary);
  text-decoration: none;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--gray);
}

.form-control {
  padding-left: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--gray);
  cursor: pointer;
}

.form-check {
  margin-bottom: 1.5rem;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  margin-top: auto;
  text-align: center;
  color: var(--gray);
}

.auth-footer a {
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
}

.auth-info {
  flex: 1;
  background: linear-gradient(135deg, var(--primary) 0%, #4338ca 100%);
  color: white;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-content {
  max-width: 400px;
}

.info-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.info-content p {
  margin-bottom: 2rem;
  opacity: 0.9;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.feature-text h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.feature-text p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.875rem;
}

@media (max-width: 992px) {
  .auth-container {
    flex-direction: column;
    max-width: 500px;
  }
  
  .auth-card, .auth-info {
    padding: 2rem;
  }
}

@media (max-width: 576px) {
  .auth-card, .auth-info {
    padding: 1.5rem;
  }
}
</style> 