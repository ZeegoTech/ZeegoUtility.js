var ZU = require('./string.js');
ZU = require('./storage.js');
ZU = require('./page.js');
ZU = require('./array.js');
ZU = require('./datetime.js');

document.getElementById('root').innerHTML = ZU.formatDate('yyyy_MM_dd hh:mm:ss 星期w 第q季度');

