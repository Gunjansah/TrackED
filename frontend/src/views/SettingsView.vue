<template>
  <div class="settings-container">
    <div class="row">
      <!-- Settings Navigation -->
      <div class="col-md-3 mb-4">
        <div class="card card-custom">
          <div class="list-group list-group-flush">
            <button 
              v-for="section in settingSections" 
              :key="section.id"
              class="list-group-item list-group-item-action d-flex align-items-center"
              :class="{ active: activeSection === section.id }"
              @click="activeSection = section.id"
            >
              <i :class="'bi ' + section.icon + ' me-2'"></i>
              {{ section.name }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Settings Content -->
      <div class="col-md-9">
        <div class="card card-custom">
          <div class="card-body">
            <!-- Account Settings -->
            <div v-if="activeSection === 'account'">
              <h4 class="card-title mb-4">Account Settings</h4>
              
              <form @submit.prevent="updateAccountSettings">
                <div class="mb-4">
                  <h5 class="mb-3">Email Preferences</h5>
                  <div class="form-check mb-2">
                    <input type="checkbox" class="form-check-input" id="emailNotifications" v-model="settings.emailNotifications">
                    <label class="form-check-label" for="emailNotifications">
                      Receive email notifications
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input type="checkbox" class="form-check-input" id="weeklyDigest" v-model="settings.weeklyDigest">
                    <label class="form-check-label" for="weeklyDigest">
                      Receive weekly digest
                    </label>
                  </div>
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="marketingEmails" v-model="settings.marketingEmails">
                    <label class="form-check-label" for="marketingEmails">
                      Receive marketing emails
                    </label>
                  </div>
                </div>
                
                <div class="mb-4">
                  <h5 class="mb-3">Security</h5>
                  <div class="mb-3">
                    <label class="form-label">Two-Factor Authentication</label>
                    <div class="d-flex align-items-center">
                      <div class="form-check form-switch">
                        <input type="checkbox" class="form-check-input" id="twoFactorAuth" v-model="settings.twoFactorEnabled">
                        <label class="form-check-label" for="twoFactorAuth">
                          {{ settings.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
                        </label>
                      </div>
                      <button 
                        type="button" 
                        class="btn btn-link ms-2"
                        v-if="!settings.twoFactorEnabled"
                        @click="setupTwoFactor"
                      >
                        Set up
                      </button>
                    </div>
                  </div>
                  
                  <button type="button" class="btn btn-outline-primary mb-3" @click="changePassword">
                    Change Password
                  </button>
                </div>
                
                <div class="mb-4">
                  <h5 class="mb-3">Language and Region</h5>
                  <div class="mb-3">
                    <label class="form-label">Language</label>
                    <select class="form-select" v-model="settings.language">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Time Zone</label>
                    <select class="form-select" v-model="settings.timezone">
                      <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                        {{ tz.label }}
                      </option>
                    </select>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </form>
            </div>
            
            <!-- Notifications Settings -->
            <div v-if="activeSection === 'notifications'">
              <h4 class="card-title mb-4">Notification Settings</h4>
              
              <form @submit.prevent="updateNotificationSettings">
                <div class="mb-4">
                  <h5 class="mb-3">Push Notifications</h5>
                  <div class="form-check mb-2">
                    <input type="checkbox" class="form-check-input" id="itemExpiry" v-model="settings.notifications.itemExpiry">
                    <label class="form-check-label" for="itemExpiry">
                      Item expiry alerts
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input type="checkbox" class="form-check-input" id="lowStock" v-model="settings.notifications.lowStock">
                    <label class="form-check-label" for="lowStock">
                      Low stock alerts
                    </label>
                  </div>
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="activityUpdates" v-model="settings.notifications.activityUpdates">
                    <label class="form-check-label" for="activityUpdates">
                      Activity updates
                    </label>
                  </div>
                </div>
                
                <div class="mb-4">
                  <h5 class="mb-3">Notification Schedule</h5>
                  <div class="mb-3">
                    <label class="form-label">Quiet Hours Start</label>
                    <input type="time" class="form-control" v-model="settings.notifications.quietHoursStart">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Quiet Hours End</label>
                    <input type="time" class="form-control" v-model="settings.notifications.quietHoursEnd">
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </form>
            </div>
            
            <!-- Privacy Settings -->
            <div v-if="activeSection === 'privacy'">
              <h4 class="card-title mb-4">Privacy Settings</h4>
              
              <form @submit.prevent="updatePrivacySettings">
                <div class="mb-4">
                  <h5 class="mb-3">Data Sharing</h5>
                  <div class="form-check mb-2">
                    <input type="checkbox" class="form-check-input" id="shareUsageData" v-model="settings.privacy.shareUsageData">
                    <label class="form-check-label" for="shareUsageData">
                      Share usage data to improve the service
                    </label>
                  </div>
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="shareCrashReports" v-model="settings.privacy.shareCrashReports">
                    <label class="form-check-label" for="shareCrashReports">
                      Share crash reports
                    </label>
                  </div>
                </div>
                
                <div class="mb-4">
                  <h5 class="mb-3">Account Data</h5>
                  <button type="button" class="btn btn-outline-primary me-2" @click="downloadData">
                    Download My Data
                  </button>
                  <button type="button" class="btn btn-outline-danger" @click="deleteAccount">
                    Delete Account
                  </button>
                </div>
                
                <button type="submit" class="btn btn-primary" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </form>
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
  name: 'SettingsView',
  data() {
    return {
      activeSection: 'account',
      isSaving: false,
      settingSections: [
        { id: 'account', name: 'Account', icon: 'bi-person' },
        { id: 'notifications', name: 'Notifications', icon: 'bi-bell' },
        { id: 'privacy', name: 'Privacy', icon: 'bi-shield-lock' }
      ],
      settings: {
        emailNotifications: true,
        weeklyDigest: true,
        marketingEmails: false,
        twoFactorEnabled: false,
        language: 'en',
        timezone: 'UTC',
        notifications: {
          itemExpiry: true,
          lowStock: true,
          activityUpdates: true,
          quietHoursStart: '22:00',
          quietHoursEnd: '07:00'
        },
        privacy: {
          shareUsageData: true,
          shareCrashReports: true
        }
      },
      timezones: [
        { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Denver', label: 'Mountain Time (MT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        { value: 'Europe/London', label: 'London (GMT)' },
        { value: 'Europe/Paris', label: 'Paris (CET)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
      ]
    }
  },
  methods: {
    async fetchSettings() {
      try {
        const data = await userService.getSettings();
        this.settings = { ...this.settings, ...data };
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    },
    
    async updateAccountSettings() {
      this.isSaving = true;
      try {
        await userService.updateSettings({
          emailNotifications: this.settings.emailNotifications,
          weeklyDigest: this.settings.weeklyDigest,
          marketingEmails: this.settings.marketingEmails,
          language: this.settings.language,
          timezone: this.settings.timezone
        });
      } catch (error) {
        console.error('Error updating account settings:', error);
      } finally {
        this.isSaving = false;
      }
    },
    
    async updateNotificationSettings() {
      this.isSaving = true;
      try {
        await userService.updateNotificationSettings(this.settings.notifications);
      } catch (error) {
        console.error('Error updating notification settings:', error);
      } finally {
        this.isSaving = false;
      }
    },
    
    async updatePrivacySettings() {
      this.isSaving = true;
      try {
        await userService.updatePrivacySettings(this.settings.privacy);
      } catch (error) {
        console.error('Error updating privacy settings:', error);
      } finally {
        this.isSaving = false;
      }
    },
    
    async setupTwoFactor() {
      try {
        await userService.setupTwoFactor();
        // TODO: Implement 2FA setup UI (QR code modal)
      } catch (error) {
        console.error('Error setting up 2FA:', error);
      }
    },
    
    async changePassword() {
      // Implement password change logic (e.g., show modal)
    },
    
    async downloadData() {
      try {
        await userService.downloadUserData();
      } catch (error) {
        console.error('Error downloading data:', error);
      }
    },
    
    async deleteAccount() {
      // Implement account deletion logic with confirmation
    }
  },
  mounted() {
    this.fetchSettings();
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.list-group-item {
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.list-group-item.active {
  background-color: var(--primary-light);
  color: var(--primary);
  border-color: transparent;
}

.list-group-item.active i {
  color: var(--primary);
}

.form-check {
  user-select: none;
}
</style> 