// Initialize with empty data structures
if (!window.virtualAlarmTestResults) window.virtualAlarmTestResults = {
    virtualAlarmTests: {}
};

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved test results if available
    const savedResults = localStorage.getItem('virtualAlarmTestResults');
    if (savedResults) {
        window.virtualAlarmTestResults = JSON.parse(savedResults);
    }

    // Generate rows for virtual alarm tests
    generateVirtualAlarmTestRows();

    // Load any saved data
    loadVirtualAlarmTestData();
});

// Function to generate rows for Virtual Alarm Test
function generateVirtualAlarmTestRows() {
    const tbody = document.getElementById('VirtualAlarmTestTbody');
    if (!tbody) return;

    // Virtual Alarm Test items
    const virtualAlarmTests = [
        {
            alarm: "SOE Buffer Full",
            iec101IOA: "950",
            iec104IOA: "950",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "Time Sync Alarm",
            iec101IOA: "951",
            iec104IOA: "951",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "RTU Health/Comm Fail",
            iec101IOA: "953",
            iec104IOA: "953",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "DI Module Fail",
            iec101IOA: "954",
            iec104IOA: "954",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "DO Module Fail",
            iec101IOA: "955",
            iec104IOA: "955",
            editable: true,
            defaultIEC101Checked: true,
            defaultIEC104Checked: true
        },
        {
            alarm: "AI Module Fail",
            iec101IOA: "956",
            iec104IOA: "956",
            editable: true,
            defaultIEC101Checked: false,
            defaultIEC104Checked: false
        },
        {
            alarm: "AO Module Fail",
            iec101IOA: "957",
            iec104IOA: "957",
            editable: true,
            defaultIEC101Checked: false,  // Both unchecked for AO Module Fail
            defaultIEC104Checked: false   // Both unchecked for AO Module Fail
        }
    ];

    virtualAlarmTests.forEach((item, index) => {
        const rowNumber = index + 1;
        const row = document.createElement('tr');
        
        // Create input fields for editable IOAs or static text for non-editable
        const iec101IOACell = item.editable 
            ? `<td style="text-align: center;"><input type="number" name="virtualAlarm_${rowNumber}_iec101IOA" value="${item.iec101IOA}" min="0" style="width: 60px;"></td>`
            : `<td style="text-align: center;">${item.iec101IOA}</td>`;
            
        const iec104IOACell = item.editable 
            ? `<td style="text-align: center;"><input type="number" name="virtualAlarm_${rowNumber}_iec104IOA" value="${item.iec104IOA}" min="0" style="width: 60px;"></td>`
            : `<td style="text-align: center;">${item.iec104IOA}</td>`;

        // Use the default checked values from the item configuration
        const iec101Checked = '';  // Always empty (unchecked)
        const iec104Checked = '';  // Always empty (unchecked)

        row.innerHTML = `
            <td style="text-align: left;">${item.alarm}</td>
            ${iec101IOACell}
            <td style="text-align: center;">
                <label class="toggle-button">
                    <input type="checkbox" name="virtualAlarm_${rowNumber}_iec101" ${iec101Checked}>
                    <span class="toggle-text"></span>
                </label>
            </td>
            ${iec104IOACell}
            <td style="text-align: center;">
                <label class="toggle-button">
                    <input type="checkbox" name="virtualAlarm_${rowNumber}_iec104" ${iec104Checked}>
                    <span class="toggle-text"></span>
                </label>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Save virtual alarm test data
function saveVirtualAlarmTestData() {
    // Ensure the test results object has the proper structure
    window.virtualAlarmTestResults = window.virtualAlarmTestResults || {};
    window.virtualAlarmTestResults.virtualAlarmTests = window.virtualAlarmTestResults.virtualAlarmTests || {};

    // Save Virtual Alarm Test results
    for (let itemNum = 1; itemNum <= 7; itemNum++) {
        const iec101Checked = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101"]`)?.checked || false;
        const iec104Checked = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104"]`)?.checked || false;
        
        // Get IOA values if they exist (for editable fields)
        const iec101IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101IOA"]`);
        const iec104IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104IOA"]`);
        
        const iec101IOA = iec101IOAInput ? iec101IOAInput.value : null;
        const iec104IOA = iec104IOAInput ? iec104IOAInput.value : null;

        window.virtualAlarmTestResults.virtualAlarmTests[`item_${itemNum}`] = {
            iec101: iec101Checked ? 'OK' : 'NO',
            iec104: iec104Checked ? 'OK' : 'NO',
            iec101IOA: iec101IOA,
            iec104IOA: iec104IOA
        };
    }

    // Save to session storage
    localStorage.setItem('virtualAlarmTestResults', JSON.stringify(window.virtualAlarmTestResults));
}

