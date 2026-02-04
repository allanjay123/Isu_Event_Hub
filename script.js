// --- SECURITY CHECK ---
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// --- CORE DASHBOARD FUNCTIONS ---
function toggleMenu() { document.getElementById('sidebar').classList.toggle('active'); }
setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);

window.onload = function() {
    if(localStorage.getItem('adminName')) document.getElementById('admin-name').innerText = localStorage.getItem('adminName');
    if(localStorage.getItem('adminPic')) document.getElementById('logo-preview').src = localStorage.getItem('adminPic');
    if(localStorage.getItem('darkMode') === 'true') applyDarkMode(true);
    
    loadHotlines(); 
    loadShouts(); 
    renderChart();
};

// --- DARK MODE & LANGUAGE ---
function toggleDarkMode() {
    const isDark = !document.body.classList.contains('dark-mode');
    applyDarkMode(isDark);
    localStorage.setItem('darkMode', isDark);
}

function applyDarkMode(isDark) {
    const icon = document.getElementById('dm-icon');
    const text = document.getElementById('dm-text');
    if(isDark) {
        document.body.classList.add('dark-mode');
        icon.className = 'fas fa-sun';
        text.innerText = "Light Mode";
    } else {
        document.body.classList.remove('dark-mode');
        icon.className = 'fas fa-moon';
        text.innerText = "Dark Mode";
    }
}

let isTagalog = false;
function changeLanguage() {
    isTagalog = !isTagalog;
    const langText = document.getElementById('lang-text');
    langText.innerText = isTagalog ? "Switch to English" : "Change Language";
    document.getElementById('nav-title').innerText = isTagalog ? "SISTEMA NG EVENT SA ISU" : "ISU ONLINE EVENT SYSTEM";
    document.getElementById('title-standings').innerHTML = `<i class="fas fa-chart-line"></i> ${isTagalog ? 'Kasalukuyang Iskor' : 'Live Department Standings'}`;
    document.getElementById('title-wall').innerHTML = `<i class="fas fa-comment-dots"></i> ${isTagalog ? 'Saloobin' : 'Freedom Wall'}`;
}

function showSystemInfo() {
    alert("🌟 ISU EVENT HUB\nVersion: 1.0.4\nStatus: Secure Connection Active");
}

// --- CHART & DATA ---
function renderChart() {
    const ctx = document.getElementById('pointsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['CCSICT', 'CTE', 'CBA', 'CAES', 'CCJE'],
            datasets: [{
                label: 'Points',
                data: [1200, 1100, 900, 850, 150],
                backgroundColor: 'rgba(45, 90, 39, 0.85)',
                borderColor: '#facc15',
                borderWidth: 2
            }]
        },
        options: { maintainAspectRatio: false }
    });
}

function sendShout() {
    const val = document.getElementById('shoutInput').value;
    if(!val) return;
    let shouts = JSON.parse(localStorage.getItem('shouts')) || [];
    shouts.push({ text: val, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
    localStorage.setItem('shouts', JSON.stringify(shouts));
    document.getElementById('shoutInput').value = '';
    loadShouts();
}

function loadShouts() {
    const shouts = JSON.parse(localStorage.getItem('shouts')) || [];
    document.getElementById('shout-box').innerHTML = shouts.map(s => `
        <div style="background:var(--card-bg); padding:8px; border-radius:5px; margin-bottom:5px; border-left:4px solid var(--isu-gold); font-size:12px;">
            <b>User:</b> ${s.text} <span style="float:right; font-size:9px; color:#999;">${s.time}</span>
        </div>
    `).join('');
}

function loadHotlines() {
    const data = [
        { id: 'clinic', name: 'Campus Clinic', icon: 'ambulance', num: '0912-345-6789' },
        { id: 'security', name: 'Security', icon: 'shield-alt', num: '0922-333-4444' }
    ];
    document.getElementById('hotline-list').innerHTML = data.map(h => `
        <div class="hotline-item">
            <i class="fas fa-${h.icon}"></i>
            <div class="hotline-info"><b>${h.name}</b><a>${localStorage.getItem('num-'+h.id) || h.num}</a></div>
        </div>
    `).join('');
}

function editAdmin() {
    const n = prompt("New Name:");
    if(n) { document.getElementById('admin-name').innerText = n; localStorage.setItem('adminName', n); }
}

function previewImg(input) {
    const reader = new FileReader();
    reader.onload = e => { document.getElementById('logo-preview').src = e.target.result; localStorage.setItem('adminPic', e.target.result); }
    reader.readAsDataURL(input.files[0]);
}
