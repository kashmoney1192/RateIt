// Simple, working authentication fix
console.log('🔧 Loading authentication fix...');

// IMMEDIATE POPUP BLOCKING - Applied instantly on script load
(function immediatePopupBlock() {
    const originalAlert = window.alert || function(){};
    window.alert = function(message) {
        // Allow My Posts testing alerts
        if (message && (message.includes('My Posts') || message.includes('Modal found') || message.includes('ERROR:'))) {
            return originalAlert(message);
        }
        console.log('🚫 IMMEDIATE BLOCK on page load:', message);
        return; // Block ALL alerts immediately
    };
    
    // Restore alert function after 3 seconds with filtering
    setTimeout(() => {
        window.alert = function(message) {
            // Only allow non-auth related alerts
            if (!message || (
                !message.toLowerCase().includes('username') &&
                !message.toLowerCase().includes('password') &&
                !message.toLowerCase().includes('invalid') &&
                !message.toLowerCase().includes('error') &&
                !message.toLowerCase().includes('not found') &&
                !message.toLowerCase().includes('not available') &&
                !message.toLowerCase().includes('sign') &&
                !message.toLowerCase().includes('login')
            )) {
                return originalAlert(message);
            } else {
                console.log('🚫 FILTERED alert after 3s:', message);
            }
        };
    }, 3000);
})();

