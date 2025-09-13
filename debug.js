// Debug script for RatingApp
console.log('Loading debug script...');

// Wait for app to load
function waitForApp() {
    return new Promise((resolve) => {
        const check = () => {
            if (window.debugRating && window.debugRating.app) {
                resolve(window.debugRating.app);
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

// Test all functionality
async function runFullTest() {
    console.log('=== STARTING FULL DEBUG TEST ===');
    
    try {
        const app = await waitForApp();
        console.log('✓ App loaded successfully');
        
        // Test 1: Check elements exist
        console.log('\n--- Test 1: DOM Elements ---');
        const elements = {
            'signin-btn': document.getElementById('signin-btn'),
            'signup-btn': document.getElementById('signup-btn'),
            'signin-email': document.getElementById('signin-email'),
            'signin-password': document.getElementById('signin-password'),
            'signup-name': document.getElementById('signup-name'),
            'signup-email': document.getElementById('signup-email'),
            'signup-password': document.getElementById('signup-password')
        };
        
        for (const [id, element] of Object.entries(elements)) {
            if (element) {
                console.log(`✓ ${id} found`);
            } else {
                console.error(`✗ ${id} NOT found`);
            }
        }
        
        // Test 2: Check localStorage
        console.log('\n--- Test 2: localStorage ---');
        const storageTest = app.testLocalStorage();
        console.log(`localStorage test: ${storageTest ? '✓ PASS' : '✗ FAIL'}`);
        
        // Test 3: Check users array
        console.log('\n--- Test 3: Users Data ---');
        console.log(`Users count: ${app.users.length}`);
        app.users.forEach((user, i) => {
            console.log(`User ${i + 1}: ${user.name} (${user.email})`);
        });
        
        // Test 4: Test sign-in function directly
        console.log('\n--- Test 4: Direct Function Test ---');
        
        // Fill in test credentials
        const emailInput = document.getElementById('signin-email');
        const passwordInput = document.getElementById('signin-password');
        
        if (emailInput && passwordInput) {
            emailInput.value = 'owner@preview.com';
            passwordInput.value = 'preview123';
            
            console.log('Test credentials filled in');
            console.log('Attempting direct sign-in...');
            
            try {
                app.signIn();
                console.log('✓ Direct sign-in function called');
            } catch (error) {
                console.error('✗ Direct sign-in failed:', error);
            }
        } else {
            console.error('✗ Could not find input fields');
        }
        
        // Test 5: Button click simulation
        console.log('\n--- Test 5: Button Click Simulation ---');
        const signinBtn = document.getElementById('signin-btn');
        if (signinBtn) {
            console.log('Simulating button click...');
            signinBtn.click();
            console.log('✓ Button click simulated');
        } else {
            console.error('✗ Sign-in button not found');
        }
        
        console.log('\n=== DEBUG TEST COMPLETE ===');
        
    } catch (error) {
        console.error('✗ Test failed:', error);
    }
}

// Auto-run test when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runFullTest, 1000);
    });
} else {
    setTimeout(runFullTest, 1000);
}

// Make test available globally
window.runFullTest = runFullTest;