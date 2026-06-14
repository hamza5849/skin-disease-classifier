const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const uploadContent = document.getElementById('uploadContent');
const previewContent = document.getElementById('previewContent');
const previewImg = document.getElementById('previewImg');

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        showPreview(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) showPreview(file);
});

function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        uploadContent.style.display = 'none';
        previewContent.style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

function resetUpload() {
    fileInput.value = '';
    previewImg.src = '';
    uploadContent.style.display = 'block';
    previewContent.style.display = 'none';
    document.getElementById('resultsContent').style.display = 'none';
    document.getElementById('resultsPlaceholder').style.display = 'block';
}

async function analyzeImage() {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select an image first!');
        return;
    }

    document.getElementById('loadingOverlay').style.display = 'flex';

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        document.getElementById('loadingOverlay').style.display = 'none';

        if (data.success) {
            showResults(data);
        } else {
            alert('Error: ' + data.error);
        }

    } catch (error) {
        document.getElementById('loadingOverlay').style.display = 'none';
        alert('Error connecting to server!');
    }
}

function showResults(data) {
    document.getElementById('resultsPlaceholder').style.display = 'none';
    document.getElementById('resultsContent').style.display = 'block';

    document.getElementById('resultDisease').textContent = data.disease;
    document.getElementById('resultShort').textContent = data.short.toUpperCase();

    const badge = document.getElementById('resultBadge');
    const risk = data.risk;
    document.getElementById('resultRisk').textContent = risk;

    const riskColors = {
        'Very High': { bg: 'rgba(255,71,87,0.2)', color: '#ff4757', border: 'rgba(255,71,87,0.4)' },
        'High':      { bg: 'rgba(255,99,72,0.2)', color: '#ff6348', border: 'rgba(255,99,72,0.4)' },
        'Medium':    { bg: 'rgba(255,165,2,0.2)', color: '#ffa502', border: 'rgba(255,165,2,0.4)' },
        'Low':       { bg: 'rgba(46,213,115,0.2)', color: '#2ed573', border: 'rgba(46,213,115,0.4)' }
    };

    const riskStyle = riskColors[risk] || riskColors['Low'];
    badge.style.background = riskStyle.bg;
    badge.style.color = riskStyle.color;
    badge.style.border = `1px solid ${riskStyle.border}`;
    badge.textContent = `${risk} Risk`;

    const riskEl = document.getElementById('resultRisk');
    riskEl.className = 'detail-value';
    riskEl.style.color = riskStyle.color;

    const confidence = data.confidence;
    document.getElementById('confidenceValue').textContent = confidence + '%';
    const circle = document.getElementById('confidenceCircle');
    const circumference = 339.3;
    const offset = circumference - (confidence / 100) * circumference;

    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 1.5s ease';
        circle.style.strokeDashoffset = offset;
    }, 100);

    const barsContainer = document.getElementById('predictionBars');
    barsContainer.innerHTML = '';

    const sorted = [...data.all_predictions].sort((a, b) => b.confidence - a.confidence);

    sorted.forEach((pred, index) => {
        const bar = document.createElement('div');
        bar.className = 'pred-bar';
        bar.innerHTML = `
            <div class="pred-bar-label">
                <span>${pred.name}</span>
                <span>${pred.confidence}%</span>
            </div>
            <div class="pred-bar-track">
                <div class="pred-bar-fill" style="width: 0%" data-width="${pred.confidence}%"></div>
            </div>
        `;
        barsContainer.appendChild(bar);

        setTimeout(() => {
            bar.querySelector('.pred-bar-fill').style.width = pred.confidence + '%';
        }, 100 + index * 100);
    });

    document.getElementById('resultsBox').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 5, 16, 0.95)';
    } else {
        navbar.style.background = 'rgba(5, 5, 16, 0.8)';
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.disease-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});