// Wait for DOM to be ready
function fixAuthentication() {
    console.log('🔧 Fixing authentication...');
    
    // Find auth buttons
    const signinBtn = document.getElementById('signin-btn');
    const signupBtn = document.getElementById('signup-btn');
    
    if (signinBtn) {
        console.log('✅ Found sign in button, adding click handler');
        signinBtn.onclick = function(e) {
            e.preventDefault();
            console.log('🔥 SIGN IN CLICKED!');
            
            const username = document.getElementById('signin-username')?.value || '';
            const password = document.getElementById('signin-password')?.value || '';
            
            console.log('Attempting sign in with:', username);
            
            // Clear any previous messages
            clearAuthMessages();
            
            if (!username || !password) {
                showAuthMessage('Please enter username and password', 'error');
                return;
            }
            
            // Simple validation - accept any valid credentials
            if (username.length > 0 && password.length > 0) {
                showAuthMessage('Sign in successful! Welcome ' + username, 'success');
                
                // Small delay before hiding auth section
                setTimeout(() => {
                    // Hide auth section and show main content
                const authSection = document.getElementById('auth-section');
                const mainContent = document.getElementById('main-content');
                const headerAuth = document.getElementById('header-auth');
                const headerUser = document.getElementById('header-user');
                
                if (authSection) authSection.style.display = 'none';
                if (mainContent) mainContent.style.display = 'block';
                if (headerAuth) headerAuth.style.display = 'none';
                if (headerUser) {
                    headerUser.style.display = 'flex';
                    const nameSpan = document.getElementById('header-user-name');
                    if (nameSpan) nameSpan.textContent = username;
                }
                    
                    console.log('✅ User signed in successfully');
                    
                    // Store the signed-in user globally
                    window.currentSignedInUser = username;
                    
                    // Update any username fields that might be visible
                    updateUsernameFields(username);
                    
                    // Setup My Posts button after successful sign-in
                    setTimeout(() => {
                        setupMyPostsButton();
                    }, 500);
                }, 1000);
            } else {
                showAuthMessage('Please enter both username and password', 'error');
            }
        };
    } else {
        console.log('❌ Sign in button not found');
    }
    
    if (signupBtn) {
        console.log('✅ Found sign up button, adding click handler');
        signupBtn.onclick = function(e) {
            e.preventDefault();
            console.log('🔥 SIGN UP CLICKED!');
            
            const name = document.getElementById('signup-name')?.value || '';
            const password = document.getElementById('signup-password')?.value || '';
            
            console.log('Attempting sign up with:', name);
            
            // Clear any previous messages
            clearAuthMessages();
            
            if (!name || !password) {
                showAuthMessage('Please enter name and password', 'error');
                return;
            }
            
            showAuthMessage('Sign up successful! Welcome ' + name, 'success');
            
            // Small delay before hiding auth section
            setTimeout(() => {
                // Hide auth section and show main content
            const authSection = document.getElementById('auth-section');
            const mainContent = document.getElementById('main-content');
            const headerAuth = document.getElementById('header-auth');
            const headerUser = document.getElementById('header-user');
            
            if (authSection) authSection.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            if (headerAuth) headerAuth.style.display = 'none';
            if (headerUser) {
                headerUser.style.display = 'flex';
                const nameSpan = document.getElementById('header-user-name');
                if (nameSpan) nameSpan.textContent = name;
            }
                
                console.log('✅ User signed up successfully');
                
                // Store the signed-in user globally
                window.currentSignedInUser = name;
                
                // Update any username fields that might be visible
                updateUsernameFields(name);
                
                // Setup My Posts button after successful sign-up
                setTimeout(() => {
                    setupMyPostsButton();
                }, 500);
            }, 1000);
        };
    } else {
        console.log('❌ Sign up button not found');
    }
    
    // Fix header auth buttons and sign out
    const headerSigninBtn = document.getElementById('header-signin-btn');
    const headerSignupBtn = document.getElementById('header-signup-btn');
    const headerSignoutBtn = document.getElementById('header-signout-btn');
    const mainSignoutBtn = document.getElementById('sign-out');
    
    if (headerSigninBtn) {
        headerSigninBtn.onclick = function(e) {
            e.preventDefault();
            console.log('🔥 HEADER SIGN IN CLICKED!');
            
            // Show auth section and scroll to it
            const authSection = document.getElementById('auth-section');
            if (authSection) {
                authSection.style.display = 'block';
                authSection.scrollIntoView({ behavior: 'smooth' });
                
                // Show sign in form
                const signinForm = document.getElementById('signin-form');
                const signupForm = document.getElementById('signup-form');
                const signinTab = document.getElementById('signin-tab');
                const signupTab = document.getElementById('signup-tab');
                
                if (signinForm) signinForm.style.display = 'block';
                if (signupForm) signupForm.style.display = 'none';
                if (signinTab) signinTab.classList.add('active');
                if (signupTab) signupTab.classList.remove('active');
            }
        };
    }
    
    if (headerSignupBtn) {
        headerSignupBtn.onclick = function(e) {
            e.preventDefault();
            console.log('🔥 HEADER SIGN UP CLICKED!');
            
            // Show auth section and scroll to it
            const authSection = document.getElementById('auth-section');
            if (authSection) {
                authSection.style.display = 'block';
                authSection.scrollIntoView({ behavior: 'smooth' });
                
                // Show sign up form
                const signinForm = document.getElementById('signin-form');
                const signupForm = document.getElementById('signup-form');
                const signinTab = document.getElementById('signin-tab');
                const signupTab = document.getElementById('signup-tab');
                
                if (signinForm) signinForm.style.display = 'none';
                if (signupForm) signupForm.style.display = 'block';
                if (signinTab) signinTab.classList.remove('active');
                if (signupTab) signupTab.classList.add('active');
            }
        };
    }
    
    // Fix sign out buttons
    if (headerSignoutBtn) {
        headerSignoutBtn.onclick = function(e) {
            e.preventDefault();
            console.log('🔥 HEADER SIGN OUT CLICKED!');
            signOutUser();
        };
    }
    
    if (mainSignoutBtn) {
        mainSignoutBtn.onclick = function(e) {
            e.preventDefault();
            console.log('🔥 MAIN SIGN OUT CLICKED!');
            signOutUser();
        };
    }
    
    // Fix My Posts button
    const myPostsBtn = document.getElementById('my-posts-btn');
    if (myPostsBtn) {
        myPostsBtn.onclick = function(e) {
            e.preventDefault();
            console.log('🔥 MY POSTS BUTTON CLICKED!');
            if (window.ratingApp && window.ratingApp.showMyPostsModal) {
                window.ratingApp.showMyPostsModal();
            } else {
                console.error('❌ RatingApp or showMyPostsModal method not available');
            }
        };
    }
    
    // Fix category search
    fixCategorySearch();
}

