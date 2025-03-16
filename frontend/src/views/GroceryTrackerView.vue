<template>
  <div class="grocery-tracker">
    <div class="toolbar">
      <div class="search-filter">
        <div class="search-box">
          <input type="text" class="form-control" placeholder="Search groceries..." v-model="searchQuery">
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <div class="filter-box">
          <select class="form-select" v-model="categoryFilter">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-outline-primary" @click="toggleSortOrder">
          <i class="fas" :class="sortAscending ? 'fa-sort-amount-down-alt' : 'fa-sort-amount-up'"></i>
          {{ sortAscending ? 'Oldest First' : 'Newest First' }}
        </button>
        
        <button class="btn btn-primary" @click="openAddModal">
          <i class="fas fa-plus"></i> Add Item
        </button>
      </div>
    </div>
    
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon bg-primary-light">
          <i class="fas fa-shopping-basket text-primary"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ filteredItems.length }}</h3>
          <p class="stat-label">Total Items</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-warning-light">
          <i class="fas fa-exclamation-triangle text-warning"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ expiringItems.length }}</h3>
          <p class="stat-label">Expiring Soon</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-danger-light">
          <i class="fas fa-times-circle text-danger"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ expiredItems.length }}</h3>
          <p class="stat-label">Expired</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-success-light">
          <i class="fas fa-check-circle text-success"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ categories.length }}</h3>
          <p class="stat-label">Categories</p>
        </div>
      </div>
    </div>
    
    <div class="grocery-table-container">
      <table class="table table-hover">
        <thead>
          <tr>
            <th style="width: 18%">Name</th>
            <th style="width: 12%">Category</th>
            <th style="width: 12%">Purchase Date</th>
            <th style="width: 12%">Expiry Date</th>
            <th style="width: 22%">Notes</th>
            <th style="width: 12%">Status</th>
            <th style="width: 12%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id" :class="getRowClass(item)">
            <td>
              <div class="item-name">
                <div class="item-icon" :class="getCategoryColorClass(item.category_name)">
                  <i class="fas fa-shopping-basket"></i>
                </div>
                <span class="text-truncate">{{ item.name }}</span>
              </div>
            </td>
            <td>{{ item.category_name }}</td>
            <td>{{ formatDate(item.purchase_date) }}</td>
            <td>{{ formatDate(item.expiry_date) }}</td>
            <td>
              <div v-if="item.notes" class="notes-cell">
                <div v-if="!expandedNotes[item.id]" class="notes-preview">
                  {{ truncateText(item.notes, 50) }}
                  <button v-if="item.notes.length > 50" 
                    class="btn-link" 
                    @click.prevent="expandNote(item.id)">
                    View More
                  </button>
                </div>
                <div v-else class="notes-full">
                  {{ item.notes }}
                  <button class="btn-link" @click.prevent="collapseNote(item.id)">Show Less</button>
                </div>
              </div>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(item)">
                {{ getStatusText(item) }}
              </span>
            </td>
            <td>
              <div class="action-buttons-cell">
                <button 
                  class="btn btn-icon btn-light" 
                  @click="handleEditItem(item)"
                  title="Edit Item"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="btn btn-icon btn-success" 
                  @click="markAsConsumed(item)"
                  title="Mark as Consumed"
                  :disabled="item.is_consumed === 1"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button 
                  class="btn btn-icon btn-delete" 
                  @click="deleteItem(item)"
                  title="Delete Item"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td colspan="6" class="text-center py-4">
              <div class="empty-state">
                <i class="fas fa-box-open mb-3" style="font-size: 2rem;"></i>
                <p class="mb-0">No grocery items found</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add/Edit Modal -->
    <div class="modal" :class="{ 'show': showAddModal }" v-if="showAddModal" @click.self="showAddModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingItem ? 'Edit Grocery Item' : 'Add Grocery Item' }}</h5>
            <button type="button" class="btn-close" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="error" class="alert alert-danger mb-3">
              {{ error }}
            </div>
            
            <form @submit.prevent="saveItem">
              <div class="form-group mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" v-model="currentItem.name" required>
              </div>
              
              <div class="form-group mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" v-model="currentItem.category" required>
                  <option value="" disabled>Select a category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.name">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group mb-3">
                <label class="form-label">Purchase Date</label>
                <input type="date" class="form-control" v-model="currentItem.purchaseDate" required>
              </div>
              
              <div class="form-group mb-3">
                <label class="form-label">Expiry Date</label>
                <input type="date" class="form-control" v-model="currentItem.expiryDate" required>
              </div>
              
              <div class="form-group mb-3">
                <label class="form-label">Quantity</label>
                <input type="number" class="form-control" v-model="currentItem.quantity" min="1" required>
              </div>
              
              <div class="form-group mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" v-model="currentItem.notes" rows="3"></textarea>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" @click="showAddModal = false">Cancel</button>
                <button type="submit" class="btn btn-primary" :disabled="loading.add">
                  <span v-if="loading.add" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  {{ loading.add ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div class="modal" :class="{ 'show': showDeleteModal }" v-if="showDeleteModal">
      <div class="modal-backdrop" @click="showDeleteModal = false"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ itemToDelete?.name }}</strong>?</p>
            <p>This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="showDeleteModal = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { groceryService, authService } from '@/services/api';

