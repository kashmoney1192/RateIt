class RatingApp {
    constructor() {
        console.log('RatingApp constructor called');
        
        // Test localStorage functionality
        this.testLocalStorage();
        
        // Load data with error handling
        try {
            this.items = JSON.parse(localStorage.getItem('ratingItems') || '[]');
            console.log('Items loaded:', this.items.length);
        } catch (e) {
            console.error('Error loading items:', e);
            this.items = [];
        }
        
        try {
            this.users = JSON.parse(localStorage.getItem('users') || '[]');
            console.log('Users loaded:', this.users.length);
        } catch (e) {
            console.error('Error loading users:', e);
            this.users = [];
        }
        
        // Ensure admin account exists
        this.ensureAdminAccount();
        
        try {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            console.log('Current user loaded:', this.currentUser);
        } catch (e) {
            console.error('Error loading current user:', e);
            this.currentUser = null;
        }
        
        try {
            this.profileRatings = JSON.parse(localStorage.getItem('profileRatings') || '[]');
            console.log('Profile ratings loaded:', this.profileRatings.length);
        } catch (e) {
            console.error('Error loading profile ratings:', e);
            this.profileRatings = [];
        }
        
        // Session username for quick rating (separate from full user accounts)  
        this.sessionUsername = sessionStorage.getItem('sessionUsername') || '';
        console.log('Session username loaded:', this.sessionUsername);
        
        // Ensure arrays are initialized
        if (!Array.isArray(this.items)) this.items = [];
        if (!Array.isArray(this.users)) this.users = [];
        if (!Array.isArray(this.profileRatings)) this.profileRatings = [];
        
        this.selectedRating = 0;
        this.profileSelectedRating = 0;
        this.selectedCategory = '';
        this.highlightedCategoryIndex = -1;
        this.highlightedSearchIndex = -1;
        
        // Common disambiguation mappings for search terms
        this.disambiguationMappings = {
            'apple': {
                meanings: ['🍎 Fruit/Food', '💻 Technology Company', '🎵 Music/Records'],
                note: 'Multiple meanings: Consider the fruit, tech company, or music context'
            },
            'nike': {
                meanings: ['👟 Sportswear Brand', '⚽ Athletic Equipment', '👗 Fashion'],
                note: 'Sports and fashion brand with various product categories'
            },
            'star': {
                meanings: ['⭐ Rating/Review', '🌟 Celebrity/Entertainment', '🔭 Astronomy/Space'],
                note: 'Could refer to ratings, celebrities, or celestial objects'
            },
            'amazon': {
                meanings: ['📦 E-commerce/Shopping', '📚 Books/Kindle', '☁️ Web Services', '🌳 Rainforest'],
                note: 'Major online marketplace, cloud services, or the rainforest'
            },
            'mouse': {
                meanings: ['🖱️ Computer Hardware', '🐭 Animal/Pet', '🎮 Gaming Peripheral'],
                note: 'Computer device, animal, or gaming equipment'
            },
            'chrome': {
                meanings: ['🌐 Web Browser', '🚗 Car Parts/Automotive', '💄 Beauty/Cosmetics'],
                note: 'Google browser, car finishing, or beauty products'
            },
            'turkey': {
                meanings: ['🦃 Food/Thanksgiving', '🇹🇷 Country/Travel', '🥩 Meat/Cooking'],
                note: 'Holiday food, country destination, or cooking ingredient'
            },
            'bridge': {
                meanings: ['🌉 Architecture/Places', '🃏 Card Game', '🦷 Dental/Healthcare', '💻 Software/Technology'],
                note: 'Physical structure, card game, dental work, or tech networking'
            }
        };
        
        // Category mapping for better search
        this.categoryMapping = {
            'food': '🍔 Food & Dining',
            'restaurants': '🍽️ Restaurants',
            'recipes': '👩‍🍳 Recipes',
            'drinks': '🍹 Drinks & Beverages',
            'entertainment': '🎬 Movies & TV',
            'music': '🎵 Music',
            'books': '📚 Books',
            'games': '🎮 Video Games',
            'boardgames': '🎲 Board Games',
            'sports': '⚽ Sports',
            'fitness': '💪 Fitness & Health',
            'places': '📍 Places & Travel',
            'hotels': '🏨 Hotels',
            'attractions': '🎢 Attractions',
            'events': '🎉 Events',
            'technology': '💻 Technology',
            'software': '🖥️ Software & Apps',
            'gadgets': '📱 Gadgets',
            'shopping': '🛒 Shopping',
            'fashion': '👗 Fashion & Style',
            'beauty': '💄 Beauty & Cosmetics',
            'home': '🏠 Home & Garden',
            'automotive': '🚗 Automotive',
            'education': '🎓 Education',
            'courses': '📖 Online Courses',
            'services': '🔧 Services',
            'healthcare': '🏥 Healthcare',
            'finance': '💰 Finance & Banking',
            'art': '🎨 Art & Culture',
            'photography': '📸 Photography',
            'podcasts': '🎙️ Podcasts',
            'youtube': '📺 YouTube Channels',
            'websites': '🌐 Websites',
            'productivity': '⚡ Productivity Tools',
            'pets': '🐕 Pets & Animals',
            'other': '🔹 Other'
        };
        
        this.initializePreviewData();
        this.init();
        
        // Add debug functions to window for manual testing
        window.debugRating = {
            app: this,
            testSignIn: () => this.signIn(),
            testSignUp: () => this.signUp(),
            getUsers: () => this.users,
            getCurrentUser: () => this.currentUser,
            clearData: () => {
                localStorage.clear();
                location.reload();
            },
            forceSignIn: () => {
                console.log('🚀 Force sign in triggered');
                this.currentUser = this.users[0] || null;
                if (this.currentUser) {
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.setupAuthInterface();
                    console.log('✅ Force sign in successful:', this.currentUser.name);
                } else {
                    console.error('❌ No users available for force sign in - no popup shown');
                }
            },
            fillTestCredentials: () => {
                const usernameField = document.getElementById('signin-username');
                const passwordField = document.getElementById('signin-password');
                
                if (usernameField && passwordField) {
                    usernameField.value = 'Owner';
                    passwordField.value = 'preview123';
                    console.log('✅ Test credentials filled');
                    return true;
                } else {
                    console.error('❌ Could not find form fields');
                    return false;
                }
            },
            testFullSignIn: () => {
                console.log('🧪 Testing full sign in process...');
                
                // Fill credentials
                if (window.debugRating.fillTestCredentials()) {
                    // Wait a moment then sign in
                    setTimeout(() => {
                        this.signIn();
                    }, 100);
                }
            }
        };
        
        console.log('Debug functions available in window.debugRating');
    }
    
    testLocalStorage() {
        try {
            const testKey = 'test-' + Date.now();
            const testValue = 'test-value';
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                console.log('localStorage test: PASSED');
                return true;
            } else {
                console.error('localStorage test: FAILED - value mismatch');
                return false;
            }
        } catch (e) {
            console.error('localStorage test: FAILED -', e);
            return false;
        }
    }

    ensureAdminAccount() {
        // Check if admin account already exists
        const existingAdmin = this.users.find(u => u.name === 'Admin');
        
        if (!existingAdmin) {
            console.log('🛡️ Creating admin account...');
            const adminUser = {
                id: Date.now(),
                name: 'Admin',
                password: 'Admin2025!',
                createdAt: new Date().toISOString(),
                isAdmin: true
            };
            
            this.users.push(adminUser);
            localStorage.setItem('users', JSON.stringify(this.users));
            console.log('✅ Admin account created successfully');
        } else {
            console.log('🛡️ Admin account already exists');
            // Ensure existing admin has correct password
            if (existingAdmin.password !== 'Admin2025!') {
                console.log('🔧 Updating admin password...');
                existingAdmin.password = 'Admin2025!';
                existingAdmin.isAdmin = true;
                localStorage.setItem('users', JSON.stringify(this.users));
                console.log('✅ Admin password updated');
            }
        }
    }

    init() {
        console.log('App initializing...');
        console.log('Users loaded:', this.users.length);
        console.log('Items loaded:', this.items.length);
        console.log('Current user:', this.currentUser);
        console.log('Session username:', this.sessionUsername);
        
        this.bindEvents();
        this.setupAuthInterface();
        this.updateSessionUserDisplay();
        this.updateHeaderAuth();
        this.renderItems();
        
        console.log('App initialized successfully');
    }
    
    showAuthSection() {
        const authSection = document.getElementById('auth-section');
        if (authSection) {
            authSection.style.display = 'block';
            authSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log('🔓 Auth section shown');
        }
    }
    
    showSigninForm() {
        console.log('📝 Showing sign in form');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        const signinTab = document.getElementById('signin-tab');
        const signupTab = document.getElementById('signup-tab');
        
        if (signinForm) signinForm.style.display = 'block';
        if (signupForm) signupForm.style.display = 'none';
        if (signinTab) {
            signinTab.classList.add('active');
            console.log('✅ Sign in tab activated');
        }
        if (signupTab) signupTab.classList.remove('active');
        
        // Focus on username field
        setTimeout(() => {
            const usernameField = document.getElementById('signin-username');
            if (usernameField) usernameField.focus();
        }, 100);
    }
    
    showSignupForm() {
        console.log('📝 Showing sign up form');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        const signinTab = document.getElementById('signin-tab');
        const signupTab = document.getElementById('signup-tab');
        
        if (signinForm) signinForm.style.display = 'none';
        if (signupForm) signupForm.style.display = 'block';
        if (signinTab) signinTab.classList.remove('active');
        if (signupTab) {
            signupTab.classList.add('active');
            console.log('✅ Sign up tab activated');
        }
        
        // Focus on name field
        setTimeout(() => {
            const nameField = document.getElementById('signup-name');
            if (nameField) nameField.focus();
        }, 100);
    }
    
    clearAuthForms() {
        // Clear sign in form
        const signinUsername = document.getElementById('signin-username');
        const signinPassword = document.getElementById('signin-password');
        if (signinUsername) signinUsername.value = '';
        if (signinPassword) signinPassword.value = '';
        
        // Clear sign up form  
        const signupName = document.getElementById('signup-name');
        const signupPassword = document.getElementById('signup-password');
        if (signupName) signupName.value = '';
        if (signupPassword) signupPassword.value = '';
        
        console.log('🧹 Auth forms cleared');
    }
    
    bindCategorySearchEvents() {
        console.log('🏷️ Binding category search events...');
        
        const bindCategoryEvents = () => {
            const categorySearch = document.getElementById('category-search');
            const categoryDropdown = document.getElementById('category-dropdown');
            
            if (!categorySearch) {
                console.warn('⚠️ Category search element not found, will retry...');
                return;
            }
            
            if (!categoryDropdown) {
                console.warn('⚠️ Category dropdown element not found, will retry...');
                return;
            }
            
            console.log('✅ Category search elements found');
            
            // Clear any existing handlers
            categorySearch.oninput = null;
            categorySearch.onfocus = null;
            categorySearch.onkeydown = null;
            
            // Input event for filtering with enhanced error handling
            categorySearch.addEventListener('input', (e) => {
                try {
                    const query = e.target.value.trim();
                    console.log('🔍 Category search query:', query);
                    
                    if (query.length > 0) {
                        this.filterCategories(query);
                    } else {
                        this.populateCategoryDropdown();
                        this.showCategoryDropdown();
                    }
                } catch (error) {
                    console.error('❌ Error in category input handler:', error);
                }
            });
            
            // Focus event - show all categories
            categorySearch.addEventListener('focus', (e) => {
                try {
                    console.log('🎯 Category search focused');
                    this.populateCategoryDropdown();
                    this.showCategoryDropdown();
                } catch (error) {
                    console.error('❌ Error in category focus handler:', error);
                }
            });
            
            // Click event to also show dropdown
            categorySearch.addEventListener('click', (e) => {
                try {
                    console.log('💆 Category search clicked');
                    this.populateCategoryDropdown();
                    this.showCategoryDropdown();
                } catch (error) {
                    console.error('❌ Error in category click handler:', error);
                }
            });
            
            // Keyboard navigation with error handling
            categorySearch.addEventListener('keydown', (e) => {
                try {
                    this.handleCategoryKeyboard(e);
                } catch (error) {
                    console.error('❌ Error in category keyboard handler:', error);
                }
            });
            
            // Verify handlers are attached
            console.log('✅ Category search handlers attached successfully');
        };
        
        // Bind immediately and with retries
        bindCategoryEvents();
        setTimeout(() => {
            console.log('🔄 Retry category events binding (500ms)');
            bindCategoryEvents();
        }, 500);
        setTimeout(() => {
            console.log('🔄 Retry category events binding (1000ms)');
            bindCategoryEvents();
        }, 1000);
        setTimeout(() => {
            console.log('🔄 Final retry category events binding (2000ms)');
            bindCategoryEvents();
        }, 2000);
        
        // Global click handler to hide dropdown with error handling
        document.addEventListener('click', (e) => {
            try {
                if (!e.target.closest('.category-search-container')) {
                    this.hideCategoryDropdown();
                }
            } catch (error) {
                console.error('❌ Error in global category click handler:', error);
            }
        });
        
        console.log('✅ Category search events binding setup completed');
    }

    bindEvents() {
        console.log('🔧 Binding events...');
        
        // Enhanced DOM ready check and auth event binding
        const bindAuthEvents = () => {
            console.log('🎯 Attempting to bind auth events...');
            
            // Auth tab elements
            const signinTab = document.getElementById('signin-tab');
            const signupTab = document.getElementById('signup-tab');
            const signinBtn = document.getElementById('signin-btn');
            const signupBtn = document.getElementById('signup-btn');
            const signoutBtn = document.getElementById('sign-out');
            
            // Header auth elements
            const headerSigninBtn = document.getElementById('header-signin-btn');
            const headerSignupBtn = document.getElementById('header-signup-btn');
            const headerSignoutBtn = document.getElementById('header-signout-btn');
            
            console.log('🔍 Elements found:', {
                signinTab: !!signinTab,
                signupTab: !!signupTab,
                signinBtn: !!signinBtn,
                signupBtn: !!signupBtn,
                signoutBtn: !!signoutBtn,
                headerSigninBtn: !!headerSigninBtn,
                headerSignupBtn: !!headerSignupBtn,
                headerSignoutBtn: !!headerSignoutBtn
            });
            
            // Tab switching events
            if (signinTab) {
                const tabHandler = (e) => {
                    e.preventDefault();
                    console.log('📝 Showing sign in form');
                    this.showSigninForm();
                };
                signinTab.removeEventListener('click', tabHandler);
                signinTab.addEventListener('click', tabHandler);
                signinTab.onclick = tabHandler;
            }
            
            if (signupTab) {
                const tabHandler = (e) => {
                    e.preventDefault();
                    console.log('📝 Showing sign up form');
                    this.showSignupForm();
                };
                signupTab.removeEventListener('click', tabHandler);
                signupTab.addEventListener('click', tabHandler);
                signupTab.onclick = tabHandler;
            }
            
            // Main form buttons
            if (signinBtn) {
                console.log('🔐 Binding sign in button');
                const signinHandler = (e) => {
                    console.log('🔥 Sign in button clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    this.signIn();
                    return false;
                };
                
                // Clear existing handlers and add new ones
                signinBtn.onclick = null;
                signinBtn.removeEventListener('click', signinHandler);
                signinBtn.addEventListener('click', signinHandler);
                signinBtn.onclick = signinHandler;
                signinBtn.type = 'button';
                
                console.log('✅ Sign in button bound successfully');
            } else {
                console.warn('⚠️ Sign in button not found - may not be visible yet');
            }
            
            if (signupBtn) {
                console.log('📝 Binding sign up button');
                const signupHandler = (e) => {
                    console.log('🔥 Sign up button clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    this.signUp();
                    return false;
                };
                
                // Clear existing handlers and add new ones
                signupBtn.onclick = null;
                signupBtn.removeEventListener('click', signupHandler);
                signupBtn.addEventListener('click', signupHandler);
                signupBtn.onclick = signupHandler;
                signupBtn.type = 'button';
                
                console.log('✅ Sign up button bound successfully');
            } else {
                console.warn('⚠️ Sign up button not found - may not be visible yet');
            }
            
            // Header auth buttons
            if (headerSigninBtn) {
                const headerSigninHandler = (e) => {
                    console.log('🔥 Header sign in clicked!');
                    e.preventDefault();
                    this.showAuthSection();
                    this.showSigninForm();
                };
                headerSigninBtn.onclick = null;
                headerSigninBtn.removeEventListener('click', headerSigninHandler);
                headerSigninBtn.addEventListener('click', headerSigninHandler);
                headerSigninBtn.onclick = headerSigninHandler;
            }
            
            if (headerSignupBtn) {
                const headerSignupHandler = (e) => {
                    console.log('🔥 Header sign up clicked!');
                    e.preventDefault();
                    this.showAuthSection();
                    this.showSignupForm();
                };
                headerSignupBtn.onclick = null;
                headerSignupBtn.removeEventListener('click', headerSignupHandler);
                headerSignupBtn.addEventListener('click', headerSignupHandler);
                headerSignupBtn.onclick = headerSignupHandler;
            }
            
            if (headerSignoutBtn) {
                const signoutHandler = (e) => {
                    console.log('🔥 Sign out clicked!');
                    e.preventDefault();
                    this.signOut();
                };
                headerSignoutBtn.onclick = null;
                headerSignoutBtn.removeEventListener('click', signoutHandler);
                headerSignoutBtn.addEventListener('click', signoutHandler);
                headerSignoutBtn.onclick = signoutHandler;
            }
            
            if (signoutBtn) {
                const signoutHandler = (e) => {
                    console.log('🔥 Main sign out clicked!');
                    e.preventDefault();
                    this.signOut();
                };
                signoutBtn.onclick = null;
                signoutBtn.removeEventListener('click', signoutHandler);
                signoutBtn.addEventListener('click', signoutHandler);
                signoutBtn.onclick = signoutHandler;
            }
            
            // Global backup click handler
            document.removeEventListener('click', this.globalClickHandler);
            this.globalClickHandler = (e) => {
                const target = e.target;
                if (target.id === 'signin-btn' || target.classList.contains('signin-btn')) {
                    console.log('🌐 Global sign in handler triggered');
                    e.preventDefault();
                    e.stopPropagation();
                    this.signIn();
                    return false;
                }
                if (target.id === 'signup-btn' || target.classList.contains('signup-btn')) {
                    console.log('🌐 Global sign up handler triggered');
                    e.preventDefault();
                    e.stopPropagation();
                    this.signUp();
                    return false;
                }
                if (target.id === 'header-signin-btn') {
                    console.log('🌐 Global header sign in handler triggered');
                    e.preventDefault();
                    this.showAuthSection();
                    this.showSigninForm();
                }
                if (target.id === 'header-signup-btn') {
                    console.log('🌐 Global header sign up handler triggered');
                    e.preventDefault();
                    this.showAuthSection();
                    this.showSignupForm();
                }
                if (target.id === 'header-signout-btn' || target.id === 'sign-out') {
                    console.log('🌐 Global sign out handler triggered');
                    e.preventDefault();
                    this.signOut();
                }
            };
            document.addEventListener('click', this.globalClickHandler, true);
            
            console.log('🎉 Auth event binding completed');
        };
        
        // Bind immediately and with retries
        bindAuthEvents();
        setTimeout(() => {
            console.log('🔄 Retry binding auth events (500ms)');
            bindAuthEvents();
        }, 500);
        setTimeout(() => {
            console.log('🔄 Retry binding auth events (1000ms)');
            bindAuthEvents();
        }, 1000);
        setTimeout(() => {
            console.log('🔄 Final retry binding auth events (2000ms)');
            bindAuthEvents();
        }, 2000);

        // Bind category search events
        this.bindCategorySearchEvents();
        
        // Main app events
        const addItemForm = document.getElementById('add-item-form');
        const searchInput = document.getElementById('search');
        const filterCategory = document.getElementById('filter-category');
        const filterRating = document.getElementById('filter-rating');
        const filterReviewCount = document.getElementById('filter-review-count');
        const filterCommentCount = document.getElementById('filter-comment-count');
        const clearFiltersBtn = document.getElementById('clear-filters');
        const addItemStars = document.getElementById('add-item-stars');
        
        if (addItemForm) {
            addItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addItem();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 0) {
                    this.showSearchResults(query);
                    this.filterItems(); // Also filter the main items grid
                } else {
                    this.hideSearchResults();
                    this.filterItems();
                }
            });
            
            searchInput.addEventListener('focus', (e) => {
                const query = e.target.value.trim();
                if (query.length > 0) {
                    this.showSearchResults(query);
                    this.filterItems(); // Also filter the main items grid
                }
            });
            
            searchInput.addEventListener('keydown', (e) => {
                this.handleSearchKeyboard(e);
            });
        }

        if (filterCategory) {
            filterCategory.addEventListener('change', (e) => {
                this.filterItems();
            });
        }

        if (filterRating) {
            filterRating.addEventListener('change', (e) => {
                this.filterItems();
            });
        }

        if (filterReviewCount) {
            filterReviewCount.addEventListener('change', (e) => {
                this.filterItems();
            });
        }

        if (filterCommentCount) {
            filterCommentCount.addEventListener('change', (e) => {
                this.filterItems();
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', (e) => {
                this.clearAllFilters();
            });
        }

        // Top reviewers modal events
        const topReviewersBtn = document.getElementById('show-top-reviewers');
        const topReviewersModal = document.getElementById('top-reviewers-modal');
        const closeTopReviewersBtn = document.getElementById('close-top-reviewers');

        if (topReviewersBtn) {
            topReviewersBtn.addEventListener('click', () => {
                this.showTopReviewersModal();
            });
        }

        if (closeTopReviewersBtn) {
            closeTopReviewersBtn.addEventListener('click', () => {
                this.hideTopReviewersModal();
            });
        }

        if (topReviewersModal) {
            topReviewersModal.addEventListener('click', (e) => {
                if (e.target === topReviewersModal) {
                    this.hideTopReviewersModal();
                }
            });
        }

        // Profile rating modal events
        const profileRatingModal = document.getElementById('profile-rating-modal');
        const closeProfileRatingBtn = document.getElementById('close-profile-rating');
        
        if (closeProfileRatingBtn) {
            closeProfileRatingBtn.addEventListener('click', () => {
                this.hideProfileRatingModal();
            });
        }

        if (profileRatingModal) {
            profileRatingModal.addEventListener('click', (e) => {
                if (e.target === profileRatingModal) {
                    this.hideProfileRatingModal();
                }
            });
        }

        // Profile rating stars
        const profileRatingStars = document.getElementById('profile-rating-stars');
        if (profileRatingStars) {
            const stars = profileRatingStars.querySelectorAll('.star');
            stars.forEach(star => {
                star.addEventListener('click', (e) => {
                    this.setProfileRating(parseInt(e.target.dataset.rating));
                });
                star.addEventListener('mouseenter', (e) => {
                    this.highlightProfileStars(parseInt(e.target.dataset.rating));
                });
            });

            profileRatingStars.addEventListener('mouseleave', () => {
                this.highlightProfileStars(this.profileSelectedRating);
            });
        }

        // Submit profile rating
        const submitProfileRatingBtn = document.getElementById('submit-profile-rating');
        if (submitProfileRatingBtn) {
            submitProfileRatingBtn.addEventListener('click', () => {
                this.submitProfileRating();
            });
        }

        // Category search functionality
        const categorySearch = document.getElementById('category-search');
        const categoryDropdown = document.getElementById('category-dropdown');
        
        if (categorySearch) {
            categorySearch.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                console.log('🔍 Category search query:', query);
                
                // Clear the hidden field when user is typing
                const categoryHidden = document.getElementById('category');
                if (categoryHidden) categoryHidden.value = '';
                
                // Always show dropdown when user types
                this.populateCategoryDropdown(query);
                this.showCategoryDropdown();
            });
            
            categorySearch.addEventListener('focus', (e) => {
                // Always show dropdown on focus
                const query = e.target.value.trim();
                this.populateCategoryDropdown(query);
                this.showCategoryDropdown();
            });
            
            categorySearch.addEventListener('keydown', (e) => {
                this.handleCategoryKeyboard(e);
            });
        }
        
        // Item details modal events
        const itemDetailsModal = document.getElementById('item-details-modal');
        const closeItemDetailsBtn = document.getElementById('close-item-details');
        const addMyRatingBtn = document.getElementById('add-my-rating-btn');
        
        if (closeItemDetailsBtn) {
            closeItemDetailsBtn.addEventListener('click', () => {
                this.hideItemDetailsModal();
            });
        }

        if (itemDetailsModal) {
            itemDetailsModal.addEventListener('click', (e) => {
                if (e.target === itemDetailsModal) {
                    this.hideItemDetailsModal();
                }
            });
        }

        if (addMyRatingBtn) {
            addMyRatingBtn.addEventListener('click', () => {
                this.hideItemDetailsModal();
                // The rating functionality will be handled by existing methods
                // This just closes the modal so user can rate from main interface
            });
        }

        // Header authentication buttons
        const headerSigninBtn = document.getElementById('header-signin-btn');
        const headerSignupBtn = document.getElementById('header-signup-btn');
        const headerSignoutBtn = document.getElementById('header-signout-btn');
        
        if (headerSigninBtn) {
            headerSigninBtn.addEventListener('click', () => {
                this.showHeaderSigninModal();
            });
        }
        
        if (headerSignupBtn) {
            headerSignupBtn.addEventListener('click', () => {
                this.showHeaderSignupModal();
            });
        }
        
        if (headerSignoutBtn) {
            headerSignoutBtn.addEventListener('click', () => {
                this.signOut();
                this.updateHeaderAuth();
            });
        }

        // Auth prompt buttons
        const promptSigninBtn = document.getElementById('prompt-signin-btn');
        const promptSignupBtn = document.getElementById('prompt-signup-btn');
        
        if (promptSigninBtn) {
            promptSigninBtn.addEventListener('click', () => {
                this.showAuthSection();
                this.showSigninForm();
            });
        }
        
        if (promptSignupBtn) {
            promptSignupBtn.addEventListener('click', () => {
                this.showAuthSection();
                this.showSignupForm();
            });
        }

        // Click outside to close dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.category-search-container')) {
                this.hideCategoryDropdown();
            }
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });

        // Rating input events
        if (addItemStars) {
            const stars = addItemStars.querySelectorAll('.star');
            console.log('Found rating stars:', stars.length);
            
            stars.forEach(star => {
                star.addEventListener('click', (e) => {
                    this.setAddItemRating(parseInt(e.target.dataset.rating));
                });
                star.addEventListener('mouseenter', (e) => {
                    this.highlightAddItemStars(parseInt(e.target.dataset.rating));
                });
            });

            addItemStars.addEventListener('mouseleave', () => {
                this.highlightAddItemStars(this.selectedRating);
            });
        }

        // My Posts modal setup with delay to ensure DOM is ready
        setTimeout(() => {
            this.setupMyPostsModal();
        }, 500);
    }

    addItem() {
        console.log('🔥 addItem() function called');
        
        try {
            // Step 1: Find the elements
            const nameElement = document.getElementById('item-name');
            const categoryElement = document.getElementById('category');
            const descriptionElement = document.getElementById('description');
            const userReviewElement = document.getElementById('user-review');
            
            console.log('📋 Add item elements found:', {
                nameElement: !!nameElement,
                categoryElement: !!categoryElement,
                descriptionElement: !!descriptionElement,
                userReviewElement: !!userReviewElement
            });
            
            if (!nameElement) {
                console.error('❌ Item name element not found!');
                alert('Item name field not found. Please refresh the page.');
                return;
            }
            
            // Step 2: Get the values
            const name = nameElement.value ? nameElement.value.trim() : '';
            const category = categoryElement ? categoryElement.value : 'other';
            const description = descriptionElement ? descriptionElement.value.trim() : '';
            const userReview = userReviewElement ? userReviewElement.value.trim() : '';
            
            console.log('📝 Add item values retrieved:', {
                name: name,
                nameLength: name.length,
                nameElementValue: nameElement.value,
                nameElementValueLength: nameElement.value ? nameElement.value.length : 0,
                category: category,
                description: description,
                userReview: userReview,
                selectedRating: this.selectedRating,
                currentUser: this.currentUser ? this.currentUser.name : 'null'
            });
            
            // Additional debug logging for title validation
            console.log('🔍 Title validation debug:', {
                nameElement: nameElement,
                rawValue: nameElement.value,
                trimmedValue: name,
                isEmpty: !name || name.length === 0,
                isEmptyCheck1: !name,
                isEmptyCheck2: name.length === 0
            });

            // Step 3: Check for authenticated user only
            if (!this.currentUser) {
                console.log('🔐 User not signed in, showing auth section');
                alert('⚠️ You must be signed in to create posts. Please sign in or create an account.');
                this.showAuthSection();
                return;
            }
            
            const activeUser = this.currentUser;
            
            // Step 4: Validate required fields after user is set
            // Double-check the name field value before validation
            const finalName = nameElement.value ? nameElement.value.trim() : name;
            console.log('🔄 Final name validation:', {
                originalName: name,
                finalName: finalName,
                elementValue: nameElement.value
            });
            
            if (!finalName || finalName.length === 0) {
                console.warn('⚠️ Item name is empty');
                alert('Please enter an item name');
                nameElement.focus();
                return;
            }
            
            if (!category || category.length === 0) {
                console.warn('⚠️ No category selected');
                alert('Please select a category');
                const categorySearch = document.getElementById('category-search');
                if (categorySearch) {
                    categorySearch.focus();
                    this.populateCategoryDropdown();
                    this.showCategoryDropdown();
                }
                return;
            }
            
            // Validate category exists in mapping
            if (!this.categoryMapping[category]) {
                console.warn('⚠️ Invalid category selected:', category);
                alert('Please select a valid category');
                const categorySearch = document.getElementById('category-search');
                if (categorySearch) categorySearch.value = '';
                return;
            }
            
            if (!this.selectedRating || this.selectedRating === 0) {
                console.warn('⚠️ No rating selected');
                alert('Please select a star rating (1-5 stars)');
                return;
            }

            // Step 5: Create the item
            // Generate unique IDs safely
            const itemId = Date.now() + Math.floor(Math.random() * 1000);
            const ratingId = itemId + Math.floor(Math.random() * 1000);
            
            const item = {
                id: itemId,
                name: finalName.trim(),
                category: category.trim(),
                description: description.trim(),
                ratings: [{
                    id: ratingId,
                    user: activeUser.name,
                    userId: activeUser.id,
                    value: parseInt(this.selectedRating),
                    review: userReview.trim(),
                    timestamp: new Date().toISOString(),
                    comments: []
                }],
                averageRating: parseInt(this.selectedRating),
                createdAt: new Date().toISOString(),
                createdBy: activeUser.name
            };
            
            // Validate the item before saving
            if (!item.name || !item.category || !item.ratings[0].user) {
                console.error('❌ Invalid item data:', item);
                alert('Error: Invalid item data. Please try again.');
                return;
            }
            
            if (item.ratings[0].value < 1 || item.ratings[0].value > 5) {
                console.error('❌ Invalid rating value:', item.ratings[0].value);
                alert('Error: Rating must be between 1 and 5 stars.');
                return;
            }

            console.log('📦 Creating item:', {
                name: item.name,
                category: item.category,
                rating: this.selectedRating,
                user: activeUser.name
            });

            this.items.unshift(item);
            this.saveItems();
            this.renderItems();
            this.clearForm();
            
            console.log('✅ Item added successfully');
            
        } catch (error) {
            console.error('💥 Add item error:', error);
            console.error('Error stack:', error.stack);
            alert('Error adding item: ' + error.message);
        }
    }

    clearForm() {
        document.getElementById('add-item-form').reset();
        this.selectedRating = 0;
        this.selectedCategory = '';
        this.highlightAddItemStars(0);
        document.getElementById('selected-rating').textContent = '0';
        
        // Clear category search
        const categorySearch = document.getElementById('category-search');
        const categoryHidden = document.getElementById('category');
        if (categorySearch) categorySearch.value = '';
        if (categoryHidden) categoryHidden.value = '';
        this.hideCategoryDropdown();
    }

    saveItems() {
        try {
            if (this.items && Array.isArray(this.items)) {
                localStorage.setItem('ratingItems', JSON.stringify(this.items));
                console.log('✅ Items saved successfully');
            } else {
                console.error('❌ Cannot save items: invalid data structure');
            }
        } catch (error) {
            console.error('❌ Error saving items:', error);
            alert('Error saving data. Please try again.');
        }
    }

    calculateAverageRating(ratings) {
        if (!ratings || !Array.isArray(ratings) || ratings.length === 0) return 0;
        try {
            const validRatings = ratings.filter(rating => rating && typeof rating.value === 'number' && !isNaN(rating.value));
            if (validRatings.length === 0) return 0;
            const sum = validRatings.reduce((acc, rating) => acc + rating.value, 0);
            return Math.round((sum / validRatings.length) * 10) / 10;
        } catch (error) {
            console.error('Error calculating average rating:', error);
            return 0;
        }
    }

    getOtherRatingsStats(item) {
        if (!this.currentUser) return null;
        const otherRatings = item.ratings.filter(r => r.userId !== this.currentUser.id);
        if (otherRatings.length === 0) return null;
        
        const avg = this.calculateAverageRating(otherRatings);
        return {
            count: otherRatings.length,
            average: avg
        };
    }

    createStarRating(currentRating, itemId, interactive = true) {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = `star ${i <= currentRating ? 'filled' : ''}`;
            star.innerHTML = '★';
            star.dataset.rating = i;

            if (interactive) {
                star.addEventListener('click', () => {
                    this.rateItem(itemId, i);
                });

                star.addEventListener('mouseenter', () => {
                    this.highlightStars(starsContainer, i);
                });

                starsContainer.addEventListener('mouseleave', () => {
                    this.highlightStars(starsContainer, currentRating);
                });
            }

            starsContainer.appendChild(star);
        }

        return starsContainer;
    }

    highlightStars(container, rating) {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    rateItem(itemId, rating) {
        if (!this.currentUser) {
            alert('Please sign in first!');
            return;
        }

        const item = this.items.find(item => item.id === itemId);
        if (!item) return;

        this.showRatingModal(itemId, rating);
    }

    showRatingModal(itemId, rating) {
        const modal = document.createElement('div');
        modal.className = 'rating-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Add Your Review</h3>
                <div class="rating-preview">
                    <span>Your Rating: </span>
                    <div class="modal-stars">
                        ${[1,2,3,4,5].map(i => `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`).join('')}
                    </div>
                    <span class="rating-number">${rating}/5</span>
                </div>
                <textarea id="review-text" placeholder="Write your review (optional)..."></textarea>
                <div class="modal-buttons">
                    <button id="submit-rating">Submit Rating</button>
                    <button id="cancel-rating">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('submit-rating').addEventListener('click', () => {
            this.submitRating(itemId, rating, document.getElementById('review-text').value.trim());
            document.body.removeChild(modal);
        });

        document.getElementById('cancel-rating').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    submitRating(itemId, rating, reviewText) {
        const item = this.items.find(item => item.id === itemId);
        if (!item) return;

        const existingRatingIndex = item.ratings.findIndex(r => r.userId === this.currentUser.id);
        
        if (existingRatingIndex !== -1) {
            const existingComments = item.ratings[existingRatingIndex].comments || [];
            item.ratings[existingRatingIndex] = {
                user: this.currentUser.name,
                userId: this.currentUser.id,
                value: rating,
                review: reviewText,
                timestamp: new Date().toISOString(),
                comments: existingComments
            };
        } else {
            item.ratings.push({
                user: this.currentUser.name,
                userId: this.currentUser.id,
                value: rating,
                review: reviewText,
                timestamp: new Date().toISOString(),
                comments: []
            });
        }

        item.averageRating = this.calculateAverageRating(item.ratings);
        this.saveItems();
        this.renderItems();
    }

    createItemCard(item) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.category = item.category;
        card.dataset.itemId = item.id;

        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'category-badge';
        categoryBadge.textContent = item.category;

        const title = document.createElement('h3');
        title.textContent = item.name;

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = item.description || 'No description';

        const ratingSection = document.createElement('div');
        ratingSection.className = 'rating-section';

        const currentRating = document.createElement('div');
        currentRating.className = 'current-rating';
        
        const otherStats = this.getOtherRatingsStats(item);
        const userRating = item.ratings.find(r => r.userId === this.currentUser?.id);
        
        if (item.ratings.length > 0) {
            let displayText = '';
            if (userRating && otherStats) {
                displayText = `You: ${userRating.value}★ | Others: ${otherStats.average}★ (${otherStats.count})`;
            } else if (userRating) {
                displayText = `You: ${userRating.value}★ | No other ratings`;
            } else if (otherStats) {
                displayText = `${otherStats.count} ratings: ${otherStats.average}★ avg`;
            }
            
            currentRating.innerHTML = `<span class="rating-display">${displayText}</span>`;
        } else {
            currentRating.innerHTML = '<span class="no-ratings">No ratings yet</span>';
        }

        const starsContainer = this.createStarRating(userRating ? userRating.value : 0, item.id);

        const ratingsComparison = this.createRatingsComparison(item);

        ratingSection.appendChild(currentRating);
        ratingSection.appendChild(starsContainer);
        ratingSection.appendChild(ratingsComparison);

        card.appendChild(categoryBadge);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(ratingSection);

        // Add owner controls if current user is owner
        if (this.isOwner()) {
            const ownerControls = document.createElement('div');
            ownerControls.className = 'owner-controls';
            ownerControls.innerHTML = `
                <div class="owner-badge">👑 OWNER CONTROLS</div>
                <button class="owner-delete-btn" onclick="window.ratingApp.ownerDeleteItem(${item.id})">
                    🗑️ Delete Item
                </button>
            `;
            card.appendChild(ownerControls);
        }

        return card;
    }

    filterItems() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const categoryFilter = document.getElementById('filter-category').value;
        const ratingFilter = document.getElementById('filter-rating').value;
        const reviewCountFilter = document.getElementById('filter-review-count').value;
        const commentCountFilter = document.getElementById('filter-comment-count').value;

        const filteredItems = this.items.filter(item => {
            // Search filter - search in name, description, category (both value and display name), and reviews
            const categoryDisplayName = this.categoryMapping[item.category] || item.category;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                                item.description.toLowerCase().includes(searchTerm) ||
                                item.category.toLowerCase().includes(searchTerm) ||
                                categoryDisplayName.toLowerCase().includes(searchTerm) ||
                                (item.ratings && item.ratings.some(rating => 
                                    rating.review && rating.review.toLowerCase().includes(searchTerm)
                                ));
            
            // Category filter
            const matchesCategory = !categoryFilter || item.category === categoryFilter;
            
            // Rating filter (minimum stars)
            const matchesRating = !ratingFilter || item.averageRating >= parseInt(ratingFilter);
            
            // Review count filter
            const matchesReviewCount = !reviewCountFilter || item.ratings.length >= parseInt(reviewCountFilter);
            
            // Comment count filter (count reviews with comments)
            const commentCount = item.ratings.filter(r => r.review && r.review.trim().length > 0).length;
            const matchesCommentCount = !commentCountFilter || 
                (commentCountFilter === '1' && commentCount > 0) ||
                (commentCountFilter !== '1' && commentCount >= parseInt(commentCountFilter));
            
            return matchesSearch && matchesCategory && matchesRating && matchesReviewCount && matchesCommentCount;
        });

        this.renderItems(filteredItems);
    }

    clearAllFilters() {
        const search = document.getElementById('search');
        const filterCategory = document.getElementById('filter-category');
        const filterRating = document.getElementById('filter-rating');
        const filterReviewCount = document.getElementById('filter-review-count');
        const filterCommentCount = document.getElementById('filter-comment-count');
        
        if (search) search.value = '';
        if (filterCategory) filterCategory.value = '';
        if (filterRating) filterRating.value = '';
        if (filterReviewCount) filterReviewCount.value = '';
        if (filterCommentCount) filterCommentCount.value = '';
        
        this.filterItems();
    }

    renderItems(itemsToRender = this.items) {
        const grid = document.getElementById('items-grid');
        if (!grid) {
            console.error('Items grid element not found');
            return;
        }
        
        grid.innerHTML = '';

        if (!itemsToRender || itemsToRender.length === 0) {
            grid.innerHTML = '<p class="no-items">No items found. Add some items to get started!</p>';
            return;
        }

        itemsToRender.forEach(item => {
            const card = this.createItemCard(item);
            grid.appendChild(card);
        });
    }

    setupUserInterface() {
        if (this.currentUser) {
            document.getElementById('user-display').textContent = this.currentUser;
            document.getElementById('user-input').style.display = 'none';
            document.getElementById('current-user').style.display = 'flex';
        } else {
            document.getElementById('user-input').style.display = 'flex';
            document.getElementById('current-user').style.display = 'none';
        }
    }

    setUser() {
        const userName = document.getElementById('user-name').value.trim();
        if (!userName) return;

        this.currentUser = userName;
        localStorage.setItem('currentUser', userName);
        this.setupUserInterface();
        document.getElementById('user-name').value = '';
        this.renderItems();
    }

    changeUser() {
        this.currentUser = '';
        localStorage.removeItem('currentUser');
        this.setupUserInterface();
        this.renderItems();
    }

    createRatingsComparison(item) {
        const container = document.createElement('div');
        container.className = 'ratings-comparison';

        if (item.ratings.length === 0) {
            return container;
        }

        const userRating = item.ratings.find(r => r.userId === this.currentUser?.id);
        const otherRatings = item.ratings.filter(r => r.userId !== this.currentUser?.id);

        if (userRating) {
            const myReviewSection = document.createElement('div');
            myReviewSection.className = 'my-review-section';
            
            const myTitle = document.createElement('h4');
            myTitle.textContent = 'Your Review:';
            myTitle.className = 'my-review-title';
            myReviewSection.appendChild(myTitle);

            const myRating = document.createElement('div');
            myRating.className = 'my-rating';
            
            const stars = this.createStarRating(userRating.value, null, false);
            stars.classList.add('my-rating-stars');
            
            const ratingValue = document.createElement('span');
            ratingValue.className = 'my-rating-value';
            ratingValue.textContent = `${userRating.value}/5`;

            myRating.appendChild(stars);
            myRating.appendChild(ratingValue);
            myReviewSection.appendChild(myRating);

            if (userRating.review) {
                const reviewText = document.createElement('p');
                reviewText.className = 'my-review-text';
                reviewText.textContent = userRating.review;
                myReviewSection.appendChild(reviewText);
            }
            
            // Add comments section for this review
            const commentsSection = this.createCommentsSection(userRating, item.id, true);
            if (commentsSection) {
                myReviewSection.appendChild(commentsSection);
            }

            container.appendChild(myReviewSection);
        }

        if (otherRatings.length > 0) {
            const othersSection = document.createElement('div');
            othersSection.className = 'others-ratings-section';
            
            const othersTitle = document.createElement('h4');
            othersTitle.textContent = `Other Ratings (${otherRatings.length}):`;
            othersTitle.className = 'others-title';
            othersSection.appendChild(othersTitle);

            const ratingCounts = [5,4,3,2,1].map(star => {
                const count = otherRatings.filter(r => r.value === star).length;
                return { star, count };
            });

            const ratingsChart = document.createElement('div');
            ratingsChart.className = 'ratings-chart';

            ratingCounts.forEach(({star, count}) => {
                const row = document.createElement('div');
                row.className = 'rating-row';
                
                const starLabel = document.createElement('span');
                starLabel.className = 'star-label';
                starLabel.textContent = `${star}★`;
                
                const bar = document.createElement('div');
                bar.className = 'rating-bar';
                
                const fill = document.createElement('div');
                fill.className = 'rating-fill';
                const percentage = otherRatings.length > 0 ? (count / otherRatings.length) * 100 : 0;
                fill.style.width = `${percentage}%`;
                
                const countLabel = document.createElement('span');
                countLabel.className = 'count-label';
                countLabel.textContent = count;
                
                bar.appendChild(fill);
                row.appendChild(starLabel);
                row.appendChild(bar);
                row.appendChild(countLabel);
                ratingsChart.appendChild(row);
            });

            othersSection.appendChild(ratingsChart);
            
            // Add individual other reviews with comments
            if (otherRatings.length > 0) {
                const reviewsList = document.createElement('div');
                reviewsList.className = 'other-reviews-list';
                
                otherRatings.forEach(rating => {
                    if (rating.review && rating.review.trim().length > 0) {
                        const reviewItem = document.createElement('div');
                        reviewItem.className = 'other-review-item';
                        
                        const reviewHeader = document.createElement('div');
                        reviewHeader.className = 'other-review-header';
                        reviewHeader.innerHTML = `
                            <span class="reviewer-name">
                                <span class="clickable-username" data-username="${rating.user}" onclick="window.ratingApp?.showProfileRatingModal('${rating.user}')">${rating.user}</span>
                            </span>
                            <span class="reviewer-rating">${rating.value}★</span>
                        `;
                        
                        const reviewContent = document.createElement('p');
                        reviewContent.className = 'other-review-text';
                        reviewContent.textContent = rating.review;
                        
                        reviewItem.appendChild(reviewHeader);
                        reviewItem.appendChild(reviewContent);
                        
                        // Add comments section for this review
                        const commentsSection = this.createCommentsSection(rating, item.id, false);
                        if (commentsSection) {
                            reviewItem.appendChild(commentsSection);
                        }
                        
                        reviewsList.appendChild(reviewItem);
                    }
                });
                
                if (reviewsList.children.length > 0) {
                    const reviewsTitle = document.createElement('h5');
                    reviewsTitle.textContent = 'Detailed Reviews:';
                    reviewsTitle.className = 'detailed-reviews-title';
                    othersSection.appendChild(reviewsTitle);
                    othersSection.appendChild(reviewsList);
                }
            }
            
            container.appendChild(othersSection);
        }

        return container;
    }

    initializePreviewData() {
        // Add preview account if not exists
        if (!this.users.find(u => u.name === 'Owner')) {
            const previewUser = {
                id: 1,
                name: 'Owner',
                password: 'preview123',
                createdAt: new Date().toISOString()
            };
            this.users.push(previewUser);
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        // No fake reviews - only real user-generated content
    }

    // Authentication methods
    showSigninForm() {
        document.getElementById('signin-tab').classList.add('active');
        document.getElementById('signup-tab').classList.remove('active');
        document.getElementById('signin-form').style.display = 'block';
        document.getElementById('signup-form').style.display = 'none';
    }

    showSignupForm() {
        document.getElementById('signup-tab').classList.add('active');
        document.getElementById('signin-tab').classList.remove('active');
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('signin-form').style.display = 'none';
    }

    signUp() {
        console.log('🔥 signUp() function called - starting process...');
        console.log('📊 Current state:', {
            usersCount: this.users?.length || 0,
            currentUser: this.currentUser?.name || 'none'
        });
        
        try {
            // Step 1: Find the elements
            const nameElement = document.getElementById('signup-name');
            const passwordElement = document.getElementById('signup-password');
            
            console.log('📋 Sign-up elements found:', {
                nameElement: !!nameElement,
                passwordElement: !!passwordElement,
                nameElementType: nameElement ? nameElement.tagName : 'null',
                passwordElementType: passwordElement ? passwordElement.tagName : 'null'
            });
            
            if (!nameElement) {
                console.error('❌ Name element not found - no popup shown');
                return;
            }
            
            if (!passwordElement) {
                console.error('❌ Password element not found - no popup shown');
                return;
            }
            
            // Step 2: Get the values
            const name = nameElement.value ? nameElement.value.trim() : '';
            const password = passwordElement.value ? passwordElement.value.trim() : '';
            
            console.log('📝 Sign-up values retrieved:', {
                name: name,
                nameLength: name.length,
                password: password ? '***' : 'empty',
                passwordLength: password.length,
                nameRaw: nameElement.value,
                passwordRaw: passwordElement.value ? '***' : 'empty'
            });

            // Step 3: Validate fields
            if (!name || name.length === 0) {
                console.warn('⚠️ Name is empty - no popup shown');
                nameElement.focus();
                return;
            }
            
            if (!password || password.length === 0) {
                console.warn('⚠️ Password is empty - no popup shown');
                passwordElement.focus();
                return;
            }

            // Step 4: Check for existing user
            const existingUser = this.users.find(u => u.name === name);
            if (existingUser) {
                console.warn('⚠️ User already exists - no popup shown');
                nameElement.focus();
                return;
            }

            // Step 5: Create new user
            const user = {
                id: Date.now(),
                name,
                password
            };

            console.log('👤 Creating new user:', { id: user.id, name: user.name });

            this.users.push(user);
            localStorage.setItem('users', JSON.stringify(this.users));
            
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            console.log('✅ User created successfully:', user.name);
            this.setupAuthInterface();
            this.updateHeaderAuth();
            this.clearAuthForms();
            
            console.log('🎉 Sign up process completed successfully');
            
        } catch (error) {
            console.error('💥 Sign up error:', error);
            console.error('Error stack:', error.stack);
            console.warn('❌ Sign up error - no popup shown to prevent spam');
        }
    }

    signIn() {
        console.log('🔥 signIn() function called - starting process...');
        console.log('📊 Current state:', {
            usersCount: this.users?.length || 0,
            currentUser: this.currentUser?.name || 'none'
        });
        
        try {
            // Step 1: Find the elements
            const usernameElement = document.getElementById('signin-username');
            const passwordElement = document.getElementById('signin-password');
            
            console.log('📋 Elements found:', {
                usernameElement: !!usernameElement,
                passwordElement: !!passwordElement
            });
            
            if (!usernameElement) {
                console.error('❌ Username element not found - no popup shown');
                return;
            }
            
            if (!passwordElement) {
                console.error('❌ Password element not found - no popup shown');
                return;
            }
            
            // Step 2: Get the values
            const username = usernameElement.value ? usernameElement.value.trim() : '';
            const password = passwordElement.value ? passwordElement.value.trim() : '';
            
            console.log('📝 Values retrieved:', {
                username: username,
                usernameLength: username.length,
                password: password ? '***' : 'empty',
                passwordLength: password.length
            });

            // Step 3: Validate fields
            if (!username || username.length === 0) {
                console.warn('⚠️ Username is empty - no popup shown');
                usernameElement.focus();
                return;
            }
            
            if (!password || password.length === 0) {
                console.warn('⚠️ Password is empty - no popup shown');
                passwordElement.focus();
                return;
            }

            // Step 4: Check users array
            console.log('👥 Checking users:', {
                usersCount: this.users.length,
                users: this.users.map(u => ({ name: u.name }))
            });
            
            if (this.users.length === 0) {
                console.error('❌ No users found in database - no popup shown');
                return;
            }

            // Step 5: Find matching user by name
            const user = this.users.find(u => u.name === username && u.password === password);
            
            console.log('🔍 User search result:', {
                foundUser: !!user,
                searchUsername: username,
                searchPassword: password ? '***' : 'empty',
                matchingUsernames: this.users.filter(u => u.name === username).length,
                matchingPasswords: this.users.filter(u => u.password === password).length
            });
            
            if (!user) {
                console.warn('❌ Invalid credentials');
                // Use inline message instead of popup to prevent continuous alerts
                this.showInlineMessage('signin-form', 'Invalid username or password. Please check your credentials and try again.', 'error');
                return;
            }

            // Step 6: Sign in successful
            console.log('✅ Sign in successful for user:', user.name);
            
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            this.setupAuthInterface();
            this.updateHeaderAuth();
            this.clearAuthForms();
            
            console.log('🎉 Sign in process completed successfully');
            
        } catch (error) {
            console.error('💥 Sign in error:', error);
            console.error('Error stack:', error.stack);
            console.warn('❌ Sign in error - no popup shown to prevent spam');
        }
    }

    signOut() {
        this.currentUser = null;
        this.sessionUsername = '';
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('sessionUsername');
        this.setupAuthInterface();
        this.updateHeaderAuth();
        this.hideRatingAsDisplay();
    }

    setupAuthInterface() {
        console.log('Setting up auth interface, current user:', this.currentUser, 'session user:', this.sessionUsername);
        
        const authSection = document.getElementById('auth-section');
        const userSection = document.getElementById('user-section');
        const mainContent = document.getElementById('main-content');
        const userDisplay = document.getElementById('user-display');
        
        if (this.currentUser) {
            console.log('User is logged in, showing main interface');
            if (authSection) authSection.style.display = 'none';
            if (userSection) userSection.style.display = 'block';
            if (mainContent) mainContent.style.display = 'block';
            if (userDisplay) userDisplay.textContent = this.currentUser.name;
            this.showAddItemForm();
            this.renderItems();
        } else {
            console.log('No full user account - showing main interface with header auth');
            // Hide main auth section, user can sign in from header
            if (authSection) authSection.style.display = 'none';
            if (userSection) userSection.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            
            // Hide the add item form when not signed in
            this.hideAddItemForm();
        }
    }

    clearAuthForms() {
        const usernameField = document.getElementById('signin-username');
        const passwordField = document.getElementById('signin-password');
        const nameField = document.getElementById('signup-name');
        const signupPasswordField = document.getElementById('signup-password');
        
        if (usernameField) usernameField.value = '';
        if (passwordField) passwordField.value = '';
        if (nameField) nameField.value = '';
        if (signupPasswordField) signupPasswordField.value = '';
    }

    showAddItemForm() {
        const addItemSection = document.querySelector('.add-item');
        const authPrompt = document.getElementById('auth-prompt');
        
        if (addItemSection) {
            addItemSection.style.display = 'block';
            console.log('✅ Add item form shown for signed-in user');
        }
        if (authPrompt) {
            authPrompt.style.display = 'none';
        }
    }

    hideAddItemForm() {
        const addItemSection = document.querySelector('.add-item');
        const authPrompt = document.getElementById('auth-prompt');
        
        if (addItemSection) {
            addItemSection.style.display = 'none';
            console.log('🔐 Add item form hidden for non-signed-in user');
        }
        if (authPrompt) {
            authPrompt.style.display = 'block';
            console.log('🔐 Auth prompt shown for non-signed-in user');
        }
    }

    // Rating input methods
    setAddItemRating(rating) {
        console.log('⭐ Setting rating to:', rating);
        this.selectedRating = rating;
        this.highlightAddItemStars(rating);
        
        const ratingDisplay = document.getElementById('selected-rating');
        if (ratingDisplay) {
            ratingDisplay.textContent = rating;
        }
        
        console.log('✅ Rating set successfully:', this.selectedRating);
    }

    highlightAddItemStars(rating) {
        const stars = document.querySelectorAll('#add-item-stars .star');
        console.log('🌟 Highlighting stars, found:', stars.length, 'rating:', rating);
        
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    showUsernamePrompt(callback) {
        console.log('🚫 Username prompt BLOCKED - using signed-in user or guest');
        
        // Never show popup - use signed-in user or create guest session
        const signedInUser = window.currentSignedInUser;
        if (signedInUser) {
            console.log('✅ Using signed-in user:', signedInUser);
            this.sessionUsername = signedInUser;
            if (callback) callback();
            return;
        }
        
        // Create a guest session instead of prompting
        const guestUser = 'Guest_' + Date.now();
        console.log('👤 Creating guest user:', guestUser);
        this.sessionUsername = guestUser;
        
        if (callback) callback();
        return;
    }

    updateSessionUserDisplay() {
        // Add or update session user display in the main interface
        let sessionDisplay = document.getElementById('session-user-display');
        
        if (!sessionDisplay) {
            // Create session user display
            sessionDisplay = document.createElement('div');
            sessionDisplay.id = 'session-user-display';
            sessionDisplay.className = 'session-user-display';
            
            // Insert it in the main content area
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.insertBefore(sessionDisplay, mainContent.firstChild);
            }
        }

        if (this.sessionUsername) {
            sessionDisplay.innerHTML = `
                <div class="session-user-info">
                    <span>Rating as: <strong>${this.sessionUsername}</strong></span>
                    <button onclick="window.debugRating?.app.clearSessionUser()" class="clear-session-btn">
                        Change User
                    </button>
                </div>
            `;
            sessionDisplay.style.display = 'block';
        } else {
            sessionDisplay.style.display = 'none';
        }
    }

    clearSessionUser() {
        console.log('🗑️ Clearing session user');
        this.sessionUsername = '';
        sessionStorage.removeItem('sessionUsername');
        this.updateSessionUserDisplay();
    }

    getTopReviewers() {
        // Create a map of reviewer stats
        const reviewerStats = new Map();
        
        // First pass: collect basic review stats
        this.items.forEach(item => {
            item.ratings.forEach(rating => {
                if (!reviewerStats.has(rating.user)) {
                    reviewerStats.set(rating.user, {
                        name: rating.user,
                        userId: rating.userId,
                        totalReviews: 0,
                        reviewsWithComments: 0,
                        totalComments: 0,
                        reciprocityCount: 0,
                        averageRating: 0,
                        totalRatingValue: 0,
                        reviewQualityScore: 0,
                        totalEngagement: 0
                    });
                }
                
                const stats = reviewerStats.get(rating.user);
                stats.totalReviews += 1;
                stats.totalRatingValue += rating.value;
                
                if (rating.review && rating.review.trim().length > 0) {
                    stats.reviewsWithComments += 1;
                    // Calculate review quality based on length and depth
                    const reviewLength = rating.review.trim().length;
                    const qualityPoints = Math.min(reviewLength / 20, 10); // Max 10 points for long reviews
                    stats.reviewQualityScore += qualityPoints;
                }
                
                // Count total comments on this reviewer's reviews
                if (rating.comments && rating.comments.length > 0) {
                    stats.totalComments += rating.comments.length;
                }
            });
        });
        
        // Second pass: calculate reciprocity (how many people this reviewer has rated back)
        reviewerStats.forEach((stats, reviewer) => {
            stats.reciprocityCount = 0;
            
            // Find all users who have rated things, and check if this reviewer rated them back
            const allUsers = new Set();
            this.items.forEach(item => {
                item.ratings.forEach(rating => {
                    if (rating.user !== reviewer) {
                        allUsers.add(rating.user);
                    }
                });
            });
            
            // Count reciprocity: how many different users this reviewer has rated back
            allUsers.forEach(otherUser => {
                const hasRatedBack = this.items.some(item => 
                    item.ratings.some(rating => 
                        rating.user === reviewer && 
                        item.ratings.some(otherRating => otherRating.user === otherUser)
                    )
                );
                if (hasRatedBack) {
                    stats.reciprocityCount++;
                }
            });
            
            stats.averageRating = (stats.totalRatingValue / stats.totalReviews).toFixed(1);
            
            // Enhanced engagement formula:
            // Base: total reviews (1 point each)
            // Quality: reviews with comments (2 points each)  
            // Interaction: total comments received (1 point each)
            // Reciprocity: people rated back (3 points each)
            // Quality bonus: review quality score
            stats.totalEngagement = 
                stats.totalReviews +                           // Base activity
                (stats.reviewsWithComments * 2) +              // Quality reviews
                stats.totalComments +                          // Community interaction
                (stats.reciprocityCount * 3) +                 // Reciprocity bonus
                Math.floor(stats.reviewQualityScore);          // Review quality
        });
        
        // Convert to array and sort by enhanced engagement score
        return Array.from(reviewerStats.values())
            .filter(reviewer => reviewer.totalReviews > 0)
            .sort((a, b) => b.totalEngagement - a.totalEngagement)
            .slice(0, 10); // Top 10 reviewers
    }

    renderTopReviewers() {
        const topReviewersList = document.getElementById('top-reviewers-list');
        if (!topReviewersList) return;
        
        const topReviewers = this.getTopReviewers();
        
        if (topReviewers.length === 0) {
            topReviewersList.innerHTML = '<div class="no-reviewers">No reviewers yet</div>';
            return;
        }
        
        topReviewersList.innerHTML = topReviewers.map((reviewer, index) => {
            const rank = index + 1;
            const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            
            return `
                <div class="reviewer-card" data-user-id="${reviewer.userId}">
                    <div class="reviewer-rank">${rankEmoji}</div>
                    <div class="reviewer-info">
                        <div class="reviewer-name">
                            <span class="clickable-username" data-username="${reviewer.name}" onclick="window.ratingApp?.showProfileRatingModal('${reviewer.name}')">${reviewer.name}</span>
                        </div>
                        <div class="reviewer-stats">
                            <span class="stat">${reviewer.totalReviews} reviews</span>
                            <span class="stat">${reviewer.reviewsWithComments} with comments</span>
                            <span class="stat">${reviewer.totalComments} interactions</span>
                            <span class="stat">${reviewer.reciprocityCount} reciprocal ratings</span>
                            <span class="stat">Avg: ${reviewer.averageRating}★</span>
                        </div>
                    </div>
                    <div class="reviewer-score">Score: ${reviewer.totalEngagement}</div>
                </div>
            `;
        }).join('');
    }
    
    createCommentsSection(rating, itemId, isOwnReview) {
        if (!rating.comments) {
            rating.comments = [];
        }
        
        const commentsContainer = document.createElement('div');
        commentsContainer.className = 'comments-section';
        
        const commentsHeader = document.createElement('div');
        commentsHeader.className = 'comments-header';
        
        const commentsCount = rating.comments.length;
        const showCommentsBtn = document.createElement('button');
        showCommentsBtn.className = 'show-comments-btn';
        showCommentsBtn.textContent = commentsCount > 0 ? `💬 ${commentsCount} comments` : '💬 No comments yet';
        
        const addCommentBtn = document.createElement('button');
        addCommentBtn.className = 'add-comment-btn';
        addCommentBtn.textContent = '+ Add Comment';
        
        commentsHeader.appendChild(showCommentsBtn);
        if (this.currentUser || this.sessionUsername) {
            commentsHeader.appendChild(addCommentBtn);
        }
        
        const commentsList = document.createElement('div');
        commentsList.className = 'comments-list';
        commentsList.style.display = 'none';
        
        // Render existing comments
        this.renderComments(commentsList, rating.comments);
        
        // Show/hide comments functionality
        showCommentsBtn.addEventListener('click', () => {
            const isVisible = commentsList.style.display !== 'none';
            commentsList.style.display = isVisible ? 'none' : 'block';
            showCommentsBtn.textContent = isVisible 
                ? (commentsCount > 0 ? `💬 ${commentsCount} comments` : '💬 No comments yet')
                : '💬 Hide comments';
        });
        
        // Add comment functionality
        addCommentBtn.addEventListener('click', () => {
            this.showAddCommentModal(rating, itemId, () => {
                this.renderComments(commentsList, rating.comments);
                showCommentsBtn.textContent = `💬 ${rating.comments.length} comments`;
                if (commentsList.style.display === 'none') {
                    commentsList.style.display = 'block';
                    showCommentsBtn.textContent = '💬 Hide comments';
                }
            });
        });
        
        commentsContainer.appendChild(commentsHeader);
        commentsContainer.appendChild(commentsList);
        
        return commentsContainer;
    }
    
    renderComments(container, comments) {
        if (!comments || comments.length === 0) {
            container.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        container.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.user}</span>
                    <span class="comment-time">${this.formatTimestamp(comment.timestamp)}</span>
                </div>
                <p class="comment-text">${comment.text}</p>
            </div>
        `).join('');
    }
    
    showAddCommentModal(rating, itemId, callback) {
        const activeUser = this.currentUser || (this.sessionUsername ? { name: this.sessionUsername, id: 'session' } : null);
        
        if (!activeUser) {
            this.showUsernamePrompt(() => {
                this.showAddCommentModal(rating, itemId, callback);
            });
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'comment-modal';
        modal.innerHTML = `
            <div class="comment-modal-content">
                <h3>Add Comment</h3>
                <p>Commenting on <strong>${rating.user}</strong>'s review</p>
                <textarea id="comment-text" placeholder="Write your comment..." maxlength="500"></textarea>
                <div class="comment-char-count">0/500</div>
                <div class="comment-modal-buttons">
                    <button id="submit-comment" class="primary-btn">Post Comment</button>
                    <button id="cancel-comment" class="secondary-btn">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const commentTextArea = document.getElementById('comment-text');
        const charCount = modal.querySelector('.comment-char-count');
        const submitBtn = document.getElementById('submit-comment');
        const cancelBtn = document.getElementById('cancel-comment');
        
        // Character counter
        commentTextArea.addEventListener('input', () => {
            const length = commentTextArea.value.length;
            charCount.textContent = `${length}/500`;
            charCount.style.color = length > 450 ? '#dc3545' : '#666';
        });
        
        // Submit comment
        submitBtn.addEventListener('click', () => {
            const commentText = commentTextArea.value.trim();
            if (commentText && commentText.length > 0) {
                const comment = {
                    id: Date.now(),
                    user: activeUser.name,
                    userId: activeUser.id || 'session',
                    text: commentText,
                    timestamp: new Date().toISOString()
                };
                
                rating.comments.push(comment);
                this.saveItems();
                document.body.removeChild(modal);
                if (callback) callback();
            }
        });
        
        // Cancel
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Focus textarea
        setTimeout(() => commentTextArea.focus(), 100);
    }
    
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }
    
    showTopReviewersModal() {
        const modal = document.getElementById('top-reviewers-modal');
        if (modal) {
            this.renderTopReviewers();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideTopReviewersModal() {
        const modal = document.getElementById('top-reviewers-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showProfileRatingModal(username) {
        if (!this.currentUser) {
            alert('Please sign in to rate user profiles');
            return;
        }

        if (username === this.currentUser.name) {
            alert('You cannot rate your own profile');
            return;
        }

        const modal = document.getElementById('profile-rating-modal');
        if (modal) {
            this.currentProfileUser = username;
            this.profileSelectedRating = 0;
            this.renderProfileRatingModal(username);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideProfileRatingModal() {
        const modal = document.getElementById('profile-rating-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.currentProfileUser = null;
            this.profileSelectedRating = 0;
        }
    }

    renderProfileRatingModal(username) {
        // Update profile info
        document.getElementById('profile-user-name').textContent = username;
        
        // Calculate user stats
        const userStats = this.calculateUserStats(username);
        document.getElementById('profile-review-count').textContent = `${userStats.totalReviews} reviews`;
        document.getElementById('profile-avg-rating').textContent = `${userStats.averageRating}★ average`;
        
        // Reset rating form
        this.highlightProfileStars(0);
        document.getElementById('profile-selected-rating').textContent = '0';
        document.getElementById('profile-review-text').value = '';
        
        // Show existing profile ratings
        this.renderExistingProfileRatings(username);
    }

    calculateUserStats(username) {
        let totalReviews = 0;
        let totalRatingValue = 0;

        this.items.forEach(item => {
            item.ratings.forEach(rating => {
                if (rating.user === username) {
                    totalReviews++;
                    totalRatingValue += rating.value;
                }
            });
        });

        return {
            totalReviews,
            averageRating: totalReviews > 0 ? (totalRatingValue / totalReviews).toFixed(1) : '0.0'
        };
    }

    renderExistingProfileRatings(username) {
        const ratingsContainer = document.getElementById('profile-ratings-list');
        const userProfileRatings = this.profileRatings.filter(rating => rating.ratedUser === username);
        
        if (userProfileRatings.length === 0) {
            ratingsContainer.innerHTML = '<div class="no-ratings">No profile ratings yet</div>';
            return;
        }

        ratingsContainer.innerHTML = userProfileRatings.map(rating => {
            const stars = '★'.repeat(rating.rating) + '☆'.repeat(5 - rating.rating);
            return `
                <div class="profile-rating-item">
                    <div class="profile-rating-header">
                        <strong>${rating.raterUser}</strong>
                        <span class="profile-rating-stars">${stars}</span>
                    </div>
                    ${rating.review ? `<div class="profile-rating-review">${rating.review}</div>` : ''}
                    <div class="profile-rating-date">${this.getRelativeTime(new Date(rating.timestamp))}</div>
                </div>
            `;
        }).join('');
    }

    setProfileRating(rating) {
        this.profileSelectedRating = rating;
        this.highlightProfileStars(rating);
        document.getElementById('profile-selected-rating').textContent = rating;
    }

    highlightProfileStars(rating) {
        const stars = document.querySelectorAll('#profile-rating-stars .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    submitProfileRating() {
        if (!this.currentProfileUser || this.profileSelectedRating === 0) {
            alert('Please select a rating');
            return;
        }

        // Check if user already rated this profile
        const existingRatingIndex = this.profileRatings.findIndex(
            rating => rating.raterUser === this.currentUser.name && rating.ratedUser === this.currentProfileUser
        );

        const reviewText = document.getElementById('profile-review-text').value.trim();
        
        const newRating = {
            id: Date.now() + Math.random(),
            raterUser: this.currentUser.name,
            ratedUser: this.currentProfileUser,
            rating: this.profileSelectedRating,
            review: reviewText,
            timestamp: new Date().toISOString()
        };

        if (existingRatingIndex >= 0) {
            // Update existing rating
            this.profileRatings[existingRatingIndex] = newRating;
        } else {
            // Add new rating
            this.profileRatings.push(newRating);
        }

        this.saveProfileRatings();
        this.hideProfileRatingModal();
        alert('Profile rating submitted successfully!');
    }

    saveProfileRatings() {
        try {
            localStorage.setItem('profileRatings', JSON.stringify(this.profileRatings));
        } catch (e) {
            console.error('Error saving profile ratings:', e);
        }
    }

    // My Posts Modal Functions
    setupMyPostsModal() {
        console.log('🔧 Setting up My Posts modal...');
        
        const myPostsBtn = document.getElementById('my-posts-btn');
        const myPostsModal = document.getElementById('my-posts-modal');
        const closeMyPostsBtn = document.getElementById('close-my-posts');
        const myReviewsTab = document.getElementById('my-reviews-tab');
        const myCommentsTab = document.getElementById('my-comments-tab');

        console.log('📋 My Posts elements found:', {
            myPostsBtn: !!myPostsBtn,
            myPostsModal: !!myPostsModal,
            closeMyPostsBtn: !!closeMyPostsBtn,
            myReviewsTab: !!myReviewsTab,
            myCommentsTab: !!myCommentsTab
        });

        // My Posts button click
        if (myPostsBtn) {
            console.log('✅ Adding click handler to My Posts button');
            myPostsBtn.addEventListener('click', () => {
                console.log('🔥 MY POSTS BUTTON CLICKED FROM MAIN HANDLER!');
                this.showMyPostsModal();
            });
        } else {
            console.error('❌ My Posts button not found!');
        }

        // Close modal
        if (closeMyPostsBtn) {
            closeMyPostsBtn.addEventListener('click', () => {
                this.hideMyPostsModal();
            });
        }

        // Close modal when clicking outside
        if (myPostsModal) {
            myPostsModal.addEventListener('click', (e) => {
                if (e.target === myPostsModal) {
                    this.hideMyPostsModal();
                }
            });
        }

        // Tab switching
        if (myReviewsTab) {
            myReviewsTab.addEventListener('click', () => {
                this.showMyReviewsTab();
            });
        }

        if (myCommentsTab) {
            myCommentsTab.addEventListener('click', () => {
                this.showMyCommentsTab();
            });
        }
    }

    showMyPostsModal() {
        console.log('🔥 showMyPostsModal called!');
        const modal = document.getElementById('my-posts-modal');
        console.log('📋 Modal element found:', !!modal);
        if (modal) {
            console.log('✅ Showing My Posts modal');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            this.populateMyPosts();
        } else {
            console.error('❌ My Posts modal not found!');
        }
    }

    hideMyPostsModal() {
        const modal = document.getElementById('my-posts-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showMyReviewsTab() {
        const reviewsTab = document.getElementById('my-reviews-tab');
        const commentsTab = document.getElementById('my-comments-tab');
        const reviewsSection = document.getElementById('my-reviews-section');
        const commentsSection = document.getElementById('my-comments-section');

        if (reviewsTab) reviewsTab.classList.add('active');
        if (commentsTab) commentsTab.classList.remove('active');
        if (reviewsSection) reviewsSection.style.display = 'block';
        if (commentsSection) commentsSection.style.display = 'none';
    }

    showMyCommentsTab() {
        const reviewsTab = document.getElementById('my-reviews-tab');
        const commentsTab = document.getElementById('my-comments-tab');
        const reviewsSection = document.getElementById('my-reviews-section');
        const commentsSection = document.getElementById('my-comments-section');

        if (reviewsTab) reviewsTab.classList.remove('active');
        if (commentsTab) commentsTab.classList.add('active');
        if (reviewsSection) reviewsSection.style.display = 'none';
        if (commentsSection) commentsSection.style.display = 'block';
    }

    populateMyPosts() {
        console.log('🔄 Populating My Posts...');
        const currentUser = this.getCurrentUser();
        console.log('Current user for My Posts:', currentUser);
        
        if (!currentUser) {
            console.warn('No current user found for My Posts');
            return;
        }

        this.populateMyReviews(currentUser.name);
        this.populateMyComments(currentUser.name);
    }

    populateMyReviews(username) {
        const reviewsList = document.getElementById('my-reviews-list');
        if (!reviewsList) return;

        const userReviews = [];
        
        // Find all reviews by this user
        this.items.forEach(item => {
            if (item.ratings && Array.isArray(item.ratings)) {
                item.ratings.forEach(rating => {
                    if (rating.user === username) {
                        userReviews.push({
                            ...rating,
                            itemName: item.name,
                            itemId: item.id,
                            itemCategory: item.category
                        });
                    }
                });
            }
        });

        if (userReviews.length === 0) {
            reviewsList.innerHTML = '<div class="no-posts-message">You haven\'t written any reviews yet.</div>';
            return;
        }

        // Sort by timestamp (newest first)
        userReviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        reviewsList.innerHTML = userReviews.map(review => `
            <div class="my-post-item">
                <div class="my-post-header">
                    <div>
                        <div class="my-post-title">${review.itemName}</div>
                        <div class="my-post-category">${this.categoryMapping[review.itemCategory] || review.itemCategory}</div>
                    </div>
                    <div class="my-post-rating">${'★'.repeat(review.value)}${'☆'.repeat(5-review.value)}</div>
                </div>
                <div class="my-post-content">${review.review || 'No review text'}</div>
                <div class="my-post-meta">
                    <div class="my-post-date">${new Date(review.timestamp).toLocaleDateString()}</div>
                    <button class="delete-post-btn" onclick="window.ratingApp.deleteReview(${review.itemId}, ${review.id})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    populateMyComments(username) {
        const commentsList = document.getElementById('my-comments-list');
        if (!commentsList) return;

        const userComments = [];
        
        // Find all comments by this user
        this.items.forEach(item => {
            if (item.ratings && Array.isArray(item.ratings)) {
                item.ratings.forEach(rating => {
                    if (rating.comments && Array.isArray(rating.comments)) {
                        rating.comments.forEach(comment => {
                            if (comment.user === username) {
                                userComments.push({
                                    ...comment,
                                    itemName: item.name,
                                    itemId: item.id,
                                    ratingId: rating.id,
                                    originalReviewer: rating.user
                                });
                            }
                        });
                    }
                });
            }
        });

        if (userComments.length === 0) {
            commentsList.innerHTML = '<div class="no-posts-message">You haven\'t written any comments yet.</div>';
            return;
        }

        // Sort by timestamp (newest first)
        userComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        commentsList.innerHTML = userComments.map(comment => `
            <div class="my-comment-item">
                <div class="my-comment-header">
                    <div class="my-comment-on">
                        Comment on "${comment.itemName}" (review by ${comment.originalReviewer})
                    </div>
                    <button class="delete-post-btn" onclick="window.ratingApp.deleteComment(${comment.itemId}, ${comment.ratingId}, ${comment.id})">
                        🗑️ Delete
                    </button>
                </div>
                <div class="my-comment-content">${comment.text}</div>
                <div class="my-post-meta">
                    <div class="my-post-date">${new Date(comment.timestamp).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }

    deleteReview(itemId, reviewId) {
        const confirmDelete = confirm('Are you sure you want to delete this review?');
        if (!confirmDelete) return;

        const item = this.items.find(item => item.id === itemId);
        if (!item) return;

        // Remove the review
        item.ratings = item.ratings.filter(rating => rating.id !== reviewId);

        // Recalculate average rating
        if (item.ratings.length > 0) {
            const totalRating = item.ratings.reduce((sum, rating) => sum + rating.value, 0);
            item.averageRating = totalRating / item.ratings.length;
        } else {
            // If no ratings left, remove the item entirely
            this.items = this.items.filter(i => i.id !== itemId);
        }

        // Save changes
        this.saveData();
        this.filterItems();
        this.populateMyReviews(this.getCurrentUser().name);
        
        console.log('✅ Review deleted successfully');
        
        // Show success message without alert popup
        this.showMyPostsMessage('Review deleted successfully!', 'success');
    }

    deleteComment(itemId, ratingId, commentId) {
        const confirmDelete = confirm('Are you sure you want to delete this comment?');
        if (!confirmDelete) return;

        const item = this.items.find(item => item.id === itemId);
        if (!item) return;

        const rating = item.ratings.find(rating => rating.id === ratingId);
        if (!rating) return;

        // Remove the comment
        rating.comments = rating.comments.filter(comment => comment.id !== commentId);

        // Save changes
        this.saveData();
        this.populateMyComments(this.getCurrentUser().name);
        
        console.log('✅ Comment deleted successfully');
        
        // Show success message without alert popup
        this.showMyPostsMessage('Comment deleted successfully!', 'success');
    }

    // Owner-only functions
    ownerDeleteItem(itemId) {
        if (!this.isOwner()) {
            console.warn('❌ Access denied: Only owner can delete items');
            return;
        }

        const item = this.items.find(item => item.id === itemId);
        if (!item) {
            console.warn('❌ Item not found');
            return;
        }

        const confirmDelete = confirm(`👑 OWNER ACTION: Are you sure you want to permanently delete "${item.name}"?\n\nThis will delete:\n• The item itself\n• All ${item.ratings?.length || 0} reviews\n• All comments\n\nThis cannot be undone!`);
        
        if (!confirmDelete) return;

        // Remove the entire item
        this.items = this.items.filter(i => i.id !== itemId);

        // Save changes and refresh display
        this.saveData();
        this.filterItems();
        
        console.log('👑 Owner deleted item:', item.name);
        this.showOwnerMessage(`Item "${item.name}" deleted successfully!`, 'success');
    }

    ownerDeleteReview(itemId, reviewId, reviewUser) {
        if (!this.isOwner()) {
            console.warn('❌ Access denied: Only owner can delete reviews');
            return;
        }

        const item = this.items.find(item => item.id === itemId);
        if (!item) return;

        const review = item.ratings.find(rating => rating.id === reviewId);
        if (!review) return;

        const confirmDelete = confirm(`👑 OWNER ACTION: Delete review by ${reviewUser}?\n\n"${review.review}"\n\nThis cannot be undone!`);
        if (!confirmDelete) return;

        // Remove the review
        item.ratings = item.ratings.filter(rating => rating.id !== reviewId);

        // Recalculate average rating
        if (item.ratings.length > 0) {
            const totalRating = item.ratings.reduce((sum, rating) => sum + rating.value, 0);
            item.averageRating = totalRating / item.ratings.length;
        } else {
            // If no ratings left, set average to 0 but keep item
            item.averageRating = 0;
        }

        // Save changes
        this.saveData();
        this.filterItems();
        
        console.log('👑 Owner deleted review by:', reviewUser);
        this.showOwnerMessage(`Review by ${reviewUser} deleted successfully!`, 'success');
    }

    ownerDeleteComment(itemId, ratingId, commentId, commentUser) {
        if (!this.isOwner()) {
            console.warn('❌ Access denied: Only owner can delete comments');
            return;
        }

        const item = this.items.find(item => item.id === itemId);
        if (!item) return;

        const rating = item.ratings.find(rating => rating.id === ratingId);
        if (!rating) return;

        const comment = rating.comments?.find(comment => comment.id === commentId);
        if (!comment) return;

        const confirmDelete = confirm(`👑 OWNER ACTION: Delete comment by ${commentUser}?\n\n"${comment.text}"\n\nThis cannot be undone!`);
        if (!confirmDelete) return;

        // Remove the comment
        rating.comments = rating.comments.filter(comment => comment.id !== commentId);

        // Save changes
        this.saveData();
        this.filterItems();
        
        console.log('👑 Owner deleted comment by:', commentUser);
        this.showOwnerMessage(`Comment by ${commentUser} deleted successfully!`, 'success');
    }

    showOwnerMessage(message, type = 'info') {
        // Remove any existing message
        const existingMessage = document.querySelector('.owner-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'owner-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 0.75rem 1rem;
            border-radius: 4px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.9rem;
            z-index: 3001;
            transition: opacity 0.3s ease;
        `;
        
        if (type === 'success') {
            messageDiv.style.cssText += `
                background: rgba(255, 215, 0, 0.2);
                border: 2px solid #ffd700;
                color: #ffd700;
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
            `;
        } else {
            messageDiv.style.cssText += `
                background: rgba(255, 215, 0, 0.15);
                border: 2px solid #ffd700;
                color: #ffd700;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
            `;
        }
        
        messageDiv.innerHTML = `👑 ${message}`;
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 4000);
    }

    getCurrentUser() {
        return this.currentUser || (window.currentSignedInUser ? { name: window.currentSignedInUser } : null);
    }

    // Check if current user is the admin with special credentials
    isAdmin() {
        const currentUser = this.getCurrentUser();
        return currentUser && currentUser.name === 'Admin' && currentUser.password === 'Admin2025!';
    }

    // Check if current user is the owner/admin
    isOwner() {
        const currentUser = this.getCurrentUser();
        return currentUser && (currentUser.name === 'Owner' || currentUser.name === 'owner' || currentUser.name === 'admin' || this.isAdmin());
    }

    // Check if current user can delete a specific post/comment
    canDelete(itemUserId, itemUsername) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;
        
        // Owner can delete anything
        if (this.isOwner()) {
            console.log('👑 Owner privileges: Can delete any content');
            return true;
        }
        
        // Regular users can only delete their own content
        return currentUser.name === itemUsername;
    }

    showMyPostsMessage(message, type = 'info') {
        // Remove any existing message
        const existingMessage = document.querySelector('.my-posts-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'my-posts-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 0.75rem 1rem;
            border-radius: 4px;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.9rem;
            z-index: 3000;
            transition: opacity 0.3s ease;
        `;
        
        if (type === 'success') {
            messageDiv.style.cssText += `
                background: rgba(0, 255, 65, 0.2);
                border: 1px solid #00ff41;
                color: #00ff41;
                box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
            `;
        } else {
            messageDiv.style.cssText += `
                background: rgba(0, 255, 255, 0.2);
                border: 1px solid #00ffff;
                color: #00ffff;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            `;
        }
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    populateCategoryDropdown(searchTerm = '') {
        const dropdown = document.getElementById('category-dropdown');
        if (!dropdown) {
            console.error('Category dropdown element not found');
            return;
        }

        console.log('🏷️ Populating categories with search term:', searchTerm);

        let categories = Object.entries(this.categoryMapping);
        
        // Filter categories if search term provided
        if (searchTerm && searchTerm.length > 0) {
            categories = categories.filter(([value, display]) => {
                const matchesDisplay = display.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesValue = value.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesWords = display.toLowerCase().split(' ').some(word => 
                    word.startsWith(searchTerm.toLowerCase())
                );
                return matchesDisplay || matchesValue || matchesWords;
            });
            console.log('🔍 Filtered categories:', categories.length, 'matches found');
        }

        if (categories.length === 0) {
            dropdown.innerHTML = '<div class="no-categories">No categories found for "' + searchTerm + '"</div>';
            return;
        }

        dropdown.innerHTML = categories.map(([value, display]) => 
            `<div class="category-option" data-value="${value}" title="Click to select ${display}">${display}</div>`
        ).join('');

        // Add click handlers to category options using event delegation for better reliability
        dropdown.addEventListener('click', (e) => {
            const clickedOption = e.target.closest('.category-option');
            if (clickedOption) {
                console.log('🖱️ Category option clicked via delegation:', clickedOption.dataset.value, clickedOption.textContent);
                this.selectCategory(clickedOption.dataset.value, clickedOption.textContent);
                e.stopPropagation();
                e.preventDefault();
            }
        });
        
        // Also add individual handlers as backup
        const options = dropdown.querySelectorAll('.category-option');
        console.log('🔗 Adding click handlers to', options.length, 'category options');
        
        options.forEach((option, index) => {
            console.log(`🏷️ Option ${index}:`, option.textContent, 'value:', option.dataset.value);
            
            option.addEventListener('click', (e) => {
                console.log('🖱️ Category option clicked (direct):', option.dataset.value, option.textContent);
                this.selectCategory(option.dataset.value, option.textContent);
                e.stopPropagation();
                e.preventDefault();
            });
            
            // Hover effects are now handled by CSS
        });

        console.log('✅ Category dropdown populated with', categories.length, 'options');
    }

    filterCategories(searchTerm) {
        console.log('🔎 Filtering categories for:', searchTerm);
        try {
            this.populateCategoryDropdown(searchTerm);
            this.highlightedCategoryIndex = -1;
            this.showCategoryDropdown();
            console.log('✅ Category filtering completed');
        } catch (error) {
            console.error('❌ Error filtering categories:', error);
        }
    }

    showCategoryDropdown() {
        const dropdown = document.getElementById('category-dropdown');
        if (dropdown) {
            dropdown.style.display = 'block';
        }
    }

    hideCategoryDropdown() {
        const dropdown = document.getElementById('category-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        this.highlightedCategoryIndex = -1;
    }

    handleCategoryKeyboard(e) {
        const dropdown = document.getElementById('category-dropdown');
        if (!dropdown || dropdown.style.display === 'none') return;

        const options = dropdown.querySelectorAll('.category-option');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.highlightedCategoryIndex = Math.min(this.highlightedCategoryIndex + 1, options.length - 1);
                this.updateCategoryHighlight();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.highlightedCategoryIndex = Math.max(this.highlightedCategoryIndex - 1, 0);
                this.updateCategoryHighlight();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.highlightedCategoryIndex >= 0 && options[this.highlightedCategoryIndex]) {
                    const selectedOption = options[this.highlightedCategoryIndex];
                    this.selectCategory(selectedOption.dataset.value, selectedOption.textContent);
                }
                break;
                
            case 'Escape':
                this.hideCategoryDropdown();
                break;
        }
    }

    updateCategoryHighlight() {
        const options = document.querySelectorAll('.category-option');
        options.forEach((option, index) => {
            if (index === this.highlightedCategoryIndex) {
                option.classList.add('highlighted');
                option.scrollIntoView({ block: 'nearest' });
            } else {
                option.classList.remove('highlighted');
            }
        });
    }

    selectCategory(value, display) {
        console.log('🎯 Selecting category:', value, display);
        
        const categorySearch = document.getElementById('category-search');
        const categoryHidden = document.getElementById('category');
        
        if (!categorySearch) {
            console.error('❌ Category search element not found');
            return;
        }
        
        if (!categoryHidden) {
            console.error('❌ Category hidden field not found');
            return;
        }
        
        // Set the values
        categorySearch.value = display;
        categoryHidden.value = value;
        this.selectedCategory = value;
        
        console.log('✅ Category selected successfully:', {
            display: display,
            value: value,
            selectedCategory: this.selectedCategory
        });
        
        // Hide dropdown and add visual feedback
        this.hideCategoryDropdown();
        
        // Brief visual feedback
        categorySearch.style.backgroundColor = '#d4edda';
        categorySearch.style.borderColor = '#28a745';
        setTimeout(() => {
            categorySearch.style.backgroundColor = '';
            categorySearch.style.borderColor = '';
        }, 1000);
    }

    showSearchResults(query) {
        const dropdown = document.getElementById('search-results-dropdown');
        if (!dropdown) return;

        const searchResults = this.searchItems(query);
        const disambiguation = this.getDisambiguation(query.toLowerCase());
        
        // Calculate and show overall rating
        const overallData = this.calculateOverallRating(searchResults);
        if (overallData && overallData.totalItems > 0) {
            this.showOverallRating(query, overallData);
        } else {
            this.hideOverallRating();
        }
        
        let html = '';
        
        // Add disambiguation if applicable
        if (disambiguation && searchResults.length > 0) {
            html += `
                <div class="search-disambiguation">
                    <div class="disambiguation-title">💡 "${query}" might refer to:</div>
                    <div class="disambiguation-text">${disambiguation.meanings.join(' • ')}</div>
                    <div class="disambiguation-text" style="margin-top: 0.3rem; font-style: italic;">${disambiguation.note}</div>
                </div>
            `;
        }
        
        // Add search results
        if (searchResults.length > 0) {
            html += searchResults.map((item, index) => {
                const stars = '★'.repeat(Math.round(item.averageRating)) + '☆'.repeat(5 - Math.round(item.averageRating));
                const categoryDisplay = this.categoryMapping[item.category] || item.category;
                
                return `
                    <div class="search-result-item" data-item-id="${item.id}" data-index="${index}">
                        <div class="search-result-info">
                            <div class="search-result-name">${item.name}</div>
                            <div class="search-result-category">${categoryDisplay}</div>
                        </div>
                        <div class="search-result-rating">
                            <div class="search-result-stars">${stars}</div>
                            <div class="search-result-avg">${item.averageRating.toFixed(1)} (${item.ratings.length})</div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            // No results found - show suggestions
            const suggestions = this.getSuggestions(query);
            html += `
                <div class="no-search-results">
                    No items found for "${query}"
                </div>
            `;
            
            if (suggestions.length > 0) {
                html += `
                    <div class="search-suggestions">
                        <div class="suggestions-title">💡 Try searching for:</div>
                        <div class="suggestions-list">${suggestions.join(' • ')}</div>
                    </div>
                `;
            }
        }
        
        dropdown.innerHTML = html;
        
        // Add click handlers
        dropdown.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const itemId = item.dataset.itemId;
                this.selectSearchResult(itemId, query);
            });
        });
        
        dropdown.style.display = 'block';
        this.highlightedSearchIndex = -1;
    }

    hideSearchResults() {
        const dropdown = document.getElementById('search-results-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
            dropdown.classList.remove('with-rating');
        }
        this.highlightedSearchIndex = -1;
        this.hideOverallRating();
    }

    calculateOverallRating(searchResults) {
        if (!searchResults || searchResults.length === 0) {
            return null;
        }

        // Calculate weighted average based on number of ratings
        let totalWeightedRating = 0;
        let totalWeight = 0;
        let totalItems = searchResults.length;
        let totalRatings = 0;

        searchResults.forEach(item => {
            const weight = Math.max(item.ratings.length, 1); // At least weight of 1
            totalWeightedRating += item.averageRating * weight;
            totalWeight += weight;
            totalRatings += item.ratings.length;
        });

        const overallRating = totalWeight > 0 ? totalWeightedRating / totalWeight : 0;

        return {
            rating: overallRating,
            totalItems: totalItems,
            totalRatings: totalRatings,
            searchResults: searchResults
        };
    }

    showOverallRating(query, overallData) {
        const ratingContainer = document.getElementById('search-overall-rating');
        const dropdown = document.getElementById('search-results-dropdown');
        
        if (!ratingContainer || !overallData) return;

        const stars = '★'.repeat(Math.round(overallData.rating)) + '☆'.repeat(5 - Math.round(overallData.rating));
        
        let categoryContext = '';
        if (overallData.totalItems > 1) {
            // Find most common category in results
            const categoryCount = {};
            overallData.searchResults.forEach(item => {
                const categoryDisplay = this.categoryMapping[item.category] || item.category;
                categoryCount[categoryDisplay] = (categoryCount[categoryDisplay] || 0) + 1;
            });
            const mostCommonCategory = Object.keys(categoryCount).reduce((a, b) => 
                categoryCount[a] > categoryCount[b] ? a : b
            );
            if (categoryCount[mostCommonCategory] >= overallData.totalItems * 0.5) {
                categoryContext = ` in ${mostCommonCategory}`;
            }
        }

        ratingContainer.innerHTML = `
            <div class="overall-rating-header">Overall Rating for "${query}"${categoryContext}</div>
            <div class="overall-rating-content">
                <div class="overall-rating-stars">${stars}</div>
                <div class="overall-rating-text">${overallData.rating.toFixed(1)}/5</div>
                <div class="overall-rating-count">(${overallData.totalItems} items, ${overallData.totalRatings} ratings)</div>
            </div>
        `;
        
        ratingContainer.style.display = 'block';
        
        if (dropdown) {
            dropdown.classList.add('with-rating');
        }
    }

    hideOverallRating() {
        const ratingContainer = document.getElementById('search-overall-rating');
        if (ratingContainer) {
            ratingContainer.style.display = 'none';
        }
    }

    searchItems(query) {
        if (!query) return [];
        
        const searchTerm = query.toLowerCase();
        return this.items.filter(item => {
            const categoryDisplayName = this.categoryMapping[item.category] || item.category;
            return item.name.toLowerCase().includes(searchTerm) ||
                   item.description.toLowerCase().includes(searchTerm) ||
                   item.category.toLowerCase().includes(searchTerm) ||
                   categoryDisplayName.toLowerCase().includes(searchTerm) ||
                   (item.ratings && item.ratings.some(rating => 
                       rating.review && rating.review.toLowerCase().includes(searchTerm)
                   ));
        }).slice(0, 8); // Limit to 8 results for performance
    }

    getDisambiguation(query) {
        return this.disambiguationMappings[query] || null;
    }

    getSuggestions(query) {
        // Generate suggestions based on common categories and partial matches
        const suggestions = [];
        const queryLower = query.toLowerCase();
        
        // Category-based suggestions
        Object.values(this.categoryMapping).forEach(category => {
            if (category.toLowerCase().includes(queryLower)) {
                suggestions.push(category);
            }
        });
        
        // Item name partial matches
        this.items.forEach(item => {
            if (item.name.toLowerCase().includes(queryLower) && !suggestions.includes(item.name)) {
                suggestions.push(item.name);
            }
        });
        
        return suggestions.slice(0, 5);
    }

    handleSearchKeyboard(e) {
        const dropdown = document.getElementById('search-results-dropdown');
        if (!dropdown || dropdown.style.display === 'none') return;

        const results = dropdown.querySelectorAll('.search-result-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.highlightedSearchIndex = Math.min(this.highlightedSearchIndex + 1, results.length - 1);
                this.updateSearchHighlight();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.highlightedSearchIndex = Math.max(this.highlightedSearchIndex - 1, 0);
                this.updateSearchHighlight();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.highlightedSearchIndex >= 0 && results[this.highlightedSearchIndex]) {
                    const selectedResult = results[this.highlightedSearchIndex];
                    const itemId = selectedResult.dataset.itemId;
                    this.selectSearchResult(itemId, e.target.value);
                }
                break;
                
            case 'Escape':
                this.hideSearchResults();
                break;
        }
    }

    updateSearchHighlight() {
        const results = document.querySelectorAll('.search-result-item');
        results.forEach((result, index) => {
            if (index === this.highlightedSearchIndex) {
                result.classList.add('highlighted');
                result.scrollIntoView({ block: 'nearest' });
            } else {
                result.classList.remove('highlighted');
            }
        });
    }

    selectSearchResult(itemId, query) {
        this.hideSearchResults();
        this.showItemDetailsModal(itemId);
    }

    showItemDetailsModal(itemId) {
        const item = this.items.find(i => i.id == itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }

        const modal = document.getElementById('item-details-modal');
        if (modal) {
            this.renderItemDetails(item);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideItemDetailsModal() {
        const modal = document.getElementById('item-details-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    renderItemDetails(item) {
        // Update item info
        const categoryDisplay = this.categoryMapping[item.category] || item.category;
        document.getElementById('item-details-name').textContent = item.name;
        document.getElementById('item-details-category').textContent = categoryDisplay;
        document.getElementById('item-details-description').textContent = item.description || 'No description provided';
        
        // Update rating display
        const stars = '★'.repeat(Math.round(item.averageRating)) + '☆'.repeat(5 - Math.round(item.averageRating));
        document.getElementById('item-details-stars').textContent = stars;
        document.getElementById('item-details-score').textContent = item.averageRating.toFixed(1);
        document.getElementById('item-details-count').textContent = `(${item.ratings.length} review${item.ratings.length !== 1 ? 's' : ''})`;
        
        // Update rate button
        const rateBtn = document.getElementById('add-my-rating-btn');
        const userRating = item.ratings.find(r => r.userId === this.currentUser?.id);
        if (userRating) {
            rateBtn.textContent = 'Update My Rating';
        } else {
            rateBtn.textContent = 'Rate This Item';
        }
        
        // Render all reviews
        this.renderAllReviews(item);
    }

    renderAllReviews(item) {
        const reviewsList = document.getElementById('all-reviews-list');
        
        if (item.ratings.length === 0) {
            reviewsList.innerHTML = '<div class="no-reviews-message">No reviews yet. Be the first to rate this item!</div>';
            return;
        }
        
        // Sort reviews by date (newest first)
        const sortedReviews = [...item.ratings].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        reviewsList.innerHTML = sortedReviews.map(rating => {
            const stars = '★'.repeat(rating.value) + '☆'.repeat(5 - rating.value);
            const date = this.getRelativeTime(new Date(rating.timestamp));
            const hasComments = rating.comments && rating.comments.length > 0;
            
            return `
                <div class="review-item-detailed">
                    <div class="review-header-detailed">
                        <div class="reviewer-info-detailed">
                            <span class="reviewer-name-detailed">
                                <span class="clickable-username" onclick="window.ratingApp?.showProfileRatingModal('${rating.user}')">${rating.user}</span>
                            </span>
                            <span class="reviewer-date">${date}</span>
                        </div>
                        <div class="review-rating-detailed">
                            <span class="review-stars-detailed">${stars}</span>
                            <span class="review-score-detailed">${rating.value}/5</span>
                            ${this.isOwner() ? `
                                <button class="owner-delete-review-btn" onclick="window.ratingApp.ownerDeleteReview(${item.id}, ${rating.id}, '${rating.user}')">
                                    👑🗑️
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    ${rating.review ? `<div class="review-text-detailed">${rating.review}</div>` : ''}
                    ${hasComments ? `
                        <div class="review-comments-section">
                            <button class="toggle-comments-btn" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'; this.textContent = this.nextElementSibling.style.display === 'none' ? '💬 Show ${rating.comments.length} comments' : '💬 Hide comments'">
                                💬 Show ${rating.comments.length} comment${rating.comments.length !== 1 ? 's' : ''}
                            </button>
                            <div class="comments-list-detailed" style="display: none;">
                                ${rating.comments.map(comment => `
                                    <div class="comment-item-detailed">
                                        <div class="comment-header">
                                            <span class="comment-author">${comment.user}</span>
                                            <span class="comment-date">${this.getRelativeTime(new Date(comment.timestamp))}</span>
                                            ${this.isOwner() ? `
                                                <button class="owner-delete-comment-btn" onclick="window.ratingApp.ownerDeleteComment(${item.id}, ${rating.id}, ${comment.id}, '${comment.user}')">
                                                    👑🗑️
                                                </button>
                                            ` : ''}
                                        </div>
                                        <div class="comment-text">${comment.text}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    showHeaderSigninModal() {
        console.log('🚫 Header signin modal blocked - redirecting to auth section');
        // Instead of showing modal, scroll to auth section
        const authSection = document.getElementById('auth-section');
        if (authSection) {
            authSection.style.display = 'block';
            authSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showHeaderSignupModal() {
        console.log('🚫 Header signup modal blocked - redirecting to auth section');
        // Instead of showing modal, scroll to auth section
        const authSection = document.getElementById('auth-section');
        if (authSection) {
            authSection.style.display = 'block';
            authSection.scrollIntoView({ behavior: 'smooth' });
            
            // Switch to signup tab
            const signupTab = document.getElementById('signup-tab');
            const signupForm = document.getElementById('signup-form');
            const signinForm = document.getElementById('signin-form');
            const signinTab = document.getElementById('signin-tab');
            
            if (signupTab) signupTab.classList.add('active');
            if (signinTab) signinTab.classList.remove('active');
            if (signupForm) signupForm.style.display = 'block';
            if (signinForm) signinForm.style.display = 'none';
        }
    }

    updateHeaderAuth() {
        console.log('🔧 Updating header auth, current user:', this.currentUser?.name || 'none');
        const headerAuth = document.getElementById('header-auth');
        const headerUser = document.getElementById('header-user');
        const headerUserName = document.getElementById('header-user-name');
        
        if (this.currentUser) {
            if (headerAuth) headerAuth.style.display = 'none';
            if (headerUser) headerUser.style.display = 'flex';
            if (headerUserName) {
                if (this.isAdmin()) {
                    headerUserName.innerHTML = `🛡️ ${this.currentUser.name} <span style="color: #ff0080; font-size: 0.8em; font-weight: bold;">(ADMIN)</span>`;
                } else if (this.isOwner()) {
                    headerUserName.innerHTML = `👑 ${this.currentUser.name} <span style="color: #ffd700; font-size: 0.8em;">(OWNER)</span>`;
                } else {
                    headerUserName.textContent = this.currentUser.name;
                }
            }
            
            // Show/hide admin dashboard button
            const adminDashboardBtn = document.getElementById('admin-dashboard-btn');
            if (adminDashboardBtn) {
                if (this.isAdmin()) {
                    adminDashboardBtn.style.display = 'inline-block';
                    console.log('🛡️ Admin dashboard button shown');
                } else {
                    adminDashboardBtn.style.display = 'none';
                }
            }

            // Setup My Posts button when user header is shown
            console.log('✅ User signed in, setting up My Posts button');
            setTimeout(() => {
                this.setupMyPostsModal();
                
                // Also call the global setup as backup
                if (window.forceSetupMyPosts) {
                    window.forceSetupMyPosts();
                }
            }, 100);
            
        } else {
            if (headerAuth) headerAuth.style.display = 'flex';
            if (headerUser) headerUser.style.display = 'none';
            
            // Hide admin dashboard button when no user is logged in
            const adminDashboardBtn = document.getElementById('admin-dashboard-btn');
            if (adminDashboardBtn) {
                adminDashboardBtn.style.display = 'none';
            }
        }
    }

    signInWithCredentials(username, password) {
        try {
            console.log('🔑 Attempting sign in with credentials:', username, 'password length:', password.length);
            console.log('🔍 Available users:', this.users.map(u => ({ name: u.name, hasPassword: !!u.password })));
            
            if (!username || username.length === 0) {
                console.warn('⚠️ Username field empty');
                return;
            }
            
            if (!password || password.length === 0) {
                console.warn('⚠️ Password field empty');
                return;
            }
            
            // Find matching user
            const user = this.users.find(u => u.name === username && u.password === password);
            console.log('🔍 Found user:', user ? 'YES' : 'NO');
            
            if (!user) {
                console.log('❌ No matching user found. Available users:', this.users.map(u => u.name));
                console.warn('❌ Invalid credentials - no popup shown to prevent spam');
                return;
            }
            
            // Sign in successful
            console.log('✅ Sign in successful for user:', user.name);
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.setupAuthInterface();
            this.updateHeaderAuth();
            
        } catch (error) {
            console.error('❌ Error during sign in:', error);
            console.warn('❌ Sign in error - no popup shown to prevent spam');
        }
    }

    signUpWithCredentials(username, password) {
        try {
            console.log('📝 Attempting sign up with credentials:', username, 'password length:', password.length);
            console.log('🔍 Current users before signup:', this.users.map(u => u.name));
            
            if (!username || username.length === 0) {
                console.warn('⚠️ Username field empty');
                return;
            }
            
            if (!password || password.length === 0) {
                console.warn('⚠️ Password field empty');
                return;
            }
            
            // Check if user already exists
            const existingUser = this.users.find(u => u.name === username);
            if (existingUser) {
                console.log('❌ Username already exists:', username);
                console.warn('❌ Username exists - no popup shown to prevent spam');
                return;
            }
            
            // Create new user
            const user = {
                id: Date.now() + Math.random(),
                name: username,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            console.log('📝 Creating new user:', user);
            this.users.push(user);
            localStorage.setItem('users', JSON.stringify(this.users));
            
            // Sign in the new user
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            console.log('✅ User created and signed in successfully:', user.name);
            console.log('👥 Total users now:', this.users.length);
            this.setupAuthInterface();
            this.updateHeaderAuth();
            
        } catch (error) {
            console.error('❌ Error during sign up:', error);
            console.warn('❌ Sign up error - no popup shown to prevent spam');
        }
    }

    // Admin Dashboard Functions
    setupAdminDashboard() {
        if (!this.isAdmin()) {
            console.warn('⚠️ Access denied: Admin privileges required');
            return;
        }

        console.log('🛡️ Setting up admin dashboard');
        
        // Setup modal event listeners
        const adminModal = document.getElementById('admin-dashboard-modal');
        const closeBtn = document.getElementById('close-admin-dashboard');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideAdminDashboard();
            });
        }

        // Setup tab switching
        this.setupAdminTabs();
        
        // Setup admin action buttons
        this.setupAdminActions();
        
        // Initial population
        this.populateAdminUsers();
        this.populateAdminStats();
    }

    showAdminDashboard() {
        if (!this.isAdmin()) {
            console.warn('⚠️ Access denied: Admin privileges required');
            return;
        }

        console.log('🛡️ Opening admin dashboard');
        const modal = document.getElementById('admin-dashboard-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.setupAdminDashboard();
            document.body.style.overflow = 'hidden';
        }
    }

    hideAdminDashboard() {
        const modal = document.getElementById('admin-dashboard-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    setupAdminTabs() {
        const tabs = ['users-tab', 'content-tab', 'stats-tab'];
        const sections = ['admin-users-section', 'admin-content-section', 'admin-stats-section'];

        tabs.forEach((tabId, index) => {
            const tab = document.getElementById(tabId);
            if (tab) {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    tabs.forEach(t => {
                        const tabEl = document.getElementById(t);
                        if (tabEl) tabEl.classList.remove('active');
                    });
                    
                    // Hide all sections
                    sections.forEach(s => {
                        const section = document.getElementById(s);
                        if (section) section.style.display = 'none';
                    });
                    
                    // Activate clicked tab and show corresponding section
                    tab.classList.add('active');
                    const section = document.getElementById(sections[index]);
                    if (section) section.style.display = 'block';
                    
                    // Populate data based on active tab
                    if (tabId === 'users-tab') this.populateAdminUsers();
                    if (tabId === 'content-tab') this.populateAdminContent();
                    if (tabId === 'stats-tab') this.populateAdminStats();
                });
            }
        });
    }

    setupAdminActions() {
        // Delete all items
        const deleteAllItemsBtn = document.getElementById('delete-all-items');
        if (deleteAllItemsBtn) {
            deleteAllItemsBtn.addEventListener('click', () => {
                if (confirm('⚠️ Are you sure you want to delete ALL items? This cannot be undone!')) {
                    this.items = [];
                    this.saveItems();
                    this.renderItems();
                    console.log('🗑️ Admin deleted all items');
                    this.populateAdminStats();
                }
            });
        }

        // Delete all reviews
        const deleteAllReviewsBtn = document.getElementById('delete-all-reviews');
        if (deleteAllReviewsBtn) {
            deleteAllReviewsBtn.addEventListener('click', () => {
                if (confirm('⚠️ Are you sure you want to delete ALL reviews? This cannot be undone!')) {
                    this.items.forEach(item => {
                        item.ratings = [];
                        item.totalRating = 0;
                        item.averageRating = 0;
                    });
                    this.saveItems();
                    this.renderItems();
                    console.log('🗑️ Admin deleted all reviews');
                    this.populateAdminStats();
                }
            });
        }

        // Delete all comments
        const deleteAllCommentsBtn = document.getElementById('delete-all-comments');
        if (deleteAllCommentsBtn) {
            deleteAllCommentsBtn.addEventListener('click', () => {
                if (confirm('⚠️ Are you sure you want to delete ALL comments? This cannot be undone!')) {
                    this.items.forEach(item => {
                        item.ratings.forEach(rating => {
                            rating.comments = [];
                        });
                    });
                    this.saveItems();
                    this.renderItems();
                    console.log('🗑️ Admin deleted all comments');
                    this.populateAdminStats();
                }
            });
        }

        // Export data
        const exportDataBtn = document.getElementById('export-data');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportAllData();
            });
        }
    }

    populateAdminUsers() {
        const usersList = document.getElementById('admin-users-list');
        if (!usersList) return;

        usersList.innerHTML = '';
        
        this.users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'admin-user-item';
            
            const userReviews = this.items.reduce((count, item) => {
                return count + item.ratings.filter(r => r.user === user.name).length;
            }, 0);
            
            userItem.innerHTML = `
                <div class="admin-user-info">
                    <div class="admin-user-name">${user.name}</div>
                    <div>Reviews: ${userReviews} | Joined: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</div>
                </div>
                <button class="admin-delete-user-btn" onclick="window.ratingApp.deleteUser('${user.name}')">
                    🗑️ Delete
                </button>
            `;
            
            usersList.appendChild(userItem);
        });
    }

    populateAdminContent() {
        console.log('🛡️ populateAdminContent called');
        const contentList = document.getElementById('admin-content-list');
        if (!contentList) {
            console.error('❌ admin-content-list element not found');
            return;
        }

        console.log(`🛡️ Populating ${this.items.length} items`);
        contentList.innerHTML = '';
        
        this.items.forEach(item => {
            console.log(`🛡️ Adding item: ${item.name} (ID: ${item.id})`);
            const contentItem = document.createElement('div');
            contentItem.className = 'admin-content-item';
            
            const reviewCount = item.ratings.length;
            const commentCount = item.ratings.reduce((count, rating) => count + (rating.comments ? rating.comments.length : 0), 0);
            
            contentItem.innerHTML = `
                <div class="admin-content-info">
                    <div><strong>${item.name}</strong> (${item.category})</div>
                    <div>Reviews: ${reviewCount} | Comments: ${commentCount} | Rating: ${item.averageRating.toFixed(1)}★</div>
                </div>
                <button class="admin-delete-user-btn" data-item-id="${item.id}">
                    🗑️ Delete
                </button>
            `;
            
            // Add event listener for delete button
            const deleteBtn = contentItem.querySelector('.admin-delete-user-btn');
            deleteBtn.addEventListener('click', () => {
                console.log('🛡️ Delete button clicked for item:', item.name, 'ID:', item.id);
                this.adminDeleteItem(item.id);
            });
            
            contentList.appendChild(contentItem);
        });
    }

    populateAdminStats() {
        const statsDisplay = document.getElementById('admin-stats-display');
        if (!statsDisplay) return;

        const totalUsers = this.users.length;
        const totalItems = this.items.length;
        const totalReviews = this.items.reduce((count, item) => count + item.ratings.length, 0);
        const totalComments = this.items.reduce((count, item) => {
            return count + item.ratings.reduce((commentCount, rating) => {
                return commentCount + (rating.comments ? rating.comments.length : 0);
            }, 0);
        }, 0);

        statsDisplay.innerHTML = `
            <div class="admin-stat-card">
                <div class="admin-stat-number">${totalUsers}</div>
                <div class="admin-stat-label">Total Users</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-number">${totalItems}</div>
                <div class="admin-stat-label">Total Items</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-number">${totalReviews}</div>
                <div class="admin-stat-label">Total Reviews</div>
            </div>
            <div class="admin-stat-card">
                <div class="admin-stat-number">${totalComments}</div>
                <div class="admin-stat-label">Total Comments</div>
            </div>
        `;
    }

    deleteUser(username) {
        if (!this.isAdmin()) {
            console.warn('⚠️ Access denied: Admin privileges required');
            return;
        }

        if (username === 'Admin') {
            alert('❌ Cannot delete admin account!');
            return;
        }

        if (confirm(`⚠️ Are you sure you want to delete user "${username}"? This will also delete all their reviews and comments.`)) {
            // Remove user from users array
            this.users = this.users.filter(u => u.name !== username);
            localStorage.setItem('users', JSON.stringify(this.users));

            // Remove user's ratings and comments
            this.items.forEach(item => {
                item.ratings = item.ratings.filter(rating => {
                    if (rating.user === username) {
                        return false; // Remove this rating
                    }
                    // Remove comments by this user
                    if (rating.comments) {
                        rating.comments = rating.comments.filter(comment => comment.user !== username);
                    }
                    return true;
                });
                
                // Recalculate ratings
                this.recalculateItemRating(item);
            });

            this.saveItems();
            this.renderItems();
            this.populateAdminUsers();
            this.populateAdminStats();
            
            console.log(`🗑️ Admin deleted user: ${username}`);
        }
    }

    adminDeleteItem(itemId) {
        console.log('🛡️ adminDeleteItem called with ID:', itemId);
        console.log('🛡️ Current user is admin:', this.isAdmin());
        console.log('🛡️ Available items:', this.items.length);
        
        if (!this.isAdmin()) {
            console.warn('⚠️ Access denied: Admin privileges required');
            alert('❌ Access denied: Admin privileges required');
            return;
        }

        console.log('🔍 Looking for item with ID:', itemId);
        const item = this.items.find(i => i.id === itemId);
        console.log('🔍 Found item:', item ? item.name : 'NOT FOUND');
        
        if (!item) {
            console.error('❌ Item not found with ID:', itemId);
            alert('❌ Item not found!');
            return;
        }

        if (confirm(`⚠️ Are you sure you want to delete "${item.name}"?`)) {
            console.log('✅ User confirmed deletion');
            const originalLength = this.items.length;
            this.items = this.items.filter(i => i.id !== itemId);
            console.log(`🗑️ Items array reduced from ${originalLength} to ${this.items.length}`);
            
            this.saveItems();
            this.renderItems();
            this.populateAdminContent();
            this.populateAdminStats();
            
            console.log(`🗑️ Admin deleted item: ${item.name}`);
            alert(`✅ Successfully deleted "${item.name}"`);
        } else {
            console.log('❌ User cancelled deletion');
        }
    }

    exportAllData() {
        const data = {
            users: this.users,
            items: this.items,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rateit-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📥 Admin exported all data');
    }
}

// Enhanced initialization with better error handling
function initializeApp() {
    console.log('🚀 Initializing RatingApp...');
    console.log('📄 Document ready state:', document.readyState);
    
    // Check if essential DOM elements exist
    const requiredElements = [
        'auth-section',
        'signin-btn', 
        'signup-btn',
        'main-content',
        'items-grid'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.warn('⚠️ Missing DOM elements:', missingElements);
        console.log('🔄 Retrying initialization in 200ms...');
        setTimeout(initializeApp, 200);
        return;
    }
    
    console.log('✅ All required DOM elements found');
    
    try {
        window.ratingApp = new RatingApp();
        console.log('🎉 RatingApp initialized successfully');
        
        // Verify buttons are working by adding manual test handlers
        setTimeout(() => {
            verifyButtonFunctionality();
        }, 500);
        
    } catch (error) {
        console.error('💥 Failed to initialize RatingApp:', error);
        console.error('Stack trace:', error.stack);
        
        // Try to provide user feedback
        const authSection = document.getElementById('auth-section');
        if (authSection) {
            authSection.innerHTML = `
                <div style="padding: 2rem; text-align: center; background: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; color: #991b1b;">
                    <h3>⚠️ Application Error</h3>
                    <p>There was an error loading the application. Please refresh the page.</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
                </div>
            `;
        }
    }
}

function verifyButtonFunctionality() {
    console.log('🔍 Verifying button functionality...');
    
    const signinBtn = document.getElementById('signin-btn');
    const signupBtn = document.getElementById('signup-btn');
    
    if (!signinBtn || !signupBtn) {
        console.error('❌ Auth buttons not found in DOM!');
        
        // Try to find them and add manual handlers
        setTimeout(() => {
            addManualButtonHandlers();
        }, 100);
        return;
    }
    
    console.log('✅ Auth buttons found:', {
        signinBtn: signinBtn.tagName,
        signupBtn: signupBtn.tagName,
        signinType: signinBtn.type,
        signupType: signupBtn.type
    });
    
    // Add additional verification handlers
    signinBtn.addEventListener('click', function testSignInHandler(e) {
        console.log('🔥 SIGNIN BUTTON CLICKED - TEST HANDLER');
        e.preventDefault();
        
        if (window.ratingApp && typeof window.ratingApp.signIn === 'function') {
            console.log('✅ Calling window.ratingApp.signIn()');
            window.ratingApp.signIn();
        } else {
            console.error('❌ RatingApp or signIn method not available - no popup shown');
        }
    });
    
    signupBtn.addEventListener('click', function testSignUpHandler(e) {
        console.log('🔥 SIGNUP BUTTON CLICKED - TEST HANDLER');
        e.preventDefault();
        
        if (window.ratingApp && typeof window.ratingApp.signUp === 'function') {
            console.log('✅ Calling window.ratingApp.signUp()');
            window.ratingApp.signUp();
        } else {
            console.error('❌ RatingApp or signUp method not available - no popup shown');
        }
    });
}

function addManualButtonHandlers() {
    console.log('🛠️ Adding manual button handlers...');
    
    // Use event delegation to catch clicks on auth buttons
    document.addEventListener('click', function(e) {
        if (e.target.id === 'signin-btn') {
            console.log('🔥 MANUAL SIGNIN HANDLER TRIGGERED');
            e.preventDefault();
            e.stopPropagation();
            
            if (window.ratingApp) {
                window.ratingApp.signIn();
            } else {
                console.error('❌ RatingApp not available - no popup shown');
            }
            return false;
        }
        
        if (e.target.id === 'signup-btn') {
            console.log('🔥 MANUAL SIGNUP HANDLER TRIGGERED');
            e.preventDefault();
            e.stopPropagation();
            
            if (window.ratingApp) {
                window.ratingApp.signUp();
            } else {
                console.error('❌ RatingApp not available - no popup shown');
            }
            return false;
        }
    }, true);
}

// Multiple initialization attempts
if (document.readyState === 'loading') {
    console.log('📄 Document still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    console.log('📄 Document already loaded, initializing immediately...');
    initializeApp();
}

// Backup initialization
window.addEventListener('load', () => {
    if (!window.ratingApp) {
        console.log('🔄 Backup initialization triggered');
        initializeApp();
    }
});

// Additional safety net - try initialization after 2 seconds if nothing worked
setTimeout(() => {
    if (!window.ratingApp) {
        console.log('🆘 Emergency initialization - last attempt');
        initializeApp();
    }
}, 2000);

// Global helper function for debugging My Posts
window.testMyPosts = function() {
    console.log('🧪 Testing My Posts functionality...');
    console.log('ratingApp exists:', !!window.ratingApp);
    console.log('showMyPostsModal exists:', !!(window.ratingApp && window.ratingApp.showMyPostsModal));
    
    if (window.ratingApp && window.ratingApp.showMyPostsModal) {
        console.log('✅ Calling showMyPostsModal directly');
        window.ratingApp.showMyPostsModal();
    } else {
        console.log('❌ Method not available, showing modal directly');
        const modal = document.getElementById('my-posts-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('✅ Modal shown directly');
        } else {
            console.log('❌ Modal element not found');
        }
    }
};

// Global function to force setup My Posts button
window.forceSetupMyPosts = function() {
    console.log('🔧 Force setting up My Posts button...');
    const myPostsBtn = document.getElementById('my-posts-btn');
    if (myPostsBtn) {
        myPostsBtn.onclick = function(e) {
            e.preventDefault();
            console.log('🔥 FORCE SETUP - MY POSTS CLICKED!');
            window.testMyPosts();
        };
        console.log('✅ Force setup complete');
    } else {
        console.log('❌ My Posts button not found');
    }
};

// SIMPLE DIRECT FUNCTION for HTML onclick
window.openMyPosts = function() {
    alert('My Posts button clicked! Function is working!');
    console.log('🔥 openMyPosts() called directly from HTML!');
    
    // Show modal directly - very simple version
    const modal = document.getElementById('my-posts-modal');
    console.log('Modal found:', !!modal);
    
    if (modal) {
        alert('Modal found! Showing it now...');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add simple test content
        const reviewsList = document.getElementById('my-reviews-list');
        const commentsList = document.getElementById('my-comments-list');
        
        if (reviewsList) {
            reviewsList.innerHTML = '<div class="no-posts-message">TEST: This is the My Posts modal! It works!</div>';
        }
        if (commentsList) {
            commentsList.innerHTML = '<div class="no-posts-message">TEST: Comments section would be here</div>';
        }
        
        // Simple close button
        const closeBtn = document.getElementById('close-my-posts');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            };
        }
        
    } else {
        alert('ERROR: Modal not found!');
        console.error('❌ My Posts modal not found');
    }
};

// Setup close handlers for the modal
window.setupMyPostsCloseHandlers = function() {
    const modal = document.getElementById('my-posts-modal');
    const closeBtn = document.getElementById('close-my-posts');
    
    if (closeBtn && !closeBtn.hasAttribute('data-handler-added')) {
        closeBtn.onclick = function() {
            console.log('🔥 Close My Posts clicked');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
        closeBtn.setAttribute('data-handler-added', 'true');
    }
    
    if (modal && !modal.hasAttribute('data-click-handler-added')) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                console.log('🔥 Clicked outside My Posts modal');
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };
        modal.setAttribute('data-click-handler-added', 'true');
    }
};

// Setup tab functionality for My Posts modal
window.setupMyPostsTabs = function() {
    const reviewsTab = document.getElementById('my-reviews-tab');
    const commentsTab = document.getElementById('my-comments-tab');
    
    if (reviewsTab && !reviewsTab.hasAttribute('data-handler-added')) {
        reviewsTab.onclick = function() {
            console.log('🔥 Reviews tab clicked');
            showMyReviewsTab();
        };
        reviewsTab.setAttribute('data-handler-added', 'true');
    }
    
    if (commentsTab && !commentsTab.hasAttribute('data-handler-added')) {
        commentsTab.onclick = function() {
            console.log('🔥 Comments tab clicked');
            showMyCommentsTab();
        };
        commentsTab.setAttribute('data-handler-added', 'true');
    }
};

// Global tab switching functions
window.showMyReviewsTab = function() {
    const reviewsTab = document.getElementById('my-reviews-tab');
    const commentsTab = document.getElementById('my-comments-tab');
    const reviewsSection = document.getElementById('my-reviews-section');
    const commentsSection = document.getElementById('my-comments-section');

    if (reviewsTab) reviewsTab.classList.add('active');
    if (commentsTab) commentsTab.classList.remove('active');
    if (reviewsSection) reviewsSection.style.display = 'block';
    if (commentsSection) commentsSection.style.display = 'none';
};

window.showMyCommentsTab = function() {
    const reviewsTab = document.getElementById('my-reviews-tab');
    const commentsTab = document.getElementById('my-comments-tab');
    const reviewsSection = document.getElementById('my-reviews-section');
    const commentsSection = document.getElementById('my-comments-section');

    if (reviewsTab) reviewsTab.classList.remove('active');
    if (commentsTab) commentsTab.classList.add('active');
    if (reviewsSection) reviewsSection.style.display = 'none';
    if (commentsSection) commentsSection.style.display = 'block';
};

// Global function to open admin dashboard
window.openAdminDashboard = function() {
    console.log('🛡️ openAdminDashboard() called from HTML');
    if (window.ratingApp && window.ratingApp.isAdmin()) {
        window.ratingApp.showAdminDashboard();
    } else {
        console.warn('⚠️ Access denied: Admin privileges required');
        alert('❌ Access denied: Admin privileges required');
    }
};

// Global function to fix scrolling issues
window.fixScrolling = function() {
    console.log('🔧 Fixing scrolling...');
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Also check for any visible modals and hide them
    const modals = [
        'item-details-modal',
        'profile-rating-modal', 
        'my-posts-modal',
        'top-reviewers-modal',
        'admin-dashboard-modal'
    ];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && modal.style.display === 'flex') {
            console.log('🔧 Found open modal:', modalId, 'closing it...');
            modal.style.display = 'none';
        }
    });
    
    console.log('✅ Scrolling should be fixed now');
};

// Automatically fix scrolling every 5 seconds as a safety net
setInterval(() => {
    // Only fix if body overflow is hidden but no modals are actually visible
    if (document.body.style.overflow === 'hidden') {
        const modals = document.querySelectorAll('[id$="-modal"]');
        const visibleModals = Array.from(modals).filter(modal => 
            modal.style.display === 'flex' || modal.style.display === 'block'
        );
        
        if (visibleModals.length === 0) {
            console.log('🔧 Auto-fixing scroll - body was hidden but no modals visible');
            window.fixScrolling();
        }
    }
}, 5000);

// Add keyboard shortcut to fix scrolling (Escape key)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals and fix scrolling
        console.log('🔧 Escape pressed - fixing scrolling and closing modals');
        window.fixScrolling();
    }
});

// Ensure document has proper overflow on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Setting initial scroll settings');
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
});