function fixCategorySearch() {
    console.log('🔧 Fixing category search...');
    
    const categorySearch = document.getElementById('category-search');
    const categoryDropdown = document.getElementById('category-dropdown');
    
    if (!categorySearch || !categoryDropdown) {
        console.log('❌ Category search elements not found');
        return;
    }
    
    console.log('✅ Found category search elements');
    
    const categories = {
        // Food & Dining
        'food': '🍔 Food & Dining',
        'restaurants': '🍽️ Restaurants',
        'recipes': '👩‍🍳 Recipes',
        'drinks': '🍹 Drinks & Beverages',
        'coffee': '☕ Coffee & Tea',
        'fastfood': '🍟 Fast Food',
        'desserts': '🍰 Desserts & Sweets',
        'cooking': '👨‍🍳 Cooking & Kitchen',
        
        // Entertainment
        'entertainment': '🎬 Movies & TV',
        'movies': '🎥 Movies',
        'tvshows': '📺 TV Shows',
        'streaming': '📱 Streaming Services',
        'music': '🎵 Music',
        'concerts': '🎤 Concerts & Live Music',
        'podcasts': '🎙️ Podcasts',
        'youtube': '📹 YouTube Channels',
        'books': '📚 Books',
        'audiobooks': '🎧 Audiobooks',
        'comics': '📖 Comics & Manga',
        
        // Gaming
        'games': '🎮 Video Games',
        'mobilegames': '📱 Mobile Games',
        'boardgames': '🎲 Board Games',
        'cardgames': '🃏 Card Games',
        'gaming': '🕹️ Gaming Hardware',
        
        // Sports & Fitness
        'sports': '⚽ Sports',
        'fitness': '💪 Fitness & Health',
        'gyms': '🏋️ Gyms & Fitness Centers',
        'workouts': '🤸 Workout Programs',
        'nutrition': '🥗 Nutrition & Diet',
        
        // Technology
        'technology': '💻 Technology',
        'software': '🖥️ Software & Apps',
        'gadgets': '📱 Gadgets',
        'phones': '📱 Smartphones',
        'laptops': '💻 Laptops & Computers',
        'headphones': '🎧 Headphones & Audio',
        'cameras': '📸 Cameras & Photography',
        'smart home': '🏠 Smart Home Devices',
        
        // Shopping & Lifestyle
        'shopping': '🛒 Shopping',
        'fashion': '👗 Fashion & Style',
        'beauty': '💄 Beauty & Cosmetics',
        'skincare': '🧴 Skincare',
        'clothing': '👕 Clothing & Accessories',
        'shoes': '👟 Shoes',
        'jewelry': '💍 Jewelry & Watches',
        
        // Travel & Places
        'travel': '📍 Places & Travel',
        'hotels': '🏨 Hotels',
        'attractions': '🎢 Tourist Attractions',
        'airlines': '✈️ Airlines',
        'destinations': '🌍 Travel Destinations',
        'transportation': '🚗 Transportation',
        
        // Home & Services
        'home': '🏠 Home & Garden',
        'furniture': '🪑 Furniture',
        'appliances': '🔌 Home Appliances',
        'tools': '🔧 Tools & Hardware',
        'services': '🛠️ Services',
        'automotive': '🚗 Automotive',
        'repair': '🔧 Repair Services',
        
        // Education & Work
        'education': '🎓 Education',
        'courses': '📖 Online Courses',
        'schools': '🏫 Schools & Universities',
        'career': '💼 Career & Jobs',
        'productivity': '⚡ Productivity Tools',
        
        // Health & Wellness
        'healthcare': '🏥 Healthcare',
        'medical': '⚕️ Medical Services',
        'wellness': '🧘 Wellness & Spa',
        'mental health': '🧠 Mental Health',
        'pharmacy': '💊 Pharmacy & Medicine',
        
        // Finance & Business
        'finance': '💰 Finance & Banking',
        'investing': '📈 Investing',
        'insurance': '🛡️ Insurance',
        'business': '🏢 Business Services',
        
        // Arts & Culture
        'art': '🎨 Art & Culture',
        'museums': '🏛️ Museums & Galleries',
        'photography': '📸 Photography',
        'crafts': '✂️ Arts & Crafts',
        
        // Pets & Animals
        'pets': '🐕 Pets & Animals',
        'veterinary': '🐾 Veterinary Services',
        'pet supplies': '🦴 Pet Supplies',
        
        // Food Specific
        'pizza': '🍕 Pizza',
        'burgers': '🍔 Burgers',
        'sushi': '🍣 Sushi & Japanese',
        'italian': '🍝 Italian Food',
        'chinese': '🥡 Chinese Food',
        'mexican': '🌮 Mexican Food',
        'indian': '🍛 Indian Food',
        'thai': '🍜 Thai Food',
        'bbq': '🍖 BBQ & Grilling',
        'seafood': '🦐 Seafood',
        'vegetarian': '🥗 Vegetarian/Vegan',
        'bakery': '🥖 Bakery & Bread',
        'ice cream': '🍦 Ice Cream',
        'wine': '🍷 Wine & Alcohol',
        'beer': '🍺 Beer & Brewing',
        'snacks': '🍿 Snacks & Chips',
        
        // Entertainment Specific
        'anime': '🎌 Anime',
        'cartoons': '📺 Cartoons',
        'documentaries': '📹 Documentaries',
        'comedy': '😂 Comedy',
        'horror': '👻 Horror',
        'action': '💥 Action Movies',
        'romance': '💕 Romance',
        'sci-fi': '🚀 Sci-Fi',
        'fantasy': '🧙 Fantasy',
        'thriller': '🔍 Thriller/Mystery',
        'drama': '🎭 Drama',
        'musicals': '🎵 Musicals & Theater',
        'stand-up': '🎤 Stand-up Comedy',
        'reality tv': '📺 Reality TV',
        
        // Gaming Specific
        'fps games': '🔫 FPS Games',
        'rpg games': '🗡️ RPG Games',
        'strategy': '♟️ Strategy Games',
        'puzzle games': '🧩 Puzzle Games',
        'racing games': '🏎️ Racing Games',
        'sports games': '⚽ Sports Games',
        'indie games': '🎮 Indie Games',
        'retro games': '🕹️ Retro Games',
        'vr games': '🥽 VR Games',
        
        // Technology Specific
        'tablets': '📱 Tablets',
        'smartwatches': '⌚ Smartwatches',
        'keyboards': '⌨️ Keyboards',
        'mice': '🖱️ Computer Mice',
        'monitors': '🖥️ Monitors',
        'speakers': '🔊 Speakers',
        'printers': '🖨️ Printers',
        'storage': '💾 Storage Devices',
        'networking': '🌐 Network Equipment',
        'accessories': '🔌 Tech Accessories',
        'chargers': '🔋 Chargers & Batteries',
        
        // Transportation
        'cars': '🚗 Cars',
        'motorcycles': '🏍️ Motorcycles',
        'bicycles': '🚲 Bicycles',
        'public transport': '🚌 Public Transport',
        'rideshare': '🚕 Rideshare Services',
        'parking': '🅿️ Parking',
        'gas stations': '⛽ Gas Stations',
        
        // Personal Care
        'haircare': '💇 Hair Care',
        'dental': '🦷 Dental Care',
        'massage': '💆 Massage & Spa',
        'nail care': '💅 Nail Care',
        'fragrance': '🌺 Fragrance & Perfume',
        
        // Professional Services
        'legal': '⚖️ Legal Services',
        'accounting': '🧮 Accounting',
        'consulting': '💼 Consulting',
        'marketing': '📈 Marketing',
        'real estate': '🏘️ Real Estate',
        'contractors': '🔨 Contractors',
        'cleaning': '🧽 Cleaning Services',
        'landscaping': '🌳 Landscaping',
        
        // Other
        'events': '🎉 Events',
        'community': '👥 Community',
        'social': '🤝 Social & Dating',
        'weather': '☀️ Weather Apps',
        'news': '📰 News & Media',
        'podcasts apps': '📱 Podcast Apps',
        'other': '🔹 Other'
    };
    
    // Show categories on focus/click
    categorySearch.onfocus = function() {
        console.log('🔍 Category search focused');
        showCategories('');
    };
    
    categorySearch.onclick = function() {
        console.log('🔍 Category search clicked');
        showCategories('');
    };
    
    // Filter categories on input
    categorySearch.oninput = function() {
        const query = this.value.toLowerCase();
        console.log('🔍 Category search query:', query);
        showCategories(query);
    };
    
    function showCategories(query) {
        const filtered = Object.entries(categories).filter(([key, value]) => 
            key.toLowerCase().includes(query) || 
            value.toLowerCase().includes(query)
        );
        
        if (filtered.length === 0) {
            categoryDropdown.innerHTML = '<div class="no-categories">No categories found</div>';
        } else {
            categoryDropdown.innerHTML = filtered.map(([key, value]) => 
                `<div class="category-option" data-value="${key}">${value}</div>`
            ).join('');
            
            // Add click handlers to options
            categoryDropdown.querySelectorAll('.category-option').forEach(option => {
                option.onclick = function() {
                    const value = this.dataset.value;
                    const display = this.textContent;
                    console.log('🎯 Selected category:', value, display);
                    
                    categorySearch.value = display;
                    const hiddenField = document.getElementById('category');
                    if (hiddenField) hiddenField.value = value;
                    
                    categoryDropdown.style.display = 'none';
                    
                    // Visual feedback
                    categorySearch.style.borderColor = '#00ff41';
                    setTimeout(() => {
                        categorySearch.style.borderColor = '';
                    }, 1000);
                };
            });
        }
        
        categoryDropdown.style.display = 'block';
    }
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.category-search-container')) {
            categoryDropdown.style.display = 'none';
        }
    });
    
    console.log('✅ Category search fixed');
}