export default {
  name: 'GroceryTrackerView',
  data() {
    return {
      groceryItems: [],
      categories: [],
      searchQuery: '',
      categoryFilter: '',
      sortAscending: true,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      newItem: {
        name: '',
        categoryId: '',
        purchaseDate: '',
        expiryDate: '',
        quantity: 1,
        quantityUnit: '',
        price: '',
        notes: ''
      },
      currentItem: {
        name: '',
        category: '',
        purchaseDate: '',
        expiryDate: '',
        quantity: 1,
        notes: '',
        consumed: false
      },
      newCategory: '',
      editingItem: null,
      editItem: null,
      itemToDelete: null,
      loading: {
        items: false,
        categories: false,
        add: false,
        edit: false,
        delete: false
      },
      error: null,
      isAuthenticated: false,
      expandedNotes: {}
    }
  },
  computed: {
    filteredItems() {
      let items = [...this.groceryItems];
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        items = items.filter(item => 
          item.name.toLowerCase().includes(query) || 
          item.category_name.toLowerCase().includes(query) ||
          (item.notes && item.notes.toLowerCase().includes(query))
        );
      }
      
      // Category filter
      if (this.categoryFilter) {
        items = items.filter(item => item.category_name === this.categoryFilter);
      }
      
      // Sort by expiry date
      const sortedItems = items.sort((a, b) => {
        const dateA = new Date(a.expiry_date);
        const dateB = new Date(b.expiry_date);
        return this.sortAscending ? dateA - dateB : dateB - dateA;
      });
      
      // Return a new array to prevent reactivity issues
      return [...sortedItems];
    },
    expiringItems() {
      const today = new Date();
      
      return this.groceryItems.filter(item => {
        if (item.is_consumed) return false;
        
        const expiryDate = new Date(item.expiry_date);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 0 && diffDays <= 3;
      });
    },
    expiredItems() {
      const today = new Date();
      
      return this.groceryItems.filter(item => {
        if (item.is_consumed) return false;
        
        const expiryDate = new Date(item.expiry_date);
        return expiryDate < today;
      });
    },
    consumedItems() {
      return this.groceryItems.filter(item => item.is_consumed);
    }
  },
  methods: {
    toggleSortOrder() {
      this.sortAscending = !this.sortAscending;
    },
    
    getDaysUntilExpiry(expiryDate) {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    },
    
    getExpiryStatus(expiryDate) {
      const daysLeft = this.getDaysUntilExpiry(expiryDate);
      
      if (daysLeft < 0) return 'expired';
      if (daysLeft <= 1) return 'critical';
      if (daysLeft <= 3) return 'warning';
      return 'good';
    },
    
    getExpiryText(expiryDate) {
      const daysLeft = this.getDaysUntilExpiry(expiryDate);
      
      if (daysLeft < 0) return `Expired ${Math.abs(daysLeft)} days ago`;
      if (daysLeft === 0) return 'Expires today';
      if (daysLeft === 1) return 'Expires tomorrow';
      return `Expires in ${daysLeft} days`;
    },
    
    resetNewItem() {
      this.newItem = {
        name: '',
        categoryId: '',
        purchaseDate: '',
        expiryDate: '',
        quantity: 1,
        quantityUnit: '',
        price: '',
        notes: ''
      };
    },
    
    openEditModal(item) {
      this.editItem = {
        id: item.id,
        name: item.name,
        categoryId: item.category_id,
        purchaseDate: item.purchase_date,
        expiryDate: item.expiry_date,
        quantity: item.quantity,
        quantityUnit: item.quantity_unit,
        price: item.price,
        notes: item.notes,
        isConsumed: item.is_consumed === 1,
        consumedDate: item.consumed_date,
        isWasted: item.is_wasted === 1
      };
      
      this.showEditModal = true;
    },
    
    openDeleteModal(item) {
      this.itemToDelete = item;
      this.showDeleteModal = true;
    },
    
    async checkAuth() {
      this.isAuthenticated = authService.isAuthenticated();
      if (!this.isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        this.$router.push('/login');
        return false;
      }
      return true;
    },
    
    async fetchGroceryItems() {
      if (!this.isAuthenticated) return;
      
      this.loading.items = true;
      this.error = null;
      
      try {
        const items = await groceryService.getItems();
        this.groceryItems = items;
      } catch (error) {
        console.error('Error fetching grocery items:', error);
        this.error = 'Failed to load grocery items. Please try again.';
      } finally {
        this.loading.items = false;
      }
    },
    
    async fetchCategories() {
      this.loading.categories = true;
      
      try {
        const categories = await groceryService.getCategories();
        this.categories = categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = 'Failed to load categories';
      } finally {
        this.loading.categories = false;
      }
    },
    
    async addGroceryItem() {
      try {
        if (!await this.checkAuth()) {
          throw new Error('Please log in to add items');
        }

        this.loading.add = true;
        this.error = null;
        
        // Validate required fields
        if (!this.currentItem.name || !this.currentItem.category || !this.currentItem.expiryDate) {
          throw new Error('Please fill in all required fields');
        }

        // Find category ID by name
        const category = this.categories.find(c => c.name === this.currentItem.category);
        
        if (!category) {
          throw new Error('Invalid category selected');
        }

        const itemData = {
          name: this.currentItem.name,
          category_id: category.id,
          purchase_date: this.currentItem.purchaseDate || new Date().toISOString().split('T')[0],
          expiry_date: this.currentItem.expiryDate,
          quantity: this.currentItem.quantity || 1,
          notes: this.currentItem.notes || ''
        };

        console.log('Adding item with data:', itemData);

        // Add the item
        const result = await groceryService.addItem(itemData);
        console.log('Item added successfully:', result);

        // Refresh the items list
        await this.fetchGroceryItems();

        // Reset form and close modal
        this.resetForm();
        this.showAddModal = false;

        // Show success message
        this.$toast.success('Item added successfully');

      } catch (error) {
        console.error('Error adding grocery item:', error);
        this.error = error.message || 'Failed to add item. Please try again.';
        if (error.message.includes('permission')) {
          // If it's a permission error, try to re-authenticate
          await this.checkAuth();
        }
      } finally {
        this.loading.add = false;
      }
    },
    
    async updateGroceryItem() {
      try {
        this.loading.add = true;
        this.error = null;
        
        // Find category ID
        const category = this.categories.find(cat => cat.name === this.currentItem.category);
        
        if (!category) {
          throw new Error('Please select a valid category');
        }
        
        const itemData = {
          name: this.currentItem.name,
          category_id: category.id,
          purchase_date: this.currentItem.purchaseDate,
          expiry_date: this.currentItem.expiryDate,
          quantity: this.currentItem.quantity,
          notes: this.currentItem.notes || '',
          is_consumed: this.currentItem.consumed ? 1 : 0,
          consumed_date: this.currentItem.consumed ? new Date().toISOString().split('T')[0] : null
        };
        
        await groceryService.updateItem(this.editingItem.id, itemData);
        await this.fetchGroceryItems();
        
        // Reset form and close modal
        this.resetForm();
        this.showAddModal = false;
        
      } catch (error) {
        console.error('Error updating grocery item:', error);
        this.error = error.message || 'Failed to update item. Please try again.';
      } finally {
        this.loading.add = false;
      }
    },
    
    async saveItem() {
      if (this.currentItem.category === 'new' && !this.newCategory) {
        this.error = 'Please enter a name for the new category';
        return;
      }
      
      if (this.editingItem) {
        await this.updateGroceryItem();
      } else {
        await this.addGroceryItem();
      }
    },
    
    resetForm() {
      this.currentItem = {
        name: '',
        category: '',
        purchaseDate: '',
        expiryDate: '',
        quantity: 1,
        notes: ''
      };
      this.newCategory = '';
      this.editingItem = null;
      this.error = null;
    },
    
    openAddModal() {
      this.resetForm();
      this.showAddModal = true;
    },
    
    async handleEditItem(item) {
      try {
        if (!await this.checkAuth()) {
          throw new Error('Please log in to edit items');
        }

        this.editingItem = item;
        this.currentItem = {
          name: item.name,
          category: item.category_name,
          purchaseDate: item.purchase_date ? item.purchase_date.split('T')[0] : '',
          expiryDate: item.expiry_date ? item.expiry_date.split('T')[0] : '',
          quantity: item.quantity || 1,
          notes: item.notes || '',
          consumed: item.is_consumed === 1
        };
        this.showAddModal = true;
      } catch (error) {
        console.error('Error preparing item for edit:', error);
        this.error = 'Failed to prepare item for editing';
      }
    },
    
    async markAsConsumed(item) {
      try {
        if (!await this.checkAuth()) {
          throw new Error('Please log in to update items');
        }

        const itemData = {
          ...item,
          is_consumed: 1,
          consumed_date: new Date().toISOString().split('T')[0]
        };

        await groceryService.updateItem(item.id, itemData);
        
        // Update the item in the local list immediately
        const index = this.groceryItems.findIndex(i => i.id === item.id);
        if (index !== -1) {
          this.groceryItems[index] = {
            ...this.groceryItems[index],
            is_consumed: 1,
            consumed_date: new Date().toISOString().split('T')[0]
          };
        }
        
        // Then refresh the full list
        await this.fetchGroceryItems();
      } catch (error) {
        console.error('Error marking item as consumed:', error);
        this.error = error.message || 'Failed to mark item as consumed';
      }
    },
    
    async deleteItem(item) {
      try {
        if (!await this.checkAuth()) {
          throw new Error('Please log in to delete items');
        }

        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
          await groceryService.deleteItem(item.id);
          await this.fetchGroceryItems();
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        this.error = error.message || 'Failed to delete item';
      }
    },
    
    async confirmDelete() {
      this.loading.delete = true;
      this.error = null;
      
      try {
        await groceryService.deleteItem(this.itemToDelete.id);
        
        // Refresh items
        await this.fetchGroceryItems();
        
        // Close modal
        this.showDeleteModal = false;
        this.itemToDelete = null;
      } catch (error) {
        console.error('Error deleting grocery item:', error);
        this.error = 'Failed to delete item. Please try again.';
      } finally {
        this.loading.delete = false;
      }
    },
    
    async getCategoryIdByName(categoryName) {
      try {
        const categories = await groceryService.getCategories();
        return categories.find(cat => cat.name === categoryName);
      } catch (error) {
        console.error('Error finding category:', error);
        return null;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
      }
    },
    getRowClass(item) {
      if (item.is_consumed) return 'consumed';
      
      const today = new Date();
      const expiryDate = new Date(item.expiry_date);
      
      if (expiryDate < today) {
        return 'expired';
      } else if (this.isExpiringSoon(expiryDate)) {
        return 'expiring-soon';
      }
      
      return '';
    },
    getStatusText(item) {
      if (item.is_consumed === 1) return 'Consumed';
      
      const today = new Date();
      const expiryDate = new Date(item.expiry_date);
      
      if (expiryDate < today) {
        return 'Expired';
      } else if (this.isExpiringSoon(expiryDate)) {
        return 'Expiring Soon';
      }
      
      return 'Good';
    },
    getStatusBadgeClass(item) {
      if (item.is_consumed === 1) return 'badge-secondary';
      
      const today = new Date();
      const expiryDate = new Date(item.expiry_date);
      
      if (expiryDate < today) {
        return 'badge-danger';
      } else if (this.isExpiringSoon(expiryDate)) {
        return 'badge-warning';
      }
      
      return 'badge-success';
    },
    isExpiringSoon(expiryDate) {
      const today = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);
      
      return expiryDate > today && expiryDate <= threeDaysLater;
    },
    getCategoryColorClass(category) {
      const categories = {
        'Dairy': 'bg-primary-light',
        'Bakery': 'bg-warning-light',
        'Meat': 'bg-danger-light',
        'Fruits': 'bg-success-light',
        'Vegetables': 'bg-info-light'
      };
      
      return categories[category] || 'bg-primary-light';
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substr(0, maxLength) + '...';
    },
    expandNote(itemId) {
      this.expandedNotes = {
        ...this.expandedNotes,
        [itemId]: true
      };
    },
    collapseNote(itemId) {
      this.expandedNotes = {
        ...this.expandedNotes,
        [itemId]: false
      };
    }
  },
  async mounted() {
    console.log('Component mounted, checking auth...');
    if (await this.checkAuth()) {
      console.log('Authenticated, fetching data...');
      await this.fetchCategories();
      await this.fetchGroceryItems();
    }
  }
}
</script>

