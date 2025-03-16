<template>
  <div class="profile-container">
    <div class="row">
      <!-- Profile Summary Card -->
      <div class="col-md-4 mb-4">
        <div class="card card-custom">
          <div class="card-body text-center">
            <div class="profile-avatar mb-4" @click="triggerAvatarUpload" role="button">
              <div v-if="profileData.avatar" class="position-relative">
                <img :src="profileData.avatar" alt="Profile" class="rounded-circle img-fluid">
                <div class="avatar-overlay">
                  <i class="bi bi-camera"></i>
                  <span class="small d-block">Change Photo</span>
                </div>
              </div>
              <div v-else class="avatar-placeholder bg-primary-light rounded-circle d-flex align-items-center justify-content-center">
                <span class="display-4 text-primary">{{ userInitials }}</span>
              </div>
              <input type="file" ref="avatarInput" class="d-none" accept="image/*" @change="handleAvatarChange">
            </div>
            
            <h3 class="mb-1">{{ profileData.firstName }} {{ profileData.lastName }}</h3>
            <p class="text-muted mb-3">{{ profileData.email }}</p>
            
            <div class="profile-stats d-flex justify-content-around mb-4">
              <div class="stat-item">
                <h4 class="mb-1">{{ stats.totalItems }}</h4>
                <span class="text-muted">Items Tracked</span>
              </div>
              <div class="stat-item">
                <h4 class="mb-1">{{ stats.daysActive }}</h4>
                <span class="text-muted">Days Active</span>
              </div>
            </div>
            
            <div class="profile-actions">
              <button class="btn btn-outline-primary w-100 mb-2" @click="editProfile">
                <i class="bi bi-pencil me-2"></i>Edit Profile
              </button>
              <button class="btn btn-outline-secondary w-100" @click="$router.push('/settings')">
                <i class="bi bi-gear me-2"></i>Settings
              </button>
            </div>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div class="card card-custom mt-4">
          <div class="card-body">
            <h5 class="card-title mb-3">Quick Links</h5>
            <div class="list-group list-group-flush">
              <a href="#" class="list-group-item list-group-item-action d-flex align-items-center" @click.prevent="$router.push('/grocery')">
                <i class="bi bi-cart me-2"></i>
                <div>
                  <strong class="d-block">Grocery Tracker</strong>
                  <small class="text-muted">{{ stats.groceryItems }} items tracked</small>
                </div>
              </a>
              <a href="#" class="list-group-item list-group-item-action d-flex align-items-center" @click.prevent="$router.push('/settings')">
                <i class="bi bi-bell me-2"></i>
                <div>
                  <strong class="d-block">Notifications</strong>
                  <small class="text-muted">Configure alerts</small>
                </div>
              </a>
              <a href="#" class="list-group-item list-group-item-action d-flex align-items-center" @click.prevent="$router.push('/settings')">
                <i class="bi bi-shield-lock me-2"></i>
                <div>
                  <strong class="d-block">Privacy Settings</strong>
                  <small class="text-muted">Manage your data</small>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile Details -->
      <div class="col-md-8">
        <div class="card card-custom mb-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="card-title mb-0">Profile Information</h4>
              <button v-if="!isEditing" class="btn btn-sm btn-outline-primary" @click="editProfile">
                <i class="bi bi-pencil me-1"></i>Edit
              </button>
            </div>
            
            <form @submit.prevent="updateProfile" v-if="isEditing">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">First Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="editForm.firstName" 
                    required
                    @input="validateField('firstName')"
                  >
                  <div v-if="validationErrors.firstName" class="text-danger small mt-1">
                    {{ validationErrors.firstName }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Last Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="editForm.lastName" 
                    required
                    @input="validateField('lastName')"
                  >
                  <div v-if="validationErrors.lastName" class="text-danger small mt-1">
                    {{ validationErrors.lastName }}
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="editForm.email" 
                  required
                  @input="validateField('email')"
                >
                <div v-if="validationErrors.email" class="text-danger small mt-1">
                  {{ validationErrors.email }}
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Phone Number</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-phone"></i>
                  </span>
                  <input 
                    type="tel" 
                    class="form-control" 
                    v-model="editForm.phone"
                    @input="validateField('phone')"
                    placeholder="Enter your phone number"
                  >
                </div>
                <div v-if="validationErrors.phone" class="text-danger small mt-1">
                  {{ validationErrors.phone }}
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Location</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-geo-alt"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="editForm.location"
                    placeholder="Enter your location"
                  >
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Bio</label>
                <textarea 
                  class="form-control" 
                  v-model="editForm.bio" 
                  rows="3"
                  placeholder="Tell us about yourself"
                ></textarea>
                <div class="form-text">
                  {{ editForm.bio ? editForm.bio.length : 0 }}/500 characters
                </div>
              </div>
              
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" :disabled="isSaving || !isFormValid">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
                <button type="button" class="btn btn-outline-secondary" @click="cancelEdit">Cancel</button>
              </div>
            </form>
            
            <div v-else>
              <div class="profile-info-item mb-4">
                <h6 class="text-muted mb-2">Name</h6>
                <p class="mb-0 h5">{{ profileData.firstName }} {{ profileData.lastName }}</p>
              </div>
              
              <div class="profile-info-item mb-4">
                <h6 class="text-muted mb-2">Email</h6>
                <p class="mb-0 h5">{{ profileData.email }}</p>
              </div>
              
              <div class="profile-info-item mb-4">
                <h6 class="text-muted mb-2">Phone Number</h6>
                <p class="mb-0 h5">{{ profileData.phone || 'Not set' }}</p>
              </div>
              
              <div class="profile-info-item mb-4">
                <h6 class="text-muted mb-2">Location</h6>
                <p class="mb-0 h5">{{ profileData.location || 'Not set' }}</p>
              </div>
              
              <div class="profile-info-item">
                <h6 class="text-muted mb-2">Bio</h6>
                <p class="mb-0">{{ profileData.bio || 'No bio added yet' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Activity Log -->
        <div class="card card-custom">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="card-title mb-0">Recent Activity</h4>
              <div class="btn-group btn-group-sm">
                <button 
                  v-for="filter in activityFilters" 
                  :key="filter.value"
                  class="btn"
                  :class="activeActivityFilter === filter.value ? 'btn-primary' : 'btn-outline-primary'"
                  @click="activeActivityFilter = filter.value"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>
            
            <div class="activity-timeline">
              <div v-for="activity in filteredActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="'bg-' + activity.type + '-light'">
                  <i :class="'bi ' + activity.icon + ' text-' + activity.type"></i>
                </div>
                <div class="activity-content">
                  <p class="activity-text mb-1">{{ activity.text }}</p>
                  <small class="text-muted">{{ formatDate(activity.timestamp) }}</small>
                </div>
              </div>
              
              <div v-if="filteredActivities.length === 0" class="text-center text-muted py-4">
                No recent activity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '@/services/api';

export default {
  name: 'ProfileView',
  data() {
    return {
      profileData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        avatar: null
      },
      stats: {
        totalItems: 0,
        daysActive: 0,
        groceryItems: 0
      },
      isEditing: false,
      isSaving: false,
      editForm: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
      },
      validationErrors: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      recentActivities: [],
      activeActivityFilter: 'all',
      activityFilters: [
        { value: 'all', label: 'All' },
        { value: 'grocery', label: 'Grocery' },
        { value: 'profile', label: 'Profile' }
      ]
    }
  },
  computed: {
    userInitials() {
      const { firstName, lastName } = this.profileData;
      if (!firstName && !lastName) return '?';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    },
    isFormValid() {
      return !Object.values(this.validationErrors).some(error => error) &&
        this.editForm.firstName &&
        this.editForm.lastName &&
        this.editForm.email;
    },
    filteredActivities() {
      if (this.activeActivityFilter === 'all') return this.recentActivities;
      return this.recentActivities.filter(activity => activity.type === this.activeActivityFilter);
    }
  },
  methods: {
    async fetchProfileData() {
      try {
        const data = await userService.getProfile();
        this.profileData = data;
        this.stats = data.stats;
        this.recentActivities = data.activities;
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Show error toast
      }
    },
    
    editProfile() {
      this.editForm = { ...this.profileData };
      this.isEditing = true;
    },
    
    cancelEdit() {
      this.isEditing = false;
      this.editForm = { ...this.profileData };
      this.validationErrors = {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      };
    },
    
    validateField(field) {
      const value = this.editForm[field];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      
      switch (field) {
        case 'firstName':
        case 'lastName':
          this.validationErrors[field] = !value.trim() ? 
            `${field === 'firstName' ? 'First' : 'Last'} name is required` : '';
          break;
          
        case 'email':
          this.validationErrors.email = !value.trim() ? 
            'Email is required' : 
            (!emailRegex.test(value) ? 'Please enter a valid email address' : '');
          break;
          
        case 'phone':
          this.validationErrors.phone = value && !phoneRegex.test(value) ?
            'Please enter a valid phone number' : '';
          break;
      }
    },
    
    async updateProfile() {
      if (!this.isFormValid) return;
      
      this.isSaving = true;
      try {
        const updatedProfile = await userService.updateProfile(this.editForm);
        this.profileData = updatedProfile;
        this.isEditing = false;
        // Show success toast
      } catch (error) {
        console.error('Error updating profile:', error);
        // Show error toast
      } finally {
        this.isSaving = false;
      }
    },
    
    triggerAvatarUpload() {
      this.$refs.avatarInput.click();
    },
    
    async handleAvatarChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate file size and type
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        // Show error toast: File size should not exceed 5MB
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        // Show error toast: Please upload an image file
        return;
      }
      
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        
        const response = await userService.updateAvatar(formData);
        this.profileData.avatar = response.avatarUrl;
        // Show success toast
      } catch (error) {
        console.error('Error uploading avatar:', error);
        // Show error toast
      }
    },
    
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
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
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  },
  mounted() {
    this.fetchProfileData();
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.profile-avatar {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  cursor: pointer;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 4px solid var(--primary-light);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border: 4px solid var(--primary-light);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.profile-info-item h6 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-timeline {
  position: relative;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: var(--dark);
}

.list-group-item {
  border: none;
  padding: 1rem;
}

.list-group-item i {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.list-group-item:hover {
  background-color: var(--light);
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  
  .profile-avatar {
    width: 120px;
    height: 120px;
  }
}
</style> 