// Load virtual alarm test data
function loadVirtualAlarmTestData() {
    // Ensure we have a valid virtualAlarmTestResults object with the expected structure
    window.virtualAlarmTestResults = window.virtualAlarmTestResults || {};
    window.virtualAlarmTestResults.virtualAlarmTests = window.virtualAlarmTestResults.virtualAlarmTests || {};

    // Load Virtual Alarm Test results
    for (let itemNum = 1; itemNum <= 7; itemNum++) {
        const testResult = window.virtualAlarmTestResults.virtualAlarmTests[`item_${itemNum}`];
        
        // Set IEC101 checkbox
        const iec101Checkbox = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101"]`);
        if (iec101Checkbox && testResult) {
            iec101Checkbox.checked = testResult.iec101 === 'OK';
        }
        
        // Set IEC104 checkbox
        const iec104Checkbox = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104"]`);
        if (iec104Checkbox && testResult) {
            iec104Checkbox.checked = testResult.iec104 === 'OK';
        }
        
        // Set IEC101 IOA value
        const iec101IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101IOA"]`);
        if (iec101IOAInput) {
            if (testResult && testResult.iec101IOA !== undefined && testResult.iec101IOA !== null) {
                // Load saved value (including empty string)
                iec101IOAInput.value = testResult.iec101IOA;
            } 
        }
        
        // Set IEC104 IOA value
        const iec104IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104IOA"]`);
        if (iec104IOAInput) {
            if (testResult && testResult.iec104IOA !== undefined && testResult.iec104IOA !== null) {
                // Load saved value (including empty string)
                iec104IOAInput.value = testResult.iec104IOA;
            } 
        }
    }
}

// Navigation functions
window.goToPreviousPage = function() {
    // Save the current test data
    saveVirtualAlarmTestData();
    window.location.href = 'FunctionalityAIPage.html'; // Update with actual previous page
};

function handleVirtualAlarmTestSubmission() {
    // First validate the form
    if (!validateVirtualAlarmTests()) {
        return; // Stop navigation if validation fails
    }

    // Validate IOA index fields for IEC101 and IEC104
    if (!validateVirtualAlarmIOAIndexFields()) {
        return; // Stop if validation fails
    }
    
    // Save the current test data
    saveVirtualAlarmTestData();
    navigationGuard.markPageAsCompleted();
    window.location.href = 'ChannelRedundacyTest.html'; // Update with actual next page
};

function SelectAll() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function clearAll() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function validateVirtualAlarmTests() {
    let isValid = true;
    let errors = [];
    
    // Get module counts from localStorage (saved from BQ page)
    const diModulesToTest = parseInt(localStorage.getItem('diModulesToTest')) || 0;
    const doModulesToTest = parseInt(localStorage.getItem('doModulesToTest')) || 0;
    const aiModulesToTest = parseInt(localStorage.getItem('aiModulesToTest')) || 0;
    const aoModulesToTest = parseInt(localStorage.getItem('aoModulesToTest')) || 0;
    
    // Reset all error styles first
    const allIOAInputs = document.querySelectorAll('input[type="number"]');
    allIOAInputs.forEach(input => {
        input.style.border = '';
    });

    // Define which items are always required (must have IOA values)
    const alwaysRequiredItems = [1, 2, 3]; // SOE Buffer Full, Time Sync Alarm, RTU Health/Comm Fail
    
    // Define conditional items based on BQ
    const conditionalItems = [
        { itemNum: 4, required: diModulesToTest > 0, name: "DI Module Fail" },      // DI Module Fail
        { itemNum: 5, required: doModulesToTest > 0, name: "DO Module Fail" },      // DO Module Fail
        { itemNum: 6, required: aiModulesToTest > 0, name: "AI Module Fail" },      // AI Module Fail
        { itemNum: 7, required: aoModulesToTest > 0, name: "AO Module Fail" }       // AO Module Fail
    ];

    // Check each test item (1-7)
    for (let itemNum = 1; itemNum <= 7; itemNum++) {
        const iec101IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec101IOA"]`);
        const iec104IOAInput = document.querySelector(`input[name="virtualAlarm_${itemNum}_iec104IOA"]`);
        
        // Get alarm name for error messages
        const row = iec101IOAInput ? iec101IOAInput.closest('tr') : 
                    iec104IOAInput ? iec104IOAInput.closest('tr') : null;
        const alarmName = row ? row.querySelector('td:first-child').textContent.trim() : `Alarm ${itemNum}`;

        // Determine if this item should be validated
        let shouldValidate = false;
        
        if (alwaysRequiredItems.includes(itemNum)) {
            shouldValidate = true;
        } else {
            const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
            if (conditionalItem && conditionalItem.required) {
                shouldValidate = true;
            }
        }

        if (!shouldValidate) continue;

        // Validate IEC101 IOA field
        if (iec101IOAInput) {
            const hasValue = iec101IOAInput.value.trim() !== "";
            if (!hasValue) {
                iec101IOAInput.style.border = '2px solid red';
                errors.push(`IEC101 ${alarmName}: IOA value is required`);
                isValid = false;
            }
        }
        
        // Validate IEC104 IOA field
        if (iec104IOAInput) {
            const hasValue = iec104IOAInput.value.trim() !== "";
            if (!hasValue) {
                iec104IOAInput.style.border = '2px solid red';
                errors.push(`IEC104 ${alarmName}: IOA value is required`);
                isValid = false;
            }
        }
    }
    
    if (!isValid) {
        alert('Validation failed - IOA values required:\n\n' + errors.join('\n'));
    }
    
    return isValid;
}