<style scoped>
.grocery-tracker {
  width: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-filter {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  flex-grow: 1;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray);
}

.filter-box {
  width: 200px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 1rem;
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
}

.bg-danger-light {
  background-color: rgba(239, 68, 68, 0.1);
}

.stat-content {
  flex-grow: 1;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: var(--dark);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--gray);
  margin: 0;
}

.grocery-table-container {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: var(--light);
  font-weight: 600;
  color: var(--gray-dark);
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
}

.item-name {
  display: flex;
  align-items: center;
}

.item-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  margin-right: 0.75rem;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin: 0;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-icon:hover {
  transform: translateY(-1px);
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  color: var(--danger);
}

.btn-danger:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--gray);
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  display: none;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal.show {
  display: block;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  max-width: 500px;
  pointer-events: auto;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  outline: 0;
  pointer-events: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--dark);
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 0 0;
  gap: 0.5rem;
  border-top: 1px solid var(--border);
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--gray);
  cursor: pointer;
  padding: 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-dark);
}

tr.expired {
  background-color: rgba(239, 68, 68, 0.05);
}

tr.expiring-soon {
  background-color: rgba(245, 158, 11, 0.05);
}

tr.consumed {
  background-color: rgba(209, 213, 219, 0.2);
  color: var(--gray);
}

