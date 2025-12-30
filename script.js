// Global variables
let allData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 12;
let isGridView = true;

// DOM elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    categoryFilter: document.getElementById('categoryFilter'),
    sectorFilter: document.getElementById('sectorFilter'),
    bankFilter: document.getElementById('bankFilter'),
    resetFilters: document.getElementById('resetFilters'),
    resultsContainer: document.getElementById('resultsContainer'),
    resultCount: document.getElementById('resultCount'),
    totalApplicants: document.getElementById('totalApplicants'),
    categoriesCount: document.getElementById('categoriesCount'),
    sectorsCount: document.getElementById('sectorsCount'),
    banksCount: document.getElementById('banksCount'),
    subSectorsCount: document.getElementById('subSectorsCount'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    noResults: document.getElementById('noResults'),
    pagination: document.getElementById('pagination'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageNumbers: document.getElementById('pageNumbers'),
    gridView: document.getElementById('gridView'),
    listView: document.getElementById('listView'),
    detailModal: document.getElementById('detailModal'),
    modalBody: document.getElementById('modalBody')
};

// Initialize the application
async function init() {
    try {
        await loadData();
        setupEventListeners();
        populateFilters();
        updateStats();
        displayResults();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to load data. Please refresh the page.');
    }
}

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        allData = await response.json();
        filteredData = [...allData];
        elements.loadingIndicator.style.display = 'none';
    } catch (error) {
        elements.loadingIndicator.innerHTML = '<p style="color: #ef4444;">❌ Error loading data</p>';
        throw error;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    elements.clearSearch.addEventListener('click', clearSearch);
    
    // Filter functionality
    elements.categoryFilter.addEventListener('change', applyFilters);
    elements.sectorFilter.addEventListener('change', applyFilters);
    elements.bankFilter.addEventListener('change', applyFilters);
    elements.resetFilters.addEventListener('click', resetFilters);
    
    // View toggle
    elements.gridView.addEventListener('click', () => toggleView(true));
    elements.listView.addEventListener('click', () => toggleView(false));
    
    // Pagination
    elements.prevPage.addEventListener('click', () => changePage(currentPage - 1));
    elements.nextPage.addEventListener('click', () => changePage(currentPage + 1));
    
    // Modal
    const closeModal = document.querySelector('.close-modal');
    closeModal.addEventListener('click', closeDetailModal);
    elements.detailModal.addEventListener('click', (e) => {
        if (e.target === elements.detailModal) closeDetailModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Handle keyboard shortcuts
function handleKeyboard(e) {
    if (e.key === 'Escape' && elements.detailModal.classList.contains('show')) {
        closeDetailModal();
    }
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        elements.searchInput.focus();
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search
function handleSearch() {
    const query = elements.searchInput.value.trim().toLowerCase();
    
    if (query) {
        elements.clearSearch.style.display = 'block';
    } else {
        elements.clearSearch.style.display = 'none';
    }
    
    applyFilters();
}

// Clear search
function clearSearch() {
    elements.searchInput.value = '';
    elements.clearSearch.style.display = 'none';
    applyFilters();
}

// Populate filter dropdowns
function populateFilters() {
    const categories = [...new Set(allData.map(item => item['Industory Category']))].filter(Boolean).sort();
    const sectors = [...new Set(allData.map(item => item['Business Sector']))].filter(Boolean).sort();
    const banks = [...new Set(allData.map(item => item['MFIBankName']))].filter(Boolean).sort();
    
    populateDropdown(elements.categoryFilter, categories);
    populateDropdown(elements.sectorFilter, sectors);
    populateDropdown(elements.bankFilter, banks);
}

// Populate dropdown helper
function populateDropdown(element, options) {
    options.forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option;
        optElement.textContent = option;
        element.appendChild(optElement);
    });
}

// Apply all filters
function applyFilters() {
    const searchQuery = elements.searchInput.value.trim().toLowerCase();
    const selectedCategory = elements.categoryFilter.value;
    const selectedSector = elements.sectorFilter.value;
    const selectedBank = elements.bankFilter.value;
    
    filteredData = allData.filter(item => {
        // Search filter
        const searchMatch = !searchQuery || 
            (item['Applicant Name'] && item['Applicant Name'].toLowerCase().includes(searchQuery)) ||
            (item['Applicant CNIC'] && item['Applicant CNIC'].toLowerCase().includes(searchQuery)) ||
            (item['MFIBankName'] && item['MFIBankName'].toLowerCase().includes(searchQuery)) ||
            (item['Industory Category'] && item['Industory Category'].toLowerCase().includes(searchQuery)) ||
            (item['Business Sector'] && item['Business Sector'].toLowerCase().includes(searchQuery)) ||
            (item['Business Sub Sector'] && item['Business Sub Sector'].toLowerCase().includes(searchQuery));
        
        // Category filter
        const categoryMatch = !selectedCategory || item['Industory Category'] === selectedCategory;
        
        // Sector filter
        const sectorMatch = !selectedSector || item['Business Sector'] === selectedSector;
        
        // Bank filter
        const bankMatch = !selectedBank || item['MFIBankName'] === selectedBank;
        
        return searchMatch && categoryMatch && sectorMatch && bankMatch;
    });
    
    currentPage = 1;
    displayResults();
}

// Reset all filters
function resetFilters() {
    elements.searchInput.value = '';
    elements.clearSearch.style.display = 'none';
    elements.categoryFilter.value = '';
    elements.sectorFilter.value = '';
    elements.bankFilter.value = '';
    
    filteredData = [...allData];
    currentPage = 1;
    displayResults();
}

// Update statistics
function updateStats() {
    elements.totalApplicants.textContent = allData.length.toLocaleString();
    
    const categories = new Set(allData.map(item => item['Industory Category']).filter(Boolean));
    elements.categoriesCount.textContent = categories.size;
    
    const sectors = new Set(allData.map(item => item['Business Sector']).filter(Boolean));
    elements.sectorsCount.textContent = sectors.size;
    
    const banks = new Set(allData.map(item => item['MFIBankName']).filter(Boolean));
    elements.banksCount.textContent = banks.size;
    
    const subSectors = new Set(allData.map(item => item['Business Sub Sector']).filter(Boolean));
    elements.subSectorsCount.textContent = subSectors.size;
}

// Display results
function displayResults() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Update result count
    elements.resultCount.textContent = `Showing ${filteredData.length} result${filteredData.length !== 1 ? 's' : ''}`;
    
    // Clear container
    elements.resultsContainer.innerHTML = '';
    
    // Show/hide no results message
    if (filteredData.length === 0) {
        elements.noResults.style.display = 'block';
        elements.pagination.style.display = 'none';
        return;
    } else {
        elements.noResults.style.display = 'none';
    }
    
    // Display cards
    pageData.forEach((item, index) => {
        const card = createApplicantCard(item, startIndex + index);
        elements.resultsContainer.appendChild(card);
    });
    
    // Update pagination
    updatePagination();
}

// Create applicant card
function createApplicantCard(item, index) {
    const card = document.createElement('div');
    card.className = 'applicant-card';
    card.setAttribute('data-index', index);
    
    card.innerHTML = `
        <div class="card-header">
            <div>
                <div class="card-title">${escapeHtml(item['Applicant Name'] || 'N/A')}</div>
                <div class="card-cnic">${escapeHtml(item['Applicant CNIC'] || 'N/A')}</div>
            </div>
            <div class="card-icon">
                <i class="fas fa-user-tie"></i>
            </div>
        </div>
        <div class="card-body">
            <div class="card-row">
                <i class="fas fa-industry"></i>
                <div>
                    <div class="card-label">Category</div>
                    <div class="card-value">
                        <span class="badge badge-category">${escapeHtml(item['Industory Category'] || 'N/A')}</span>
                    </div>
                </div>
            </div>
            <div class="card-row">
                <i class="fas fa-briefcase"></i>
                <div>
                    <div class="card-label">Sector</div>
                    <div class="card-value">
                        <span class="badge badge-sector">${escapeHtml(item['Business Sector'] || 'N/A')}</span>
                    </div>
                </div>
            </div>
            <div class="card-row">
                <i class="fas fa-chart-pie"></i>
                <div>
                    <div class="card-label">Sub Sector</div>
                    <div class="card-value">${escapeHtml(item['Business Sub Sector'] || 'N/A')}</div>
                </div>
            </div>
            <div class="card-row">
                <i class="fas fa-building"></i>
                <div>
                    <div class="card-label">Bank</div>
                    <div class="card-value">${escapeHtml(item['MFIBankName'] || 'N/A')}</div>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showDetailModal(item));
    
    return card;
}

// Show detail modal
function showDetailModal(item) {
    elements.modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">${escapeHtml(item['Applicant Name'] || 'N/A')}</div>
            <div class="modal-subtitle">${escapeHtml(item['Applicant CNIC'] || 'N/A')}</div>
        </div>
        <div class="modal-body">
            <div class="detail-row">
                <i class="fas fa-industry"></i>
                <div class="detail-content">
                    <div class="detail-label">Industry Category</div>
                    <div class="detail-value">
                        <span class="badge badge-category">${escapeHtml(item['Industory Category'] || 'N/A')}</span>
                    </div>
                </div>
            </div>
            <div class="detail-row">
                <i class="fas fa-briefcase"></i>
                <div class="detail-content">
                    <div class="detail-label">Business Sector</div>
                    <div class="detail-value">
                        <span class="badge badge-sector">${escapeHtml(item['Business Sector'] || 'N/A')}</span>
                    </div>
                </div>
            </div>
            <div class="detail-row">
                <i class="fas fa-chart-pie"></i>
                <div class="detail-content">
                    <div class="detail-label">Business Sub Sector</div>
                    <div class="detail-value">${escapeHtml(item['Business Sub Sector'] || 'N/A')}</div>
                </div>
            </div>
            <div class="detail-row">
                <i class="fas fa-building"></i>
                <div class="detail-content">
                    <div class="detail-label">MFI/Bank Name</div>
                    <div class="detail-value">${escapeHtml(item['MFIBankName'] || 'N/A')}</div>
                </div>
            </div>
        </div>
    `;
    
    elements.detailModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close detail modal
function closeDetailModal() {
    elements.detailModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (totalPages <= 1) {
        elements.pagination.style.display = 'none';
        return;
    }
    
    elements.pagination.style.display = 'flex';
    
    // Update prev/next buttons
    elements.prevPage.disabled = currentPage === 1;
    elements.nextPage.disabled = currentPage === totalPages;
    
    // Generate page numbers
    elements.pageNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-number';
        pageBtn.textContent = i;
        
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        pageBtn.addEventListener('click', () => changePage(i));
        elements.pageNumbers.appendChild(pageBtn);
    }
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayResults();
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle view (grid/list)
function toggleView(gridView) {
    isGridView = gridView;
    
    if (gridView) {
        elements.resultsContainer.className = 'results-grid';
        elements.gridView.classList.add('active');
        elements.listView.classList.remove('active');
    } else {
        elements.resultsContainer.className = 'results-list';
        elements.listView.classList.add('active');
        elements.gridView.classList.remove('active');
    }
    
    displayResults();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    elements.loadingIndicator.innerHTML = `
        <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #ef4444;"></i>
        <p style="color: #ef4444; font-weight: 600;">${message}</p>
    `;
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { init, loadData, applyFilters, displayResults };
}