function validateVirtualAlarmIOAIndexFields() {
    // Get module counts from localStorage (saved from BQ page)
    const diModulesToTest = parseInt(localStorage.getItem('diModulesToTest')) || 0;
    const doModulesToTest = parseInt(localStorage.getItem('doModulesToTest')) || 0;
    const aiModulesToTest = parseInt(localStorage.getItem('aiModulesToTest')) || 0;
    const aoModulesToTest = parseInt(localStorage.getItem('aoModulesToTest')) || 0;
    
    // Get all IEC101 and IEC104 input fields
    const iec101Inputs = document.querySelectorAll('input[name*="iec101IOA"]');
    const iec104Inputs = document.querySelectorAll('input[name*="iec104IOA"]');
    
    let isValid = true;
    let emptyFields = [];
    let duplicateFields = [];

    // Define which items are always required
    const alwaysRequiredItems = [1, 2, 3]; // SOE Buffer Full, Time Sync Alarm, RTU Health/Comm Fail
    
    // Define conditional items
    const conditionalItems = [
        { itemNum: 4, required: diModulesToTest > 0 }, // DI Module Fail
        { itemNum: 5, required: doModulesToTest > 0 }, // DO Module Fail
        { itemNum: 6, required: aiModulesToTest > 0 }, // AI Module Fail
        { itemNum: 7, required: aoModulesToTest > 0 }  // AO Module Fail
    ];

    // Reset previous red borders
    [...iec101Inputs, ...iec104Inputs].forEach(input => {
        input.style.border = ''; // clear border
    });

    // 1. Check IEC101 fields - only check that they have values for required items
    iec101Inputs.forEach(input => {
        const inputName = input.name;
        const itemNumMatch = inputName.match(/virtualAlarm_(\d+)_iec101IOA/);
        if (!itemNumMatch) return;
        
        const itemNum = parseInt(itemNumMatch[1]);
        const hasValue = input.value.trim() !== "";

        // Determine if this item should be validated
        let shouldValidate = false;
        
        if (alwaysRequiredItems.includes(itemNum)) {
            shouldValidate = true;
            
            // For always required items, they MUST have a value
            if (!hasValue) {
                input.style.border = '2px solid red';
                isValid = false;
                const alarmName = getAlarmNameFromInput(input);
                emptyFields.push(`IEC101 ${alarmName}: IOA value is required`);
            }
        } else {
            const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
            if (conditionalItem && conditionalItem.required) {
                shouldValidate = true;
                
                // For conditional required items, they MUST have a value
                if (!hasValue) {
                    input.style.border = '2px solid red';
                    isValid = false;
                    const alarmName = getAlarmNameFromInput(input);
                    emptyFields.push(`IEC101 ${alarmName}: IOA value is required (${conditionalItem.required ? 'module exists' : ''})`);
                }
            }
        }
    });
    
    // 2. Check IEC104 fields - only check that they have values for required items
    iec104Inputs.forEach(input => {
        const inputName = input.name;
        const itemNumMatch = inputName.match(/virtualAlarm_(\d+)_iec104IOA/);
        if (!itemNumMatch) return;
        
        const itemNum = parseInt(itemNumMatch[1]);
        const hasValue = input.value.trim() !== "";

        // Determine if this item should be validated
        let shouldValidate = false;
        
        if (alwaysRequiredItems.includes(itemNum)) {
            shouldValidate = true;
            
            // For always required items, they MUST have a value
            if (!hasValue) {
                input.style.border = '2px solid red';
                isValid = false;
                const alarmName = getAlarmNameFromInput(input);
                emptyFields.push(`IEC104 ${alarmName}: IOA value is required`);
            }
        } else {
            const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
            if (conditionalItem && conditionalItem.required) {
                shouldValidate = true;
                
                // For conditional required items, they MUST have a value
                if (!hasValue) {
                    input.style.border = '2px solid red';
                    isValid = false;
                    const alarmName = getAlarmNameFromInput(input);
                    emptyFields.push(`IEC104 ${alarmName}: IOA value is required`);
                }
            }
        }
    });

    if (!isValid) {
        alert(`Validation failed - IOA values required:\n\n${emptyFields.join('\n')}`);
        return false;
    }

    // 3. Check for duplicate values in IEC101 column (only for required items that have values)
    const iec101ActiveInputs = Array.from(iec101Inputs).filter(input => {
        const itemNumMatch = input.name.match(/virtualAlarm_(\d+)_iec101IOA/);
        if (!itemNumMatch) return false;
        
        const itemNum = parseInt(itemNumMatch[1]);
        
        // Only include if item should be validated and has a value
        if (input.value.trim() === "") return false;
        
        if (alwaysRequiredItems.includes(itemNum)) return true;
        
        const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
        return conditionalItem && conditionalItem.required;
    });

    const iec101Values = iec101ActiveInputs.map(input => input.value.trim());
    const iec101Duplicates = findDuplicates(iec101Values);

    if (iec101Duplicates.length > 0) {
        isValid = false;
        iec101ActiveInputs.forEach(input => {
            if (iec101Duplicates.includes(input.value.trim())) {
                input.style.border = '2px solid red';
            }
        });
        duplicateFields.push(`IEC101: Duplicate values found (${iec101Duplicates.join(', ')})`);
    }

    // 4. Check for duplicate values in IEC104 column (only for required items that have values)
    const iec104ActiveInputs = Array.from(iec104Inputs).filter(input => {
        const itemNumMatch = input.name.match(/virtualAlarm_(\d+)_iec104IOA/);
        if (!itemNumMatch) return false;
        
        const itemNum = parseInt(itemNumMatch[1]);
        
        // Only include if item should be validated and has a value
        if (input.value.trim() === "") return false;
        
        if (alwaysRequiredItems.includes(itemNum)) return true;
        
        const conditionalItem = conditionalItems.find(item => item.itemNum === itemNum);
        return conditionalItem && conditionalItem.required;
    });

    const iec104Values = iec104ActiveInputs.map(input => input.value.trim());
    const iec104Duplicates = findDuplicates(iec104Values);

    if (iec104Duplicates.length > 0) {
        isValid = false;
        iec104ActiveInputs.forEach(input => {
            if (iec104Duplicates.includes(input.value.trim())) {
                input.style.border = '2px solid red';
            }
        });
        duplicateFields.push(`IEC104: Duplicate values found (${iec104Duplicates.join(', ')})`);
    }

    if (duplicateFields.length > 0) {
        alert(`Duplicate IOA index values found:\n${duplicateFields.join('\n')}\n\n`);
        return false;
    }

    return true;
}

// Helper function to get alarm name from input element
function getAlarmNameFromInput(input) {
    const row = input.closest('tr');
    if (row) {
        return row.querySelector('td:first-child').textContent.trim();
    }
    return 'Unknown';
}


// Helper function to find duplicate values in an array
function findDuplicates(arr) {
    const duplicates = [];
    const seen = {};
    
    arr.forEach(value => {
        if (seen[value]) {
            if (!duplicates.includes(value)) {
                duplicates.push(value);
            }
        } else {
            seen[value] = true;
        }
    });
    
    return duplicates;
}