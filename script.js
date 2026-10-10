// 初始化数据
let items = JSON.parse(localStorage.getItem('lostItems')) || [
    { id: 1, type: 'found', name: '校园卡', place: '图书馆', contact: 'wx:12345', desc: '在二楼捡到', status: 'active' },
    { id: 2, type: 'lost', name: '水杯', place: '食堂', contact: 'tel:13800000000', desc: '粉色保温杯', status: 'active' }
];

function saveData() { localStorage.setItem('lostItems', JSON.stringify(items)); }
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'page-home') renderList(items);
}

// 渲染列表
function renderList(data) {
    const list = document.getElementById('item-list');
    list.innerHTML = data.map(item => `
        <div class="card" onclick="openDetail(${item.id})">
            <h4>${item.name} <span class="status ${item.status === 'done' ? 'done' : ''}">${item.type === 'lost' ? '寻物' : '招领'} · ${item.status === 'done' ? '已完成' : '进行中'}</span></h4>
            <p>📍 ${item.place}</p>
        </div>
    `).join('');
}

// 筛选
function filterType(type) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    if (type === 'all') renderList(items);
    else renderList(items.filter(i => i.type === type));
}

// 发布
function publishItem() {
    const name = document.getElementById('pub-name').value;
    const place = document.getElementById('pub-place').value;
    const contact = document.getElementById('pub-contact').value;
    if (!name || !place || !contact) return alert('请填写完整信息！');
    const newItem = {
        id: Date.now(),
        type: document.getElementById('pub-type').value,
        name, place, contact,
        desc: document.getElementById('pub-desc').value,
        status: 'active'
    };
    items.push(newItem);
    saveData();
    alert('发布成功！');
    showPage('page-home');
}

// 搜索
function goSearch() {
    const kw = document.getElementById('search-input').value.trim().toLowerCase();
    const results = items.filter(i => i.name.toLowerCase().includes(kw));
    document.getElementById('search-results').innerHTML = results.length ?
        results.map(item => `<div class="card" onclick="openDetail(${item.id})"><h4>${item.name}</h4><p>📍 ${item.place}</p></div>`).join('') :
        '<p style="text-align:center;color:#999;">没有找到相关物品</p>';
    showPage('page-search');
}

// 详情
let currentDetailId = null;
function openDetail(id) {
    const item = items.find(i => i.id === id);
    currentDetailId = id;
    document.getElementById('detail-content').innerHTML = `
        <h3>${item.name}</h3>
        <p style="margin:10px 0;">类型：${item.type === 'lost' ? '寻物' : '招领'}</p>
        <p>地点：${item.place}</p>
        <p>描述：${item.desc || '无'}</p>
        <p>状态：${item.status === 'done' ? '已完成' : '进行中'}</p>
    `;
    document.getElementById('btn-contact').style.display = item.status === 'done' ? 'none' : 'block';
    document.getElementById('btn-update').style.display = item.status === 'done' ? 'none' : 'block';
    document.getElementById('btn-contact').innerText = '复制联系方式: ' + item.contact;
    showPage('page-detail');
}

// 复制联系方式
function copyContact() {
    const item = items.find(i => i.id === currentDetailId);
    navigator.clipboard.writeText(item.contact).then(() => alert('联系方式已复制！'));
}

// 更新状态
function updateStatus() {
    const item = items.find(i => i.id === currentDetailId);
    item.status = 'done';
    saveData();
    alert('状态已更新为已完成！');
    openDetail(currentDetailId);
}

// 首次加载
renderList(items);