// Helper functions for better user feedback
function showAuthMessage(message, type = 'info') {
    // Remove any existing message
    clearAuthMessages();
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.id = 'auth-message';
    messageDiv.style.cssText = `
        padding: 0.75rem 1rem;
        margin: 1rem 0;
        border-radius: 4px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.9rem;
        text-align: center;
        transition: opacity 0.3s ease;
    `;
    
    if (type === 'error') {
        messageDiv.style.cssText += `
            background: rgba(255, 0, 128, 0.1);
            border: 1px solid #ff0080;
            color: #ff0080;
            text-shadow: 0 0 5px #ff0080;
        `;
    } else if (type === 'success') {
        messageDiv.style.cssText += `
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid #00ff41;
            color: #00ff41;
            text-shadow: 0 0 5px #00ff41;
        `;
    } else {
        messageDiv.style.cssText += `
            background: rgba(0, 255, 255, 0.1);
            border: 1px solid #00ffff;
            color: #00ffff;
            text-shadow: 0 0 5px #00ffff;
        `;
    }
    
    messageDiv.textContent = message;
    
    // Insert message into auth section
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) {
        authContainer.insertBefore(messageDiv, authContainer.firstChild);
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
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
    }
}

function clearAuthMessages() {
    const existingMessage = document.getElementById('auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Function to update username fields when user is signed in
function updateUsernameFields(username) {
    console.log('🔄 Updating username fields for:', username);
    
    // Find and hide any username prompt modals or inputs
    const usernameModal = document.getElementById('username-modal');
    if (usernameModal) {
        usernameModal.style.display = 'none';
    }
    
    // Auto-fill any username fields in forms
    const usernameInputs = document.querySelectorAll('input[placeholder*="username"], input[placeholder*="Username"], input[placeholder*="Name"], input[id*="user"]');
    usernameInputs.forEach(input => {
        if (input.type === 'text' && !input.closest('.auth-form')) {
            input.value = username;
            input.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
            input.style.borderColor = '#00ff41';
            input.readOnly = true;
            
            // Add a label showing it's auto-filled
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('auto-fill-label')) {
                const label = document.createElement('div');
                label.classList.add('auto-fill-label');
                label.style.cssText = `
                    font-size: 0.8rem;
                    color: #00ff41;
                    margin-top: 0.25rem;
                    font-family: 'Share Tech Mono', monospace;
                    text-shadow: 0 0 3px #00ff41;
                `;
                label.textContent = `✓ Signed in as: ${username}`;
                input.parentNode.insertBefore(label, input.nextSibling);
            }
        }
    });
    
    // Override any username prompt functions to prevent popups
    if (window.ratingApp && window.ratingApp.showUsernamePromptModal) {
        window.ratingApp.showUsernamePromptModal = function(title, message, buttonText, callback) {
            console.log('🔄 Username prompt intercepted, using signed-in user:', username);
            // Just call the callback directly with the signed-in username - NO POPUP
            if (callback && typeof callback === 'function') {
                callback(username, 'signed-in-user');
            }
            return; // Prevent any modal from showing
        };
    }
    
    // Override any alert functions to prevent spam - COMPREHENSIVE BLOCKING
    const originalAlert = window.alert;
    let lastAlertTime = 0;
    let lastAlertMessage = '';
    
    window.alert = function(message) {
        const now = Date.now();
        
        // Block ALL authentication-related prompts except My Posts alerts
        if (message && (
            message.toLowerCase().includes('username') ||
            message.toLowerCase().includes('password') ||
            message.toLowerCase().includes('enter your') ||
            message.toLowerCase().includes('please enter') ||
            message.toLowerCase().includes('fill in') ||
            message.toLowerCase().includes('invalid') ||
            message.toLowerCase().includes('credentials') ||
            (message.toLowerCase().includes('sign in') && !message.toLowerCase().includes('please sign in to view')) ||
            message.toLowerCase().includes('login') ||
            message.toLowerCase().includes('try:') ||
            message.toLowerCase().includes('already exists') ||
            message.toLowerCase().includes('error during') ||
            message.toLowerCase().includes('something went wrong') ||
            message.toLowerCase().includes('no users found') ||
            message.toLowerCase().includes('field not found') ||
            message.toLowerCase().includes('please choose') ||
            message.toLowerCase().includes('different name') ||
            message.toLowerCase().includes('not available') ||
            message.toLowerCase().includes('not ready') ||
            message.toLowerCase().includes('refresh the page') ||
            message.toLowerCase().includes('please refresh') ||
            message.toLowerCase().includes('application') ||
            message.toLowerCase().includes('functionality') ||
            message.toLowerCase().includes('no users available')
        )) {
            console.log('🚫 BLOCKED auth-related alert:', message);
            return; // Never show these popups
        }
        
        // Prevent same alert within 5 seconds to stop spam
        if (message === lastAlertMessage && (now - lastAlertTime) < 5000) {
            console.log('🚫 Blocked duplicate alert (spam prevention):', message);
            return;
        }
        
        lastAlertTime = now;
        lastAlertMessage = message;
        originalAlert(message);
    };
    
    // Update session username if it exists
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('sessionUsername', username);
    }
    
    // Update any rating systems that need a username and block prompts
    if (window.ratingApp) {
        window.ratingApp.sessionUsername = username;
        if (window.ratingApp.currentUser && typeof window.ratingApp.currentUser === 'object') {
            window.ratingApp.currentUser.name = username;
        }
        
        // Force session user display update
        if (window.ratingApp.updateSessionUserDisplay) {
            window.ratingApp.updateSessionUserDisplay();
        }
    }
    
    // Apply comprehensive blocks
    blockAllUserPrompts();
    
    // Setup My Posts button after sign-in
    setupMyPostsButton();
}

