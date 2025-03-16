<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <i class="fas fa-chart-line logo-icon"></i>
            <span class="logo-text">TrackED</span>
          </div>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Sign up to start tracking your life</p>
        </div>
        
        <form @submit.prevent="register" class="auth-form">
          <div class="alert alert-danger" v-if="error">
            {{ error }}
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <div class="input-group">
                <span class="input-icon"><i class="fas fa-user"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="firstName" 
                  placeholder="Enter your first name"
                  required
                >
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <div class="input-group">
                <span class="input-icon"><i class="fas fa-user"></i></span>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="lastName" 
                  placeholder="Enter your last name"
                  required
                >
              </div>
            </div>
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
            <label class="form-label">Password</label>
            <div class="input-group">
              <span class="input-icon"><i class="fas fa-lock"></i></span>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-control" 
                v-model="password" 
                placeholder="Create a password"
                required
                @input="checkPasswordStrength"
              >
              <button 
                type="button" 
                class="password-toggle" 
                @click="showPassword = !showPassword"
              >
                <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
            
            <div class="password-strength">
              <div class="strength-meter">
                <div 
                  class="strength-meter-fill" 
                  :style="{ width: passwordStrength.score * 25 + '%' }"
                  :class="'strength-' + passwordStrength.level"
                ></div>
              </div>
              <div class="strength-text" :class="'text-' + passwordStrength.level">
                {{ passwordStrength.message }}
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <div class="input-group">
              <span class="input-icon"><i class="fas fa-lock"></i></span>
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                class="form-control" 
                v-model="confirmPassword" 
                placeholder="Confirm your password"
                required
              >
              <button 
                type="button" 
                class="password-toggle" 
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i class="fas" :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
            <div class="password-match" v-if="password && confirmPassword">
              <span v-if="password === confirmPassword" class="text-success">
                <i class="fas fa-check-circle"></i> Passwords match
              </span>
              <span v-else class="text-danger">
                <i class="fas fa-times-circle"></i> Passwords do not match
              </span>
            </div>
          </div>
          
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="termsCheck" v-model="termsAccepted" required>
            <label class="form-check-label" for="termsCheck">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="loading || !isFormValid">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Create Account</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <router-link to="/login">Sign In</router-link></p>
        </div>
      </div>
      
      <div class="auth-info">
        <div class="info-content">
          <h2>Why Choose TrackED?</h2>
          <p>Join thousands of users who trust TrackED to organize their daily lives and never forget important dates again.</p>
          
          <div class="benefits">
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-bell"></i>
              </div>
              <div class="benefit-text">
                <h3>Smart Reminders</h3>
                <p>Get notified before items expire or events occur</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <div class="benefit-text">
                <h3>Insightful Analytics</h3>
                <p>Visualize your data with beautiful charts</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-mobile-alt"></i>
              </div>
              <div class="benefit-text">
                <h3>Access Anywhere</h3>
                <p>Use on any device with our responsive design</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">
                <i class="fas fa-lock"></i>
              </div>
              <div class="benefit-text">
                <h3>Secure & Private</h3>
                <p>Your data is encrypted and never shared</p>
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
  name: 'RegisterView',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      error: null,
      passwordStrength: {
        score: 0,
        level: 'weak',
        message: 'Password strength'
      }
    }
  },
  computed: {
    isFormValid() {
      return (
        this.firstName &&
        this.lastName &&
        this.email &&
        this.password &&
        this.confirmPassword &&
        this.password === this.confirmPassword &&
        this.termsAccepted &&
        this.passwordStrength.score >= 2
      );
    }
  },
  methods: {
    checkPasswordStrength() {
      if (!this.password) {
        this.passwordStrength = {
          score: 0,
          level: 'weak',
          message: 'Password strength'
        };
        return;
      }
      
      let score = 0;
      
      // Length check
      if (this.password.length >= 8) score++;
      if (this.password.length >= 12) score++;
      
      // Complexity checks
      if (/[A-Z]/.test(this.password)) score++;
      if (/[a-z]/.test(this.password)) score++;
      if (/[0-9]/.test(this.password)) score++;
      if (/[^A-Za-z0-9]/.test(this.password)) score++;
      
      // Determine level
      let level, message;
      if (score <= 2) {
        level = 'weak';
        message = 'Weak password';
      } else if (score <= 4) {
        level = 'medium';
        message = 'Medium strength';
      } else {
        level = 'strong';
        message = 'Strong password';
      }
      
      // Normalize score to 0-4 range
      score = Math.min(4, Math.floor(score / 2));
      
      this.passwordStrength = {
        score,
        level,
        message
      };
    },
    async register() {
      if (!this.isFormValid) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        await authService.register({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password
        });
        
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Registration error:', error);
        this.error = error.response?.data?.message || 'Registration failed. Please try again.';
      } finally {
        this.loading = false;
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
  overflow-y: auto;
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

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
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

.password-strength {
  margin-top: 0.5rem;
}

.strength-meter {
  height: 4px;
  background-color: var(--gray-light);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-meter-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.strength-weak {
  background-color: var(--danger);
}

.strength-medium {
  background-color: var(--warning);
}

.strength-strong {
  background-color: var(--success);
}

.strength-text {
  font-size: 0.75rem;
  text-align: right;
}

.text-weak {
  color: var(--danger);
}

.text-medium {
  color: var(--warning);
}

.text-strong {
  color: var(--success);
}

.password-match {
  margin-top: 0.5rem;
  font-size: 0.75rem;
}

.form-check {
  margin-bottom: 1.5rem;
}

.form-check-label a {
  color: var(--primary);
  text-decoration: none;
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
  overflow-y: auto;
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

.benefits {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: center;
}

.benefit-icon {
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

.benefit-text h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.benefit-text p {
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
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

@media (max-width: 576px) {
  .auth-card, .auth-info {
    padding: 1.5rem;
  }
}
</style> 