.days-text {
  font-size: 0.75rem;
}

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .search-box, .filter-box {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    flex-direction: column;
  }
  
  .action-buttons {
    justify-content: flex-end;
  }
}

@media (max-width: 576px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}

.badge {
  padding: 6px 10px;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
  display: inline-block;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.badge-warning {
  background-color: #ffc107;
  color: #000;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.text-muted {
  color: #6c757d;
}

.notes-cell {
  max-width: 100%;
  word-wrap: break-word;
  padding-right: 10px;
  position: relative;
}

.notes-preview {
  display: block;
  width: 100%;
  line-height: 1.4;
}

.notes-full {
  position: absolute;
  left: 0;
  right: 10px;
  background: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10;
  border: 1px solid #e9ecef;
  white-space: pre-wrap;
  word-break: break-word;
}

.btn-link {
  background: none;
  border: none;
  color: #007bff;
  padding: 2px 4px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-left: 4px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
}

.btn-link:hover {
  text-decoration: underline;
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 4px;
}

.table td {
  position: relative;
  padding: 1rem;
  vertical-align: middle;
  line-height: 1.4;
  white-space: normal;
}

/* Add styles for table columns to maintain their width */
.table th, .table td {
  width: 1%;
  white-space: nowrap;
}

.table th[style*="width"], .table td:nth-child(5) {
  white-space: normal;
  width: auto;
}

.action-buttons-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  min-width: 120px;
}

.btn-delete {
  background-color: #fff;
  border: 2px solid #dc3545;
  color: #dc3545;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: #fff;
  transform: translateY(-1px);
}
</style> 