import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Tooltip, Popover, Modal, Dropdown } from 'bootstrap'

// Initialize Bootstrap components
export default {
  install(app) {
    // Make Bootstrap components available globally
    app.config.globalProperties.$bootstrap = {
      Tooltip,
      Popover,
      Modal,
      Dropdown
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl)
    })
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new Popover(popoverTriggerEl)
    })
  }
} 