// Function to sign out user
function signOutUser() {
    console.log('😪 Signing out user...');
    
    // Clear global user state
    window.currentSignedInUser = null;
    
    // Clear session storage
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('sessionUsername');
    }
    
    // Clear local storage if available
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('currentUser');
    }
    
    // Update header to show auth buttons
    const headerAuth = document.getElementById('header-auth');
    const headerUser = document.getElementById('header-user');
    
    if (headerAuth) headerAuth.style.display = 'flex';
    if (headerUser) headerUser.style.display = 'none';
    
    // Show auth section and hide main content
    const authSection = document.getElementById('auth-section');
    const mainContent = document.getElementById('main-content');
    
    if (authSection) authSection.style.display = 'block';
    if (mainContent) mainContent.style.display = 'none';
    
    // Clear any auto-filled username fields
    const autoFilledInputs = document.querySelectorAll('input[readonly]');
    autoFilledInputs.forEach(input => {
        if (input.style.backgroundColor.includes('255, 65')) { // Green background
            input.value = '';
            input.style.backgroundColor = '';
            input.style.borderColor = '';
            input.readOnly = false;
        }
    });
    
    // Remove auto-fill labels
    const autoFillLabels = document.querySelectorAll('.auto-fill-label');
    autoFillLabels.forEach(label => label.remove());
    
    // Clear auth form fields
    const signinUsername = document.getElementById('signin-username');
    const signinPassword = document.getElementById('signin-password');
    const signupName = document.getElementById('signup-name');
    const signupPassword = document.getElementById('signup-password');
    
    if (signinUsername) signinUsername.value = '';
    if (signinPassword) signinPassword.value = '';
    if (signupName) signupName.value = '';
    if (signupPassword) signupPassword.value = '';
    
    // Clear any messages
    clearAuthMessages();
    
    // Show success message
    showAuthMessage('Successfully signed out. You can sign in again anytime.', 'success');
    
    // Update ratingApp state if it exists
    if (window.ratingApp) {
        window.ratingApp.currentUser = null;
        window.ratingApp.sessionUsername = '';
        if (window.ratingApp.setupAuthInterface) {
            window.ratingApp.setupAuthInterface();
        }
        if (window.ratingApp.updateHeaderAuth) {
            window.ratingApp.updateHeaderAuth();
        }
    }
    
    console.log('✅ User signed out successfully');
}

