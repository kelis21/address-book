const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');
const exportContactsBtn = document.getElementById('export-contacts-btn');
const importContactsBtn = document.getElementById('import-contacts-btn');
//创建空数组
let contacts = [];
//提交事件
contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    const newContact = { name, phone, email, address, favorite: false };
    contacts.push(newContact);

    renderContactList();
    contactForm.reset();
    console.log(contacts);
});

//删除事件和收藏事件
contactList.addEventListener('click', function (event) {
    if (event.target.classList.contains('favorite-btn')) {
        const contactIndex = event.target.closest('li').dataset.index;
        contacts[contactIndex].favorite = !contacts[contactIndex].favorite;
        event.target.textContent = contacts[contactIndex].favorite ? '已收藏' : '收藏';
        event.target.classList.toggle('favorite', contacts[contactIndex].favorite);
    } else if (event.target.classList.contains('delete-btn')) {
        const contactIndex = event.target.closest('li').dataset.index;
        contacts.splice(contactIndex, 1);
        renderContactList();
    }
});
function contactsTo2DArray(contacts) {
    return contacts.map(contact => [
        contact.name,
        contact.phone,
        contact.email,
        contact.address,
        contact.favorite ? '✓' : '✗'
    ]);
}

// 修改导出按钮的点击事件处理程序
exportContactsBtn.addEventListener('click', function () {
    // 将contacts数组转换为二维数组
    const contacts2DArray = contactsTo2DArray(contacts);
    // 创建一个新的工作簿
    const wb = XLSX.utils.book_new();
    // 将二维数组数据转换为工作表
    const ws = XLSX.utils.aoa_to_sheet(contacts2DArray);
    // 将工作表添加到工作簿中
    XLSX.utils.book_append_sheet(wb, ws, 'Contacts');
    // 导出Excel文件
    XLSX.writeFile(wb, 'contacts.xlsx');
});

importContactsBtn.addEventListener('click', function () {
    readFile();

});

function renderContactList() {
    contactList.innerHTML = '';
    contacts.forEach((contact, index) => {
        const listItem = document.createElement('li');
        listItem.dataset.index = index;

        const contactInfo = document.createElement('div');
        contactInfo.textContent = `${contact.name} - ${contact.phone} - ${contact.email} - ${contact.address}`;

        const favoriteBtn = document.createElement('button');
        favoriteBtn.textContent = contact.favorite ? '已收藏' : '收藏';
        favoriteBtn.classList.add('favorite-btn');
        favoriteBtn.classList.toggle('favorite', contact.favorite);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '删除';
        deleteBtn.classList.add('delete-btn');

        listItem.appendChild(contactInfo);
        listItem.appendChild(favoriteBtn);
        listItem.appendChild(deleteBtn);

        contactList.appendChild(listItem);
    });
}
function readFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file first!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // 假设我们只读取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 将工作表转换为JSON格式
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 在页面上显示JSON数据
        const output = document.getElementById('output');
        output.textContent = JSON.stringify(jsonData, null, 2);
    };
    reader.readAsArrayBuffer(file);
}

