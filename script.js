/**
 * Nashama Business College - Core Logic
 * Handles Data Persistence (localStorage) and Shared Utilities
 */

const DB_KEY = 'nashama_db';

// Initial Data Schema
const initialData = {
    site_settings: {
        news_text: 'أهلاً بكم في كلية نشامى الأعمال - التسجيل مفتوح للفصل الدراسي الأول'
    },
    departments: [
        { id: 1, name: 'إدارة الأعمال' },
        { id: 2, name: 'المحاسبة' },
        { id: 3, name: 'التسويق الإلكتروني' }
    ],
    majors: [
        { id: 1, name: 'إدارة عامة', department_id: 1 },
        { id: 2, name: 'محاسبة تكاليف', department_id: 2 },
        { id: 3, name: 'تسويق رقمي', department_id: 3 }
    ],
    // facilityCategories removed - using manual string entry
    staff: [],
    facilities: [],
    materials: []
};

// --- Data Management ---

const DB = {
    // Load data from localStorage or initialize if empty
    load: () => {
        const data = localStorage.getItem(DB_KEY);
        if (!data) {
            DB.save(initialData);
            return initialData;
        }
        return JSON.parse(data);
    },

    // Save data to localStorage
    save: (data) => {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },

    // Reset to initial state
    reset: () => {
        DB.save(initialData);
        location.reload();
    },

    // Export data as JSON file
    export: () => {
        const data = DB.load();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "nashama_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    // Import data from JSON file
    import: (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                DB.save(data);
                alert('تم استيراد البيانات بنجاح!');
                location.reload();
            } catch (error) {
                alert('ملف غير صالح!');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }
};

// --- Helper Functions ---

const Helpers = {
    // Generate unique ID
    generateId: (collection) => {
        if (collection.length === 0) return 1;
        return Math.max(...collection.map(item => item.id)) + 1;
    },

    // Get Department Name by ID
    getDeptName: (id, departments) => {
        const dept = departments.find(d => d.id == id);
        return dept ? dept.name : 'غير محدد';
    },

    // getCatName removed - categories are now strings

    // Highlight Today in Schedule
    highlightToday: () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const todayIndex = new Date().getDay();
        const todayName = days[todayIndex];

        const rows = document.querySelectorAll(`.schedule-row[data-day="${todayName}"]`);
        rows.forEach(row => row.classList.add('highlight-today'));
    }
};

// Initialize Global State
window.appData = DB.load();

// Update News Ticker if exists
document.addEventListener('DOMContentLoaded', () => {
    const ticker = document.getElementById('news-ticker-content');
    if (ticker && window.appData.site_settings.news_text) {
        ticker.textContent = window.appData.site_settings.news_text;
    }
});

// Mobile Menu Toggle
function toggleMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('active');
}