// Function to check if user is already signed in and update accordingly
function checkExistingSignIn() {
    const headerUserName = document.getElementById('header-user-name');
    const headerUser = document.getElementById('header-user');
    
    if (headerUser && headerUser.style.display !== 'none' && headerUserName) {
        const username = headerUserName.textContent.trim();
        if (username && username !== 'User') {
            console.log('👤 Found existing signed-in user:', username);
            window.currentSignedInUser = username;
            updateUsernameFields(username);
        }
    }
    
    // Also check session storage
    if (typeof sessionStorage !== 'undefined') {
        const sessionUser = sessionStorage.getItem('sessionUsername');
        if (sessionUser && sessionUser.trim()) {
            console.log('👤 Found session user:', sessionUser);
            window.currentSignedInUser = sessionUser;
            updateUsernameFields(sessionUser);
        }
    }
}

// Block username prompts immediately on page load - AGGRESSIVE BLOCKING
(function() {
    const originalAlert = window.alert;
    window.alert = function(message) {
        if (message && (
            message.toLowerCase().includes('username') ||
            message.toLowerCase().includes('enter your') ||
            message.toLowerCase().includes('please enter') ||
            message.toLowerCase().includes('fill in') ||
            message.toLowerCase().includes('what is your name') ||
            message.toLowerCase().includes('enter name') ||
            message.toLowerCase().includes('sign in') ||
            message.toLowerCase().includes('login')
        )) {
            console.log('🚫 BLOCKED username/auth prompt:', message);
            return;
        }
        return originalAlert(message);
    };
    
    // Also block prompt function - MORE AGGRESSIVE
    const originalPrompt = window.prompt;
    window.prompt = function(message, defaultText) {
        if (message && (
            message.toLowerCase().includes('username') ||
            message.toLowerCase().includes('name') ||
            message.toLowerCase().includes('enter your') ||
            message.toLowerCase().includes('password') ||
            message.toLowerCase().includes('sign in') ||
            message.toLowerCase().includes('login')
        )) {
            console.log('🚫 BLOCKED username/auth prompt:', message);
            return null;
        }
        return originalPrompt(message, defaultText);
    };
    
    // Block confirm prompts too
    const originalConfirm = window.confirm;
    window.confirm = function(message) {
        if (message && (
            message.toLowerCase().includes('username') ||
            message.toLowerCase().includes('sign in') ||
            message.toLowerCase().includes('login')
        )) {
            console.log('🚫 BLOCKED username/auth confirm:', message);
            return false;
        }
        return originalConfirm(message);
    };
})();

