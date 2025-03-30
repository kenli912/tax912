document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI and event listeners
    initUI();
    
    // Attach event listener to calculate button
    document.getElementById('calculateBtn').addEventListener('click', calculateTax);
    
    // Handle adding and removing dependent children
    document.getElementById('addChild').addEventListener('click', addChild);
    
    // Handle adding and removing dependent parents
    document.getElementById('addParent').addEventListener('click', addParent);
    
    // Calculate tax on initial load
    calculateTax();
});

// Initialize UI elements
function initUI() {
    // Add input event listeners to numerical inputs for formatting
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/^0+/, '');
            if (this.value === '') this.value = '0';
        });
    });
}

// Add a new child to the form
function addChild() {
    const childrenContainer = document.getElementById('childrenContainer');
    const childCount = childrenContainer.children.length + 1;
    
    if (childCount > 9) {
        alert('最多可添加9名子女');
        return;
    }

    const childItem = document.createElement('div');
    childItem.className = 'child-item grid grid-cols-12 gap-3 items-center';
    childItem.innerHTML = `
        <div class="col-span-8 md:col-span-5">
            <label class="text-sm font-medium text-gray-700">子女 ${childCount}</label>
        </div>
        <div class="col-span-4 md:col-span-5">
            <label class="inline-flex items-center">
                <input type="checkbox" class="form-checkbox text-black child-birth-year">
                <span class="ml-2 text-sm">出生年度</span>
            </label>
        </div>
        <div class="col-span-12 md:col-span-2 flex justify-end">
            <button type="button" class="remove-child text-sm text-red-600 hover:text-red-800">移除</button>
        </div>
    `;
    
    childrenContainer.appendChild(childItem);
    
    // Attach event listener to remove button
    childItem.querySelector('.remove-child').addEventListener('click', function() {
        childrenContainer.removeChild(childItem);
        // Renumber children
        const children = childrenContainer.querySelectorAll('.child-item');
        children.forEach((child, index) => {
            child.querySelector('label').textContent = `子女 ${index + 1}`;
        });
    });
}

// Add a new dependent parent to the form
function addParent() {
    const parentsContainer = document.getElementById('parentsContainer');
    const parentCount = parentsContainer.children.length + 1;
    
    if (parentCount > 4) {
        alert('最多可添加4名供養父母');
        return;
    }

    const parentItem = document.createElement('div');
    parentItem.className = 'parent-item grid grid-cols-12 gap-3 items-center';
    parentItem.innerHTML = `
        <div class="col-span-5">
            <label class="text-sm font-medium text-gray-700">供養父母 ${parentCount}</label>
        </div>
        <div class="col-span-5">
            <select class="form-select w-full text-sm rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black parent-age">
                <option value="over60">60歲或以上</option>
                <option value="55to59">55-59歲</option>
            </select>
        </div>
        <div class="col-span-2 flex justify-end">
            <button type="button" class="remove-parent text-sm text-red-600 hover:text-red-800">移除</button>
        </div>
        <div class="col-span-12">
            <label class="inline-flex items-center">
                <input type="checkbox" class="form-checkbox text-black parent-living-together">
                <span class="ml-2 text-sm">全年同住</span>
            </label>
        </div>
    `;
    
    parentsContainer.appendChild(parentItem);
    
    // Attach event listener to remove button
    parentItem.querySelector('.remove-parent').addEventListener('click', function() {
        parentsContainer.removeChild(parentItem);
        // Renumber parents
        const parents = parentsContainer.querySelectorAll('.parent-item');
        parents.forEach((parent, index) => {
            parent.querySelector('label').textContent = `供養父母 ${index + 1}`;
        });
    });
}

// Calculate tax based on current form values
function calculateTax() {
    // Gather basic income information
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value) || 0;
    const monthsWorked = parseFloat(document.getElementById('monthsWorked').value) || 12;
    const doublePay = parseFloat(document.getElementById('doublePay').value) || 0;
    const bonus = parseFloat(document.getElementById('bonus').value) || 0;
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;
    
    // Calculate total income
    const annualSalary = monthlyIncome * monthsWorked;
    const totalIncome = annualSalary + doublePay + bonus;
    
    // Determine marital status
    const maritalStatus = document.querySelector('input[name="maritalStatus"]:checked').value;
    
    // Count children and their allowances
    const children = document.querySelectorAll('.child-item');
    let childAllowance = 0;
    
    children.forEach(child => {
        // Basic child allowance
        childAllowance += 130000;
        
        // Additional allowance for birth year
        if (child.querySelector('.child-birth-year').checked) {
            childAllowance += 130000;
        }
    });
    
    // Count dependent parents and their allowances
    const parents = document.querySelectorAll('.parent-item');
    let parentAllowance = 0;
    
    parents.forEach(parent => {
        const age = parent.querySelector('.parent-age').value;
        const livingTogether = parent.querySelector('.parent-living-together').checked;
        
        // Basic allowance based on age
        if (age === 'over60') {
            parentAllowance += 50000;
            if (livingTogether) parentAllowance += 50000;
        } else {
            parentAllowance += 25000;
            if (livingTogether) parentAllowance += 25000;
        }
    });
    
    // Calculate basic allowance based on marital status
    const basicAllowance = maritalStatus === 'married' ? 264000 : 132000;
    
    // Calculate total allowances
    const totalAllowances = basicAllowance + childAllowance + parentAllowance;
    
    // Calculate net income and taxable income
    const netIncome = totalIncome - deductions;
    const taxableIncome = Math.max(0, netIncome - totalAllowances);
    
    // Calculate tax using both progressive and standard rates
    const progressiveTax = calculateProgressiveTax(taxableIncome);
    const standardTax = calculateStandardTax(netIncome);
    
    // Determine which tax calculation method to use
    const lowerTax = Math.min(progressiveTax, standardTax);
    const taxMethod = progressiveTax <= standardTax ? "累進稅率" : "標準稅率";
    
    // Apply tax reduction (100% up to $1,500)
    const taxReduction = Math.min(lowerTax, 1500);
    const finalTax = Math.max(0, lowerTax - taxReduction);
    
    // Update the UI with calculated values
    updateResults({
        totalIncome,
        deductions,
        netIncome,
        totalAllowances,
        taxableIncome,
        taxMethod,
        calculatedTax: lowerTax,
        taxReduction,
        finalTax
    });
}

// Update the results section of the UI
function updateResults(results) {
    document.getElementById('totalIncome').textContent = formatCurrency(results.totalIncome);
    document.getElementById('totalDeductions').textContent = formatCurrency(results.deductions);
    document.getElementById('netIncome').textContent = formatCurrency(results.netIncome);
    document.getElementById('totalAllowances').textContent = formatCurrency(results.totalAllowances);
    document.getElementById('taxableIncome').textContent = formatCurrency(results.taxableIncome);
    document.getElementById('taxMethod').textContent = results.taxMethod;
    document.getElementById('calculatedTax').textContent = formatCurrency(results.calculatedTax);
    document.getElementById('taxReduction').textContent = formatCurrency(results.taxReduction);
    document.getElementById('finalTax').textContent = formatCurrency(results.finalTax);
}

// Format currency amounts for display
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-HK');
}