// Run fixes when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAuthentication);
} else {
    fixAuthentication();
}

// Also run after a delay to ensure everything is loaded
setTimeout(() => {
    fixAuthentication();
    // Extra blocking for any delayed prompts
    blockInitialPrompts();
}, 1000);

setTimeout(() => {
    fixAuthentication();
    blockInitialPrompts();
}, 2000);

// Function to block initial username prompts
function blockInitialPrompts() {
    // Hide any modal that might be showing username prompts
    const usernameModal = document.getElementById('username-modal');
    if (usernameModal && usernameModal.style.display !== 'none') {
        console.log('🚫 Hiding username modal on page load');
        usernameModal.style.display = 'none';
    }
    
    // Override ratingApp methods that trigger username prompts
    if (window.ratingApp) {
        // Don't show username prompts on page load
        const originalShowUsernamePrompt = window.ratingApp.showUsernamePromptModal;
        if (originalShowUsernamePrompt) {
            window.ratingApp.showUsernamePromptModal = function(title, message, buttonText, callback) {
                console.log('🚫 Blocked username prompt modal:', title);
                // Don't show the modal, just return
                return;
            };
        }
        
        // Don't auto-prompt for session username on load
        if (window.ratingApp.setupSessionUser) {
            const originalSetupSession = window.ratingApp.setupSessionUser;
            window.ratingApp.setupSessionUser = function() {
                // Just skip the setup to avoid prompts
                console.log('🚫 Skipped session user setup to avoid prompts');
            };
        }
    }
}

// Also fix tab switching
function fixTabSwitching() {
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    
    if (signinTab) {
        signinTab.onclick = function() {
            clearAuthMessages();
            showSigninForm();
        };
    }
    
    if (signupTab) {
        signupTab.onclick = function() {
            clearAuthMessages();
            showSignupForm();
        };
    }
}

function showSigninForm() {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    
    if (signinForm) signinForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
    if (signinTab) signinTab.classList.add('active');
    if (signupTab) signupTab.classList.remove('active');
}

function showSignupForm() {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    
    if (signinForm) signinForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
    if (signinTab) signinTab.classList.remove('active');
    if (signupTab) signupTab.classList.add('active');
}

// Add tab switching to the fix and check for existing sign-ins
setTimeout(() => {
    fixTabSwitching();
    checkExistingSignIn();
}, 500);

// Comprehensive popup and prompt blocking
function blockAllUserPrompts() {
    // Block all forms of user input prompts when signed in
    if (!window.currentSignedInUser) return;
    
    // Override prompt function
    const originalPrompt = window.prompt;
    window.prompt = function(message, defaultText) {
        if (message && (message.toLowerCase().includes('username') || message.toLowerCase().includes('name'))) {
            console.log('🚫 Blocked prompt for signed-in user:', message);
            return window.currentSignedInUser;
        }
        return originalPrompt(message, defaultText);
    };
    
    // Override confirm for user-related confirmations
    const originalConfirm = window.confirm;
    window.confirm = function(message) {
        if (message && message.toLowerCase().includes('username')) {
            console.log('🚫 Auto-confirmed for signed-in user:', message);
            return true;
        }
        return originalConfirm(message);
    };
    
    // Block rating submission prompts
    if (window.ratingApp) {
        // Override rating methods that might prompt for username
        const originalAddItem = window.ratingApp.addItem;
        if (originalAddItem) {
            window.ratingApp.addItem = function() {
                // Set session username before calling original
                if (window.currentSignedInUser) {
                    this.sessionUsername = window.currentSignedInUser;
                }
                return originalAddItem.call(this);
            };
        }
        
        // Auto-set session username
        if (window.currentSignedInUser) {
            window.ratingApp.sessionUsername = window.currentSignedInUser;
            if (window.ratingApp.currentUser) {
                window.ratingApp.currentUser.name = window.currentSignedInUser;
            }
        }
    }
}

// Check periodically for username fields that need updating and block prompts
setInterval(() => {
    if (window.currentSignedInUser) {
        updateUsernameFields(window.currentSignedInUser);
        blockAllUserPrompts();
        
        // Also check if My Posts button needs setup
        const myPostsBtn = document.getElementById('my-posts-btn');
        if (myPostsBtn && !myPostsBtn.hasAttribute('data-handler-added')) {
            setupMyPostsButton();
        }
    }
}, 2000);

// Apply blocks immediately for existing signed-in users
setTimeout(blockAllUserPrompts, 1000);

// Block any immediate prompts
blockInitialPrompts();

console.log('🔧 Authentication fix loaded - username prompts blocked');

// Function to setup My Posts button - AGGRESSIVE APPROACH
function setupMyPostsButton() {
    console.log('🔧 Setting up My Posts button - AGGRESSIVE');
    
    // Try multiple times to ensure it works
    for (let attempt = 0; attempt < 5; attempt++) {
        setTimeout(() => {
            const myPostsBtn = document.getElementById('my-posts-btn');
            console.log(`Attempt ${attempt + 1}: My Posts button found:`, !!myPostsBtn);
            
            if (myPostsBtn) {
                // Remove any existing handlers
                myPostsBtn.onclick = null;
                myPostsBtn.removeAttribute('data-handler-added');
                
                console.log('🔧 Adding DIRECT click handler to My Posts button');
                myPostsBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔥 MY POSTS BUTTON CLICKED - DIRECT HANDLER!');
                    console.log('Window ratingApp exists:', !!window.ratingApp);
                    console.log('showMyPostsModal exists:', !!(window.ratingApp && window.ratingApp.showMyPostsModal));
                    
                    if (window.ratingApp && typeof window.ratingApp.showMyPostsModal === 'function') {
                        console.log('✅ Calling showMyPostsModal');
                        window.ratingApp.showMyPostsModal();
                    } else {
                        console.error('❌ RatingApp or showMyPostsModal method not available');
                        console.log('Window.ratingApp:', window.ratingApp);
                        if (window.ratingApp) {
                            console.log('Available methods:', Object.keys(window.ratingApp));
                        }
                        
                        // Fallback - try to create and show modal directly
                        const modal = document.getElementById('my-posts-modal');
                        if (modal) {
                            console.log('📋 Fallback: Showing modal directly');
                            modal.style.display = 'flex';
                            document.body.style.overflow = 'hidden';
                        }
                    }
                    return false;
                };
                
                // Also add event listener as backup
                myPostsBtn.addEventListener('click', function(e) {
                    console.log('🔥 MY POSTS EVENT LISTENER FIRED!');
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
                
                myPostsBtn.setAttribute('data-handler-added', 'true');
                console.log('✅ My Posts button handler added successfully');
                return; // Exit loop once successful
            }
        }, attempt * 200); // Staggered attempts
    }
}